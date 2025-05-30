<template>
  <div>
    이거슨 dashboard
  </div>

</template>

<script setup>
import MultiFileUpload from '@/components/MultiFileUpload.vue';


</script>

<style scoped>
.date-picker-wrapper {
  display: flex;
  align-items: center; /* 전체 높이 기준 정렬 */
  gap: 4px;
}

.date-text-field {
  flex: 1;
  height: 40px; /* 맞춤 높이 (density compact 기준) */
}

.calendar-icon-btn {
  height: 40px;         /* 텍스트필드와 정확히 동일하게 */
  width: 40px;
  min-width: 40px;
  padding: 0;
  margin: 0;
  border-radius: 0;
  align-self: center;   /* 높이 정렬 */
}

.calendar-icon-btn .v-icon {
  font-size: 20px;
}
</style>
