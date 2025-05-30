import IndexView from '@/layouts/IndexView.vue'



const routes = [
  {
    path: '/',
    component: IndexView,
    children: [
      {
        path: '/',
        name: 'DashBoard',
        component: () => import('@/views/DashBoard.vue')
      },
    ]
  },
  /** Login */
  {
    path: '/login',
    name: 'LogIn',
    component: () => import('@/views/login/LogIn.vue'),
  },

  /** 기본관리 */
  {
    path: '/basic',
    component: IndexView,
    children: [
      {
        path: 'itemDetail',
        name: 'ItemDetail',
        component: () => import('@/views/basic/ItemDetail.vue')
      },
      {
        path: 'itemList',
        name: 'ItemList',
        component: () => import('@/views/basic/ItemList.vue')
      },
      {
        path: 'itemDetailList',
        name: 'ItemDetailList',
        component: () => import('@/views/basic/ItemDetailList.vue')
      },
    ]
  },
  /**발주관리 */
  {
    path: '/order',
    component: IndexView,
    children: [
      {
        path: 'orderList',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue')
      },
      {
        path: 'orderDetail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/OrderDetail.vue'),
        props: true,
      },
      {
        path: 'orderEdit/:id',
        name: 'OrderEdit',
        component: () => import('@/views/order/OrderEdit.vue'),
        props: true,
      },
      {
        path: 'orderNew',
        name: 'OrderNew',
        component: () => import('@/views/order/OrderNew.vue')
      },
    ]
  },
  /** 시스템 관리 */
  {
    path: '/system',
    component: IndexView,
    children: [
      {
        path: 'userMgmt',
        name: 'UserMgmt',
        component: () => import('@/views/system/UserMgmtList.vue')
      },
      {
        path: 'commonMgmt',
        name: 'CommonMgmt',
        component: () => import('@/views/system/CommonMgmtList.vue')
      },
      {
        path: 'templateMgmt',
        name: 'Template',
        component: () => import('@/views/system/TemplateMgmtList.vue')
      },
    ]
  },
  {
    path: `/:pathmatch(.*)*`,
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },


]

export default routes
