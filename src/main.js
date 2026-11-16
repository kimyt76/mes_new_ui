
import '@/assets/styles.scss';
import CommDatePicker from '@/components/CommDatePicker.vue';
import { useAuthStore } from '@/stores/auth.js';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import 'primeflex/primeflex.css';
import { DialogService } from 'primevue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// =====================================================
// 1. Vue App / Pinia 생성
// =====================================================
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// =====================================================
// 2. PrimeVue 설정
// =====================================================
app.use(DialogService);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: {
        firstDayOfWeek: 0,
        dayNames: [
            '일요일', '월요일', '화요일', '수요일',
            '목요일', '금요일', '토요일'
        ],
        dayNamesShort: [
            '일', '월', '화', '수', '목', '금', '토'
        ],
        dayNamesMin: [
            '일', '월', '화', '수', '목', '금', '토'
        ],
        monthNames: [
            '1월', '2월', '3월', '4월',
            '5월', '6월', '7월', '8월',
            '9월', '10월', '11월', '12월'
        ],
        monthNamesShort: [
            '1월', '2월', '3월', '4월',
            '5월', '6월', '7월', '8월'
        ],
        today: '오늘',
        clear: '초기화',
        dateFormat: 'yy-mm-dd',
        am: '오전',
        pm: '오후'
    },
    pt: {
        column: {
            headerContent: {
                class: 'justify-center'
            }
        },
        dialog: {
            header: {
                style: {
                    backgroundColor: '#BCAAA4',
                    color: '#fff',
                    height: '40px',
                    display: 'flex',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                }
            }
        }
    }
});

app.use(ConfirmationService);

// =====================================================
// 3. 공통 컴포넌트
// =====================================================
app.component('DatePicker', CommDatePicker);

// =====================================================
// 4. 전역 메뉴 읽기 / 쓰기 권한
// =====================================================
app.mixin({
    computed: {
        readYn() {
            const authStore = useAuthStore(pinia);
            const path = router.currentRoute.value.path;

            return authStore.getReadYnByPath(path) ?? 'N';
        },

        writeYn() {
            const authStore = useAuthStore(pinia);
            const path = router.currentRoute.value.path;

            const readYn = authStore.getReadYnByPath(path);
            const writeYn = authStore.getWriteYnByPath(path);

            // 읽기 + 쓰기 권한 모두 Y인 경우만 허용
            return readYn === 'Y' && writeYn === 'Y' ? 'Y' : 'N';
        }
    }
});

// =====================================================
// 5. 전역 저장 중복 실행 방지
// =====================================================
app.mixin({
    data() {
        return {
            isSaving: false
        };
    },

    methods: {
        async saveGuard(callback) {

            // 저장 중이면 중복 실행 차단
            if (this.isSaving) {
                return;
            }

            this.isSaving = true;

            try {
                return await callback();
            } finally {
                // 성공 / 실패 관계없이 해제
                this.isSaving = false;
            }
        }
    }
});

// =====================================================
// 6. App 실행
// =====================================================
app.mount('#app');
