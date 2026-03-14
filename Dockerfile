# Stage 1: Builder - Install dependencies and build
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.4.1

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Production - Create minimal runtime image
FROM node:22-alpine

# Install pnpm for production
RUN npm install -g pnpm@10.4.1

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install all dependencies (needed for server bundle with external packages)
RUN pnpm install --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose port (Railway will override this)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
