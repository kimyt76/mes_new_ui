import { defineStore } from 'pinia';
import router from '@/router';
import { getMenuList } from '@/api/auth';


export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [] // 화면에 보여줄 메뉴
  }),
  actions: {
    async loadMenu(userId) {
      const menuList = await getMenuList(userId); // 서버에서 menu 리스트 조회

      // 권한 있는 메뉴만 필터
      const allowedMenu = menuList.filter(m => m.readYn === 'Y');
      // 화면용 메뉴 구조 생성 (중첩 메뉴 처리)
      this.items = this.buildMenuTree(allowedMenu);

      // 동적 라우터 등록
      allowedMenu.forEach(menu => {
        if (menu.routeName && !router.hasRoute(menu.routeName)) {
          router.addRoute({
            path: menu.menuPath,
            name: menu.routeName,
            component: () => import(`@/views${menu.menuPath}.vue`)
          });
        }
      });
    },

    async menuList(userId) {
      return await getMenuList(userId); // 서버에서 menu 리스트 조회
    } ,
    // 메뉴 트리 빌드 (parent_id 기준)
    buildMenuTree(menuList, parentId = null) {
        const filtered = menuList.filter(m => {
            // 부모 메뉴인 경우
            if (parentId === null) {
              return m.parentId === null || m.parentId === 0;
            }
            return Number(m.parentId) === Number(parentId);
          });
      return filtered
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(m => {
          const children = this.buildMenuTree(menuList, m.menuId);
          return {
            title: m.menuName,
            icon: m.icon,
            to: m.routeName ? { name: m.routeName } : null,
            items: children.length ? children : undefined
          };
        });
    }
  }
});
