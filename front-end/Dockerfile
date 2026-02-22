#🔹 Dockerfile

#Es la receta para construir una imagen.

#Define:

 # -Desde qué imagen base arrancar
 # -Qué copiar
 # -Qué instalar
 # -Qué comandos ejecutar
 # -Qué puerto exponer
# - Qué comando final correr

###############################################
# 1️⃣ ETAPA DE BUILD (compila el front)
###############################################

# Usamos una imagen liviana de Node
# Alpine = versión minimalista (más liviana)
FROM node:20-alpine AS builder

# Directorio interno del contenedor donde vivirá el proyecto
# No tiene que existir en tu PC, se crea dentro del contenedor
WORKDIR /app

# Copiamos solo los package primero
# Esto permite cachear dependencias si no cambian
COPY package*.json ./

# Instalamos dependencias del front
RUN npm install

# Copiamos TODO el código del front
COPY . .
# ⚠️ Estas variables se pasan desde docker-compose como build args.
# ⚠️ Variables necesarias en tiempo de build (Nuxt static)
# de manera basica, es el metodo que encontre de pasarle las variables y no me queden vacias

ARG NUXT_PUBLIC_API_BASE_URL
ARG NUXT_PUBLIC_MQTT_URL
ARG NUXT_PUBLIC_MQTT_USERNAME
ARG NUXT_PUBLIC_MQTT_PASSWORD

ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_MQTT_URL=$NUXT_PUBLIC_MQTT_URL
ENV NUXT_PUBLIC_MQTT_USERNAME=$NUXT_PUBLIC_MQTT_USERNAME
ENV NUXT_PUBLIC_MQTT_PASSWORD=$NUXT_PUBLIC_MQTT_PASSWORD
# Ejecutamos el build de Nuxt
# Esto genera la carpeta .output
RUN npm run build


###############################################
# 2️⃣ ETAPA DE PRODUCCIÓN (servidor NGINX)
###############################################

# Imagen ultra liviana solo para servir archivos estáticos
FROM nginx:alpine

# Copiamos SOLO los archivos generados en el build
# No copiamos node_modules ni código fuente
COPY --from=builder /app/.output/public /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponemos el puerto 80 (Nginx corre ahí)
EXPOSE 80

# Comando que mantiene Nginx corriendo en foreground
CMD ["nginx", "-g", "daemon off;"]
