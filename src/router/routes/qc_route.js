/** QC */
export default [
      /* 품질검사 요청 */
     {
        path:'reqQcTest',
        name:'ReqQcTest',
        component: () => import('@/views/qc/reqQcTest/ReqQcTestList.vue')
      },
      /* 품질검사 */
      {
        path:'qcTest',
        name:'QcTest',
        component: () => import('@/views/qc/qcTest/QcTestList.vue')
      },
       /* 품질별 검사비교 */
      {
        path:'reqQcTestCompare',
        name:'ReqQcTestCompare',
        component: () => import('@/views/qc/reqQcTestCompare/ReqQcTestCompareList.vue')
      },
       /* 품질검사 유형 */
      {
        path:'qcTestType',
        name:'QcTestType',
        component: () => import('@/views/qc/qcTestType/QcTestTypeList.vue')
      },
       /* 공정검사 */
      {
        path:'procTest',
        name:'ProcTest',
        component: () => import('@/views/qc/procTest/ProcTestList.vue'),
        props: true,
      },
    /* 공정검사유형 */
      {
        path:'procTestType',
        name:'ProcTestType',
        component: () => import('@/views/qc/procTestType/ProcTestTypeList.vue')
      },
       /* 시험번호별 내역 */
      {
          path:'qcTestNo',
          name:'QcTestNo',
          component: () => import('@/views/qc/qcTestNo/QcTestNoList.vue'),
          props: true,
        },


    ]
