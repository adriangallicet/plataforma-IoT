//middleware para usuarios autenticados
//si el usuario no tiene token lo enviamos a login
export default defineNuxtRouteMiddleware(async () => {
  const { $axios } = useNuxtApp()

  try {
    await $axios.get('/verify')
    // OK → sigue
  } catch {
    return navigateTo('/login')
  }
})
