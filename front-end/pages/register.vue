<template>
    <div class="flex items-center justify-center h-screen">
        <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Crear una cuenta</CardTitle>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-2">
            <Label for="name">Name</Label>
            <Input v-model="user.name" id="name" placeholder="ingrese su nombre"/>
          </div>
          <div class="flex flex-col space-y-2">
            <Label for="email">Email</Label>
            <Input v-model="user.email" id="email" placeholder="name@example.com" />
          </div>
          <div class="flex flex-col space-y-2">
            <Label for="pass">Password</Label>
            <Input type="password" v-model="user.password" id="pass" placeholder="password" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end">
      <Button @click="register()">Register</Button>
    </CardFooter>
  </Card>
    </div>
   
</template>
  
<script>  
 
import { useToast } from '@/components/ui/toast/use-toast'


export default {  
  setup() {  
    const { toast } = useToast();
    // Definir el layout dentro de setup  
    definePageMeta({  
      layout: 'auth', // Nombre del layout vacío  
      middleware: 'not-authenticated'
    });  

    return {  
      toast // Devolviendo el toast para poder usarlo en el contexto , necesario ya que el componente lo necesita en el template para que funcione
    };  
  },
  data(){
    return {
      user:{
        name:"",
        email:"",
        password:""
      }
    }

  },
  methods: {
    register(){
        this.$axios.post("/register", this.user)
        .then( res => {
           //sucess - usuario creado
           if(res.data.status == "success"){
           this.toast({  
            title: 'Éxito',  
            description: 'La acción se realizó exitosamente.',
            variant: 'success'
            
        }) 
        this.user.name = "" //limpiamos las casillas en caso de que sea exitoso el register
        this.user.password = ""
        this.user.email = ""

        
        
        return
      }
        })
        .catch(e => {
            console.log(e.response.data)

            if(e.response.data.error.errors.email.kind == "unique"){
              this.toast({  
                title: 'Fallo',  
                description: 'Usuario ya existente',  
                variant: 'destructive'
             })
             return
            } else{
              this.toast({  
                title: 'Fallo',  
                description: 'Error creando usuario',
                variant: 'destructive'
               })

               return
            }
        })
    }

    
  }
}  
</script>  