import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

 router.beforeEach(async (to, form) => {
  const auth = useAuthStore();

//   if (!auth.sessionChecked) {
//     await auth.fetchUser();
//   }
    if (!auth.sessionChecked) {
        try {
            await auth.fetchUser();
        } catch (e) {
            // ✅ 실패해도 체크 완료 처리
            auth.user = null;
        } finally {
            auth.sessionChecked = true;
        }
    }
  if (!auth.isLoggedIn && to.name !== 'LogIn') {
    return { name: 'LogIn' };
  } else if (auth.isLoggedIn && to.name === 'LogIn') {
    return { path: '/' };
  } else {
    return true;
  }

})



export default router;
