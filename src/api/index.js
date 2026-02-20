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
function dateToYMDLocal(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function convertDates(obj) {
  if (obj === null || obj === undefined) return obj

  if (obj instanceof Date) {
    return dateToYMDLocal(obj) // ✅ 로컬 yyyy-MM-dd
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
 * 📌 요청 인터셉터: Date를 yyyy-MM-dd 로 변환 (FormData는 제외)
 * ──────────────────────────────────── */
API_URL.interceptors.request.use(
  config => {
    const hasFormData = typeof FormData !== 'undefined'
    const isFormData = hasFormData && config.data instanceof FormData

    // ✅ FormData는 multipart 깨질 수 있으므로 제외
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
 * 📌 응답 인터셉터
 *  1) blob 다운로드 예외
 *  2) RestResponse는 전역에서 처리하지 않음 (화면에서 code로 처리)
 *  3) 처음 진입/로그인 화면에서는 모든 오류 알림을 조용히 처리
 *  4) 사용 중에만 네트워크/401/403/500 알림 + 라우팅 처리
 * ──────────────────────────────────── */
API_URL.interceptors.response.use(
  (response) => {
    if (response.config?.responseType === "blob") return response;

    const res = response.data;

    const isApiResponse =
      res &&
      typeof res === "object" &&
      Object.prototype.hasOwnProperty.call(res, "success") &&
      Object.prototype.hasOwnProperty.call(res, "message") &&
      Object.prototype.hasOwnProperty.call(res, "code");

    if (!isApiResponse) return response;

    // ✅ 실패면 reject로 보내서 catch로 떨어지게
    if (res.success === false) {
      const err = new Error(res.message || "요청 처리 실패");
      err.api = res;                // <-- handleApiError에서 쓰기 좋게 붙임
      err.response = response;      // 원본도 같이
      return Promise.reject(err);
    }

    // ✅ 성공이면 ApiResponse 자체 반환
    return res;
  },
  (error) => {
    // 네트워크/서버 장애(응답 자체가 없거나)도 catch로
    return Promise.reject(error);
  },

  error => {
    const status = error.response?.status
    const auth = useAuthStore()
    const { vWarning, vError } = useAlertStore()

    // ✅ 다운로드(blob) 요청은 전역 처리에서 제외
    const isBlobRequest =
      error.config?.responseType === 'blob' ||
      (typeof error.config?.url === 'string' && error.config.url.includes('/files/download'))

    if (isBlobRequest) return Promise.reject(error)

    // ✅ "처음 진입/로그인 화면"에서는 어떤 오류도 알림 X
    const isLoginRoute = router.currentRoute.value?.name === 'LogIn'
    const isBooting = !auth.sessionChecked
    const shouldSilent = isLoginRoute || isBooting

    /**
     * 1) error.response 없음 (네트워크/CORS/서버DOWN)
     */
    if (!error.response) {
      if (shouldSilent) return Promise.reject(error)

      vWarning?.('서버와 연결할 수 없습니다.')
      router.push({ name: 'LogIn' }).catch(() => {})
      return Promise.reject(error)
    }

    /**
     * 2) 401/403 (인증/권한)
     */
    if (status === 401 || status === 403) {
      auth.user = null

      if (shouldSilent) return Promise.reject(error)

      if (router.currentRoute.value?.name !== 'LogIn') {
        vWarning?.('세션이 만료되었습니다. 다시 로그인해주세요.')
        router.push({ name: 'LogIn' }).catch(() => {})
      }
      return Promise.reject(error)
    }

    /**
     * 3) 그 외(500 등) 서버 오류
     */
    if (shouldSilent) return Promise.reject(error)

    vError?.(error.response?.data?.message || '서버 오류가 발생했습니다.')
    return Promise.reject(error)
  }
)

export { API_URL }
export default API_URL
