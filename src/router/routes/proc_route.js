/** 칭량관리 */
export default [
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
        path: 'mat/mat',
        name: 'MatList',
        component: () => import('@/views/proc/mat/mat/MatList.vue')
      },





]
