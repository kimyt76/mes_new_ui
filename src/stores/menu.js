import { getMenuList } from '@/api/auth'
import { addDynamicRoutes } from '@/router/dynamic'
import { defineStore } from 'pinia'


export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
    permissions: []
  }),

  actions: {
    async loadMenu() {
      const data = await getMenuList()

      this.menuList = data.menu
      this.permissions = data.permissions

      // 라우트 자동 등록
      addDynamicRoutes(this.menuList)
    }
  }
})
