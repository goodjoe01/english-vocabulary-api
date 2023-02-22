# Establece la imagen base
FROM node:18.12-alpine

# Crea un directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --only=production

# Copia el resto de los archivos
COPY . .

# Compila el código TypeScript en JavaScript
RUN npm run build

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Iniciar la aplicación
CMD [ "node", "./dist/index.js" ]