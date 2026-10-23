import { ApiSystem } from "@/api/apiSystem";
import { fetchUser, login, logout } from "@/api/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userId: null,
    deptNm: null,
    memberNm: null,

    menuAuthList: [],

    sessionChecked: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,

    getWriteYnByPath: (state) => (path) => {
      const menu = state.menuAuthList.find(
        item => item.menuPath === path
      );

      return menu?.writeYn ?? 'N';
    },

    getReadYnByPath: (state) => (path) => {
      const menu = state.menuAuthList.find(
        item => item.menuPath === path
      );

      return menu?.readYn ?? 'N';
    },
  },

  actions: {

    async loginUser(userId, password) {
      try {
        const data = await login(userId, password);

        this.user = data;
        this.userId = data.userId;
        this.deptNm = data.deptNm;
        this.memberNm = data.memberNm;

      } catch (err) {
        throw err;
      }
    },


    async logoutUser() {
      await logout();

      this.user = null;
      this.userId = null;
      this.deptNm = null;
      this.memberNm = null;
      this.menuAuthList = [];
    },


    async fetchUser() {
      try {
        const data = await fetchUser();

        this.user = data;
        this.userId = data.userId;
        this.deptNm = data.deptNm;
        this.memberNm = data.memberNm;

      } catch {
        this.user = null;
        this.userId = null;
        this.deptNm = null;
        this.memberNm = null;
        this.menuAuthList = [];
      } finally {
        this.sessionChecked = true;
      }
    },


    async fetchMenuAuthList() {
      if (!this.userId) {
        this.menuAuthList = [];
        return;
      }

      const res = await ApiSystem.getMenuList();

      this.menuAuthList = res?.data ?? res ?? [];
    },


    setMenuAuthList(menuList) {
      this.menuAuthList = menuList ?? [];
    }

  }

});
