import { defineStore } from 'pinia';
import mqtt from 'mqtt'
import { useNuxtApp } from '#app'; // Asegúrate de importar useNuxtApp  


export const useMainStore = defineStore('main', {  
  state: () => ({  
    devices: [],
    userData: null
  }),
  actions: {  
    setDevices(newdevice){
      this.devices = newdevice
    }, 
    async getDevices() {  
      const { $axios } = useNuxtApp() //plugin axios para las llamadas
     

      try {  
        const res = await $axios.get("/device"); 
        // Asignamos los dispositivos desde la respuesta  
        this.setDevices(res.data.data);  
      } catch (error) {  
        console.error('Error fetching devices:', error);  
      }  
    },
       async getUserData() {
        
      // 1️⃣ Ya existe → devolverlo
      if (this.userData) {
        return
      }
      const { $axios } = useNuxtApp()
      // 2️⃣ No existe → pedirlo
      try {
        const res = await $axios.get('/verify')

        if (res.data.status === 'success') {
          this.userData = res.data.userData
          
        }
      } catch (err) {
        this.userData = null
      }
    },
    updateDeviceActuatorValue(dId, actuatorId, newValue) {
  const device = this.devices.find(d => d._id === dId);
  if (device) {
    const actuator = device.actuators.find(a => a.id === actuatorId);
    if (actuator) {
      actuator.value = newValue; // actualizar en store
    }
  }
    },
    setUserData(user) {
      this.userData = user
    },
    clearUserData() {
      this.userData = null
    }
    
    

  }
});  



export const useMqttStore = defineStore('mqtt', {
  state: () => ({
    client: null,
    isConnected: false,
  }),
  actions: {
    startClient() {
      const {  $axios, $eventBus } = useNuxtApp();
      const store = useMainStore()
      const config = useRuntimeConfig()

        if (!store.userData) { //sin userData no hacemos nada, necesitamos el id para la suscripcion de topic
        console.warn('[MQTT] userData no disponible, abortando conexión')
        return
      }
      // Si ya hay un cliente y está conectado, no hacer nada
      if (this.client && this.isConnected) {
        return
      }

       const userId = store.userData._id


this.client = mqtt.connect(config.public.mqttUrl, {
  clean: true,
  reconnectPeriod: 5000,
  clientId: 'web_' + Date.now(),
  username: config.public.mqttUsername,
  password: config.public.mqttPassword,
})
      this.client.on('connect', () => {
        this.isConnected = true
        this.subscribe(userId + "/+/+/sdata")
      
      })


      //ganchos. Tal vez son de utilidad
      // this.client.on('error', (error) => {
      //   console.error('Error MQTT', error)
      // })

      // this.client.on('reconnect', () => {
      //   console.log('Reconectando MQTT...')
      // })

    this.client.on('message', (topic, message) => { 

    try {  
        // Identificar desde qué topic nos está llegando el mensaje  
        const splittedTopic = topic.split("/"); // Divide el topic en partes  
        const msgType = splittedTopic[3];  

        
        if (msgType === "sdata") {  
           
            // Parsear el mensaje recibido  
            const parsedMessage = JSON.parse(message.toString());  
            const newValue = parsedMessage.value; // Acceder al valor que necesito  

            const toSend = {  
                dId: splittedTopic[1],  
                actuatorId: splittedTopic[2],  
                newValue: newValue,  
            };   

            ///LINEA PARA VALIDAR DATOS ANTES DE REALIZAR LLAMADA A LA API /////

            if (!toSend.dId || !toSend.actuatorId || newValue === undefined) {  
                return;  
            } 
            
            // Realizar la actualización del dispositivo  
            $axios.put("/device", toSend)  
                .then(res => {  
                    if (res.data.status === "success") {  

                        // ** Actualiza el estado local basado en la respuesta **  

                         $eventBus.emit(topic); 
                        const device = store.devices.find(dev => dev._id === toSend.dId); 
                        if (device) {  
                           store.updateDeviceActuatorValue(toSend.dId, toSend.actuatorId, newValue);

                            // ** Guardar en la base de datos si el nuevo valor es true **  
                            if (newValue) {  
                                const dataToStore = {  
                                    locationId: device.locationId, // Obtener el ID de la ubicación  
                                    locationName: device.locationName, // Obtener el nombre de la ubicación  
                                    deviceName: device.name, // Obtener el nombre del dispositivo  
                                    deviceId: device._id, // ID del dispositivo
                                    habitacion: toSend.actuatorId, 
                                    valor: 1000,
                                    createdTime: Date.now(), // Guardar la hora actual  
                                };  
                              
                                // Realizar el POST para guardar en la base de datos  
                                $axios.post("/data", dataToStore)  
                                    .then(saveRes => {  
                                        if (saveRes.data.status === "success") {  
                                            console.log("Data saved successfully."); 
                                        } else {  
                                            console.error("Error saving data:", saveRes.data.message);  
                                        }  
                                    })  
                                    .catch(error => {  
                                        console.error("Error saving data:", error);  
                                    });  
                            }  
                        }  
                    }  
                })  
                .catch(e => {  
                    console.error("Error updating device:", e);  
                });  
        }  
    } catch (error) {  
        console.log(error);  
    }  
});  

      

      this.client.on('close', () => {
        this.isConnected = false
      })
    },

    stopClient() {
      if (this.client) {
        this.client.end()
        this.client = null
        this.isConnected = false
      }
    },

    publish(topic, msg) {
      if (this.client && this.isConnected) {
        this.client.publish(topic, JSON.stringify(msg))
      } 
    },

    subscribe(topic) {
      if (this.client && this.isConnected) {
        
        this.client.subscribe(topic, { qos: 0 }, (err) => {
          if (err){
            return err
          }
        })
      } else {
        return
      }
    }
  }
})