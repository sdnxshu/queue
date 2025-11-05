# Use the official Bun image as base
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Copy package.json and bun.lockb (if available)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
# ENV REDIS_URL=redis://redis:6379

# Run the application
CMD ["bun", "run", "dev"]