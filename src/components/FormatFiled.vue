<template>
  <FloatLabel variant="on" class="mr-4 w-full">
    <!-- InputText -->
    <InputText
      v-if="type === 'text'"
      v-model="model"
      :style="style"
      :placeholder="placeholder"
    />

    <!-- Dropdown -->
    <Select
      v-else-if="type === 'select'"
      v-model="model"
      :options="options"
      option-label="codeNm"
      option-value="code"
      :style="style"
      :placeholder="placeholder"
    />

    <!-- Calendar(DatePicker) -->
    <DatePicker
      v-else-if="type === 'date'"
      v-model="model"
      date-format="yy-mm-dd"
      show-icon
      :style="style"
      :placeholder="placeholder"
    />

    <!-- Number -->
    <InputNumber
      v-else-if="type === 'number'"
      v-model="model"
      :style="style"
      :placeholder="placeholder"
    />

    <!-- Textarea -->
    <Textarea
      v-else-if="type === 'textarea'"
      v-model="model"
      :style="style"
      :placeholder="placeholder"
    />

    <!-- Label (항상 플로팅 라벨로 동작) -->
    <label>{{ label }}</label>
  </FloatLabel>
</template>

<script setup>
const model = defineModel() // v-model 자동 연결

defineProps({
  type: { type: String, default: 'text' }, // text, select, date, number, textarea
  label: { type: String, default: '' },    // 플로팅 라벨 (위로 올라감)
  placeholder: { type: String, default: '' }, // 입력 전 안내 문구
  style: [String, Object],
  options: { type: Array, default: () => [] }, // select 전용 옵션
})
</script>
