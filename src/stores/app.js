import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const drawer = ref(true)

  function toggleDrawer() {
    drawer.value = !drawer.value
  }

  return { drawer, toggleDrawer }
})
