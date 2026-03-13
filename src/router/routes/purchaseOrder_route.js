
/** 발주/구매관리 */
export default [
      {
        path: 'purOrderM',
        name: 'PurOrderM',
        component: () => import('@/views/purchase/order/PurchaseOrderMList.vue')
      },
      {
          path: 'purOrderP',
          name: 'PurOrderP',
          component: () => import('@/views/purchase/order/PurchaseOrderPList.vue')
      },
      {
          path: 'purOrderStateP',
          name: 'ㅖurOrderStateP',
          component: () => import('@/views/purchase/order/PurchaseOrderPDetailList.vue')
      },
      {
        path: 'purchaseTran',
        name: 'PurchaseTran',
        component: () => import('@/views/purchase/tran/PurchaseTranList.vue')
      },
      {
        path: 'purchaseState',
        name: 'PurchaseState',
        component: () => import('@/views/purchase/tran/PurchaseStateList.vue')
      },

]
