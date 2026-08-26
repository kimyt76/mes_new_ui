/** 모니터링, 기본관리 */
export default [
    /**품목정보 */
      {
        path: 'itemList',
        name: 'ItemList',
        component: () => import('@/views/basic/item/ItemList.vue')
      },
      {
        path: 'itemThird',
        name: 'ItemThird',
        component: () => import('@/views/basic/item/ItemThird.vue'),
      },

      /**품목상세정보 */
      {
        path: 'itemInfoList',
        name: 'ItemInfoList',
        component: () => import('@/views/basic/item/ItemInfoList.vue')
      },

      /**거래처정보 */
      {
        path: 'customerList',
        name: 'CustomerList',
        component: () => import('@/views/basic/customer/CustomerList.vue')
      },

      /**창고정보 */
      {
        path: 'storageList',
        name: 'StorageList',
        component: () => import('@/views/system/storage/StorageList.vue')
      },

    /**생산실적 */
      {
        path: 'prodPerformance',
        name: 'ProdPerformance',
        component: () => import('@/views/basic/prod/ProdPerformanceList.vue')
      },
    /**생산수율 */
      {
        path: 'prodYield',
        name: 'ProdYield',
        component: () => import('@/views/basic/prod/ProdYieldList.vue')
      },
    /**업체별생산량 */
      {
        path: 'prodCompany',
        name: 'ProdCompany',
        component: () => import('@/views/basic/prod/ProdCompany.vue')
      },


      /**************************생산일보***************************************/
      {
        path: 'dailyReport/m1DailyReport',
        name: 'M1DailyReport',
        component: () => import('@/views/basic/dailyReport/m1DailyReport/M1DailyReportList.vue')
      },
      {
        path: 'dailyReport/m2DailyReport',
        name: 'M2DailyReport',
        component: () => import('@/views/basic/dailyReport/m2DailyReport/M2DailyReportList.vue')
      },
      {
        path: 'dailyReport/m0DailyReport',
        name: 'M0DailyReport',
        component: () => import('@/views/basic/dailyReport/m0DailyReport/M0DailyReportList.vue')
      },
      {
        path: 'dailyReport/laborCost',
        name: 'LaborCost',
        component: () => import('@/views/basic/dailyReport/laborCost/LaborCostList.vue')
      },





    ]

