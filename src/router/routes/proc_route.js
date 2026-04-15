/** 칭량관리 */
export default [
      /* 칭량 */
      {
        path: 'weigh',
        name: 'WeighList',
        component: () => import('@/views/proc/weigh/weigh/WeighList.vue')
      },
      {
        path: 'weigh/procTest',
        name: 'WeighProcTestList',
        component: () => import('@/views/proc/weigh/procTest/WeighProcTestList.vue')
      },
      {
        path: 'weigh/weighTran',
        name: 'WeighTran',
        component: () => import('@/views/proc/weigh/weighTran/WeighTranList.vue')
      },


      /* 제조 */
      {
        path: 'mat/mat',
        name: 'MatList',
        component: () => import('@/views/proc/mat/mat/MatList.vue')
      },

      /* 코팅 */
      {
        path: 'coating/coating',
        name: 'CoatingList',
        component: () => import('@/views/proc/coating/coating/CoatingList.vue')
      },
      {
        path: 'coating/coatingTran',
        name: 'CoatingTran',
        component: () => import('@/views/proc/coating/coatingTran/CoatingTranList.vue')
      },

      /* 충전 */
      {
        path: 'charge/charge',
        name: 'ChargeList',
        component: () => import('@/views/proc/charge/charge/ChargeList.vue')
      },
      {
        path: 'charge/chargeTran',
        name: 'ChargeTran',
        component: () => import('@/views/proc/charge/chargeTran/ChargeTranList.vue')
      },

      /* 포장 */
      {
        path: 'packing/packing',
        name: 'PackingList',
        component: () => import('@/views/proc/packing/packing/PackingList.vue')
      },
      {
        path: 'packing/packingTran',
        name: 'PackingTran',
        component: () => import('@/views/proc/packing/packingTran/PackingTranList.vue')
      },




]
