<template>
    <v-alert
      v-model="alert.visible"
      class="app-alert"
      :type="alert.type"
      :text = "alert.message"
      :style="{ zIndex: 10000 }"
    ></v-alert>
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'

const alert = useAlertStore()

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
