FROM node:16-alpine AS build

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:16-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
