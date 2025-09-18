import axios from "axios";
import router from "@/router"; // useRouter() 대신 직접 import
import { useAlertStore } from "@/stores/alert";
import { useAuthStore } from "@/stores/auth";

axios.defaults.withCredentials = true;

export const API_URL = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000
});

export async function post(url, payload) {
  try {
    const res = await API_URL.post(url, payload);

    if (!res.data.success) {
      // 실패 처리
      throw new Error(res.data.message || '서버 오류');
    }
    // 성공 시 data 리턴
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


API_URL.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const { vWarning } = useAlertStore();
    const auth = useAuthStore();

    // 서버 연결 끊김 (네트워크 에러)
    if (!error.response) {
      console.error('서버와 연결할 수 없습니다.');
      router.push('/login');
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && router.currentRoute.value.name !== "LogIn") {
      console.warn("접근 권한 오류. 로그인 페이지로 이동합니다.");
      auth.user = null;
      router.push({ name: "LogIn" }).catch(() => {});
    }
    return Promise.reject(error);
  }
);
