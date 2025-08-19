#!/bin/sh
set -eu

: "${VITE_API_BASE:=http://localhost:8080}"
: "${VITE_TURNSTILE_SITEKEY:=}"
: "${SENTRY_DSN:=}"
: "${APP_ENV:=production}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__RUNTIME_CONFIG__ = {
  API_URL: "${VITE_API_BASE}",
  TURNSTILE_SITEKEY: "${VITE_TURNSTILE_SITEKEY}",
  SENTRY_DSN: "${SENTRY_DSN}",
  APP_ENV: "${APP_ENV}"
};
EOF

exec "$@"
