// src/config/runtime.ts

// 1) Định nghĩa "hình dáng" cấu hình bạn cần dùng trong app
type RuntimeShape = {
  API_URL: string;
  TURNSTILE_SITEKEY: string;
  APP_ENV: string;
  SENTRY_DSN: string;
};

// 2) Khai báo global để TypeScript biết window có __RUNTIME_CONFIG__
//    (biến này được nạp từ /env.js)
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Partial<RuntimeShape>;
  }
}

// Tiện ích nhỏ để lấy từ runtime theo key
const fromRuntime = (k: keyof RuntimeShape) => window.__RUNTIME_CONFIG__?.[k];

// 3) Hợp nhất theo thứ tự ưu tiên:
//    Runtime (env.js) -> Build-time (import.meta.env) -> Default
export const RUNTIME: RuntimeShape = {
  API_URL:
    (fromRuntime('API_URL') as string | undefined) ??
    import.meta.env.VITE_API_BASE ??
    'http://localhost:8080',

  TURNSTILE_SITEKEY:
    (fromRuntime('TURNSTILE_SITEKEY') as string | undefined) ??
    import.meta.env.VITE_TURNSTILE_SITEKEY ??
    '',

  APP_ENV:
    (fromRuntime('APP_ENV') as string | undefined) ??
    import.meta.env.MODE ?? // "development" khi chạy `vite dev`
    'development',

  SENTRY_DSN:
    (fromRuntime('SENTRY_DSN') as string | undefined) ??
    import.meta.env.VITE_SENTRY_DSN ??
    '',
} as const;
