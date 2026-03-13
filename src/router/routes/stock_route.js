/** 제조관리 */
export default [
        /* 재고조회 */
      {
        path: 'stock',
        name: 'StockList',
        component: () => import('@/views/stock/stock/StockList.vue')
      },
      /* 원재료수불부 */
      {
        path: 'rawMat',
        name: 'RawMatList',
        component: () => import('@/views/stock/stock/RawMatList.vue')
      },
      /* 부자재수불부 */
      {
        path: 'subMat',
        name: 'SubMatList',
        component: () => import('@/views/stock/stock/SubMatList.vue')
      },
      /* 품목별사용량 */
      {
        path: 'itemUse',
        name: 'ItemUse',
        component: () => import('@/views/stock/stock/ItemUseList.vue')
      },
       /* 시험번호별 사용현황 */
      {
        path: 'testUse',
        name: 'TestUse',
        component: () => import('@/views/stock/stock/TestUseList.vue')
      },
      /* 사용기한(원재료) */
      {
        path: 'useByM1',
        name: 'UseByM1',
        component: () => import('@/views/stock/stock/UseByM1List.vue')
      },
      /* 사용기한(부자재) */
      {
        path: 'useByM2',
        name: 'UseByM2',
        component: () => import('@/views/stock/stock/UseByM2List.vue')
      },
      /* 자재조정 */
      {
        path: 'adjust',
        name: 'Adjust',
        component: () => import('@/views/stock/adj/AdjustList.vue')
      },
      /* 자재이동요청 */
      {
        path: 'moveReq',
        name: 'MoveReq',
        component: () => import('@/views/stock/moveReq/MoveReqList.vue')
      },





       /* 재고조사 */
      {
        path: 'inventory',
        name: 'InventoryList',
        component: () => import('@/views/stock/inventory/InventoryList.vue')
      },








      /* 자재이동요청 */


    ]
