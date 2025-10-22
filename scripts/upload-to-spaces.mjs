#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const API_BASE = (process.env.SPACES_API_BASE || process.env.API_BASE || "").replace(/\/+$/, "");

if (!API_BASE) {
  console.error("[upload-to-spaces] Thiếu biến môi trường SPACES_API_BASE hoặc API_BASE.");
  console.error("Vui lòng thiết lập endpoint API tuyệt đối ví dụ: https://example.com/api");
  process.exit(1);
}

if (!/^https?:\/\//i.test(API_BASE)) {
  console.error("[upload-to-spaces] API_BASE phải là URL tuyệt đối (bao gồm http/https).");
  process.exit(1);
}

const [, , dirArg = "public", manifestArg = "src/generated/spaces-manifest.json"] = process.argv;
const rootDir = process.cwd();
const sourceDir = path.resolve(rootDir, dirArg);
const manifestPath = path.resolve(rootDir, manifestArg);

const MIME_MAP = new Map(
  Object.entries({
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".heic": "image/heic",
    ".ico": "image/x-icon",
    ".jfif": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".jxl": "image/jxl",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".m4v": "video/x-m4v",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
    ".avi": "video/x-msvideo",
  })
);

const DEFAULT_EXTENSIONS = new Set(MIME_MAP.keys());

const toPresignUrl = (pathName) => new URL(pathName.replace(/^\/+/, ""), `${API_BASE}/`).toString();

const normalizeHeaderValues = (headers = {}) =>
  Object.entries(headers).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {});

const buildPublicUrl = (uploadUrl, presign) => {
  if (presign.assetUrl) return presign.assetUrl;
  if (presign.publicUrl) return presign.publicUrl;
  if (presign.objectUrl) return presign.objectUrl;
  if (presign.cdnUrl) return presign.cdnUrl;
  if (presign.finalUrl) return presign.finalUrl;
  if (presign.path) {
    const base = uploadUrl.replace(/\/?$/, "");
    const cleanPath = String(presign.path).replace(/^\/+/, "");
    return `${base}/${cleanPath}`;
  }
  if (presign.key) {
    const base = uploadUrl.replace(/\/?$/, "");
    const cleanKey = String(presign.key).replace(/^\/+/, "");
    return `${base}/${cleanKey}`;
  }
  if (presign.fields?.key !== undefined) {
    const base = uploadUrl.replace(/\/?$/, "");
    const fieldKey = String(presign.fields.key).replace(/^\/+/, "");
    return `${base}/${fieldKey}`;
  }
  return uploadUrl.split("?")[0];
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      if (entry.isFile()) {
        return fullPath;
      }
      return [];
    })
  );
  return files.flat();
}

async function uploadFile(fullPath) {
  const buffer = await readFile(fullPath);
  const relativePath = path.relative(sourceDir, fullPath).replace(/\\/g, "/");
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_MAP.get(ext) || "application/octet-stream";

  console.log(`→ Đang presign ${relativePath} (${buffer.length} bytes)`);

  const presignRes = await fetch(toPresignUrl("/uploads/presign"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: relativePath,
      contentType,
      size: buffer.length,
    }),
  });

  if (!presignRes.ok) {
    throw new Error(
      `Không thể tạo presign cho ${relativePath} (mã ${presignRes.status}).`
    );
  }

  const presign = await presignRes.json();
  const uploadUrl = presign.uploadUrl ?? presign.url;

  if (!uploadUrl) {
    throw new Error(`Phản hồi presign cho ${relativePath} thiếu uploadUrl.`);
  }

  const method = (presign.method ?? (presign.fields ? "POST" : "PUT")).toUpperCase();

  if (method === "POST") {
    const formData = new FormData();
    const fields = presign.fields ?? {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
    formData.append(
      "file",
      new Blob([buffer], { type: contentType }),
      path.basename(fullPath)
    );

    const uploadResp = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResp.ok) {
      throw new Error(`Tải lên ${relativePath} thất bại (mã ${uploadResp.status}).`);
    }
  } else {
    const headers = {
      "Content-Type": contentType,
      ...normalizeHeaderValues(presign.headers),
    };

    const uploadResp = await fetch(uploadUrl, {
      method: "PUT",
      body: buffer,
      headers,
    });

    if (!uploadResp.ok) {
      throw new Error(`Tải lên ${relativePath} thất bại (mã ${uploadResp.status}).`);
    }
  }

  const url = buildPublicUrl(uploadUrl, presign);
  console.log(`✓ Hoàn tất ${relativePath} → ${url}`);
  return { path: relativePath, url };
}

async function main() {
  console.log(`[upload-to-spaces] Bắt đầu với thư mục: ${sourceDir}`);
  let allFiles;
  try {
    allFiles = await walk(sourceDir);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      console.error(`[upload-to-spaces] Thư mục không tồn tại: ${sourceDir}`);
      process.exit(1);
    }
    throw error;
  }
  const assetFiles = allFiles.filter((file) =>
    DEFAULT_EXTENSIONS.has(path.extname(file).toLowerCase())
  );

  if (!assetFiles.length) {
    console.log("Không tìm thấy tệp hình ảnh/video nào để tải lên.");
    return;
  }

  const manifest = {};

  for (const filePath of assetFiles) {
    try {
      const result = await uploadFile(filePath);
      manifest[result.path] = result.url;
    } catch (error) {
      console.error(`✗ Lỗi với ${filePath}:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[upload-to-spaces] Đã lưu manifest tại ${manifestPath}`);
  console.log(`[upload-to-spaces] Đã tải thành công ${Object.keys(manifest).length} tệp.`);
}

main().catch((error) => {
  console.error("[upload-to-spaces] Dừng với lỗi:", error instanceof Error ? error.stack : error);
  process.exit(1);
});
