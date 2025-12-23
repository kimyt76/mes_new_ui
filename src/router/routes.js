import AppLayout from '@/layout/AppLayout.vue'

import basic_route from './routes/basic_route'
import lab_route from './routes/lab_route'
import mat_route from './routes/mat_route'
import order_route from './routes/order_route'
import production_route from './routes/production_route'
import purchaseOrder_route from './routes/purchaseOrder_route'
import stock_route from './routes/stock_route'
import system_route from './routes/system_route'
import weigh_route from './routes/weigh_route'


const routes = [
    /** dashboard */
    {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',          // 최종 URL: /dashboard
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      // 필요하면 여기 다른 공통 페이지들도 같이 children으로 추가 가능
    ],
   },
    /** Login */
    {
        path: '/login',
        name: 'LogIn',
        component: () => import('@/views/login/LogIn.vue'),
    },
  /** /basic – 기본정보 */
  {
    path: '/basic',
    component: AppLayout,
    children: basic_route,
  },
  /** /lab – 연구 */
  {
    path: '/lab',
    component: AppLayout,
    children: lab_route,
  },
  /** /prod – 제 */
  {
    path: '/mat',
    component: AppLayout,
    children: mat_route,
  },
  /** /prod – 제 */
  {
    path: '/mat/weigh',
    component: AppLayout,
    children: weigh_route,
  },

  /** /prod – 제 */
  {
    path: '/order',
    component: AppLayout,
    children: order_route,
  },
  /** /prod – 제 */
  {
    path: '/purchase',
    component: AppLayout,
    children: purchaseOrder_route,
  },
  /** /prod – 제 */
  {
    path: '/prod',
    component: AppLayout,
    children: production_route,
  },
  /** /prod – 제 */
  {
    path: '/stock',
    component: AppLayout,
    children: stock_route,
  },
  /** /prod – 제 */
  {
    path: '/system',
    component: AppLayout,
    children: system_route,
  },
   {
    path: `/:pathmatch(.*)*`,
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },


]

export default routes


// import AppLayout from '@/layout/AppLayout.vue';

// const routes = [
//         /** Login */
//         {
//             path: '/dashboard',
//             name: 'Dashboard',
//             component: () => import('@/views/Dashboard.vue'),
//         },
//         /** Login */
//         {
//             path: '/login',
//             name: 'LogIn',
//             component: () => import('@/views/login/LogIn.vue'),
//         },
//         {
//             path: '/basic',
//             component: AppLayout,
//             children: [
//                 {
//                 path: 'itemList',
//                 name: 'ItemList',
//                 component: () => import('@/views/basic/item/ItemList.vue')
//                 },
//                 {
//                 path: 'itemDetail/:id',
//                 name: 'ItemDetail',
//                 component: () => import('@/views/basic/item/ItemDetail.vue')
//                 },
//                 {
//                 path: 'itemInfoList',
//                 name: 'ItemInfoList',
//                 component: () => import('@/views/basic/item/ItemInfoList.vue')
//                 },
//             ]
//         },
//         {
//             path: '/order',
//             component: AppLayout,
//             children: [
//                 {
//                 path: 'contractList',
//                 name: 'ContractList',
//                 component: () => import('@/views/order/contract/ContractList.vue')
//                 },
//                 {
//                 path: 'contractDetail/:id',
//                 name: 'ContractDetail',
//                 component: () => import('@/views/order/contract/ContractDetail.vue')
//                 },
//             ]
//         },
//         {
//         path: '/lab',
//         component: AppLayout,
//         children: [
//             {
//             path: 'ingredientlist',
//             name: 'IngredientList',
//             component: () => import('@/views/lab/ingredient/IngredientList.vue')
//             },
//             {
//             path: 'materialList',
//             name: 'MaterialList',
//             component: () => import('@/views/lab/material/MaterialList.vue')
//             },
//             // {
//             // path: 'materialDetail/:id',
//             // name: 'MaterialDetail',
//             // component: () => import('@/views/lab/material/MaterialDetailPop.vue')
//             // },
//         ]
//         },
//         {
//         path: '/',
//         component: AppLayout,
//         children: [
//             {
//                 path: '/',
//                 name: 'Dashboard',
//                 component: () => import('@/views/Dashboard.vue')
//             },
//             {
//                 path: '/uikit/formlayout',
//                 name: 'formlayout',
//                 component: () => import('@/views/uikit/FormLayout.vue')
//             },
//             {
//                 path: '/uikit/input',
//                 name: 'input',
//                 component: () => import('@/views/uikit/InputDoc.vue')
//             },
//             {
//                 path: '/uikit/button',
//                 name: 'button',
//                 component: () => import('@/views/uikit/ButtonDoc.vue')
//             },
//             {
//                 path: '/uikit/table',
//                 name: 'table',
//                 component: () => import('@/views/uikit/TableDoc.vue')
//             },
//             {
//                 path: '/uikit/list',
//                 name: 'list',
//                 component: () => import('@/views/uikit/ListDoc.vue')
//             },
//             {
//                 path: '/uikit/tree',
//                 name: 'tree',
//                 component: () => import('@/views/uikit/TreeDoc.vue')
//             },
//             {
//                 path: '/uikit/panel',
//                 name: 'panel',
//                 component: () => import('@/views/uikit/PanelsDoc.vue')
//             },

//             {
//                 path: '/uikit/overlay',
//                 name: 'overlay',
//                 component: () => import('@/views/uikit/OverlayDoc.vue')
//             },
//             {
//                 path: '/uikit/media',
//                 name: 'media',
//                 component: () => import('@/views/uikit/MediaDoc.vue')
//             },
//             {
//                 path: '/uikit/message',
//                 name: 'message',
//                 component: () => import('@/views/uikit/MessagesDoc.vue')
//             },
//             {
//                 path: '/uikit/file',
//                 name: 'file',
//                 component: () => import('@/views/uikit/FileDoc.vue')
//             },
//             {
//                 path: '/uikit/menu',
//                 name: 'menu',
//                 component: () => import('@/views/uikit/MenuDoc.vue')
//             },
//             {
//                 path: '/uikit/charts',
//                 name: 'charts',
//                 component: () => import('@/views/uikit/ChartDoc.vue')
//             },
//             {
//                 path: '/uikit/misc',
//                 name: 'misc',
//                 component: () => import('@/views/uikit/MiscDoc.vue')
//             },
//             {
//                 path: '/uikit/timeline',
//                 name: 'timeline',
//                 component: () => import('@/views/uikit/TimelineDoc.vue')
//             },
//             {
//                 path: '/uikit/template',
//                 name: 'template',
//                 component: () => import('@/views/uikit/ListTemplate.vue')
//             },
//             {
//                 path: '/pages/empty',
//                 name: 'empty',
//                 component: () => import('@/views/pages/Empty.vue')
//             },
//             {
//                 path: '/pages/crud',
//                 name: 'crud',
//                 component: () => import('@/views/pages/Crud.vue')
//             },
//             {
//                 path: '/documentation',
//                 name: 'documentation',
//                 component: () => import('@/views/pages/Documentation.vue')
//             }

//         ]
//     },
//     {
//         path: '/landing',
//         name: 'landing',
//         component: () => import('@/views/pages/Landing.vue')
//     },
//     {
//         path: '/pages/notfound',
//         name: 'notfound',
//         component: () => import('@/views/pages/NotFound.vue')
//     },

//     {
//         path: '/auth/login',
//         name: 'login',
//         component: () => import('@/views/pages/auth/Login.vue')
//     },
//     {
//         path: '/auth/access',
//         name: 'accessDenied',
//         component: () => import('@/views/pages/auth/Access.vue')
//     },
//     {
//         path: '/auth/error',
//         name: 'error',
//         component: () => import('@/views/pages/auth/Error.vue')
//     }
// ]


// export default routes;
