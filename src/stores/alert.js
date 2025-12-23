// stores/alert.js
import { defineStore } from 'pinia'

let toastRef = null // 전역 Toast 참조

export const useAlertStore = defineStore('alert', {
  actions: {
    setToastRef(ref) {
      toastRef = ref
      // console.log('toastRef set:', toastRef)
    },
    show(message, type = 'success', life = 4000) {
      if (!toastRef) {
        // console.warn('toastRef가 아직 null입니다.')
        return
      }
      toastRef.add({
        severity: type,
        detail: message,                // ✅ 메시지만 사용
        life,
      })
    },
    vSuccess(msg, life = 4000) {
      this.show(msg, 'success', life)
    },
    vError(msg, life = 4000) {
      this.show(msg, 'error', life)
    },
    vInfo(msg, life = 4000) {
      this.show(msg, 'info', life)
    },
    vWarning(msg, life = 4000) {
      this.show(msg, 'warn', life)
    },
  },
})
