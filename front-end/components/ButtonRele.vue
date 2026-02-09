<template>
    <Card class="w-full mb-4" :class="[getStatus()]">
        <CardHeader>
            <CardTitle class="text-sm"> HAB {{config.actuator.id}}</CardTitle>
        </CardHeader>
        <CardContent class="flex justify-end px-6 pb-6">
            <Button
        :disabled="loading"
        variant="outline"
        @click="sendValue"
      >
        <template v-if="loading">
          <span class="loader"></span> Enviando...
        </template>
        <template v-else>
          On
        </template>
      </Button>
                 
    </CardContent>
        
    </Card>
    
</template>

<script>
import {useMqttStore} from '@/store'
import { useNuxtApp } from '#app'; // Asegúrate de importar useNuxtApp  

export default {
  props: ['config'], //propiedad que espera recibir el componente

setup(){
  const { $eventBus } = useNuxtApp();
  const mqttStore = useMqttStore()

  return {
      eventBus: $eventBus,
      mqttStore,
      
    }
},
  
  data() {
    return {
    sending:true,
    loading: false,
    timeoutId: null,
    topic2: this.config.userId + "/" + this.config._id + "/" + this.config.actuator.id + "/sdata",
    };
  },
  mounted() {
    this.listenResponse()
  },
  unmounted() {
    this.removeListener();
  },
  methods: {
    sendValue(){
         this.loading = true;  // Coloca en estado cargando  
      // Configura timeout para detectar si no llega respuesta en 10s  
      this.timeoutId = setTimeout(() => {  
        this.loading = false; // Sale del estado cargando  
        //tal vez en esta linea se podria agregar un toast para mostrar al usuario error 
      }, 10000);  
      
        const valor = !this.config.actuator.value;
       

        const toSend = {
            topic: this.config.userId + "/" + this.config._id + "/" + this.config.actuator.id + "/actdata",
            msg: {
                value: valor
            }
        };
      this.mqttStore.publish(toSend.topic, toSend.msg)
    },

    getStatus(){
        if(this.config.actuator.value) {

            return "bg-lime-100"
        }
        return "bg-neutral-300"
    },
    listenResponse(){
      
      this.eventBus.on(this.topic2, this.handleResponse)

    },
    handleResponse(){
       if (this.loading) {
        clearTimeout(this.timeoutId);
        this.loading = false;
        // Opcional: mostrar confirmación
      }
    },
    removeListener(){
      this.eventBus.off(this.topic2, this.handleResponse);
    }
  }
};
</script>

<style>
/* Spinner simple para indicar carga */
.loader {
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<!-- forma de estructurar topicos segun su origen y destino
/userId/dId/temperature/sdata para data desde el dispositivo a la plataforma
/userId/dId/temperature/actdata para data desde la plataforma al dispositivo

buena idea esta diferenciacion para no suscribirme a un mensaje que estoy mandado yo
y me llegue a mi mismo, es decir, q me haga un eco -->
