/** 칭량관리 */
export default [
      /**
       * 칭량
       */
      {
        path: 'weigh',
        name: 'WeighList',
        component: () => import('@/views/proc/weigh/weigh/WeighList.vue')
      },
      /* 공정검사*/
      {
        path: 'weigh/weighProcTest',
        name: 'WeighProcTest',
        component: () => import('@/views/proc/weigh/procTest/WeighProcTestList.vue')
      },
      /* 제품출고*/
      {
        path: 'weigh/weighTran',
        name: 'WeighTran',
        component: () => import('@/views/proc/weigh/weighTran/WeighTranList.vue')
      },

      /* 자재불출*/
      {
        path: 'weigh/weighOut',
        name: 'WeighOut',
        component: () => import('@/views/proc/weigh/weighOut/WeighOutList.vue')
      },
      /* 일일마감*/
      {
        path: 'weigh/dayClose',
        name: 'DayClose',
        component: () => import('@/views/proc/weigh/dayClose/DayCloseList.vue')
      },
      /* 월마감*/
      {
        path: 'weigh/monClose',
        name: 'MonClose',
        component: () => import('@/views/proc/weigh/monClose/MonCloseList.vue')
      },
      /* 폐기조정*/
      {
        path: 'weigh/distposalAdjust',
        name: 'DistposalAdjust',
        component: () => import('@/views/proc/weigh/distposalAdjust/DistposalAdjustList.vue')
      },


      /* 제조 */
      {
        path: 'mat/mat',
        name: 'MatList',
        component: () => import('@/views/proc/mat/mat/MatList.vue')
      },
      {
        path: 'mat/conditon',
        name: 'MatProcCond',
        component: () => import('@/views/proc/mat/conditon/MatProcCondList.vue')
      },


      /* 코팅 */
      {
        path: 'coating/coating',
        name: 'CoatingList',
        component: () => import('@/views/proc/coating/coating/CoatingList.vue')
      },
      {
        path: 'coating/coatingEentire',
        name: 'CoatingEentire',
        component: () => import('@/views/proc/coating/coating/CoatingEentireList.vue')
      },

      /* 충전 */
      {
        path: 'charge/charge',
        name: 'ChargeList',
        component: () => import('@/views/proc/charge/charge/ChargeList.vue')
      },
      /* 충전 */
      {
        path: 'charge/chargeEentire',
        name: 'ChargeEentire',
        component: () => import('@/views/proc/charge/charge/ChargeEentireList.vue')
      },


      /* 포장 */
      {
        path: 'packing/packing',
        name: 'PackingList',
        component: () => import('@/views/proc/packing/packing/PackingList.vue')
      },
      {
        path: 'packing/packingEentire',
        name: 'PackingEentire',
        component: () => import('@/views/proc/packing/packing/PackingEentireList.vue')
      },




]
