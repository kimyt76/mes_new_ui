
/** 발주/구매관리 */
export default [
      {
        path: 'matOrderM',
        name: 'MatOrderM',
        component: () => import('@/views/purchase/order/PurchaseOrderMList.vue')
      },
      {
        path: 'purchaseTranM',
        name: 'PurchaseTranM',
        component: () => import('@/views/purchase/tran/PurchaseTranMList.vue')
      },
      {
        path: 'matOrderP',
        name: 'MatOrderP',
        component: () => import('@/views/purchase/order/PurchaseOrderPList.vue')
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
