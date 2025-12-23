import '@/assets/styles.scss';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import 'primeflex/primeflex.css';
import { DialogService } from 'primevue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';


const app = createApp(App);
app.use(createPinia())
app.use(router);
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
        dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        today: '오늘',
        clear: '초기화',
        dateFormat: 'yy-mm-dd'
    },
    pt: {
        column: {
            headerContent: { class: 'justify-center' } //
        },
        dialog: {
            header: {
                style: {
                backgroundColor: '#BCAAA4',
                color: '#fff',
                height: '40px',          // 높이 설정
                display: 'flex',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
                }
            }
        }
    }
});
app.use(ConfirmationService);

app.mount('#app');
