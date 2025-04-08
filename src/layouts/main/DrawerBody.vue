<template>
  <v-navigation-drawer
    v-model="menuStore.drawer"
    dark
    app
    >

    <DrawerHeader />
    <v-divider />

    <ListMain
      :items="menuStore.items"
    />
    <template #append>
      <div class="pa-2 text-center">
        <v-btn
          block
          class="font-weight-black"
          color="red"
          rounded
          large
          target="_blank"
          href="http://jincostech.com/"
        >
          Jincostech
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { useMenuStore } from '@/stores/menu';
import DrawerHeader from './DrawerHeader.vue';
import ListMain from './ListMain.vue';

const menuStore = useMenuStore()

// 예: 메뉴 drawer 열고 닫기
//menuStore.toggleDrawer(false)

</script>

<style>

</style>
