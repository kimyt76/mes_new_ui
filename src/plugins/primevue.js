// src/plugins/primevue.js
import PrimeVue from 'primevue/config'

// 서비스
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

// 디렉티브
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'

// ─────────────────────────────
// 공통으로 쓸 PrimeVue 컴포넌트들 import
// (안 쓰는 건 자유롭게 삭제해도 됩니다)
// ─────────────────────────────
import Avatar from 'primevue/avatar'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import RadioButton from 'primevue/radiobutton'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'

// 필요하면 더 추가해서 사용 가능

export default function registerPrimeVue(app) {
  // PrimeVue 기본 설정
  app.use(PrimeVue, {
    ripple: true,     // Ripple 효과 사용
    inputStyle: 'outlined', // 기본 input 스타일 (outlined / filled)
  })

  // 서비스 등록
  app.use(ToastService)
  app.use(ConfirmationService)

  // 디렉티브 등록
  app.directive('ripple', Ripple)
  app.directive('tooltip', Tooltip)

  // 컴포넌트 전역 등록
  app.component('Button', Button)
  app.component('Dialog', Dialog)
  app.component('DataTable', DataTable)
  app.component('Column', Column)
  app.component('FileUpload', FileUpload)
  app.component('InputText', InputText)
  app.component('Checkbox', Checkbox)
  app.component('Breadcrumb', Breadcrumb)
  app.component('Card', Card)
  app.component('Toolbar', Toolbar)
  app.component('Menubar', Menubar)
  app.component('TabPanel', TabPanel)
  app.component('Textarea', Textarea)
  app.component('InputNumber', InputNumber)
  app.component('RadioButton', RadioButton)
  app.component('Toast', Toast)
  app.component('ConfirmDialog', ConfirmDialog)
  app.component('ProgressSpinner', ProgressSpinner)
  app.component('Tag', Tag)
  app.component('Chip', Chip)
  app.component('Avatar', Avatar)
  app.component('Panel', Panel)
}
