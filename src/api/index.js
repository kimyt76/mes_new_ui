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
 *      - 다운로드(blob) 요청은 예외 처리
 *      - RestResponse(code/message/data) 공통 처리
 *      - ✅ 첫 접속(미로그인) 시 경고 메시지 안 띄우고 조용히 로그인 이동
 *      - ✅ 사용 중 세션 만료 시에만 세션 만료 메시지 띄움
 * ──────────────────────────────────── */
API_URL.interceptors.response.use(
  response => {
    const { vWarning, vError } = useAlertStore()

    // ✅ 다운로드(blob) 응답은 RestResponse 검사 제외 (그대로 반환)
    const isBlobResponse = response.config?.responseType === 'blob'
    if (isBlobResponse) {
      return response
    }

    // ✅ RestResponse 공통 처리
    const res = response.data

    const isRestResponse =
      res &&
      typeof res === 'object' &&
      Object.prototype.hasOwnProperty.call(res, 'code') &&
      Object.prototype.hasOwnProperty.call(res, 'message')

    if (isRestResponse) {
      // ✅ 성공
      if (res.code === 0) {
        return res // {code, message, data}
      }

      // ✅ code != 0 : 비즈니스 에러
      const msg = res.message || '처리 중 오류가 발생했습니다.'

      if (res.code === 1001) {
        vWarning?.(msg)
      } else {
        vError?.(msg)
      }

      return Promise.reject({
        isBizError: true,
        code: res.code,
        message: msg,
        data: res.data,
        original: response,
      })
    }

    // ✅ RestResponse 형태가 아니면 기존대로 response 반환
    return response
  },

  error => {
    const status = error.response?.status
    const { vWarning, vError } = useAlertStore()
    const auth = useAuthStore()

    // ✅ 다운로드(blob) 요청은 전역 처리에서 제외
    const isBlobRequest =
      error.config?.responseType === 'blob' ||
      (typeof error.config?.url === 'string' && error.config.url.includes('/files/download'))

    if (isBlobRequest) {
      return Promise.reject(error)
    }

    /**
     * ✅ 1) error.response가 없는 경우 (네트워크 에러 / CORS / 서버 Down)
     * - 첫 접속(세션 체크 전)에는 조용히 처리 (알림 X, 라우팅 X)
     * - 시스템 사용 중에는 알림 + 로그인 페이지 이동
     */
    if (!error.response) {
      // ✅ 첫 접속이면 조용히 넘김
      if (!auth.sessionChecked) {
        return Promise.reject(error)
      }

      console.error('서버와 연결할 수 없습니다.')
      vWarning?.('서버와 연결할 수 없습니다.')
      router.push({ name: 'LogIn' }).catch(() => {})
      return Promise.reject(error)
    }

    /**
     * ✅ 2) 인증/권한 문제 (401/403)
     * - 첫 접속(세션 체크 전)에는 "미로그인 확인" 과정이므로 알림 X
     * - 시스템 사용 중에는 "세션 만료" 안내 후 로그인 이동
     */
    if (status === 401 || status === 403) {
      // ✅ 첫 접속(세션 체크 전): 조용히 처리
      if (!auth.sessionChecked) {
        auth.user = null
        return Promise.reject(error)
      }

      // ✅ 사용 중 세션 만료: 안내 + 로그인 이동
      if (router.currentRoute.value.name !== 'LogIn') {
        vWarning?.('세션이 만료되었습니다. 다시 로그인해주세요.')
        auth.user = null
        router.push({ name: 'LogIn' }).catch(() => {})
      }

      return Promise.reject(error)
    }

    /**
     * ✅ 3) 그 외 서버 오류
     */
    vError?.(error.response?.data?.message || '서버 오류가 발생했습니다.')

    return Promise.reject(error)
  }
)

export { API_URL }
export default API_URL
