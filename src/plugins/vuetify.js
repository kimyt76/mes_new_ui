import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import { ko } from 'vuetify/locale'  //
import { VDateInput } from 'vuetify/labs/VDateInput'

const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  locale: {
    locale: 'ko',
    messages: { ko },
  },
  defaults: {
    VDateInput: {
      format: formatDate
    }
  }
})
