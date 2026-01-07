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
 *      - RestResponse(code/message/data) 공통 처리 추가 ✅
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

    // 서버가 RestResponse 형태로 내려주는 경우만 처리
    // (다른 API가 있을 수도 있으니 형태 체크)
    const isRestResponse =
      res &&
      typeof res === 'object' &&
      Object.prototype.hasOwnProperty.call(res, 'code') &&
      Object.prototype.hasOwnProperty.call(res, 'message')

    if (isRestResponse) {
      // ✅ 성공이면 data를 반환할지, res 전체를 반환할지 선택 가능
      // → 현재 너희는 msg.data.message 같은 방식이었으니,
      //    앞으로는 res.message / res.data로 쓰게 하려면 res 전체 반환이 편함
      if (res.code === 0) {
        return res // {code, message, data}
      }

      // ✅ code != 0 : 비즈니스 에러
      // - 여기서 alert를 띄우고
      // - reject로 catch로 보내서 호출부에서 추가 처리 가능하게
      const msg = res.message || '처리 중 오류가 발생했습니다.'

      // code에 따라 알림 강도 다르게 가능 (원하면 수정)
      // ex) 중복(1001)은 Warning, 저장오류(2001)는 Error
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
      return Promise.reject(error)
    }

    // ✅ 그 외 서버 오류(500 등)
    // RestResponse를 쓰는 API라면 여기로 잘 안 오지만,
    // 혹시 모를 예외 처리
    vError?.(error.response?.data?.message || '서버 오류가 발생했습니다.')

    return Promise.reject(error)
  }
)

export { API_URL }
export default API_URL
