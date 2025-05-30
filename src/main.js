import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import globalCommaNumber from './plugins/global-commaNumber'


const app = createApp(App)


app.directive('comma-number', globalCommaNumber)
app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
