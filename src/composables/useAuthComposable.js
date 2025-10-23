// composables/useAuthComposable.js
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

export function useAuthComposable() {
  const auth = useAuthStore()
  const { currentWriteYn, userId } = storeToRefs(auth)

  // 화면에서 바로 반응형으로 쓰는 writeYn
  const writeYn = computed(() => currentWriteYn.value)

  // 새로고침 시 writeYn 복원
  const restoreWriteYn = () => {
    auth.restoreWriteYn()
  }

  // 화면 마운트 시 자동 복원
  onMounted(() => {
    if (!currentWriteYn.value || currentWriteYn.value === 'N') {
      restoreWriteYn()
    }
  })

  return {
    auth,          // action 함수들도 사용 가능
    userId,
    writeYn,
    restoreWriteYn
  }
}
