import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' // 👈 분리한 routes 불러오기
import { useAuthStore } from '@/stores/auth'
import { useCommonListStore } from '@/stores/commonListStore'


const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes,
})

 router.beforeEach(async (to, from) => {
  const auth = useAuthStore();
  const store = useCommonListStore()

  if (!auth.sessionChecked) {
    await auth.fetchUser();
  }

  const sameGroup =
    (to.name?.toString().startsWith('Material') &&
     from.name?.toString().startsWith('Material'))

  // 다른 메뉴 그룹 이동 시 clear
  if (!sameGroup) {
    store.clearPage(from.name)
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
