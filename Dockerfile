# Multi-stage build for production
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application
COPY --from=development --chown=nestjs:nodejs /app/dist ./dist
COPY --from=development --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=development --chown=nestjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=nestjs:nodejs prisma ./prisma
COPY --chown=nestjs:nodejs .env.example ./.env

# Switch to non-root user
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "dist/main"]