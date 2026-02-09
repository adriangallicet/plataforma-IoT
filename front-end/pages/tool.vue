<template>  
  <div class="flex flex-col w-full"> 
      <!-- Encabezado Fijo -->  
      <header class="bg-white p-4"> 
          <div class="flex flex-col">  
              <h1>Tool for Rele</h1>  
              <Card class="w-[350px] mt-2">  
                  <CardHeader>  
                      <CardTitle>Locacion</CardTitle>  
                  </CardHeader>  
                  <CardContent>  
                      <form>  
                          <div class="grid items-center w-full gap-4">  
                              <div class="flex flex-col space-y-1.5">  
                                  <Label for="location">Locacion</Label>  
                                  <Select v-model="selectedLocation" @update:modelValue="filterDevices">  
                                      <SelectTrigger id="location">  
                                          <SelectValue placeholder="Select" />  
                                      </SelectTrigger>  
                                      <SelectContent position="popper">  
                                          <SelectItem v-for="location in locations" :key="location._id" :value="location._id">  
                                              {{ location.name }}  
                                          </SelectItem>  
                                      </SelectContent>  
                                  </Select>  
                              </div>  
                          </div>  
                      </form>  
                  </CardContent>  
              </Card>  
          </div>  
      </header>    
      <div v-if="filteredDevices.length">  
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">  
        <div v-for="device in filteredDevices" :key="device._id" class="mb-2 flex flex-col">  
            <CardHeader>  
                <CardTitle>{{ device.name }}</CardTitle>  
            </CardHeader>  
            <div class="flex flex-col space-y-2">  
                <div v-for="actuator in device.actuators" :key="actuator.id">  
                    <ButtonRele :config="{ ...device, actuator }" />  
                </div>  
            </div>  
        </div>  
    </div>  
</div>  
<p v-else>No hay dispositivos para la locación seleccionada.</p>  
  </div>  
</template>
<script>

import { useNuxtApp } from '#app'; // Importa useNuxtApp  
import {useMainStore} from '@/store'
import {useMqttStore} from '@/store'




export default {
  setup(){
      definePageMeta({  
      middleware: 'authenticated'
    });

    const store = useMainStore()
     const { $axios, $eventBus } = useNuxtApp()
     const mqttStore = useMqttStore()

    return {
      store,
      axios: $axios,
      mqttStore,
      eventBus:$eventBus
    }
    }
,
    data(){
        return {
          locations: [],
          devices:[],
          selectedLocation: "",
          filteredDevices: [],
            locacion: "",
      client: null, //var que utilizo en startMqttClient, la inicio aqui por si la necesito fuera del metodo
      isConnected: false,

        }
    },
    async mounted(){
      await this.store.getDevices()
      this.devices = this.store.devices
      await this.getLocations()
      await this.store.getUserData()
      this.mqttStore.startClient();
   
    },
    methods: {
    async getLocations(){
       

try {
  const res = await this.$axios.get("/location")

  if(res.data.status =="success"){
    this.locations = res.data.data 
    //siempre una respuesta desde la api hacia el front va a venir en formato res.data, le agregamos otro.data ya que establecemos asi el objeto en la api
    //ver response en locations.js routes de api
  }
} catch (error) {
  this.toast({  
          title: 'Fallo',  
          description: 'Error al obtener lista de locaciones',  
          variant: 'destructive'
       })
       return
  
}
},
  filterDevices(){ 
    this.filteredDevices = this.devices.filter(device => device.locationId === this.selectedLocation); 
    }
  },

   
};
</script>
