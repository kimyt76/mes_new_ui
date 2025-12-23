/** 생산관리 */
export default [

      {
        path: 'workOrderList',
        name: 'WorkOrderList',
        component: () => import('@/views/production/workOrder/WorkOrderList.vue')
      },
      {
        path:'workOrderDetail/:id?',
        name: 'WorkOrderDetail',
        component: () => import('@/views/production/workOrder/WorkOrderDetail.vue')
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
