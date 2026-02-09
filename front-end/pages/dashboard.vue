<script>  

import {useMainStore} from '@/store'
export default{  
  setup(){
      definePageMeta({  
      middleware: 'authenticated'
    });

    const store = useMainStore()
    const { $axios } = useNuxtApp()

    return {
      store,
      axios: $axios
    }
    }, 
  data() {  
    return {  
selectedPeriod: 'anual',
data:[],
totalRevenue: 0,  
      totalSales: 0,
      recentCount: 0,
      totalLocations: 0,
      totalDevices: 0,
      uniqueLocations:[],
      selectedLocation: '',
      results:[]

    };  
  },
  mounted(){
    this.getData(this.selectedPeriod)
  },  
  watch: {
  selectedPeriod(newVal) {
    this.getData(newVal)
  },
  selectedLocation() {
    this.getData(this.selectedPeriod)
  }
},

  methods: {  
    resetLocation(){
      this.selectedLocation = ""
      this.getData(this.selectedPeriod)
    },
    
    async getData(period){
       
      //  const axiosHeaders = {
      //    headers: {
      //      token: this.store.token.token
      //    }
      //  }

       const params = {
      period: period,
      location: this.selectedLocation
    }

       try {
         const res = await this.axios.get("/data",{  
      params: params,  // Pasa los parámetros 
      //headers: axiosHeaders.headers,  // Asegúrate de incluir los headers  
    });
       
         if(res.data.status =="success"){
           this.totalRevenue = res.data.data.totalRevenue;  
          this.totalSales = res.data.data.totalSales; 
          this.totalLocations = res.data.data.totalLocations; 
          this.totalDevices = res.data.data.totalDevices;
          this.recentCount = res.data.data.recentCount; 
          this.data = res.data.data.dataForChart;
          this.uniqueLocations = res.data.data.uniqueLocations
         }
       } catch (error) {
        
              console.log(error)
              return
         
       }
       }
  },  
} 
</script> 

<template>
  <div class="min-h-screen p-8 pb-24 md:pb-8
"> 

  <div class="flex items-center justify-between">
  <h2 class="text-3xl font-bold tracking-tight">
    Dashboard
  </h2>
</div>

<div class="mb-4">
      
   <div class="flex items-end gap-4 mb-4">
  <div>
    <Label for="location">Locación</Label>
    <Select v-model="selectedLocation">
      <SelectTrigger class="w-[180px]" id="location">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem
          v-for="(location, index) in uniqueLocations"
          :key="index"
          :value="location"
        >
          {{ location }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>

  
</div>



        <Button
    v-if="selectedLocation"
    variant="outline"
    class="w-[180px]"
    @click="resetLocation"
  >
    Volver al balance general
  </Button>  

          
          

  <Tabs v-model="selectedPeriod"  default-value="anual" class="space-y-4 mt-3">
    <TabsList class="w-[180px]">
      <TabsTrigger class="w-[180px]" value="anual">
        Anual
      </TabsTrigger>
     
      <TabsTrigger class="w-[180px]" value="semanal">
        Semanal
      </TabsTrigger>
     
    </TabsList>
    <TabsContent value="anual" >
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Ganancia Total
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">${{totalRevenue}}</div>  
      <p class="text-xs text-muted-foreground">
        +20.1% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Suscripciones
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalSales }}</div>  
      <p class="text-xs text-muted-foreground">
        +180.1% from last month
      </p>
    </CardContent>
  </Card>
  <Card v-if="!selectedLocation">
    <CardHeader  class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Locaciones Activas
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalLocations }}</div>
      <p class="text-xs text-muted-foreground">
        +19% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Dispositivos Activos
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalDevices }}</div> 
      <p class="text-xs text-muted-foreground">
        +201 since last hour
      </p>
    </CardContent>
  </Card>
</div>
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
  <Card class="col-span-4">
    <CardHeader>
      <CardTitle>Overview</CardTitle>
    </CardHeader>
    <CardContent class="pl-2">
      <BarChart  
          :data="data"  
          index="name"  
          :categories="['total']"  
          :rounded-corners="4"
          :colors="['#134e4a']"
          :y-formatter="(tick, i) => {
return typeof tick === 'number'
? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
: ''
}"  
      />  
    </CardContent>
  </Card>
</div> 
    </TabsContent>
    
    <TabsContent value="semanal" >
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Ganancia Total
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">${{totalRevenue}}</div>  
      <p class="text-xs text-muted-foreground">
        +20.1% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Suscripciones
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalSales }}</div>  
      <p class="text-xs text-muted-foreground">
        +180.1% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Locaciones Activas
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalLocations }}</div>
      <p class="text-xs text-muted-foreground">
        +19% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Dispositivos Activos
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ totalDevices }}</div> 
      <p class="text-xs text-muted-foreground">
        +201 since last hour
      </p>
    </CardContent>
  </Card>
</div>
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
<Card class="col-span-4 w-full">
  <CardHeader>
    <CardTitle>Overview</CardTitle>
  </CardHeader>

 <CardContent class="p-0">
  <div
    class="
      relative
      w-full
      h-[260px]
      sm:h-[320px]
      md:h-[360px]
      px-2
    "
  >
    <BarChart
      :key="selectedPeriod"
      :data="data"
      index="name"
      :categories="['total']"
      :rounded-corners="4"
      :colors="['#134e4a']"
    />
  </div>
</CardContent>

</Card>

</div> 
    </TabsContent>

  </Tabs>
    </div>
        </div>

</template>