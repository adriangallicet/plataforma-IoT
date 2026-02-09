export const useNavigation = () => {
  const items = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:chart-line'
    },
    {
      title: 'Dispositivos',
      path: '/dispositivos',
      icon: 'mdi:memory'
    },
    {
      title: 'Tool',
      path: '/tool',
      icon: 'mdi:sitemap'
    },
    {
      title: 'Locations',
      path: '/locations',
      icon: 'mdi:map-marker'
    }
  ]

  return { items }
}
