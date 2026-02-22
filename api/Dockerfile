#🔹 Dockerfile

#Es la receta para construir una imagen.

#Define:

 # -Desde qué imagen base arrancar
 # -Qué copiar
 # -Qué instalar
 # -Qué comandos ejecutar
 # -Qué puerto exponer
# - Qué comando final correr

# Usamos una imagen oficial liviana de Node.js
# alpine es más pequeña y optimizada
FROM node:20-alpine



# Definimos el directorio de trabajo dentro del contenedor
# Todo lo que copiemos después irá dentro de /app
WORKDIR /app


# Copiamos únicamente los archivos de dependencias primero
# Esto permite que Docker aproveche la cache si el código cambia
# pero las dependencias no
COPY package*.json ./


# Instalamos las dependencias del proyecto
# Se ejecuta dentro del contenedor
RUN npm install


# Ahora copiamos el resto del código fuente
COPY . .


# Exponemos el puerto que usa la API
# Esto no publica el puerto, solo lo documenta
EXPOSE 3001


# Comando que se ejecuta cuando el contenedor inicia
# Debe coincidir con tu script en package.json
CMD ["npm", "start"]


