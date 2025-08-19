<template>
  <div>
    <v-app  id="inspire" style="background-color:#FCF6F1;">
    <!-- Login Component -->
      <div class="d-flex justify-center" style="margin-top:200px">
        <v-card width="450px">
          <div class="pa-11">
            <div style="text-align: center" class="mb-16 MT-5">
              <h1>MES LOGIN</h1>
            </div>
            <v-form class="pl-5 pr-5" ref="loginForm" @submit.prevent="handleLogin">
              <v-text-field
                class="mb-2"
                label="사용자 ID"
                prepend-inner-icon="mdi-account"

                v-model="userNm"
              ></v-text-field>
              <v-text-field
                class="mb-2"
                label="PASSWORD"
                v-model="password"
                prepend-inner-icon="mdi-lock"

                type="password"
              ></v-text-field>
              <v-btn
                type="submit"
                color="blue lighten-1 text-capitalize"
                depressed
                large
                block
                dark
                class="mb-5"
                style="height: 45px"
                > 로그인 </v-btn>

                <!-- 이건 관리자 권한으로 접속했을 경우에만 보여야 함 -->
              <v-btn
                color="accent"
                depressed
                large
                block
                dark
                class="mb-5"
                style="height: 45px"
                @click="dialog = true"
                > 패스워드 초기화 </v-btn>
            </v-form>
          </div>
        </v-card>
      </div>

      <v-dialog  v-model="dialog" max-width="400px" persistent>
        <PasswordInitPop  @close-dialog="dialog = false"/>
      </v-dialog>

   </v-app>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import PasswordInitPop from '@/views/login/PasswordInitPop.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// const show = ref(false)
//modal용
const dialog = ref(false);

const userNm = ref('');
const password = ref('');
const error = ref(null)
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {

  try{
    await authStore.loginUser(userNm.value, password.value);

    router.push("/dashboard")

  }catch(err){
    error.value = `${err.message} 로그인 실패!!`;
  }
}
</script>

<style lang="scss" scoped>

</style>
