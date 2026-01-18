// Fallback runtime config for local dev (prevents 404s when index.html loads /env.js).
// In production, the container entrypoint overwrites this file at runtime.
window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};

