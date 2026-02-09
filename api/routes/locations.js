import express from 'express';
const router = express.Router();
import { checkAuth } from '../middlewares/authentication.js'

//importamos el modelo que creamos
import Location from '../models/location.js';

//creamos endpoint para grabar en bd las locaciones que envia el front

router.post('/location', checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id //guardamos userId que rescatamos del token, motivo de seguridad
        
        var newLocation = req.body.location 

        //agregamos los campos que nos faltan del modelo
        newLocation.userId = userId
        newLocation.createdTime = Date.now()

        const r = await Location.create(newLocation) //le pasamos al modelo para que cree un registro en mongo
        
        const response = {
            status: "success"
        }

        return res.json(response)

    } catch (error) {
        console.log(error)

        const response = {
            status: "error",
            error: error
        }
        return res.status(500).json(response)
        
    }
})

router.get("/location", checkAuth ,async (req, res) => {
   
    try { //es importante el uso de los trycatch. Asi, ante un error, no se detiene la ejecucion del programa
        const userId = req.userData._id //todo lo que genera mongo lo realiza con _, por eso _id, al instertar un dispositivo crea dicho id
       
        const locations = await Location.find({userId: userId}) //si hacemos el find vacio traeria todos los dispositivos
        
        const response = {
            status: "success",
            data: locations
        }
    
       return res.json(response)
    } catch (error) {


        const response = {
            status: "error",
            error: error
        }
        return res.status(500).json(response)
    }
  

});

router.delete('/location', checkAuth, async(req, res) =>{
    try {
        const userId = req.userData._id
        const locationId = req.query.locationId

        const r = await Location.deleteOne({userId: userId, _id: locationId})

        const response = {
            status: "success"
        }

        return res.json(response)
    } catch (error) {

        console.log(error)

        const response = {
            status: "error",
            error: error
        }

        return res.status(500).json(response)
    }

})


export default router;

