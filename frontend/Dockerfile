# Étape 1 : Build du TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY . ./

# Compile front.ts → dist/front.js
RUN npx tsc

# Étape 2 : Serveur NGINX
FROM nginx:alpine

# Copie le JS compilé
COPY --from=builder /app/dist /usr/share/nginx/html/

# Copie aussi index.html (car il n'est pas dans /dist)
COPY --from=builder /app/dist /usr/share/nginx/html/dist
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/style.css /usr/share/nginx/html/style.css

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
