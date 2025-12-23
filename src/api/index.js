// src/api/axios.js
import router from '@/router'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

/**
 * 공통 axios 인스턴스
 */
const API_URL = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  withCredentials: true,
})

/**
 * Date 객체 → 'yyyy-MM-dd' 문자열로 변환
 * 객체/배열 안에 중첩된 Date까지 재귀적으로 전부 처리
 */
function convertDates(obj) {
  if (obj === null || obj === undefined) return obj

  if (obj instanceof Date) {
    return obj.toISOString().split('T')[0] // yyyy-MM-dd
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertDates(item))
  }

  if (typeof obj === 'object') {
    const newObj = {}
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
      newObj[key] = convertDates(obj[key])
    }
    return newObj
  }

  return obj
}

/* ─────────────────────────────────────
 *  📌 요청 인터셉터: Date를 yyyy-MM-dd 로 변환 (FormData는 제외)
 * ──────────────────────────────────── */
API_URL.interceptors.request.use(
  config => {
    const hasFormData = typeof FormData !== 'undefined'
    const isFormData = hasFormData && config.data instanceof FormData

    // ✅ FormData는 건드리면 multipart 깨질 수 있으므로 제외
    if (config.data && !isFormData) {
      config.data = convertDates(config.data)
    }

    if (config.params) {
      config.params = convertDates(config.params)
    }

    return config
  },
  error => Promise.reject(error)
)

/* ─────────────────────────────────────
 *  📌 응답 인터셉터: 전역 에러 처리
 *      - 다운로드(blob) 요청은 예외 처리 (호출부에서 처리)
 * ──────────────────────────────────── */
API_URL.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const { vWarning } = useAlertStore()
    const auth = useAuthStore()

    // ✅ 다운로드(blob) 요청은 전역 처리에서 제외
    // (blob 에러는 error.response.data가 Blob이라서 전역처리에서 꼬이는 경우가 많음)
    const isBlobRequest =
      error.config?.responseType === 'blob' ||
      (typeof error.config?.url === 'string' && error.config.url.includes('/files/download'))

    if (isBlobRequest) {
      return Promise.reject(error)
    }

    // 서버 연결 끊김 (네트워크 에러)
    if (!error.response) {
      console.error('서버와 연결할 수 없습니다.')
      vWarning?.('서버와 연결할 수 없습니다.')
      router.push('/login')
      return Promise.reject(error)
    }

    // 인증/권한 문제
    if ((status === 401 || status === 403) && router.currentRoute.value.name !== 'LogIn') {
      console.warn('접근 권한 오류. 로그인 페이지로 이동합니다.')
      auth.user = null
      router.push({ name: 'LogIn' }).catch(() => {})
    }

    return Promise.reject(error)
  }
)

export { API_URL }
export default API_URL
