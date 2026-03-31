<template>
  <Toast ref="toast"
    position="top-center"
    appendTo="self"
    class="big-toast"/>
  <router-view />
  <DynamicDialog />

  <ConfirmDialog>
  <template #container="{ message, acceptCallback, rejectCallback }">
    <div class="custom-confirm">

      <!-- ✅ 헤더: 색으로 강조 -->
      <div class="custom-confirm-header">
        {{ message.header || '확인' }}
      </div>

      <div class="custom-confirm-body">

        <!-- 아이콘 작게 -->
        <div class="custom-confirm-icon-wrap">
          <i class="pi pi-exclamation-triangle custom-confirm-icon"></i>
        </div>

        <!-- 텍스트 작게 -->
        <p class="custom-confirm-message">
          {{ message.message }}
        </p>
      </div>

      <div class="custom-confirm-footer">
        <Button
          label="취소"
          class="custom-btn cancel"
          outlined
          @click="rejectCallback"
        />
        <Button
          label="확인"
          class="custom-btn accept"
          @click="acceptCallback"
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

.p-datatable .p-datatable-thead > tr > th {
  text-align: center !important;
}

.p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content {
  justify-content: center !important;
}

.p-datatable .p-datatable-thead > tr > th .p-datatable-column-title {
  width: 100%;
  text-align: center !important;
}

:deep(.p-dialog-mask) {
  backdrop-filter: blur(2px);
}
.custom-confirm {
  width: 360px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

/* ✅ 헤더 강조 */
.custom-confirm-header {
  background: #BCAAA4; /* 초록 */
  color: #fff;
  font-size: 16px;   /* 작게 */
  font-weight: 600;
  padding: 12px 16px;
}

/* 본문 */
.custom-confirm-body {
  padding: 24px 20px 16px;
  text-align: center;
}

/* 아이콘 작게 */
.custom-confirm-icon-wrap {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-confirm-icon {
  font-size: 20px;  /* 작게 */
  color: #f59e0b;
}

/* 텍스트 작게 */
.custom-confirm-message {
  margin: 0;
  white-space: pre-line;
  font-size: 15px;   /* 기존 25 → 줄임 */
  line-height: 1.6;
  font-weight: 500;
  color: #374151;
}

/* 버튼 영역 */
.custom-confirm-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px 20px;
}

/* 버튼 */
.custom-btn {
  min-width: 100px;
  height: 38px;
  font-size: 14px;
  border-radius: 8px;
}

.cancel {
  border-color: #cbd5e1 !important;
  color: #475569 !important;
}

.accept {
  background: #10b981 !important;
  border-color: #10b981 !important;
}
</style>

