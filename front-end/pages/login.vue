<template>

    <div>
        <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>TV services</CardTitle>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-2">
            <Label for="email">Email</Label>
            <Input v-model="user.email" id="email" placeholder="name@example.com" />
          </div>
          <div class="flex flex-col space-y-2">
            <Label for="pass">Password</Label>
            <Input  type="password" v-model="user.password" id="pass" placeholder="password" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end">
      <Button @click="login()">login</Button>
    </CardFooter>
  </Card>
    </div>
   
</template>
  
<script>
import { useToast } from '@/components/ui/toast/use-toast'
import { useMainStore } from '@/store'

export default {
  setup() {
    const { toast } = useToast()
    const { $axios } = useNuxtApp()
    const store = useMainStore()

    definePageMeta({
      layout: 'auth',
      middleware: 'not-authenticated'
    })

    return {
      toast,
      axios: $axios,
      store
    }
  },

  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
   async login () {
  try {
    const res = await this.axios.post('/login', this.user)
    if (res.data.status === 'success') {
       this.store.setUserData(res.data.userData)

      navigateTo('/')
    }
  } catch {
    this.toast({
      title: 'Fallo',
      description: 'Error al intentar acceder',
      variant: 'destructive'
    })
  }
}

  }
}
</script>