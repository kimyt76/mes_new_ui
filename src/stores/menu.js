import { defineStore } from "pinia";

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items : [
      { title: 'DashBoard', icon:'mdi-view-dashboard', to:'/'},
      { title: '기본관리', icon: 'mdi-table-settings', items: [
          { title: '품목관리', to: '/basic/itemList'},
          { title: '품목상세관리', to: '/basic/itemDetailList'},
          { title: '거래처관리', to: '/basic/customerList'},
          { title: '창고관리', to: '/basic/storageList'},
          { title: '고객사관리', to: '/basic/clientList' },
        ]
      },
      { title: '영업관리', icon: 'mdi-table-settings', items: [
          { title: '사양서검토', to: '/order/draftList' },
          { title: '수주관리', to: '/order/contractList' },
          { title: '판매관리', to: '/order/saleList' },
          { title: '출하관리', to: '/order/shipmentList' },
          { title: '진행현황', to: '/order/progressList' },
        ]
      },
      { title: '연구관리', icon: 'mdi-microscope', items: [
          { title: '성분정보', to: '/lab/ingredient'},
          { title: '원료관리', to: '/lab/material'},
          { title: '연구처방', to: '/lab/research'},
        ]
      },
      { title: '시스템관리', icon: 'mdi mdi-cog', roles: ['ADMIN'], items: [
          { title: '사용자관리', to: '/system/userMgmt' },
          { title: '공통코드관리', to: '/system/commonMgmt' },
          { title: '템플릿관리', to: '/system/templateMgmt' },
        ]
      },
    ]
  }),
  gradient: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',

})
