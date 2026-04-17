<template>
  <div class="date-range-wrap">
    <div class="date-field">
      <FloatLabel variant="on">
        <DatePicker
          v-model="startDateModel"
          :viewDate="startDateModel"
          :showIcon="true"
          dateFormat="yy-mm-dd"
          inputClass="w-full"
          class="w-full"
          :manualInput="false"
          @update:modelValue="onStartChange"
        />
        <label>시작일</label>
      </FloatLabel>
    </div>

    <div class="date-field">
      <FloatLabel variant="on">
        <DatePicker
          v-model="endDateModel"
          :viewDate="endDateModel"
          :showIcon="true"
          dateFormat="yy-mm-dd"
          inputClass="w-full"
          class="w-full"
          :manualInput="false"
          @update:modelValue="onEndChange"
        />
        <label>종료일</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import { computed } from 'vue'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:startDate',
  'update:endDate',
  'change'
])

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

const startDateModel = computed({
  get() {
    return parseDate(props.startDate)
  },
  set(value) {
    emit('update:startDate', formatDate(value))
  }
})

const endDateModel = computed({
  get() {
    return parseDate(props.endDate)
  },
  set(value) {
    emit('update:endDate', formatDate(value))
  }
})

const onStartChange = (value) => {
  emit('change', {
    startDate: formatDate(value),
    endDate: props.endDate
  })
}

const onEndChange = (value) => {
  emit('change', {
    startDate: props.startDate,
    endDate: formatDate(value)
  })
}
</script>

<style scoped>
.date-range-wrap {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 200px;
}

.date-label {
  font-size: 13px;
  color: #666;
}
</style>
