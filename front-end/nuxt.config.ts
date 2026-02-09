// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Disables server-side rendering
   runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
      mqttUrl: process.env.NUXT_PUBLIC_MQTT_URL,
      mqttUsername: process.env.NUXT_PUBLIC_MQTT_USERNAME,
      mqttPassword: process.env.NUXT_PUBLIC_MQTT_PASSWORD,
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/icon',
    'nuxt-highcharts',
    '@pinia/nuxt'
  ],
  plugins: ['~/plugins/event-bus.js'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
})