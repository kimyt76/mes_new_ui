// src/stores/commonListStore.js
import { defineStore } from 'pinia'

export const useCommonListStore = defineStore('commonListStore', {
  state: () => ({
    pages: {} // { [routeName]: { searchParams: {}, listData: [], lastUpdated: null } }
  }),
  actions: {
    setSearchParams(routeName, params) {
      if (!this.pages[routeName]) this.pages[routeName] = {}
      this.pages[routeName].searchParams = { ...params }
    },
    setListData(routeName, data) {
      if (!this.pages[routeName]) this.pages[routeName] = {}
      this.pages[routeName].listData = data
      this.pages[routeName].lastUpdated = new Date().getTime()
    },
    getPage(routeName) {
      return this.pages[routeName] || { searchParams: {}, listData: [] }
    },
    clearPage(routeName) {
      delete this.pages[routeName]
    },
    clearAll() {
      this.pages = {}
    }
  }
})
