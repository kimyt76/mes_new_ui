import * as loginApi from '@/api/auth';
import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore( 'login', () => {
  const token = ref(null);
  const userNm = ref(null);
  const userId = ref(null);
  const password = ref(null);
  const role = ref(null);

  /**
   *  action
   * @param {*} newToken
   */
  async function setToken(newToken) {
    token.value = newToken;
  }

  /**
   *  사용자 정보
   */
  async function getUserInfo() {
    try{
      const localToken = localStorage.getItem(`access_token`);
      const response = await loginApi.getUserInfo(localToken);
    }catch(err){
      //localStorage.removeItem(`access_token`)
    }
  }


  return {
     token
    ,userNm
    ,userId
    ,password
    ,role
    ,setToken
    ,getUserInfo
  }
});
