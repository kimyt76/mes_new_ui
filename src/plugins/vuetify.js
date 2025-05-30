import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import { ko } from 'vuetify/locale'  //


export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'ko',
    messages: { ko },
  },
})
