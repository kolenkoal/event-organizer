FROM node:18 AS build-stage

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:1.23 AS production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]