<template>
  <div class="mt-2 p-2 border rounded-lg shadow-sm" style="width: 15rem; height: 3.5rem;">
    <DatePicker
        v-model="time"
        timeOnly
        showIcon
        hourFormat="12"
        appendTo="body"
        :manualInput="false"
        style="width: 100%;"
    />
  </div>


  <div class="flex justify-end gap-1 mt-3">
    <Button label="입력" @click="timeInput"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';

const time = ref(null);
const dialogRef = inject('dialogRef');

const formatHHmm = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

onMounted(() => {
  time.value = new Date(); //
});

const timeInput = () => {
  dialogRef.value.close(formatHHmm(time.value));
};

const closeDialog = () => {
  dialogRef.value.close();
};
</script>
