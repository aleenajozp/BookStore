# Stage 1: Build Frontend
FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime Server
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend assets
COPY --from=builder /app/frontend/dist ./public

# Copy server files, models, and uploads
COPY server.js ./
COPY models/ ./models/
COPY uploads/ ./uploads/

# OpenShift arbitrary UID support
RUN chgrp -R 0 /app && chmod -R g=u /app

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
