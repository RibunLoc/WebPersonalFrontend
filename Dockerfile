# Stage 1: Build
FROM node:22-alpine AS build

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

COPY --chown=appuser:appgroup . .
USER appuser

RUN npm run build -- --sourcemap=false

# Stage 2: Nginx server
FROM nginx:alpine

RUN mkdir -p /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/ /usr/share/nginx/html

# Thêm template env và entrypoint
COPY docker/env.template.js /usr/share/nginx/html/env.template.js
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
