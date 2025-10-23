<template>
  <v-navigation-drawer
    v-model="drawer"
    v-bind="$attrs"
    dark
    :width="255"
    app
    >

    <NavDrawerHead/>
    <v-divider/>
    <ListMain
      :items="items"
      />
    <template #append>
      <div class="pa-2 text-center">
        <v-btn
          block
          class="font-weight-black"
          color="red"
          rounded
          target="_blank"
          href="https://chatgpt.com/"
        >
          chatgpt
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';
import { useMenuStore } from '@/stores/menu';
import NavDrawerHead from './NavDrawerHead.vue';
import ListMain from './ListMain.vue';

/**
 *  toggle기능 drawer 기능
 */
const appStore = useAppStore()
const { drawer } = storeToRefs(appStore)

/**
 *  menu 호출
 */
const menuStore = useMenuStore();
const { items } = storeToRefs(menuStore)
</script>

<style scoped>

</style>
