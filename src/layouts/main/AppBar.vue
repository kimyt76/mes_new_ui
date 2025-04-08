<template>
<v-app-bar :elevation="1"
  app
  color="#505050"
  dark
>
<template v-slot:prepend>
  <v-app-bar-nav-icon
  @click="drawer = !drawer"
  ></v-app-bar-nav-icon>
</template>
<v-app-bar-title>Jincotech</v-app-bar-title>
<v-btn
  @click="lognOut"
  icon="mdi-export"
></v-btn>
</v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


const authStore = useAuthStore();
const router = useRouter();

/**
 * 부서와 이름 가져와서 헤더에 보여주기
 */


 /**
  * 로그 아웃 기능
  */
const lognOut = () => {
  //로그인 상태여야 해당 이벤트 실행
  authStore.logoutUser()
  router.push("/");
}


</script>

<style>

</style>
