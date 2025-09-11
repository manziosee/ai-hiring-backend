FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (ignore package-lock issues)
RUN npm install --legacy-peer-deps --no-package-lock

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start script with migration
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]