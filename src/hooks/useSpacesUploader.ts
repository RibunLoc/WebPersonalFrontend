import { useCallback, useState } from "react";
import { apiUrl } from "../config/api";
import {
  buildPublicUrl,
  normalizeHeaderValues,
  type PresignResponse,
} from "../utils/spaces";

type UploadResult = {
  file: File;
  url: string;
};

export const useSpacesUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    if (!files.length) return [];

    setIsUploading(true);
    setError(null);

    const results: UploadResult[] = [];

    try {
      for (const file of files) {
        const presignRes = await fetch(apiUrl("/uploads/presign"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            size: file.size,
          }),
        });

        if (!presignRes.ok) {
          throw new Error(
            `Không thể tạo URL tải lên cho “${file.name}” (mã ${presignRes.status}).`
          );
        }

        const presign: PresignResponse = await presignRes.json();
        const uploadUrl = presign.uploadUrl ?? presign.url;

        if (!uploadUrl) {
          throw new Error("Thiếu uploadUrl trong phản hồi presign.");
        }

        const method = (presign.method ?? (presign.fields ? "POST" : "PUT")).toUpperCase();

        if (method === "POST") {
          const formData = new FormData();
          const fields = presign.fields ?? {};
          Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });
          formData.append("file", file);

          const uploadResp = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!uploadResp.ok) {
            throw new Error(`Tải lên “${file.name}” thất bại (mã ${uploadResp.status}).`);
          }
        } else {
          const headers = {
            "Content-Type": file.type || "application/octet-stream",
            ...normalizeHeaderValues(presign.headers),
          };

          const uploadResp = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers,
          });

          if (!uploadResp.ok) {
            throw new Error(`Tải lên “${file.name}” thất bại (mã ${uploadResp.status}).`);
          }
        }

        const publicUrl = buildPublicUrl(uploadUrl, presign);
        results.push({ file, url: publicUrl });
      }

      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải tệp lên.";
      setError(message);
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadFiles, isUploading, error };
};
