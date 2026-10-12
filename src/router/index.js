
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from) => {
    const auth = useAuthStore();

    /**
     * 최초 접속 시 서버 세션 확인
     */
    if (!auth.sessionChecked) {
        await auth.fetchUser();
    }

    /**
     * 로그인하지 않은 사용자
     * 로그인 화면으로 이동
     */
    if (!auth.isLoggedIn) {

        if (to.name !== 'LogIn') {
            return { name: 'LogIn' };
        }

        return true;
    }

    /**
     * 로그인한 사용자가 로그인 화면 접근
     * 메인 화면으로 이동
     */
    if (to.name === 'LogIn') {
        return { path: '/' };
    }

    return true;
});

export default router;
