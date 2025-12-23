<template>
  <div class="flex justify-center items-center h-screen bg-blue-50">
    <Card class="w-[400px] h-[400px] shadow-2xl rounded-2xl">
      <template #title>
        <div class="flex flex-row items-center justify-center mb-6">
            <Avatar size="48" shape="circle" class="mr-3">
                <img src="/logo_jincostech.jpg" alt="Logo" />
            </Avatar>
            <h2 class="font-bold text-5lg leading-[48px]">MES LOGIN</h2>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <!-- 사용자 ID -->
          <FloatLabel  variant="on">
            <InputText
              id="userId"
              v-model="userId"
              class="w-full"
              :invalid="userIdError !== ''"
              size="large"
            />
            <label for="userId">사용자 ID</label>
          </FloatLabel>
          <small v-if="userIdError" class="p-error">{{ userIdError }}</small>

          <!-- PASSWORD -->
          <FloatLabel variant="on">
            <Password
              id="password"
              v-model="password"
              class="w-full"
              :feedback="false"
              toggleMask
              :invalid="passwordError !== ''"
              size="large"
              fluid
            />
            <label for="password">PASSWORD</label>
          </FloatLabel>
          <small v-if="passwordError" class="p-error">{{ passwordError }}</small>

          <!-- 로그인 버튼 -->
          <Button
            type="submit"
            label="로그인"
            icon="pi pi-sign-in"
            class="w-full p-button-raised p-button-primary mt-4"
            :loading="loading"
          />

          <div class="flex justify-end mt-5">
            <span> 로그인 접속이 안될 경우 관리자에게 문의하세요</span>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// store
const { vError } = useAlertStore()
const appStore = useAuthStore()
const router = useRouter()

// state
const loading = ref(false)
const userId = ref('')
const password = ref('')
const userIdError = ref('')
const passwordError = ref('')

// 유효성 검사
const validate = () => {
  let valid = true
  userIdError.value = ''
  passwordError.value = ''

  if (!userId.value) {
    userIdError.value = '사용자 ID는 필수입니다.'
    valid = false
  } else if (userId.value.length < 2) {
    userIdError.value = '사용자 ID는 최소 2자 이상이어야 합니다.'
    valid = false
  }

  if (!password.value) {
    passwordError.value = '패스워드는 필수입니다.'
    valid = false
  } else if (password.value.length < 4) {
    passwordError.value = '패스워드는 최소 4자 이상이어야 합니다.'
    valid = false
  }

  return valid
}

// 로그인 처리
const handleLogin = async () => {
  if (!validate()) {
    return
  }

  loading.value = true
  try {
    await appStore.loginUser(userId.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    vError(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* PrimeVue는 Tailwind랑 같이 쓰면 커스텀 CSS 최소화 가능 */
</style>
