import { defineStore } from "pinia";

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items : [
      { title: 'DashBoard', icon:'mdi-view-dashboard', to:'/'},
      { title: '기본관리', icon: 'mdi-table-settings', items: [
          { title: '품목관리', to: '/basic/itemList'},
          { title: '품목상세관리', to: '/basic/itemDetailList'},
        ]
      },
      { title: '발주관리', icon: 'mdi-table-settings', items: [
          { title: '발주관리', to: '/order/orderList' },
        ]
      },
      { title: '시스템관리', icon: 'mdi mdi-cog', items: [
          { title: '사용자관리', to: '/system/userMgmt' },
          { title: '공통코드관리', to: '/system/commonMgmt' },
        ]
      },
    ]
  }),
  gradient: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',

})
