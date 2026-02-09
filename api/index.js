//incluimos librerias(requires)
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; //middleware
import cors from 'cors'; //set politicas de acceso, por ej para que sitios puedan acceder a la api
import mongoose from 'mongoose';
import colors from 'colors'; //permite imprimir console logs de distintos colores
import devicesRouter from './routes/devices.js';
import usersRouter from './routes/users.js';
import locationsRouter from './routes/locations.js';
import datasRouter from './routes/datas.js';
import authsRouter from './routes/auths.js';
import webhooksRouter from './routes/webhooks.js';
import 'dotenv/config';



//instancia o variables locales que van a contener las librerias(instances)
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3001

//express config
app.use(morgan("tiny")); // el middleware nos va a mostrar uan salida cada vez que se golpee el endpoint tiny-manera acotada-
app.use(express.json());
app.use(express.urlencoded({ //permite que en los GET pasemos datos por url, se comprendida por express y la transforme en objeto JS
    extended: true
}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // ✅ necesario para cookies
}))
//express config

//express routes
app.use("/api", devicesRouter);
app.use("/api", usersRouter);
app.use("/api", locationsRouter);
app.use("/api", datasRouter);
app.use("/api", authsRouter);
app.use("/api", webhooksRouter);

 //ordenamiento de rutas y endpoints en archivos separados

//listener API
app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`.cyan);
});

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
  };
//nos valemos de la libreria para conectarnos, mediante try/catch, la uri que armamos y las options
    mongoose.connect(process.env.MONGO_URI, options).then(
        () => {
          console.log("\n");
          console.log("*******************************".green);
          console.log("✔ Mongo Successfully Connected!".green);
          console.log("*******************************".green);
          console.log("\n");
        },
        (err) => {
          console.log("\n");
          console.log("*******************************".red);
          console.log("    Mongo Connection Failed    ".red);
          console.log("*******************************".red);
          console.log("\n");
          console.log(err);
        }
      );




