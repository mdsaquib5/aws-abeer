FROM node:20-alpine

# Install curl for container health check support
RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy dependency files first to utilize Docker build caching
COPY package*.json ./

# Install only production dependencies (ignore devDependencies like nodemon)
RUN npm install --only=production --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Create the uploads folder for local files and assign permissions to the node user
RUN mkdir -p uploads && chown -R node:node /usr/src/app

# Run as non-root user for container security
USER node

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "server.js"]
