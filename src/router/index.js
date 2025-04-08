import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";


const routes = [
  {
    path: '/',
    component: () => import('@/layouts/main/Index.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/DashBoardView.vue')
      },
      {
        path: '/system/userMgmt',
        name: 'UserMgmt',
        component: () => import('@/views/system/UserMgmt.vue')
      },
      {
        path: '/system/commonMgmt',
        name: 'CommonMgmt',
        component: () => import('@/views/system/CommonMgmt.vue')
      },
      {
        path: '/prod/prodList',
        name: 'ProdList',
        component: () => import('@/views/prod/ProdList.vue')
      },
      {
        path: '/prod/prodDtl',
        name: 'ProdDtlList',
        component: () => import('@/views/prod/ProdDtlList.vue')
      },
    ]
  },
  {
    path: '/',
    name:'Login',
    component: () => import('@/views/login/LoginView.vue')
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

//router.beforeEach

export default router
