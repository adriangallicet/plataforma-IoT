<script>
import { useToast } from '@/components/ui/toast/use-toast'
import {useMainStore} from '@/store'

export default {
  setup(){
    const { toast } = useToast();
    const store = useMainStore()
    const { $axios } = useNuxtApp()


    definePageMeta({   
      middleware: 'authenticated'
    });

    return {
      store,
      toast,
      axios: $axios
    };

  },
  data(){
    return{
      locations:[],
        devices:[],
        locationName: "",
        locationDescription: ""
    }

},
mounted(){
  this.getLocations()
},
  methods: {
    async saveLocation(){
      
        const toSend = {
          location: {
          name: this.locationName,
          description: this.locationDescription,
          devices: this.devices
           }
        }

        try {
            const res = await this.axios.post("/location", toSend)
            if(res.data.status == "success"){
                this.toast({  
                title: 'Éxito',  
                description: 'La acción se realizó exitosamente.',
                variant: 'success'
            })
            this.getLocations()
        }
        } catch (error) {
            this.toast({  
                title: 'Fallo',  
                description: 'Usuario ya existente',  
                variant: 'destructive'
             })
             console.log(error)
             return
            }
        },
    // get locations
    
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
                description: 'Error al obtener listado de locaciones',  
                variant: 'destructive'
             })
             return  
      }
    },
  //delete location
  async deleteLocation(location){
      const axiosHeaders = {
  
        params:{
          locationId: location._id
        }
    }
    try {
      const res = await this.axios.delete("/location", axiosHeaders )

      if(res.data.status == "success") {
        this.toast({  
                title: 'Éxito',  
                description: 'La acción se realizó exitosamente.',
                variant: 'success'
            })
            this.getLocations()
      }
    } catch (error) {
      this.toast({  
                title: 'Fallo',  
                description: 'Error borrando locacion',  
                variant: 'destructive'
             })
             return
    }

        
    }    
    }
  } 

    
</script>

<template>
  <div class="flex flex-col gap-6 p-6">




   <!-- Header fijo -->
    <header>
      <p>All your locations.</p>
      <h1 class="text-2xl font-bold">Locations</h1>
    </header>
     <!-- Card fija -->
    <Card class="w-full md:w-[350px]">
    <CardHeader>
      <CardTitle>Nueva locacion</CardTitle>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid  gap-4">
          <div class="flex flex-col space-y-2">
            <Label for="name">Name</Label>
            <Input v-model="locationName" id="name" placeholder="Nombre de locacion" />
          </div>
          <div class="flex flex-col space-y-2">
            <Label for="id">Description</Label>
            <Input v-model="locationDescription" id="des" placeholder="descripcion de la locacion" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter>
      <Button @click="saveLocation()">Deploy</Button>
    </CardFooter>
  </Card>
  <div class="rounded-lg border">

  <Table>
    <TableCaption>A list of your recent Locations.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">
          ID
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="location in locations" :key="location._id">
        <TableCell class="font-medium">
          {{ location._id }}
        </TableCell>
        <TableCell>{{ location.name }}</TableCell>
        <TableCell>{{ location.description }}</TableCell>
        <!-- <TableCell><Icon size="20" :name="item.icon" color="black"/></TableCell> -->
        <TableCell>  
            <Button @click="deleteLocation(location)"> eliminar 
            </Button>  
          </TableCell>    
      </TableRow>
    </TableBody>
  </Table>
</div>
</div>
</template>

