<template>
   <v-responsive class="border rounded" max-height="300">
    <v-app>
      <DrawerBody />

      <AppBar />

      <MainView />
    </v-app>
   </v-responsive>

</template>

<script setup>
import AppBar from './AppBar.vue';
import DrawerBody from './DrawerBody.vue'
import MainView from './MainView.vue';


</script>

<style>

</style>
