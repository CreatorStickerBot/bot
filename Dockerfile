FROM node:17.9.0

WORKDIR /app

COPY . .

RUN npm ci
CMD ["node", "index.js"]
