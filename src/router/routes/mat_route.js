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
        path: 'equirementCalculationM2',
        name: 'EquirementCalculationM2',
        component: () => import('@/views/mat/equirementCalculation/SubEquirementCalculation.vue')
      },
      {
        path: 'itemM1Equirment',
        name: 'ItemM1Equirment',
        component: () => import('@/views/mat/itemEquirment/ItemM1Equirment.vue')
      },
      {
        path: 'itemM2Equirment',
        name: 'ItemM2Equirment',
        component: () => import('@/views/mat/itemEquirment/ItemM2Equirment.vue')
      },


    ]
