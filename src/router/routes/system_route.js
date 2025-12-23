/** 시스템 관리 */
export default [

      {
        path: 'userMgmt',
        name: 'UserMgmt',
        component: () => import('@/views/system/user/UserMgmtList.vue')
      },
      {
        path: 'commonMgmt',
        name: 'CommonMgmt',
        component: () => import('@/views/system/common/CommonMgmtList.vue')
      },
    //   {
    //     path: 'templateMgmt',
    //     name: 'Template',
    //     component: () => import('@/views/system/TemplateMgmtList.vue')
    //   },
    ]
