import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const menuStore = useMenuStore()

  if (!auth.sessionChecked) {
    await auth.fetchUserData()
    if (auth.isLoggedIn && menuStore.items.length === 0) {
      await menuStore.loadMenu(auth.userId)
    }
  }

  if (!auth.isLoggedIn && to.name !== 'LogIn') {
    return next({ name: 'LogIn' })
  }

  // 권한 체크
  const flat = menuStore.items.flatMap(m => [m, ...(m.items || [])])
  const target = flat.find(m => m.path === to.path)
  if (target && target.read_yn === 'N') {
    alert('접근 권한이 없습니다.')
    return next(false)
  }

  next()
})

export default router
