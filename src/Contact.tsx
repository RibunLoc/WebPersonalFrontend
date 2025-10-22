import styles from "./Contact.module.css";
import { type ChangeEvent, useRef, useState } from "react";
import Turnstile from "react-turnstile";
import { RUNTIME } from "./config/runtime";
import { apiUrl } from "./config/api";
import { useSpacesUploader } from "./hooks/useSpacesUploader";

declare global {
  interface Window {
    turnstile?: {
      render: (el: Element, opts: any) => string;
      getResponse: (id: string) => string;
      reset: (id?: string) => void;
    };
  }
}

type Status = "idle" | "pending" | "success" | "error";

const MAX_ATTACHMENTS = 5;
const ACCEPTED_TYPES = "image/*,video/*";

const formatFileSize = (bytes: number) => {
  if (!Number.isFinite(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
};

export const sitekey: string = RUNTIME.TURNSTILE_SITEKEY || "1x00000000000000000000AA";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFiles, isUploading, error: uploadError } = useSpacesUploader();

  const totalSize = attachments.reduce((acc, file) => acc + file.size, 0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    if (!incoming.length) return;

    let duplicates = 0;
    let overflow = false;

    setAttachments((prev) => {
      const merged = [...prev];

      for (const file of incoming) {
        const exists = merged.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified &&
            item.type === file.type
        );

        if (exists) {
          duplicates += 1;
          continue;
        }

        if (merged.length >= MAX_ATTACHMENTS) {
          overflow = true;
          break;
        }

        merged.push(file);
      }

      return merged;
    });

    if (overflow) {
      setFileError(`Bạn chỉ có thể đính kèm tối đa ${MAX_ATTACHMENTS} tệp.`);
    } else if (duplicates) {
      setFileError(`Đã bỏ qua ${duplicates} tệp trùng lặp.`);
    } else {
      setFileError(null);
    }

    // reset value để chọn lại cùng 1 file liên tiếp
    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
    setFileError(null);
  };

  const resetFormState = (formEl: HTMLFormElement) => {
    formEl.reset();
    setToken("");
    setAttachments([]);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.turnstile?.reset?.();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    if (!token) {
      alert("Vui lòng hoàn thành xác thực (Turnstile).");
      return;
    }

    setStatus("pending");

    const form = new FormData(formEl);
    const payload: Record<string, unknown> = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
      turnstile_token: token,
    };

    try {
      const uploaded = attachments.length ? await uploadFiles(attachments) : [];

      if (uploaded.length) {
        payload.attachments = uploaded.map(({ file, url }) => ({
          name: file.name,
          url,
          type: file.type,
          size: file.size,
        }));
      }
    } catch (err) {
      console.error("upload error", err);
      setStatus("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    const url = apiUrl("/contact");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setShowToast(true);
        resetFormState(formEl);
        // tự ẩn toast và trả form về trạng thái idle
        setTimeout(() => {
          setShowToast(false);
          setStatus("idle");
        }, 2200);
      } else {
        setStatus("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }
    } catch (err) {
      console.error("fetch error", err);
      setStatus("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  }

  return (
    <section className={styles.contactSection} id="contact">
      <h2 className={styles.sectionTitle}>📬 Contact Me</h2>
      <p className={styles.sectionDesc}>
        Gửi cho mình một lời nhắn, mình sẽ phản hồi sớm nhất có thể.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          type="text"
          placeholder="Tên của bạn"
          required
          minLength={2}
          maxLength={80}
        />
        <input name="email" type="email" placeholder="Email" required />
        <textarea
          name="message"
          placeholder="Nội dung liên hệ"
          required
          minLength={10}
          maxLength={2000}
        />

        <div className={styles.fileInputWrap}>
          <label className={styles.fileLabel} htmlFor="contact-attachments">
            <span>Đính kèm (tùy chọn)</span>
            <input
              id="contact-attachments"
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </label>
          <p className={styles.fileHint}>
            Hỗ trợ ảnh/video (tối đa {MAX_ATTACHMENTS} tệp). Tổng dung lượng hiện tại: {" "}
            <strong>{formatFileSize(totalSize)}</strong>
          </p>
        </div>

        {fileError && (
          <p className={styles.fileError} role="alert">
            {fileError}
          </p>
        )}

        {attachments.length > 0 && (
          <ul className={styles.fileList}>
            {attachments.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className={styles.fileItem}
              >
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileMeta}>
                    {formatFileSize(file.size)}
                    {file.type ? ` • ${file.type}` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeAttachment(index)}
                  aria-label={`Xóa tệp ${file.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {uploadError && (
          <p className={styles.fileError} role="alert">
            {uploadError}
          </p>
        )}

        <Turnstile
          sitekey={sitekey}
          action="contact"
          theme="auto"
          onVerify={(t) => setToken(t)}
          onError={() => setToken("")}
          onExpire={() => setToken("")}
          refreshExpired="auto"
        />

        <button
          type="submit"
          className={`${styles.submitBtn} ${
            status === "pending" || isUploading ? styles.loading : ""
          } ${status === "success" ? styles.done : ""}`}
          disabled={status === "pending" || !token || isUploading}
          aria-busy={status === "pending" || isUploading}
        >
          {status === "pending" || isUploading ? (
            <>
              <span className={styles.spinner} aria-hidden />
              <span>{isUploading ? "Đang tải tệp…" : "Đang gửi…"}</span>
            </>
          ) : (
            "Gửi liên hệ"
          )}
        </button>

        {/* Vùng thông báo cho screen reader */}
        <div className={styles.srOnly} aria-live="polite">
          {status === "pending"
            ? "Đang gửi"
            : status === "success"
            ? "Gửi thành công"
            : status === "error"
            ? "Gửi thất bại"
            : ""}
        </div>
      </form>

      {/* Toast đẹp + animation, tự ẩn */}
      <div
        className={`${styles.toast} ${showToast ? styles.show : ""} ${
          status === "success"
            ? styles.toastSuccess
            : status === "error"
            ? styles.toastError
            : ""
        }`}
        role="status"
        aria-live="polite"
      >
        <svg viewBox="0 0 52 52" className={styles.icon}>
          {/* Success circle + tick */}
          {status === "success" && (
            <>
              <circle className={styles.circle} cx="26" cy="26" r="24" />
              <path className={styles.tick} d="M16 27 L24 35 L38 20" />
            </>
          )}
          {/* Error cross */}
          {status === "error" && (
            <>
              <circle className={styles.circleError} cx="26" cy="26" r="24" />
              <path className={styles.cross} d="M18 18 L34 34 M34 18 L18 34" />
            </>
          )}
        </svg>
        <span>
          {status === "success"
            ? "Đã gửi thành công!"
            : status === "error"
            ? "Gửi thất bại, vui lòng thử lại."
            : ""}
        </span>
      </div>
    </section>
  );
}
