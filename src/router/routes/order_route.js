/** 발주관리 */
export default [
      //기안서관리
      {
        path: 'draftList',
        name: 'DraftList',
        component: () => import('@/views/order/draft/DratfList.vue')
      },
      {
        path: 'draftNew',
        name: 'DraftNew',
        component: () => import('@/views/order/draft/DraftReg.vue')
      },
      {
        path: 'draftDetail/:id',
        name: 'DraftDetail',
        component: () => import('@/views/order/draft/DraftDetail.vue')
      },
      {
        path: 'draftEdit/:id',
        name: 'DraftEdit',
        component: () => import('@/views/order/draft/DraftEdit.vue')
      },

      // 수주관리
      {
        path: 'contractList',
        name: 'ContractList',
        component: () => import('@/views/order/contract/ContractList.vue')
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
      //진행현황
      {
        path: 'progressList',
        name: 'ProgressList',
        component: () => import('@/views/order/mgmt/ProgressList.vue'),
        props: true,
      },
      {
        path: 'clientList',
        name: 'ClientList',
        component: () => import('@/views/order/client/ClientList.vue')
      },
      {
        path: 'clientDetail/:id?',
        name: 'ClientDetail',
        component: () => import('@/views/order/client/ClientDetailPop.vue'),
        props: true,
      },
    ]
