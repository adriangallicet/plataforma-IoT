
<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-2 lg:px-4 grow overflow-auto">
      <header
        class="flex items-center gap-2 p-4 hover:scale-[101%] transition cursor-pointer"
      >
        <Logo class="hidden lg:inline"/>
        <p class="font-bold text-black hidden lg:block">
          TV services
        </p>
      </header>

      <!-- Menu items -->
      <div class="px-2 lg:px-4 pb-4">
        <div class="grid gap-2">
          <NuxtLink
            v-for="(item, index) in items"
            :key="index"
            :to="item.path"
            :title="item.title"
            class="
              flex items-center gap-2
              px-2 py-2
              transition rounded cursor-pointer
              hover:bg-neutral-100
              justify-center lg:justify-start
              [&.router-link-active]:bg-neutral-200
            "
          >
            <Icon size="20" :name="item.icon" />
            <span class="hidden lg:inline">
              {{ item.title }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <div class="px-2 lg:px-4 py-4 mt-auto">
      <button
        @click="logout"
        class="
          flex items-center gap-2
          w-full px-2 py-2
          text-sm text-red-600
          hover:bg-red-50 rounded
          justify-center lg:justify-start
        "
      >
        <Icon size="20" name="mdi:logout" />
        <span class="hidden lg:inline">
          Logout
        </span>
      </button>
    </div>
  </div>
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

