/** QC */
export default [
      {
        path:'reqQcTest',
        name:'ReqQcTest',
        component: () => import('@/views/qc/reqQcTest/ReqQcTestList.vue')
      },
      {
        path:'qcTest',
        name:'QcTest',
        component: () => import('@/views/qc/qcTest/QcTestList.vue')
      },
      {
        path:'reqQcTestCompare',
        name:'ReqQcTestCompare',
        component: () => import('@/views/qc/reqQcTestCompare/ReqQcTestCompareList.vue')
      },
      {
        path:'reqQcTestType',
        name:'ReqQcTestType',
        component: () => import('@/views/qc/reqQcTestType/ReqQcTestTypeList.vue')
      },
      {
        path:'procTest',
        name:'ProcTest',
        component: () => import('@/views/qc/procTest/ProcTestList.vue'),
        props: true,
      },
      {
        path:'procTestType',
        name:'ProcTestType',
        component: () => import('@/views/qc/procTestType/ProcTestTypeList.vue')
      },
      {
          path:'qcTestNo',
          name:'QcTestNo',
          component: () => import('@/views/qc/qcTestNo/QcTestNoList.vue'),
          props: true,
        },


    ]
