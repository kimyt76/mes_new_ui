/** 제조관리 */
export default [

      {
        path: 'matPlan',
        name: 'MatPlanList',
        component: () => import('@/views/mat/matPlan/MatPlanList.vue')
      },
      {
        path: 'equirementCalculation',
        name: 'EquirementCalculation',
        component: () => import('@/views/mat/equirementCalculation/EquirementCalculation.vue')
      },
      {
        path: 'itemM1Equirment',
        name: 'ItemM1Equirment',
        component: () => import('@/views/mat/itemM1Equirment/ItemM1Equirment.vue')
      },


    ]
