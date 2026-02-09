import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/authentication.js'



/*
 ___  ______________ _____ _      _____ 
|  \/  |  _  |  _  \  ___| |    /  ___|
| .  . | | | | | | | |__ | |    \ `--. 
| |\/| | | | | | | |  __|| |     `--. \
| |  | \ \_/ / |/ /| |___| |____/\__/ /
\_|  |_/\___/|___/ \____/\_____/\____/  
*/
import Device from '../models/device.js';



/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/ 
*/

//get devices
router.get("/device", checkAuth ,async (req, res) => {
   
    try { //es importante el uso de los trycatch. Asi, ante un error, no se detiene la ejecucion del programa
        const userId = req.userData._id //todo lo que genera mongo lo realiza con _, por eso _id, al instertar un dispositivo crea dicho id
       
        const devices = await Device.find({userId: userId}) //si hacemos el find vacio traeria todos los dispositivos
        
        const toSend = {
            status: "success",
            data: devices
        }
    
        return res.json(toSend)
    } catch (error) {

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend)
    }
});

 //new device    
router.post("/device", checkAuth , async (req, res) => {

    try {
        const userId = req.userData._id
        var newDevice = req.body.newDevice

        if (!newDevice) { //aseguramos que venga en la solicitud
            return res.status(400).json({ status: "error" })
        }


    newDevice.userId = userId //le estamos agregando el campo de id al objeto que viene
    newDevice.createdTime = Date.now() //time in unix

    const device = await Device.create(newDevice)

    const toSend = {
        status: "success"
    }

    return res.json(toSend)
        
    } catch (error) {

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend)
    }


    
  
});

//delete device - en el metodo delete, pasamos los datos por params(fijate en postman) es literal como en get, pasas params por url
router.delete("/device", checkAuth, async (req, res) => {

    try {
        console.log("en la query llega", req)
        const userId = req.userData._id
        const dId = req.query.dId
        console.log("en dId hay", dId)
        const result = await Device.deleteOne({userId: userId, dId: dId})
    
        const toSend = {
            status: "success",
            data: result
        }
    
        return res.json(toSend)
        
    } catch (error) {

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend)
    }

   


  
});

//UPDATE DEVICE -vienen los datos por body, como si fuera un post - el objetivo de este metodo es actualizar el valor del actuador en bd (true|false)
//al realizarse un cambio sobre el dispositivo de manera satisfactoria - utilizado en store startclient() en respuesta a mensaje Mqtt desde el dispositivo IoT
router.put("/device", checkAuth, async(req, res) => {
    const userId = req.userData._id
    const dId = req.body.dId;          // Acceso a dId  
    const actuatorId = req.body.actuatorId; // Acceso a actuatorId  
    const newValue = req.body.newValue;      // Acceso a newValue  

    try {
                const result2 = await Device.updateOne({_id:dId,"actuators.id": actuatorId, userId},{$set: { "actuators.$.value": newValue }})

                const toSend = {
                    status: "success"
                }
            
                return res.json(toSend)
            
            } catch (error) {
                const toSend = {
                    status: "error",
                    error: error
                }
                return res.status(500).json(toSend)
            }
});

export default router;