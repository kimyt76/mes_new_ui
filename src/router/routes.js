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
        path: 'itemDetail/:id',
        name: 'ItemDetail',
        component: () => import('@/views/basic/item/ItemDetail.vue'),
        props: true,
      },
      {
        path: 'itemNewCd',
        name: 'ItemNewCd',
        component: () => import('@/views/basic/item/ItemNewCd.vue'),
      },
      {
        path: 'itemSubCd',
        name: 'ItemSubCd',
        component: () => import('@/views/basic/item/ItemSubCd.vue'),
      },
      {
        path: 'itemThird',
        name: 'ItemThird',
        component: () => import('@/views/basic/item/ItemThird.vue'),
      },
      {
        path: 'itemList',
        name: 'ItemList',
        component: () => import('@/views/basic/item/ItemList.vue')
      },
      {
        path: 'itemDetailList',
        name: 'ItemDetailList',
        component: () => import('@/views/basic/item/ItemInfoList.vue')
      },
      {
        path: 'customerList',
        name: 'CustomerList',
        component: () => import('@/views/basic/customer/CustomerList.vue')
      },
      {
        path: 'storageList',
        name: 'StorageList',
        component: () => import('@/views/basic/storage/StorageList.vue')
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
        component: () => import('@/views/order/order/OrderList.vue')
      },
      {
        path: 'orderDetail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/order/OrderDetail.vue'),
        props: true,
      },
      {
        path: 'orderEdit/:id',
        name: 'OrderEdit',
        component: () => import('@/views/order/order/OrderEdit.vue'),
        props: true,
      },
      {
        path: 'orderNew',
        name: 'OrderNew',
        component: () => import('@/views/order/order/OrderNew.vue')
      },

      //기안서관리
      {
        path: 'draftList',
        name: 'DraftList',
        component: () => import('@/views/order/draft/DratfList.vue')
      },
      {
        path: 'draftNew',
        name: 'DraftNew',
        component: () => import('@/views/order/draft/DraftNew.vue')
      },

      // 수주관리
      {
        path: 'contractList',
        name: 'ContractList',
        component: () => import('@/views/order/contract/ContractList.vue')
      },
      {
        path: 'contractDetail/:id?',
        name: 'ContractDetail',
        component: () => import('@/views/order/contract/ContractDetail.vue'),
        props: true,
      },
      {
        path: 'contractReg',
        name: 'ContractReg',
        component: () => import('@/views/order/contract/ContractReg.vue'),
      },
      //판매관리
      {
        path: 'saleList',
        name: 'SaleList',
        component: () => import('@/views/order/sale/SaleList.vue')
      },
      {
        path: 'saleReg',
        name: 'SaleReg',
        component: () => import('@/views/order/sale/SaleReg.vue')
      },
      {
        path: 'saleDetail/:id?',
        name: 'SaleDetail',
        component: () => import('@/views/order/sale/SaleDetail.vue'),
        props: true,
      },
      //출하지시서관리
      {
        path: 'shipmentList',
        name: 'ShipmentList',
        component: () => import('@/views/order/shipment/ShipmentList.vue')
      },
      {
        path: 'shipmentReg',
        name: 'ShipmentReg',
        component: () => import('@/views/order/shipment/ShipmentReg.vue')
      },
      {
        path: 'shipmentDetail/:id?',
        name: 'ShipmentDetail',
        component: () => import('@/views/order/shipment/ShipmentDetail.vue'),
        props: true,
      },
      //진행현황
      {
        path: 'progressList',
        name: 'ProgressList',
        component: () => import('@/views/order/mgmt/ProgressList.vue'),
        props: true,
      },
    ]
  },
  {
    path:'/lab',
    component: IndexView,
    children: [
      {
        path:'ingredient',
        name:'Ingredient',
        component: () => import('@/views/lab/ingredient/IngredientList.vue')
      },
      {
        path:'material',
        name:'Material',
        component: () => import('@/views/lab/material/MaterialList.vue')
      },
      {
        path:'materialDeail/:id',
        name:'MaterialDetail',
        component: () => import('@/views/lab/material/MaterialDetail.vue'),
        props: true,
      },
      {
        path:'research',
        name:'Research',
        component: () => import('@/views/lab/ResearchList.vue')
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
        component: () => import('@/views/system/user/UserMgmtList.vue')
      },
      {
        path: 'commonMgmt',
        name: 'CommonMgmt',
        component: () => import('@/views/system/common/CommonMgmtList.vue')
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
