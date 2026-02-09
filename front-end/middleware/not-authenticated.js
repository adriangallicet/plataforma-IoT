//middleware para usuarios no autenticados, lo utilizaremos en login y register
export default defineNuxtRouteMiddleware(async () => {
  const { $axios } = useNuxtApp()

  try {
    await $axios.get('/verify')
    return navigateTo('/')
  } catch {
    // no logueado → puede entrar
  }
})
