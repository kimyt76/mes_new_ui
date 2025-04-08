import { defineStore } from "pinia";


export const useMenuStore = defineStore('menu', {
  state: () => ({
    drawer: true,
    gradient: 'rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)',
    items: [
      { title: 'Dashboard', icon:'mdi-view-dashboard', to:'/'},
      { title: '기본관리', icon: 'mdi-table-settings', items: [
          { title: '품목관리', to: '/prod/prodList' },
          { title: '품목상세관리', to: '/prod/prodDtl' },
          ]
      },
      { title: '시스템관리', icon: 'mdi-table-settings', items: [
          { title: '사용자관리', to: '/system/userMgmt' },
          { title: '공통코드관리', to: '/system/commonMgmt' },
          ]
      },
    ]
  }),
  getters:{
    getDrawer: state => state.drawer
  },
  actions:{
    setDrawer (state, data) {
      state.drawer = data
    },
    toggleDrawer(value) {
      this.drawer = value
    }
  }


})





