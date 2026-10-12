
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

    /**
     * 로그인
     */
    async loginUser(userId, password) {
      const data = await login(userId, password);

      this.user = data;
      this.userId = data.userId;
      this.deptNm = data.deptNm;
      this.memberNm = data.memberNm;
      this.sessionChecked = true;

      return data;
    },

    /**
     * 인증 정보 초기화
     * 서버 요청 없이 Pinia 상태만 초기화
     */
    clearSession() {
      this.user = null;
      this.userId = null;
      this.deptNm = null;
      this.memberNm = null;
      this.menuAuthList = [];
      this.sessionChecked = true;

      localStorage.removeItem('user');
    },

    /**
     * 로그아웃
     */
    async logoutUser() {
      try {
        await logout();
      } finally {
        this.clearSession();
      }
    },

    /**
     * 로그인 세션 확인
     */
    async fetchUser() {
      try {
        const data = await fetchUser();

        if (!data || !data.userId) {
          this.clearSession();
          return;
        }

        this.user = data;
        this.userId = data.userId;
        this.deptNm = data.deptNm;
        this.memberNm = data.memberNm;

      } catch (err) {
        this.clearSession();

      } finally {
        this.sessionChecked = true;
      }
    },

    /**
     * 메뉴 권한 조회
     */
    async fetchMenuAuthList() {
      if (!this.userId) {
        this.menuAuthList = [];
        return;
      }

      const res = await ApiSystem.getMenuList();

      this.menuAuthList = res?.data ?? res ?? [];
    },

    /**
     * 메뉴 권한 설정
     */
    setMenuAuthList(menuList) {
      this.menuAuthList = menuList ?? [];
    }

  }

});
