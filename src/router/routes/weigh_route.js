/** 칭량관리 */
export default [
      {
        path: 'weigh',
        name: 'WeighList',
        component: () => import('@/views/mat/weigh/weigh/WeighList.vue')
      },
      {
        path: 'procTest',
        name: 'WeighProcTestList',
        component: () => import('@/views/mat/weigh/proc/WeighProcTestList.vue')
      },
]
