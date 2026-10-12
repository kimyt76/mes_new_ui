
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

let isRedirecting = false

/**
 * Date 객체 → 'yyyy-MM-dd' 문자열로 변환
 * 객체/배열 안에 중첩된 Date까지 재귀적으로 전부 처리
 */
function dateToYMDLocal(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function convertDates(obj) {
  if (obj === null || obj === undefined) return obj

  if (obj instanceof Date) {
    return dateToYMDLocal(obj)
  }

  if (Array.isArray(obj)) return obj.map(convertDates)

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
 * 요청 인터셉터: Date를 yyyy-MM-dd 로 변환
 * ──────────────────────────────────── */
API_URL.interceptors.request.use(
  config => {
    const hasFormData = typeof FormData !== 'undefined'
    const isFormData = hasFormData && config.data instanceof FormData

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
 * 응답 인터셉터
 * ──────────────────────────────────── */
API_URL.interceptors.response.use(
  (response) => {

    // 다운로드 파일은 원본 응답 반환
    if (response.config?.responseType === 'blob') {
      return response
    }

    const res = response.data

    const isApiResponse =
      res &&
      typeof res === 'object' &&
      Object.prototype.hasOwnProperty.call(res, 'success') &&
      Object.prototype.hasOwnProperty.call(res, 'message') &&
      Object.prototype.hasOwnProperty.call(res, 'code')

    if (!isApiResponse) return response

    // API 실패
    if (res.success === false) {
      const err = new Error(res.message || '요청 처리 실패')
      err.api = res
      err.response = response

      return Promise.reject(err)
    }

    // API 성공
    return res
  },

  (error) => {

    const status = error.response?.status
    const auth = useAuthStore()
    const { vWarning, vError } = useAlertStore()

    const isLoginRoute =
      router.currentRoute.value?.name === 'LogIn'

    const isBooting = !auth.sessionChecked
    const shouldSilent = isLoginRoute || isBooting

    const requestUrl = error.config?.url || ''

    // 로그인 API의 인증 실패는 로그인 화면에서 처리
    const isLoginRequest =
      requestUrl.includes('/auth/login')

    if (isLoginRequest) {
      return Promise.reject(error)
    }

    /**
     * 1. 세션 만료 / 인증 실패 (401)
     */
    if (status === 401) {

      auth.clearSession()

      if (!isLoginRoute && !isRedirecting) {

        isRedirecting = true

        if (!shouldSilent) {
          vWarning?.('세션이 만료되었습니다. 다시 로그인해주세요.')
        }

        router.replace({ name: 'LogIn' })
          .catch(() => {})
          .finally(() => {
            isRedirecting = false
          })
      }

      return Promise.reject(error)
    }

    /**
     * 2. 접근 권한 없음 (403)
     */
    if (status === 403) {

      if (!shouldSilent) {
        vWarning?.('접근 권한이 없습니다.')
      }

      return Promise.reject(error)
    }

    /**
     * 3. 네트워크 오류 / 서버 연결 실패
     */
    if (!error.response) {

      if (shouldSilent) {
        return Promise.reject(error)
      }

      vWarning?.('서버와 연결할 수 없습니다.')

      return Promise.reject(error)
    }

    /**
     * 4. 기타 서버 오류 (500 등)
     */
    if (shouldSilent) {
      return Promise.reject(error)
    }

    vError?.(
      error.response?.data?.message ||
      '서버 오류가 발생했습니다.'
    )

    return Promise.reject(error)
  }
)

export { API_URL }
export default API_URL
