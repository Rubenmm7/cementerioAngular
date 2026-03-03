# Construcción con Node 24
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Servidor Nginx para ejecutar la aplicación
FROM nginx:alpine
COPY --from=build /app/dist/cementerioAngular/* /usr/share/nginx/html/
EXPOSE 80