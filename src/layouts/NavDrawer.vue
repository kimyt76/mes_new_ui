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
import { useMenuStore } from '@/stores/menu';
import NavDrawerHead from './NavDrawerHead.vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import ListMain from './ListMain.vue';
import { proxyRefs } from 'vue';

/**
 *  toggle기능 drawer 기능
 */
const appStore = useAppStore()
const { drawer } = storeToRefs(appStore)

/**
 *  menu 호출
 */
const { items } = useMenuStore()
</script>

<style scoped>

</style>
