FROM node:lts-alpine
ENV NODE_ENV=production

RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    libjpeg-turbo-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY . .
RUN npm install -g pnpm

RUN pnpm install



CMD ["pnpm", "start"]