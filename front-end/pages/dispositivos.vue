
<script>
import {useMainStore} from '@/store'
import { useToast } from '@/components/ui/toast/use-toast'


export default {
  setup(){
    const store = useMainStore()
    const { toast } = useToast();
    const { $axios } = useNuxtApp()

    definePageMeta({   
      middleware: 'authenticated'
    });

    return {
      store,
      toast,
      axios: $axios
    }
  },
  mounted(){
    this.store.getDevices()
    this.getLocations()
  },
  methods: {
    updateLocationName() {  
  const selectedLocation = this.locations.find(location => location._id === this.newDevice.locationId);  
  // Verificamos si se encontró la ubicación  
  if (selectedLocation) {  
    this.newDevice.locationName = selectedLocation.name; // Asignamos el nombre a locationName  
  } else {  
    this.newDevice.locationName = ""; // Si no se encuentra, lo dejamos en blanco  
  }  
}  ,
    async getLocations(){

try {
  const res = await this.axios.get("/location")
 
  if(res.data.status =="success"){
    this.locations = res.data.data 
    //siempre una respuesta desde la api hacia el front va a venir en formato res.data, le agregamos otro.data ya que establecemos asi el objeto en la api
    //ver response en locations.js routes de api
  }
} catch (error) {
  this.toast({  
          title: 'Fallo',  
          description: 'No se encontraron locaciones asociadas',  
          variant: 'destructive'
       })
       return
  
}
},

createNewDevice() {
  this.updateLocationName();
  if(this.newDevice.name == ""){
    this.toast({  
      title: 'Fallo',  
      description: 'Campo nombre vacio',  
      variant: 'destructive'
   })
   return //matamos la funcion para que no siga ejecutandose la funcion
  }

  if(this.newDevice.dId == ""){
    this.toast({  
      title: 'Fallo',  
      description: 'Device ID vacio',  
      variant: 'destructive'
   })
   return //matamos la funcion para que no siga ejecutandose la funcion
  }

  if(this.newDevice.name == ""){
    this.toast({  
      title: 'Fallo',  
      description: 'Campo nombre vacio',  
      variant: 'destructive'
   })
   return //matamos la funcion para que no siga ejecutandose la funcion
  }

  if (!this.newDevice.locationId) {  
      this.toast({  
        title: 'Fallo',  
        description: 'Por favor, selecciona una locación',  
        variant: 'destructive'  
      });  
      return;  
    } 

  if(this.actuatorsDenominacion == ""){
    this.toast({  
      title: 'Fallo',  
      description: 'Campo denominacion vacío',  
      variant: 'destructive'
   })
   return //matamos la funcion para que no siga ejecutandose la funcion
  }
  
    if(this.actuatorsCount == ""){
    this.toast({  
      title: 'Fallo',  
      description: 'Campo actuadores vacío',  
      variant: 'destructive'
   })
   return //matamos la funcion para que no siga ejecutandose la funcion
  }

      // Validar y obtener los inputs para actuadores y denominacion  
      const denominacion = parseInt(this.actuatorsDenominacion); // la entrada de denominación  
    const cantidadActuadores = parseInt(this.actuatorsCount); // la entrada de número de actuadores
 // Inicializar el array de actuadores  
 this.newDevice.actuators = [];   

for (let i = 0; i < cantidadActuadores; i++) {  
  const id = (denominacion + i).toString(); // Generar el ID usando denominación + i  
  // Agregar el nuevo formato de objeto al array de actuadores  
  this.newDevice.actuators.push({ id: id, value: false });   
}  
   
    const toSend = {
      newDevice: this.newDevice
    }

    this.axios.post("/device", toSend)
    .then(res => {
      if (res.data.status == "success") {
        this.store.getDevices()
        this.newDevice = {  
            name: "",  
            dId: "",  
            locationId: "",  
            locationName: "",
            actuators: {}
          };  
          this.actuatorsDenominacion = ""
          this.actuatorsCount = ""

      }
      this.toast({  
      title: 'Exito',  
      description: 'Dispositivo agregado',  
      variant: 'success'
   })

    })
    .catch(e => {
      if (
        e.response.data.status == "error" &&
        e.response.data.error.errors.dId.kind == "unique"
      ){
        this.toast({  
        title: 'Fallo',  
        description: 'dispositivo ya registrado',  
        variant: 'destructive'  
      });  
      return
      } else {
        this.toast({  
        title: 'Fallo',   
        variant: 'destructive'  
      });  
      }
    })

},
async deleteDevice(device){

 const axiosHeaders = {
        params:{
          dId: device.dId
        }
    }
  
    try {
      const res = await this.axios.delete("/device", axiosHeaders)

      if(res.data.status == "success") {
        this.toast({  
                title: 'Éxito',  
                description: 'La acción se realizó exitosamente.',
                variant: 'success'
            })
            this.store.getDevices()
      }
    } catch (error) {
      this.toast({  
                title: 'Fallo',  
                description: 'Error al borrar device',  
                variant: 'destructive'
             })
             return
    }

        
    }
  },
  data(){
    return {
      locations:[],
      newDevice: {
        name: "",
        dId: "",
        locationId: "",
        locationName: "",
        actuators: []
      },
      actuatorsDenominacion: "", // nuevo campo para denominación  
      actuatorsCount: "" // nuevo campo para cantidad de actuadores  
// devices: [] //este devices que llenamos con la respuesta posee el inconveniente que solo vive en esta page,
            // una solucion es tomar esos datos y en vez de guardar en una variable local resolverlo mediante store, haciendo devices accesible desde cualquier vista y componente
            //el problema radica en que solo se recuperarian los devices cuando se ingresa a esta page mediante el metodo getDevices, en conclusion: llevar el metodo a store
    }
  },
}

</script>

<template>
  <div class="flex flex-col gap-6 p-6">

    <!-- Header -->
    <header>
      <p>All your devices.</p>
      <h1 class="text-2xl font-bold">Devices</h1>
    </header>

    <!-- Card -->
    <Card class="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle>Nuevo dispositivo</CardTitle>
      </CardHeader>

      <CardContent>
        <form class="grid gap-4">
          <div class="flex flex-col space-y-2">
            <Label>Name</Label>
            <Input
              v-model="newDevice.name"
              placeholder="Nombre del nuevo dispositivo"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <Label>ID</Label>
            <Input
              v-model="newDevice.dId"
              placeholder="Número de serie"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <Label>Denominación</Label>
            <Input
              v-model="actuatorsDenominacion"
              placeholder="Ej: 100, 101…"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <Label>Actuadores</Label>
            <Input
              v-model="actuatorsCount"
              placeholder="Cantidad de actuadores"
            />
          </div>

          <div class="flex flex-col space-y-2">
            <Label>Locación</Label>
            <Select v-model="newDevice.locationId">
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="location in locations"
                  :key="location._id"
                  :value="location._id"
                >
                  {{ location.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button @click="createNewDevice()">Deploy</Button>
      </CardFooter>
    </Card>

    <!-- Table -->
    <div class="rounded-lg border">
      <Table>
        <TableCaption>A list of your recent Devices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Locación</TableHead>
            <TableHead>Habitaciones</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="device in store.devices"
            :key="device._id"
          >
            <TableCell class="font-medium">
              {{ device.dId }}
            </TableCell>
            <TableCell>{{ device.name }}</TableCell>
            <TableCell>{{ device.locationName }}</TableCell>
            <TableCell>{{ device.actuators.length }}</TableCell>
            <TableCell>
              <Button @click="deleteDevice(device)">
                eliminar
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

