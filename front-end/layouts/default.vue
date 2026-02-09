<template>
  <div class="h-screen flex flex-col lg:flex-row overflow-hidden">
    <div class="hidden lg:flex shrink-0">
      <Sidebar />
    </div>

    <main class="flex-1 pb-24 lg:pb-0 overflow-x-hidden px-4 lg:px-8 pt-6">
      <slot />
    </main>

    <BottomNav class="lg:hidden shrink-0" />
    <Toaster />
  </div>
</template>
