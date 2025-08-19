<template>
  <v-list-item>
    <template #prepend>
      <v-avatar>
        <a href="http://jincostech.com/" target="_blank" rel="noopener">
          <img :src="logo" alt="Logo" style="width: 40px; height: auto;" />
        </a>
<!--
        <v-img img :src="logo" alt="Logo"
          target="_blank"
          href="http://jincostech.com/"
        /> -->
      </v-avatar>
    </template>
    <v-list-item-title>Jincotech</v-list-item-title>
    <v-list-item-subtitle>MES NEW</v-list-item-subtitle>
  </v-list-item>
</template>

<script setup>
import logo from '@/assets/icon/logo_jincostech.jpg'
</script>

<style 1coped>

</style>
