import { RUNTIME } from "./runtime";

const BASE = (RUNTIME.VITE_API_BASE || "").replace(/\/+$/, "");

/**
 * Helper ghép URL an toàn (hỗ trợ base absolute hoặc relative như "/api").
 */
export const apiUrl = (path: string) => {
  const clean = path.replace(/^\/+/, "");
  if (!BASE) return `/${clean}`;
  if (/^https?:\/\//i.test(BASE)) {
    return new URL(clean, `${BASE}/`).toString();
  }
  // BASE là đường dẫn tương đối (proxy dev)
  return `${BASE}/${clean}`;
};
