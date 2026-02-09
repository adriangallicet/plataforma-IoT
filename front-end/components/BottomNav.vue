<template>
  <nav
    class="
      fixed bottom-0 left-0 z-50
      w-full h-16
      bg-white
      border-t
      shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
      lg:hidden
    "
  >
    <ul class="grid grid-cols-5 h-full">
      <!-- Navigation items -->
      <NuxtLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="
          relative
          flex flex-col items-center justify-center
          gap-1 text-xs
          text-neutral-500
          transition
          [&.router-link-active]:text-black
          [&.router-link-active]:font-medium
        "
      >
        <Icon :name="item.icon" size="22" />
        <span>{{ item.title }}</span>

        <!-- active indicator -->
        <span
          class="
            absolute bottom-1 w-6 h-0.5 rounded
            bg-black
            opacity-0
            [&.router-link-active]:opacity-100
          "
        />
      </NuxtLink>

      <!-- Logout -->
      <li>
        <button
          @click="logout"
          class="
            w-full h-full
            flex flex-col items-center justify-center
            gap-1 text-xs
            text-red-500
            transition
            hover:bg-red-50
          "
        >
          <Icon name="mdi:logout" size="22" />
          <span>Logout</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { useMqttStore } from '@/store'
import { useMainStore } from '@/store'

const { items } = useNavigation()
const mqttStore = useMqttStore()
const store = useMainStore()

const { $axios } = useNuxtApp()

async function logout () {
  try {
    await $axios.post('/logout')
  } catch (err) {
    console.error('error logout', err)
  }

  // limpiar estado
  mqttStore.stopClient()
  store.clearUserData()

  await navigateTo('/login')
}
</script>
