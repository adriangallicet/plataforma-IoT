# 🚀 📡 Plataforma Web IoT (Nuxt 3 + Node.js + MongoDB + MQTT + Docker)

Proyecto para gestión y monitoreo de dispositivos IoT.
Forma parte de un sistema prototipo desarrollado como tesis de grado en Ingeniería en Telecomunicaciones. 

El documento completo del trabajo, donde se detalla el diseño conceptual y la arquitectura general del sistema se encuentra disponible en:

🔗 https://github.com/adriangallicet/tesis-plataforma-iot

Se recomienda su lectura para comprender el enfoque integral del proyecto y su marco teórico.


Esta sección incluye:

- 🌐 Frontend SPA (Nuxt 3)

- 🔧 API REST (Node.js + Express)

- 🔐 Autenticación JWT mediante cookies httpOnly

- 📡 Comunicación en tiempo real mediante MQTT

- 🐳 Orquestación completa mediante Docker

El objetivo principal es demostrar buenas prácticas de desarrollo, organización y arquitectura de una aplicación real, más que ofrecer un producto final comercial.

La aplicación simula un entorno productivo donde usuarios autenticados pueden administrar dispositivos, locaciones y comunicarse en tiempo real mediante MQTT.
```
## 🧱 Arquitectura del Proyecto
root/
├── api/         # Backend (Node.js + Express + MongoDB)
├── front-end/   # Frontend (Nuxt 3 SPA + Pinia + Tailwind)
├── docker-compose.yml
└── package.json
```

## 🔹 Tecnologías utilizadas
### Frontend

- Nuxt 3 (SPA)
- Pinia (State Management)
- Tailwind CSS
- Shadcn UI
- MQTT vía WebSocket

### Backend

- Node.js
- Express
- MongoDB
- JWT (autenticación con cookies httpOnly)

### Realtime

EMQX (Broker MQTT)

Suscripciones dinámicas por usuario

## 🧩 Funcionalidades

🔐 Login / Logout con cookies seguras

🧠 Manejo de sesión persistente

📡 Conexión MQTT individual por usuario

📊 Dashboard con métricas

🔌 Gestión básica de dispositivos y locaciones

🚀 Arquitectura desacoplada (Frontend / API / Broker)

## 🐳 Ejecución con Docker (Recomendado)

La plataforma puede ejecutarse completamente mediante Docker Compose.

Incluye:

- API
- Frontend (servido por Nginx)
- MongoDB
- EMQX (Broker MQTT)

### 📦 Requisitos

- Docker
- Docker Compose

### ▶️ Levantar todo el stack

Desde la raíz del proyecto:
```bash
docker-compose up --build
```
### 🌐 Servicios disponibles

| Servicio       | URL                                                    |
| -------------- | ------------------------------------------------------ |
| Frontend       | [http://localhost:3000](http://localhost:3000)         |
| API            | [http://localhost:3001/api](http://localhost:3001/api) |
| EMQX Dashboard | [http://localhost:18083](http://localhost:18083)       |
| MongoDB        | mongodb://localhost:27017                              |

### 🔐 Variables de entorno en Docker

Los contenedores utilizan:

- api/.env.docker

- front-end/.env.docker

No es necesario crear .env manualmente cuando se usa Docker.

Las variables públicas de Nuxt (NUXT_PUBLIC_*) se inyectan en tiempo de build.

## 🚀 Arquitectura Docker
                         ┌──────────────┐
                         │   Usuario    │
                         └──────┬───────┘
                                │ Interacción UI
                                ▼
                   ┌────────────────────────┐
                   │   Frontend (Nuxt SPA)  │
                   │ - Cliente REST         │
                   │ - Cliente MQTT (WS)    │
                   └──────▲───────────▲─────┘
                          │           │
                          │           │
                     HTTP │           │ WebSocket MQTT
                          ▼           ▼
                ┌────────────────┐   ┌──────────────┐
                │   API Node.js  │   │  EMQX Broker │
                └──────▲─────────┘   └──────────────┘
                       │                    
                       ▼                   
                ┌──────────────┐     
                │   MongoDB    │     
                └──────────────┘     
                                     

- Frontend compilado en build
- Servido como SPA estática con Nginx
- API independiente
- Servicios desacoplados

## ⚙️ Ejecución Manual (Modo Desarrollo)

Si se desea ejecutar sin Docker:

### Requisitos

- Node.js >= 18

- MongoDB activo

- Broker MQTT activo (ej: EMQX)

### 🔐 Variables de entorno

En /api y /front-end encontrará un archivo .env.example.

Debe crear un archivo .env en cada carpeta.

### Ejemplo Frontend (front-end/.env)

```bash
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001
NUXT_PUBLIC_MQTT_URL=ws://localhost:8083/mqtt
NUXT_PUBLIC_MQTT_USERNAME=superuser
NUXT_PUBLIC_MQTT_PASSWORD=superuser
```
### Ejemplo Backend (api/.env)
```bash
# Server
PORT=3001
# Mongo
MONGO_URI=mongodb://devuser:devpassword@localhost:27017/admin
# JWT
JWT_SECRET=super_secret_dev
JWT_EXPIRES_IN=7d
# Environment
NODE_ENV=development
```
### 🔧 Backend (API)
```bash
cd api
npm install
npm run dev
```

Disponible en:
```
http://localhost:3001/api
```

### 🎨 Frontend (Nuxt 3 SPA)
```bash
cd front-end
npm install
npm run dev
```

Disponible en:
```
http://localhost:3000

```
### 🚀 despliegue manual (Notas)

- Front y API pueden deployarse por separado
- Se espera un broker MQTT activo en ws://localhost:8083
- Se espera base de datos mongo activa en mongodb://localhost:27017/
- Las cookies requieren withCredentials: true


## 🔐 Autenticación

- Login genera JWT
- JWT se guarda en cookie `httpOnly`
- Front **no accede al token** directamente
- Middleware `/verify` valida sesión
- Logout limpia cookie

¿Por qué cookies HttpOnly?
- Evitan acceso al token vía XSS
- No se expone el JWT en el frontend
- Patrón más cercano a entornos productivos reales
- Evitar problemas de hydration comúnmente conocidos de nuxt al usar localStorage

## 📡 MQTT

La aplicación se conecta a un broker MQTT para:
- Suscribirse a mensajes de dispositivos
- Enviar comandos a los dispositivos
- Recibir confirmación de la operacion solicitada
La conexión MQTT se gestiona de forma centralizada para evitar múltiples conexiones innecesarias.

- Conexión vía WebSocket
- Suscripción dinámica por usuario:

```
<userId>/+/+/sdata
```

- Cliente MQTT gestionado desde Pinia Store

## 📄 Scripts útiles

### Backend
```bash
npm run dev
npm start
```
### Frontend
```bash
npm run dev
npm run build
npm run preview
```


## 📌 Estado del proyecto

✅ Funcional

✅ Arquitectura desacoplada

✅ Autenticación segura con cookies httpOnly

✅ Comunicación MQTT operativa

✅ Dockerizado (API + Frontend + Mongo + EMQX)

✅ Listo para GitHub

## 🔮 Posibles mejoras futuras

- Roles y permisos de usuario
- Sistema de alertas automáticas
- Generalización fuera del caso de uso presentado en la tesis
- Integración con sensores (actualmente, solo preparada para actuadores)
- Deploy en servidor productivo (VPS / Cloud)
- Implementacion de certificados ssl para https


## 👤 Autor

**Adrián Gallicet**

