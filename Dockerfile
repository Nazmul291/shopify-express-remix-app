# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Set environment variables
ENV NODE_ENV=production

# Install OpenSSL 1.1 Compatibility and other dependencies
RUN apk update && \
    apk add --no-cache openssl && \
    ln -s /usr/lib/libssl.so.1.1 /usr/lib/libssl.so && \
    ln -s /usr/lib/libcrypto.so.1.1 /usr/lib/libcrypto.so && \
    apk add --no-cache bash && \
    rm -rf /var/cache/apk/*

# Verify OpenSSL installation
RUN openssl version

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "docker-start"]