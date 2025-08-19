import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' // 👈 분리한 routes 불러오기
import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes,
})

<<<<<<< HEAD

 router.beforeEach(async (to, form) => {
  const auth = useAuthStore();

  if (!auth.sessionChecked) {
    await auth.fetchUser();
  }

  if (!auth.isLoggedIn && to.name !== 'LogIn') {
    return { name: 'LogIn' };
  } else if (auth.isLoggedIn && to.name === 'LogIn') {
    return { path: '/' };
  } else {
    return true;
  }

})

=======
//router.beforeEach
>>>>>>> 855cf22632ab5369ad12aea6ea3e9a6f7b152ca0

export default router
