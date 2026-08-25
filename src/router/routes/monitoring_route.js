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
    /**충전모니터링 */
      {
        path: 'chargeMonitoring',
        name: 'ChargeMonitoring',
        component: () => import('@/views/monitoring/ChargeMonitoringList.vue')
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





    ]

