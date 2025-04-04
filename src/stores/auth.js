import { defineStore } from "pinia";
import { login, logout } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    deptNm : null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async loginUser(userNm, password) {
      try {

        const data = await login(userNm, password);

        console.log('JSON ', JSON.stringify(data.userInfo))

        this.user = JSON.stringify(data.userInfo);
        this.token = data.token;

      } catch (error) {
        throw error;
      }
    },
    logoutUser() {
      this.user = null;
      this.token = null;
      logout();
    },
  },
});
