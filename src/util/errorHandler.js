// utils/errorHandler.js
import { useAlertStore } from "@/stores/alert"
export function handleApiError(err) {
  console.error('API ERROR:', err)

  const message =
    err?.response?.data?.message ||
    err?.response?.data?.data?.message ||   // 확장 대비용
    err?.message ||
    '처리 중 오류가 발생했습니다.'

  const alertStore = useAlertStore()
  alertStore.vError(message)
}
