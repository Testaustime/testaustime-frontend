FROM --platform=$BUILDPLATFORM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM --platform=$TARGETPLATFORM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

CMD ["nginx", "-g", "daemon off;"]
