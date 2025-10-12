
# --- STAGE 1: BUILD ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 2: RUNTIME/PRODUCTION ---
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


# Copy package.json for runtime version extraction
COPY --from=builder /app/package.json /package.json

# Copy the custom entrypoint script and make it executable
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Pass .env values to entrypoint.sh at runtime (except VERSION)
ENV API_BASE_URL="${API_BASE_URL}"
ENV APP_MODE="${APP_MODE}"

# Entrypoint will read VERSION from /VERSION
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
