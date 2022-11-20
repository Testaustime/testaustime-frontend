FROM --platform=$BUILDPLATFORM node:19-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build



FROM --platform=$TARGETPLATFORM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

CMD ["nginx", "-g", "daemon off;"]
