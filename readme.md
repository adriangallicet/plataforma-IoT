# 🚀 📡 Plataforma web IoT (Nuxt 3 + Node.js + MQTT)

Proyecto para gestión y monitoreo de dispositivos IoT.
forma parte de un sistema prototipo, desarrollado como tesis de grado.
Incluye **frontend**, **API REST con autenticación JWT por cookies** y **comunicación MQTT**.
El objetivo principal del proyecto es demostrar buenas prácticas de desarrollo y organización
 de una aplicación real, más que ofrecer un producto final.
La aplicación simula un entorno productivo donde usuarios autenticados pueden administrar
 dispositivos, locaciones y comunicarse en tiempo real mediante MQTT.


## 🧱 Arquitectura

```
root/
├── api/         # Backend (Node.js + Express + MongoDB)
├── front-end/   # Frontend (Nuxt 3 + Pinia + Tailwind)
└── package.json # Opcional (scripts raíz)
```

- **Frontend**: Nuxt 3 (SPA), Pinia, Tailwind, Shadcn UI
- **Backend**: Node.js, Express, MongoDB, JWT
- **Auth**: JWT almacenado en cookie httpOnly
- **Realtime**: MQTT (WebSocket)



## 🧩 ¿Qué hace la aplicación?

- 🔐 Login / Logout con cookies seguras
- 🧠 Manejo de sesión mediante cookies
- 📡 Conexión MQTT por usuario
- 📊 Dashboard con métricas
- 🔌 Gestión básica de dispositivos y locaciones
- 🚀 Frontend y API desacoplados



## ⚙️ Requisitos

- Node.js >= 18(Se probó hasta dicha versión)
- MongoDB
- Broker MQTT (Se ha utilizado EMQX en este caso)

### 🔐 Variables de entorno
Tanto en /api como en /front-end Encontrará un ejemplo de las variables
utilizadas en el archivo .env.example. En base a ellas, cree un archivo .env
para /api y otro para /front-end antes de ejecutar tanto la API como la interfaz de usuario.

Por ejemplo
Backend (api/.env):

```env
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001
NUXT_PUBLIC_MQTT_URL=ws://localhost:8083/mqtt
NUXT_PUBLIC_MQTT_USERNAME=superuser
NUXT_PUBLIC_MQTT_PASSWORD=superuser
```

> Ver `.env.example`



## 🔧 Backend (API)

### 📁 Ubicación
```
/api
```

### 📦 Instalación
```bash
cd api
npm install
```


### ▶️ Ejecución
En /api
```bash
npm run dev
```

API disponible en:
```
http://localhost:3001/api
```



## 🎨 Frontend (Nuxt 3)

### 📁 Ubicación
```
/front-end
```

### 📦 Instalación
```bash
cd front-end
npm install
```
### ▶️ Ejecución
En /front-end
```bash
npm run dev
```

Frontend disponible en:
```
http://localhost:3000
```



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

- Cliente MQTT controlado desde Pinia Store



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



## 🚀 Deploy (Notas)

- Front y API pueden deployarse por separado
- Se espera un broker MQTT activo en ws://localhost:8083
- Se espera base de datos mongo activa en mongodb://localhost:27017/
- Las cookies requieren withCredentials: true



## 📌 Estado del proyecto

✅ Funcional
✅ Listo para GitHub


🚀 Posibles Mejoras
- Roles de usuario
- Alertas automáticas
- Preparar la plataforma para recibir datos de sensores
 (actualmente, solo preparada para actuadores)
- Preparar la plataforma para que pueda utilizarse de manera generalizada
 (fuera del caso de uso del proyecto)
- Dockerización
- Deploy en producción

## 👤 Autor

**Adrián Gallicet**



