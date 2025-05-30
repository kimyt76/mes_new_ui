<template>
  <v-list-item>
    <template #prepend>
      <v-avatar>
        <v-img img :src="logo" alt="Logo"/>
      </v-avatar>
    </template>
    <v-list-item-title>Jincotech</v-list-item-title>
    <v-list-item-subtitle>MES NEW</v-list-item-subtitle>
  </v-list-item>
</template>

<script setup>
import logo from '@/assets/icon/logo_jincostech.jpg'
</script>

<style lang="scss" scoped>

</style>
