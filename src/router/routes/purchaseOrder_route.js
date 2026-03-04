
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
        path: 'purchaseTranM',
        name: 'PurchaseTranM',
        component: () => import('@/views/purchase/tran/PurchaseTranMList.vue')
      },
      {
        path: 'purchaseTranP',
        name: 'PurchaseTranP',
        component: () => import('@/views/purchase/tran/PurchaseTranPList.vue')
      },
      {
        path: 'tranCurrent',
        name: 'TranCurrent',
        component: () => import('@/views/purchase/tran/PurchaseCurrentList.vue')
      },

]
