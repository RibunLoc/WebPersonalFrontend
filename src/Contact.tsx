import styles from "./Contact.module.css";
import { useRef, useState } from "react";
import Turnstile from "react-turnstile";
import { RUNTIME } from "./config/runtime";

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

export const sitekey : string = RUNTIME.TURNSTILE_SITEKEY || "1x00000000000000000000AA";
const BASE = (RUNTIME.VITE_API_BASE || "").replace(/\/+$/, "");

const MESSAGE_PRESETS = [
  {
    label: "Hợp tác dự án",
    value: "Chào bạn, mình muốn trao đổi về một dự án mới. Bạn có thể tư vấn giúp mình được không?",
  },
  {
    label: "Tư vấn DevOps",
    value: "Mình cần tư vấn về CI/CD và hạ tầng cloud cho team. Bạn có thể chia sẻ hướng tiếp cận phù hợp không?",
  },
] as const;

// Helper ghép URL an toàn (hỗ trợ base absolute hoặc relative như "/api")
export const apiUrl = (path: string) => {
  const clean = path.replace(/^\/+/, "");
  if (!BASE) return `/${clean}`;
  if (/^https?:\/\//i.test(BASE)) {
    return new URL(clean, BASE + "/").toString();
  }
  // BASE là đường dẫn tương đối (proxy dev)
  return `${BASE}/${clean}`;
};

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const [showToast, setShowToast] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const applyPreset = (text: string) => {
    const el = messageRef.current;
    if (!el) return;
    const trimmed = el.value.trim();
    el.value = trimmed ? `${el.value}\n\n${text}` : text;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
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
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
      turnstile_token: token,
    };

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
        formEl.reset();
        setToken("");
        // reset widget (nếu có)
        window.turnstile?.reset?.();
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
        <input name="email" type="email" placeholder="Email để mình liên hệ" required />
        <textarea
          name="message"
          placeholder="Nội dung liên hệ"
          required
          minLength={10}
          maxLength={2000}
          ref={messageRef}
        />

        <div className={styles.quickFill} aria-label="Điền nhanh nội dung">
          <p className={styles.quickLabel}>Gợi ý nội dung</p>
          <div className={styles.quickRow}>
            {MESSAGE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={styles.quickBtn}
                onClick={() => applyPreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

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
            status === "pending" ? styles.loading : ""
          } ${status === "success" ? styles.done : ""}`}
          disabled={status === "pending" || !token}
          aria-busy={status === "pending"}
        >
          {status === "pending" ? (
            <>
              <span className={styles.spinner} aria-hidden />
              <span>Đang gửi…</span>
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
