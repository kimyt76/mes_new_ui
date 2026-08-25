/** 모니터링, 기본관리 */
export default [
    /**설비가동정보 */
      {
        path: 'equipOperationInfo',
        name: 'EquipOperationInfo',
        component: () => import('@/views/monitoring/EquipOperationInfoList.vue')
      },
    /**제조모니터링 */
      {
        path: 'matMonitoring',
        name: 'MatMonitoring',
        component: () => import('@/views/monitoring/MatMonitoringList.vue')
      },
    /**접점모니터링 */
      {
        path: 'contactMonitoring',
        name: 'ContactMonitoring',
        component: () => import('@/views/monitoring/ContactMonitoringList.vue')
      },
    /**생산실적현황 */
      {
        path: 'prodPerfomaceStatus',
        name: 'ProdPerfomaceStatus',
        component: () => import('@/views/monitoring/ProdPerfomaceStatusList.vue')
      },



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
      {
        path: 'itemInfoList',
        name: 'ItemInfoList',
        component: () => import('@/views/basic/item/ItemInfoList.vue')
      },
      {
        path: 'customerList',
        name: 'CustomerList',
        component: () => import('@/views/basic/customer/CustomerList.vue')
      },
      {
        path: 'storageList',
        name: 'StorageList',
        component: () => import('@/views/system/storage/StorageList.vue')
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

