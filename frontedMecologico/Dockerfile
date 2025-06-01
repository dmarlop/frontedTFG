# Usa Node.js directamente (sin Nginx)
FROM node:18-alpine

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Instala Angular CLI globalmente
RUN npm install -g @angular/cli

# Copia todo el código
COPY . .

# Build de producción (opcional, puedes usar solo ng serve si prefieres)
RUN npm run build

# Expone el puerto 4200
EXPOSE 4200

# Comando para servir la aplicación (development)
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]