/** 제조관리 */
export default [

      {
        path: 'stock',
        name: 'StockList',
        component: () => import('@/views/stock/stock/StockList.vue')
      },
      {
        path: 'rawMat',
        name: 'RawMatList',
        component: () => import('@/views/stock/stock/RawMatList.vue')
      },
      {
        path: 'itemUse',
        name: 'ItemUse',
        component: () => import('@/views/stock/stock/ItemUseList.vue')
      },
      {
        path: 'testUse',
        name: 'TestUse',
        component: () => import('@/views/stock/stock/TestUseList.vue')
      },
      {
        path: 'usShelf',
        name: 'UsShelf',
        component: () => import('@/views/stock/stock/UseShelfList.vue')
      },

    ]
