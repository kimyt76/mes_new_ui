import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' // 👈 분리한 routes 불러오기
import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes,
})


 router.beforeEach(async (to, form) => {
  const auth = useAuthStore();

  if ( !auth.isLoggedIn  ) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn && to.name !== 'LogIn') {
    return { name: 'LogIn' };
  } else if (auth.isLoggedIn && to.name === 'LogIn') {
    return { path: '/' };
  } else {
    return true;
  }

})


export default router
