# Stage 1: Build 
FROM node:22-alpine AS build

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY --chown=appuser:appgroup . .
RUN npm run build 

# Stage 2: Nginx server
FROM nginx:alpine

RUN mkdir -p /usr/share/nginx/html

COPY nginx.conf /ect/nginx/nginx.conf

COPY --from=build /app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;" ]
