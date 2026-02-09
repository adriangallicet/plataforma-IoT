import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/authentication.js'

import Data from '../models/data.js';
import Location from '../models/location.js'; // Importar el modelo de Localizaciones  
import Device from '../models/device.js'; // Importar el modelo de Dispositivos 

router.post("/data", checkAuth , async (req, res) => {

    const { locationId, locationName, deviceName, deviceId, habitacion, valor, createdTime } = req.body;  
    

    try {  
        const newData = new Data({  
            locationId,  
            locationName,  
            deviceName,  
            deviceId,  
            habitacion, 
            valor,  
            createdTime
            
        });  
        
        
        const data = await Data.create(newData) 
        res.status(201).json({ status: 'success', message: 'Data saved successfully' });  
    } catch (error) {    
        res.status(500).json({ status: 'error', message: 'Failed to save data' });  
    }  


    
  
});

router.get("/data", checkAuth, async (req, res) => {  
    try {  

        const userId = req.userData._id //guardamos userId que rescatamos del token, motivo de seguridad
        const { period, location } = req.query; // Obtener el periodo desde la consulta  
        const now = Date.now(); // Obtener la hora actual en milisegundos como número  
        let queryConditions = {}; // Inicializar condiciones de consulta  

        const locations = await Location.find({ userId: userId }).select('name -_id');
        const uniqueLocations = locations.map(loc => loc.name);

        // Filtro por ubicación si se proporcionó
        if (location) {
           queryConditions.locationName = location;
        }
    
        // Definir las condiciones de consulta según el periodo  
        switch (period) {  
            case 'semanal':  
                queryConditions.createdTime = {  
                    $gte: now - (7 * 24 * 60 * 60 * 1000), // Últimos 7 días  
                    $lte: now  
                };  
                break;  

            case 'anual':  
                const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime(); // Primer día del año  
                const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999).getTime(); // Último día del año  
                queryConditions.createdTime = {  
                    $gte: startOfYear,  
                    $lte: endOfYear  
                };  
                break;  

            default:  
                return res.status(400).json({ status: 'error', message: 'Periodo no válido. Debe ser "semanal" o "anual"' });  
        }  
        //

        // Recuperar datos que cumplen con las condiciones de tiempo  
        const datos = await Data.find(queryConditions);  
    
         // Inicializar variables para el procesamiento  
        let totalRevenue = 0;  
        let totalSales = 0;  
        let totalLocations = 0;  
        let totalDevices = 0;  
        let recentCount = 0;
        let dataForChart = [];

         // 1) Definir claves posibles según periodo
        const isSemanal = period === 'semanal';
        const isAnual = period === 'anual';

        const keysSemanal = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']; // ES corto
        const keysAnual   = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']; // ES corto

        // Si period es 'semanal', allKeys toma las clavesSemanal.
        // Si period es 'anual', allKeys toma las clavesAnual.
        const allKeys = isSemanal ? keysSemanal : isAnual ? keysAnual : [];

        // Propósito:
        // Tener una lista fija de claves para inicializar y para asegurar que, 
        // aunque no haya datos para algunas claves, esas claves aparezcan en 
        // el resultado con total 0
        //A su vez, se implemento emptyChart, teniendo en cuenta que el caso en que no haya datos generados,
        //se devuelve dataForChart con las keys, y valores de 0, ya que el chart esta a la espera de dichos datos.
        
        // Si no hay datos  
        if (!datos || datos.length === 0) {  

             const emptyChart = allKeys.map(k => ({
            name: k,
            total: 0
            }))
            // Preparar la respuesta(devolvemos todo en 0)
        const response = {  
            status: "success",  
            data: {  
                totalRevenue,  
                totalSales,  
                totalLocations,  
                totalDevices,  
                dataForChart: emptyChart,  
                recentCount,
                uniqueLocations  
            }  
        };  

        // Enviar la respuesta al cliente  
        return res.json(response);  
        }  

       

        // 2) Inicializar acumuladores
        // Se llena con todas las claves de allKeys, inicializando cada una a 0
        const groupedData = {};
        allKeys.forEach(k => { groupedData[k] = 0; });

        // 3) Procesar los datos recuperados
        //se recorre datos, array de objetos de la coleccion data, cada objeto es una suscripcion/venta

        datos.forEach(item => {

        totalRevenue += item.valor; //el monto de la venta
        totalSales++;

        //createdTime es un timestamp en unix.
        //netwDate crea un objeto Date de esta fecha/hora,para poder extraer partes como el día de la semana o el mes.
        const createdTime = new Date(item.createdTime); 
        let key;
        //usamos toLocaleString con la opción { weekday: 'short' } para obtener el nombre corto del día de la semana en español
        //Ejemplos de resultados posibles: 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'
        //usamos toLocaleString con { month: 'short' } para obtener el nombre corto del mes en español.
        //Ejemplos: 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
        if (isSemanal) {
            key = createdTime.toLocaleString('es-ES', { weekday: 'short' });
        } else if (isAnual) {
            key = createdTime.toLocaleString('es-ES', { month: 'short' });
        } else {
            return;
        }

        //groupedData.hasOwnProperty(key) verifica si ya existe una entrada para esa clave en el acumulador
        // groupedData[key] += item.valor--> Suma el valor de la venta actual al total acumulado para esa clave.
        //es decir: va iterando sobre el array datos(item es cada iteracion) y en cada caso, se suma el valor correspondiente
        //al mes o semana correspondiente
        if (groupedData.hasOwnProperty(key)) {
            groupedData[key] += item.valor;
        }
        });

        // 4) Convertir a array para la respuesta
        //  devuelve un array de pares [clave, valor], por ejemplo [['dom', 100], ['lun', 200], ...]
        // .map transforma cada par en un objeto con la forma { name, total }.
        dataForChart = Object.entries(groupedData).map(([name, total]) => ({
        name,
        total
        }));

        // Ejemplo práctico

        // Suponga:
        // period = 'semanal' -> isSemanal = true
        // groupedData inicializa con: { dom: 0, lun: 0, mar: 0, mie: 0, jue: 0, vie: 0, sáb: 0 }
        // Una venta de:
        // item.valor = 150
        // item.createdTime corresponde a domingo
        // Proceso:
        // createdTime = new Date(item.createdTime)
        // isSemanal es true, así que:
        // key = createdTime.toLocaleString('es-ES', { weekday: 'short' }) => 'dom'
        // groupedData.hasOwnProperty('dom') devuelve true (porque inicializamos dom a 0)
        // groupedData['dom'] += 150
        // groupedData queda: { dom: 150, lun: 0, mar: 0, mie: 0, jue: 0, vie: 0, sáb: 0 }

    
                //Obtener locaciones y dispositivos distintos  
        const distinctLocations = Array.from(new Set(datos.map(item => item.locationName)));  
        totalLocations = distinctLocations.length;  

        const distinctDevices = Array.from(new Set(datos.map(item => item.deviceId)));  
        totalDevices = distinctDevices.length;  

        // Contar datos recientes  
        recentCount = datos.length;  

        // Preparar la respuesta  
        const response = {  
            status: "success",  
            data: {  
                totalRevenue,  
                totalSales,  
                totalLocations,  
                totalDevices,  
                dataForChart,  
                recentCount,
                 uniqueLocations  
            }  
        };  

        // Enviar la respuesta al cliente  
        return res.json(response);  
    } catch (error) {  
        console.error("Error al obtener datos del dashboard:", error);  
        res.status(500).json({ status: 'error', message: 'Error al obtener los datos' });  
    }  
});  

export default router;