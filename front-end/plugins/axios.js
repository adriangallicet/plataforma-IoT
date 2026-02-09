import axios from 'axios';  

export default defineNuxtPlugin(nuxtApp => {  
  const config = useRuntimeConfig()
  // Configura Axios  
  const api = axios.create({  
    baseURL: `${config.public.apiBaseUrl}/api`, // Cambia a tu URL base  está en .env
    timeout: 10000, // Opcional: establece un tiempo de espera  //Axios cancela la request si pasan más de 10 segundos sin respuesta
    withCredentials: true //NO acepta cookies de otra origin sin withCredentials: true
  });  
  // Agrega la instancia de Axios al contexto de Nuxt  
  nuxtApp.provide('axios', api);  
});  