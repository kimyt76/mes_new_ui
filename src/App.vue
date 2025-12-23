<template>
  <Toast ref="toast"
    position="top-center"
    appendTo="self"
    class="big-toast"/>
  <router-view />
  <DynamicDialog />
  <ConfirmDialog group="deleteBatch">
  <template #container="{ message, acceptCallback, rejectCallback }">
    <div class="p-dialog p-component" style="width:360px">
      <!-- header 제거: 아예 안 그려줌 -->

      <!-- content -->
      <div class="p-dialog-content px-6 pt-7 pb-5 text-center">
        <p class="text-lg font-semibold m-0 whitespace-pre-line">
          {{ message.message }}
        </p>
      </div>

      <!-- footer -->
      <div class="p-dialog-footer flex justify-center gap-5" style="padding: 0 64px 22px;">
        <Button
          label="예"
          class="p-button-sm"
          style="width:96px"
          @click="acceptCallback"
        />
        <Button
          label="아니오"
          class="p-button-sm p-button-outlined"
          style="width:96px"
          @click="rejectCallback"
        />
      </div>
    </div>
  </template>
</ConfirmDialog>





</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { nextTick, onMounted, ref } from 'vue'

const toast = ref(null)
const { setToastRef } = useAlertStore()

onMounted(async () => {
  await nextTick()
  setToastRef(toast.value)
})
</script>

<style>
/* 📌 위치는 그대로 유지 */
.big-toast.p-toast-top-center {
  top: 30vh !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

/* 📌 토스트 크기 20% 작게 */
.big-toast .p-toast-message {
  width: auto !important;       /* 반드시 auto */
  min-width: 120px !important;  /* 최소 크기 */
  max-width: 400px !important;  /* 내용이 길면 여기까지만 늘어남 */

  padding: 3px 5px !important;   /* 기존 20px 30px → 16px 24px */
  font-size: 12px !important;      /* 글씨도 20% 축소 */
  border-radius: 5px !important;
  margin-bottom: 10px;
}

/* 📌 detail 텍스트도 작게 */
.big-toast .p-toast-detail {
  font-size: 17px !important;      /* 기존 22px → 17px */
  font-weight: 500;
}

/* summary 안 쓰면 숨기기 */
.big-toast .p-toast-summary {
  display: none;
}

/* 📌 아이콘 제거 */
.big-toast .p-toast-message-icon,
.big-toast .p-toast-icon {
  display: none !important;
}

/* 📌 텍스트 수직 정렬 유지 */
.big-toast .p-toast-message-content {
  align-items: center !important;
}



</style>

