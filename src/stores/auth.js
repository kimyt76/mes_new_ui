import { fetchUser, login, logout } from "@/api/auth";
import { defineStore } from "pinia";
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userId : null,
    deptNm : null,
    memberNm : null,
    sessionChecked: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async loginUser(userId, password) {
      try{
        const data =  await login(userId, password) ;

        //console.log('data' , data)
        this.user = data;
        this.userId = data.userId;
        this.deptNm = data.deptNm;
        this.memberNm = data.memberNm;
        //localStorage.setItem('user', data)
      }catch(err){
        throw err;
      }

    },

    async logoutUser() {
      logout();
      this.user = null
    },

    async fetchUser() {
      try {
        const data = await fetchUser();

        this.user = data;
        this.userId = data.userId;
        this.deptNm = data.deptNm;
        this.memberNm = data.memberNm;

        localStorage.setItem('user', data)
      } catch {
        this.user = null
      }finally{
        this.sessionChecked = true;
      }
    }
  }


})


