/** 생산관리 */
export default [

      {
        path: 'workOrderList',
        name: 'WorkOrderList',
        component: () => import('@/views/production/workOrder/WorkOrderList.vue')
      },
      {
        path: 'workOrderProgress',
        name: 'WorkOrderProgress',
        component: () => import('@/views/production/workOrder/WorkOrderProgressList.vue')
      },

      {
        path:'worker',
        name: 'WorkerList',
        component: () => import('@/views/production/worker/WorkerList.vue')
      },

    //   {
    //     path: 'workSchedule',
    //     name: 'WorkSchedule',
    //     component: () => import('@/views/production/workSchedule/WorkSchedule.vue')
    //   },
    //   {
    //     path: 'scheduleReg',
    //     name: 'ScheduleReg',
    //     component: () => import('@/views/production/workSchedule/ScheduleReg.vue')
    //   },
    ]
