<!-- LabeledDatePicker.vue -->
<template>
  <FloatLabel variant="on" class="inline-flex flex-col datepicker-field">
    <DatePicker
      v-model="proxyValue"
      :inputId="inputId"
      showIcon
      iconDisplay="input"
      :inputClass="'datepicker-input p-inputtext-sm'"
    />
    <label :for="inputId">{{ label }}</label>
  </FloatLabel>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Date, String, null],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  inputId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const proxyValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
/* 전체 컴포넌트 폭 */
.datepicker-field {
  width: 130px;  /* 원하는 폭으로 조절 */
}

/* 실제 인풋 모양 */
.datepicker-input {
  width: 100%;
  font-size: 0.875rem;  /* 조금 작게 */
  padding-right: 2.2rem; /* 아이콘 들어갈 공간 확보 */
  box-sizing: border-box;
}
</style>
