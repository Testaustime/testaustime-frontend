FROM node:alpine AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /usr/src/app/dist .
CMD ["nginx", "-g", "daemon off;"]