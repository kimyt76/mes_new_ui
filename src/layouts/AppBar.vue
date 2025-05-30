<template>
  <v-app-bar
    app
    dark
    height="49"
    color="blue-grey-lighten-2"
    >
    <template v-slot:prepend>
      <v-btn
        icon="mdi-menu"
        @click="toggleDrawer"
        ></v-btn>
    </template>
    <v-toolbar-title text="Jincotech"></v-toolbar-title>
    {{ deptNm }}
    {{ memberNm }}
      <v-btn
        @click="lognOut"
        icon="mdi-export"
      ></v-btn>
  </v-app-bar>
</template>

<script setup>
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  /**
   *  drawer  toggle기능
   */
  const { toggleDrawer } = useAppStore()
  const authStore = useAuthStore();

  /**
   *  login 후 app바에 부서 이름 넣기
   */
  const router = useRouter();
  const { memberNm, deptNm } =  authStore;

  /**
  * 로그 아웃 기능
  */
  const lognOut = () => {
    //로그인 상태여야 해당 이벤트 실행
    authStore.logoutUser()
    authStore.user = null;
    router.push({name:'LogIn'})
  }
</script>

<style lang="scss" scoped>

</style>
