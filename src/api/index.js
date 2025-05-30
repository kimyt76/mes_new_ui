import axios from "axios";
import router from "@/router"; // useRouter() 대신 직접 import
import { useAlertStore } from "@/stores/alert";


axios.defaults.withCredentials = true;

export const API_URL = axios.create({
  baseURL: '/api',
  withCredentials: true // ✅ 여기도
});


API_URL.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const { vWarning } = useAlertStore();

    if ((status === 401 || status === 403) && router.currentRoute.value.name !== "LogIn") {
      console.warn("접근 권한 오류. 로그인 페이지로 이동합니다.");
      //vWarning("접근 권한 오류. 로그인 페이지로 이동합니다.");
      router.push({ name: "LogIn" }).catch(() => {});
    }

    if (status === 500) {
      console.warn("서버 오류가 발생했습니다.");
      //vWarning("서버 오류가 발생했습니다.");
      if (router.currentRoute.value.name !== "ErrorPage") {
        router.push({ name: "ErrorPage" }).catch(() => {});
      }
    }

    return Promise.reject(error);
  }
);
