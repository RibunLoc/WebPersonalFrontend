// src/config/runtime.ts
type RuntimeShape = {
  VITE_API_BASE: string;
  TURNSTILE_SITEKEY: string;
  APP_ENV: string;
  SENTRY_DSN: string;
};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Partial<RuntimeShape & {
      VITE_API_BASE: string;
      VITE_TURNSTILE_SITEKEY: string;
    }>;
  }
}

const R = window.__RUNTIME_CONFIG__ ?? {};

export const RUNTIME: RuntimeShape = {
  VITE_API_BASE:
    R.VITE_API_BASE ??                          // <— thêm dòng này
    import.meta.env.VITE_API_BASE ??
    "http://localhost:8080",

  TURNSTILE_SITEKEY:
    R.TURNSTILE_SITEKEY ??
    R.VITE_TURNSTILE_SITEKEY ??                 // <— thêm dòng này
    import.meta.env.VITE_TURNSTILE_SITEKEY ??
    "",

  APP_ENV:
    R.APP_ENV ??
    import.meta.env.MODE ??
    "development",

  SENTRY_DSN:
    R.SENTRY_DSN ??
    import.meta.env.VITE_SENTRY_DSN ??
    "",
} as const;
