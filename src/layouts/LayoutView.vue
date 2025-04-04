<template>
  <v-app id="layout">
    <!-- header menu -->
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Jincotech</v-app-bar-title>
      <!-- <v-app-bar-icon></v-app-bar-icon>  이것은 vuetify3에서 아래 v-btn> 으로 변경됨-->
      <v-btn
        @click="lognOut"
        icon="mdi-export"
        ></v-btn>

    </v-app-bar>
    <!-- left menu -->
    <v-navigation-drawer
      stateless
      value="true"
      d-flex
    >
    <v-list v-model:opened="open">
      <!-- <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item> -->
      <v-list-group value="mainMgmt">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="기본관리 "
          ></v-list-item>
        </template>

          <v-list-item
            v-for="([title, icon, path], i) in subMenus"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :value="title"
            @click="movePath(path)"
          ></v-list-item>
      </v-list-group>
    </v-list>
    <v-list v-model:opened="open">
      <v-list-group value="systemMgmt">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="시스템관리 "
            active
          ></v-list-item>
        </template>

          <v-list-item
            v-for="([title, icon, path], i) in subMenus1"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :value="title"
            @click="movePath(path)"
            active
          ></v-list-item>
        </v-list-group>

    </v-list>

  </v-navigation-drawer>
  <v-main>
    <v-container
        background-color="surface-light"
      >
      <RouterView/>
    </v-container>
  </v-main>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';


const router = useRouter();
const authStore = useAuthStore();


const open = ref(['mainMgmt']);


const subMenus = [
    //['DashBoard', 'mdi-account-multiple-outline', router.push('/DashBoard') ],
   // ['Settings', 'mdi-cog-outline',  router.push('/settings')],
]
const subMenus1 = [
    ['사용자관리', 'mdi-account-multiple-outline', router.push('/system/userMgmt') ],
   // ['공통코드관리', 'mdi-cog-outline',  router.push('/commonMgmt')],
   // ['Settings', 'mdi-cog-outline',  router.push('/settings')],

]

const movePath = move =>{
  router.push(move);
}

const lognOut = () => {
  authStore.logoutUser();
  router.push('/login')
}

</script>

<style lang="scss" scoped>


</style>
