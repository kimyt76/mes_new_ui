<template>
    <v-alert
      v-model="alert.visible"
      class="app-alert"
      :type="alert.type"
      :text = "alert.message"
    ></v-alert>
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'

const alert = useAlertStore()

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
