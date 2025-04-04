import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LayoutView from "@/layouts/LayoutView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/login/LoginView.vue";

import CommonMgmt from "@/views/system/CommonMgmt.vue";
import UserMgmt from "@/views/system/UserMgmt.vue";



const routes = [

  {
    path:'/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue')
  },
  {
    path:'/system',
    component: LayoutView,
    children: [
      {
        path: 'userMgmt',
        component: UserMgmt
      }
    ]
  }
]


// const routes = [
//   {
//     path:'/',
//     component: LayoutView,
//     children: [
//       {
//         path:'/',
//         name : '',
//         // component: () => import('@/view/Home.vue')
//         component: HomeView,
//       },
//       {
//         path:'/login',
//         name : 'Login',
//         // component: () => import('@/view/login/LoginView.vue')
//         component: LoginView,
//       },
//     ]
//   },

//   {
//     path:'/system',
//     component: LayoutView,
//     chlidren: [
//       {
//         path:'userMgmt',
//         component: () => import('@/view/system/UserMgmt.vue')

//       },
//       {
//         path:'commonMgmt',
//         //component: () => import('@/view/system/CommonMgmt.vue')
//         component: CommonMgmt,
//       }
//     ]
//   }
// ]


const router = createRouter({
  history: createWebHistory('/'),
  routes,
})



export default router
