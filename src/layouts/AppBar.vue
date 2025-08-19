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
    <!-- 사용자 정보 드롭다운 -->
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="text-capitalize mr-5"
          append-icon="mdi-menu-down"
        >
          {{ deptNm }} / {{ memberNm }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item prepend-icon="mdi-account-edit" @click="editProfile">
          <v-list-item-title>정보 수정</v-list-item-title>
        </v-list-item>
        <v-list-item prepend-icon="mdi-logout" @click="logout">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

<v-dialog  v-model="dialog" max-width="800px" persistent>
    <UserDtlPop
      :mode= mode
      :id=userId
      :title="`사용자 상세정보`"
      @saved="handleSaved"
      @close-dialog="dialog = false"/>
  </v-dialog>

</template>

<script setup>
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import UserDtlPop from '@/views/system/user/UserDtlPop.vue';
  import { ref } from 'vue';
import { useAlertStore } from '@/stores/alert';

  const { vSuccess } = useAlertStore()
  const dialog = ref(false)
  const mode = ref('U')

  /**
   *  drawer  toggle기능
   */
  const { toggleDrawer } = useAppStore()
  const authStore = useAuthStore();

  /**
   *  login 후 app바에 부서 이름 넣기
   */
  const router = useRouter();
  const { memberNm, deptNm, userId } =  authStore;

  /**
  * 로그 아웃 기능
  */
  const logout = () => {
    //로그인 상태여야 해당 이벤트 실행
    authStore.logoutUser()
    authStore.user = null;
    router.push({name:'LogIn'})
  }


  const editProfile = () => {
    dialog.value = true
  }

  const handleSaved = (msg) => {
    vSuccess(msg)
  }

</script>

<style lang="scss" scoped>

</style>
