<template>
    <FloatLabel variant="on">
        <DatePicker
            v-model="innerDate"
            :showIcon="true"
            dateFormat="yy-mm-dd"
            inputClass="w-full"
            class="w-full"
            @update:modelValue="onChange"
        />
        <label for="on_label">일자</label>
  </FloatLabel>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const parseDate = (value) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const formatDate = (date) => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const innerDate = computed({
  get() {
    return parseDate(props.modelValue)
  },
  set(value) {
    const formatted = formatDate(value)
    emit('update:modelValue', formatted)
  }
})

const onChange = (value) => {
  emit('change', {
    date: formatDate(value)
  })
}
</script>
