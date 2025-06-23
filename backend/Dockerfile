# Base image
FROM node:22-alpine3.21 AS base
WORKDIR /app

# Builder image
FROM base AS builder

# Copy package files and install all dependencies (including devDeps)
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build TypeScript
COPY . .
RUN npm run build

# Production image
FROM base AS runner

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files and metadata from builder
COPY --from=builder /app/dist ./dist
COPY templates ./templates

# Expose port
EXPOSE 3000

# Start the compiled server
CMD ["node", "dist/server.js"]
