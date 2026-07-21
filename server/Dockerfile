FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

COPY . .

EXPOSE 4000
CMD ["npm", "start"]
