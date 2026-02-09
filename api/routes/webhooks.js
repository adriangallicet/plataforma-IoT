import express from 'express';
const router = express.Router();
import Device from '../models/device.js'; // Importar el modelo de Dispositivos 

router.post("/getdevicecredentials", async (req, res ) =>{
    console.log(req.body);
    const dId = req.body.dId;
    const _id = req.body._id;
    const device = await Device.findOne({ dId: dId });
    console.log(device)
    if(!_id == device._id){
        return res.status(401).json();
    }

    const userId = device.userId;

    const toSend = {
        topic: userId + "/" + _id + "/",
        actuators: device.actuators
    };

    console.log(toSend);

    res.json(toSend); //res como Json, ya que va al dispositivo
})

export default router;