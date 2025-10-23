// stores/auth.js
import { defineStore } from "pinia";
import { login, logout, fetchUser } from "@/api/auth";
import { useMenuStore } from "@/stores/menu";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref(null);
  const userId = ref(null);
  const deptNm = ref(null);
  const memberNm = ref(null);
  const sessionChecked = ref(false);
  const authMap = ref({}); // { router_name: { readYn, writeYn } }
  const currentWriteYn = ref('');

  // getters
  const isLoggedIn = computed(() => !!user.value);

  // actions
  const loginUser = async (id, password) => {
    const data = await login(id, password);

    user.value = data;
    userId.value = data.userId;
    deptNm.value = data.deptNm;
    memberNm.value = data.memberNm;
    // 메뉴 로딩
    const menuStore = useMenuStore();
    const menuList = await menuStore.menuList(userId.value);

    // 권한 매핑
    authMap.value = {};
    menuList.forEach(menu => {
      if (menu.routeName) {
        authMap.value[menu.routeName] = {
          readYn: menu.readYn,
          writeYn: menu.writeYn
        };
      }
    });
  };

  // 선택 메뉴 권한 세팅 (리스트 → 상세)
  const setCurrentWriteYn = (writeYn) => {
    currentWriteYn.value = writeYn;
    localStorage.setItem('currentWriteYn', writeYn);
  };

  const restoreWriteYn = () => {
    const saved = localStorage.getItem('currentWriteYn');
    if (saved) currentWriteYn.value = saved;
    return currentWriteYn.value
  };

  const logoutUser = () => {
    logout();
    user.value = null;
    authMap.value = {};
    writeYn.value = 'N';
  };

  const fetchUserData = async () => {
    try {
      const data = await fetchUser();
      user.value = data;
      userId.value = data.userId;
      deptNm.value = data.deptNm;
      memberNm.value = data.memberNm;

      // 메뉴 로딩
    const menuStore = useMenuStore();
    const menuList = await menuStore.menuList(userId.value);

    // 권한 매핑
    authMap.value = {};
    menuList.forEach(menu => {
      if (menu.routeName) {
        authMap.value[menu.routeName] = {
          readYn: menu.readYn,
          writeYn: menu.writeYn
        };
      }
    });
    } catch {
      user.value = null;
    } finally {
      sessionChecked.value = true;
    }
  };

   // getter: 현재 라우트에 따른 writeYn 반환
    const writeYn = computed(() => {
      const route = useRoute()
      const val = authMap.value?.[route.name]?.writeYn || 'N';
      return val;
    });

  return {
    user,
    userId,
    deptNm,
    memberNm,
    sessionChecked,
    authMap,
    writeYn,
    isLoggedIn,
    loginUser,
    logoutUser,
    fetchUserData,
    setCurrentWriteYn,
    currentWriteYn,
    restoreWriteYn,
  };
});
