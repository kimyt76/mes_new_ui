import  { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state : () => ({
    visible: false,
    message: '',
    type: 'success',
  }),
  actions: {
    show(message, type = 'success') {
      this.message = message
      this.type = type
      this.visible = true

      // 자동으로 사라지게 (3초 후)
      setTimeout(() => {
        this.visible = false
      }, 3000)
    },
    hide() {
      this.visible = false
    },
    vSuccess(msg){
      this.show(msg, 'success')
    },
    vError(msg){
      this.show(msg, 'error')
    },
    vError(msg){
      this.show(msg, 'error')
    },
    vWarning(msg){
      this.show(msg, 'warning')
    },
    vInfo(msg){
      this.show(msg, 'info')
    },
  }
})


const msgDetail = code => {
  const cd = code
  const msg = ''
  switch (cd) {
    case "500":
      msg = "서버 오류입니다."
      break
    case "401":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    case "500":
      msg = "서버 오류입니다."
      break
    default:
       msg = "서버 오류입니다."
       break
  }

  return msg
}
