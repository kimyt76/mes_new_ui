<template>
  <v-app  id="inspire" style="background-color:#E1F5FE;">
    <div class="d-flex justify-center" style="margin-top:200px">
      <v-card width="450px">
        <div class="pa-11">
          <div style="text-align: center" class="mb-16 MT-5">
            <h1>
              <v-avatar>
                <v-img img :src="logo" alt="Logo"/>
              </v-avatar>
              MES LOGIN</h1>
          </div>
          <v-form class="pl-5 pr-5" ref="loginForm" @submit.prevent="handleLogin">
            <v-text-field
              class="mb-2"
              label="사용자 ID"
              prepend-inner-icon="mdi-account"
              v-model="userId"
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
          </v-form>
        </div>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import logo from '@/assets/icon/logo_jincostech.jpg'
import {ref} from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';

const {vError} = useAlertStore()

const loading = ref(false)
const userId = ref('김연태');
const password = ref('1234');

const appStore = useAuthStore();
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try{
    await appStore.loginUser(userId.value, password.value);
    router.push({name:'DashBoard'})
  }catch(err){
    console.log('err', err)
    console.log('state', err.response.status)
    vError(err)
  }finally{
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>
