export default {
  mounted(el) {
    const format = (value) => {
      const isNegative = value.startsWith('-')
      const digits = value.replace(/[^0-9]/g, '')
      const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return isNegative ? `-${formatted}` : formatted
    }

    const onKeyDown = (e) => {
      const allowedKeys = [
        'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete',
        '-', // allow minus
      ]
      if (
        !/[0-9]/.test(e.key) &&
        !allowedKeys.includes(e.key)
      ) {
        e.preventDefault()
      }

      if (e.key === '-' && e.target.selectionStart !== 0) {
        e.preventDefault()
      }
    }

    const onInput = (e) => {
      let raw = e.target.value
      raw = raw.replace(/[^0-9\-]/g, '')
      if ((raw.match(/-/g) || []).length > 1) {
        raw = raw.replace(/-+/g, '-')
      }
      if (raw.includes('-') && !raw.startsWith('-')) {
        raw = raw.replace(/-/g, '')
      }
      e.target.value = format(raw)
      el.dispatchEvent(new Event('input')) // v-model 연동 유지
    }

    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('input', onInput)

    el._cleanup = () => {
      el.removeEventListener('keydown', onKeyDown)
      el.removeEventListener('input', onInput)
    }
  },


  unmounted(el) {
    el._cleanup?.()
  }
}
