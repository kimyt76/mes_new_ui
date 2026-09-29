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
      {
        path: 'storage',
        name: 'StorageList',
        component: () => import('@/views/system/storage/StorageList.vue')
      },
      {
        path: 'scale',
        name: 'Scale',
        component: () => import('@/views/system/scale/ScaleList.vue')
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/MenuList.vue')
      },
      {
        path: 'auth',
        name: 'Auth',
        component: () => import('@/views/system/auth/AuthList.vue')
      },


    ]
