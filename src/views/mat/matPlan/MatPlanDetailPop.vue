<template>
  <div class="popup-root">
    <!-- 상단(검색/버튼) -->
    <div class="top-section">
      <Button
        v-if="isBtnDisabled"
        label="주문서"
        severity="secondary"
        @click="openContractDialog"
      />
    </div>

    <!-- 가운데(테이블만 스크롤) -->
    <div class="table-section">
      <DataTable
        :value="matPlanList"
        dataKey="matPlanId"
        tableStyle="table-layout: fixed; width: 100%"
        columnResizeMode="fit"
        class="my-table"
        scrollable
        scrollHeight="flex"
        showGridlines
      >
        <Column field="matRegDate" header="일자" :style="{ width: '120px', textAlign: 'center' }">
          <template #body="slotProps">
            <DatePicker
              v-model="slotProps.data.matRegDate"
              :inputStyle="{ width: '120px', textAlign: 'center' }"
            />
          </template>
        </Column>
        <Column field="poNo" header="PO No." :style="{ width: '140px', textAlign: 'center' }" />
        <Column field="itemCd" header="품목코드" :style="{ width: '120px', textAlign: 'center' }" />
        <Column field="itemName" header="품목명" :style="{ width: '350px', textAlign: 'left' }" bodyClass="break-words"/>
        <Column field="qty" header="수량" :style="{ width: '130px', textAlign: 'right' }">
            <template #body="slotProps">{{ Number(slotProps.data.qty ?? 0).toLocaleString() }}</template>
        </Column>
        <Column field="theoryMakeQty" header="이론제조량" :style="{ width: '130px'}">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.theoryMakeQty"
              class="w-full"
              :min="0"
              :useGrouping="true"
              :inputStyle="{ width: '120px', textAlign: 'right' }"
              :maxFractionDigits="0"
            />
          </template>
        </Column>
        <Column field="matInstrQty" header="제조지시량" :style="{ width: '130px'}">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.matInstrQty"
              class="w-full"
              :min="0"
              :useGrouping="true"
              :inputStyle="{ width: '120px', textAlign: 'right' }"
              :max="Number(slotProps.data.qty ?? 0)"
              :maxFractionDigits="0"
              @update:modelValue="(val) => validateQty(val, slotProps.data)"
            />
          </template>
        </Column>
        <Column field="matPlanDate" header="제조예정일" :style="{ width: '120px', textAlign: 'center' }">
          <template #body="slotProps">
            <DatePicker
              v-model="slotProps.data.matPlanDate"
              :inputStyle="{ width: '120px', textAlign: 'center' }"
            />
          </template>
        </Column>
        <Column field="etc" header="비고" :style="{ width: '130px' }">
          <template #body="slotProps">
            <InputText v-model="slotProps.data.etc" class="w-full" />
          </template>
        </Column>
        <Column field="actions"        header="-"    :style="{ width: '20px'}" style="text-align: center;" >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
      </DataTable>
    </div>

    <!-- 하단(버튼 고정) -->
    <div class="bottom-section">
      <Button label="저장" class="p-button-secondary" @click="saveInfo" />
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>

    <!-- 두 번째 팝업 -->
    <Dialog
        v-model:visible="contractDialogVisible"
        header="주문서 조회"
        modal
        :draggable="false"
        :resizable="false"
        :style="{ width: '81rem' }"
        :contentStyle="{ height: '40rem', overflow: 'hidden', padding: '0' }"
        >
        <div class="dialog-body">
            <MatContractListPop @confirm="handleContractSelect" @close="dialogClose" />
        </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, ref } from 'vue';
import MatContractListPop from './MatContractListPop.vue';

const { vWarning, vSuccess } = useAlertStore();

const contractDialogVisible = ref(false);
const isBtnDisabled = ref(true);
const dialogRef = inject('dialogRef');
const matPlanList = ref([]);

const openContractDialog = () => {
  contractDialogVisible.value = true;
};

const dialogClose = () => {
  contractDialogVisible.value = false;
};

const handleContractSelect = (rows) => {
  if (!Array.isArray(rows)) return;
  addRow(rows);
};

const addRow = (rows) => {
  const rowItem = rows.map((o) => ({
    matRegDate: '',
    poNo: o.poNo,
    itemCd: o.itemCd,
    itemName: o.itemName,
    qty: o.qty,
    theoryMakeQty: 0,
    matInstrQty: 0,
    matPlanDate: '',
    etc: '',
  }));

  matPlanList.value.push(...rowItem);
};

const validateQty = (value, rowData) => {
  const v = Number(value ?? 0);
  const qty = Number(rowData.qty ?? 0);

  if (v > qty) {
    vWarning('제조지시량은 수량을 초과할 수 없습니다.');
    rowData.matInstrQty = 0; // ✅ 오타 수정 (matInstructionQty -> matInstrQty)
  }
};

const saveInfo = async () => {
  try {
    if (matPlanList.value.length === 0) {
      vWarning('저장할 데이터가 없습니다.');
      return;
    }

    const res = await ApiMat.saveMatPlanList(matPlanList.value);
    vSuccess(res.message);
  } catch (err) {
    handleApiError(err);
  }
};

const removeRow = (idx) =>{
    matPlanList.value.splice(idx, 1)
}

onMounted(async () => {
  if (!isEmpty(dialogRef.value.data.id)) {
    isBtnDisabled.value = false;
    matPlanList.value = await ApiMat.getMatPlanDetailList(dialogRef.value.data.id);
  }
});

const closeDialog = () => {
  dialogRef.value.close();
};
</script>

<style scoped>
/* ✅ 팝업 전체: 바깥 스크롤 금지 */
.popup-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ✅ 상단은 고정 */
.top-section {
  padding: 0.75rem;
  flex: 0 0 auto;
}

/* ✅ 가운데만 스크롤 */
.table-section {
  flex: 1 1 auto;
  min-height: 0;   /* ⭐ flex + 스크롤 핵심 */
  overflow: auto;  /* ⭐ 테이블 영역에서만 스크롤 */
  padding: 0 0.75rem;
}

/* ✅ 하단 버튼 고정 */
.bottom-section {
  padding: 0.75rem;
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

/* 테이블 스타일 */
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 6px 6px 0.1rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
.dialog-body {
  height: 100%;
}
</style>
