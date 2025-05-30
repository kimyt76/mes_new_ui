import axios from "axios";
import router from "@/router"; // useRouter() 대신 직접 import

axios.defaults.withCredentials = true;

export const API_URL = axios.create({
  baseURL: '/api',
  withCredentials: true // ✅ 여기도
});


// API_URL.interceptors.response.use(
//   response => response,
//   error =>{
//     if ( error.response && error.response.status === 401 ){
//       // 세션이 만료되었거나 로그인 필요
//       router.push('/login')
//     }

//     return Promise.reject(error)
//   }

// )

