export default {
  mounted(el, binding, vnode) {
    function format(value) {
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      const numeric = value.toString().replace(/,/g, '');
      if (isNaN(numeric)) {
        return '';
      }
      return Number(numeric).toLocaleString();
    }

    // input 이벤트 처리
    el.addEventListener('input', (e) => {
      const rawValue = e.target.value.replace(/,/g, '');
      if (/^\d*$/.test(rawValue)) {
        // 업데이트 v-model 값
        vnode.props['onUpdate:modelValue']?.(rawValue);
        // 표시값 콤마포맷
        e.target.value = format(rawValue);
      } else {
        // 숫자가 아닌 입력 거부
        e.target.value = format(binding.value);
      }
    });

    // 초기 렌더링 시 값 포맷
    el.value = format(binding.value);
  },
  updated(el, binding) {
    // 외부에서 값이 바뀌면 표시 업데이트
    function format(value) {
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      const numeric = value.toString().replace(/,/g, '');
      if (isNaN(numeric)) {
        return '';
      }
      return Number(numeric).toLocaleString();
    }

    el.value = format(binding.value);
  },
};
