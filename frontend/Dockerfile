# FROM node:18 AS build-stage

# WORKDIR /app

# COPY package.json ./

# RUN npm install --force

# COPY . .

# RUN npm run build

# FROM nginx:1.23 AS production-stage

# COPY --from=build-stage /app/build /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM node:18 AS build-stage

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build

# FROM nginx:1.23 AS production-stage

# COPY --from=build-stage /app/build /usr/share/nginx/html

# # COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["npm", "start"]

# CMD ["nginx", "-g", "daemon off;"]
