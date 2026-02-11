<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 97rem; height: 30rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
            <div class="search-field">
            <Button
              label="주문서"
              severity="secondary"
              @click="openContractDialog"
              class="search-button"
            />
            </div>
        </div>
        <!-- 🔹 리스트 영역 (높이 제한) -->
        <div class="list-section mt-3">
          <div class="list-wrapper">
            <DataTable
              ref="dt"
              :value="matPlanList"
              dataKey="matPlanId"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table h-full"
              scrollable
              scrollHeight="flex"
              showGridlines
            >
              <Column field="matRegDate" header="일자" :style="{ width: '120px', textAlign: 'center'}" >
                <template #body="slotProps">
                    <DatePicker v-model="slotProps.data.matRegDate" :inputStyle="{ width: '120px', textAlign: 'center' }"/>
                </template>
              </Column>
              <Column field="poNo"      header="PO No."     :style="{ width: '140px', textAlign: 'center'}"  />
              <Column field="itemCd"    header="품목코드"   :style="{ width: '120px' , textAlign: 'center'}" />
              <Column field="itemName"  header="품목명"     :style="{ width: '350px', textAlign: 'left'}"  bodyClass="break-words" />
              <Column field="qty"       header="수량"       :style="{ width: '130px' , textAlign: 'right'}" >
                 <template #body="slotProps">
                        {{ slotProps.data.qty.toLocaleString() }}
                </template>
              </Column>
              <Column field="matInstructionQty" header="제조지시량" :style="{ width: '130px', textAlign: 'center'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.matInstructionQty"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '120px', textAlign: 'right' }"
                        :max="slotProps.data.qty"
                         @update:modelValue="(val) => validateQty(val, slotProps.data)"
                    />
                </template>
              </Column>
              <Column field="matPlanDate" header="제조예정일" :style="{ width: '120px', textAlign: 'center'  }" >
                <template #body="slotProps">
                    <DatePicker
                        v-model="slotProps.data.matPlanDate" :inputStyle="{ width: '120px', textAlign: 'center' }"
                    />
                </template>
              </Column>
              <Column field="etc" header="비고"   :style="{ width: '130px'}" >
                  <template #body="slotProps">
                      <InputText
                          v-model="slotProps.data.etc"
                          class="w-full"
                      />
                  </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
          <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
        </div>
    </div>
    </template>
</Card>

<!-- 🔹 두 번째 팝업을 일반 Dialog로 사용 -->
  <Dialog
     v-model:visible="contractDialogVisible"
     header="주문서 조회"
     modal
    :draggable="false"
    :resizable="false"
    :breakpoints="{}"
    :style="{ width: '80rem', maxWidth: '80rem' }"
    :contentStyle="{ height: '38rem', overflow: 'hidden' }"
  >
    <!-- 자식 컴포넌트에 이벤트 바인딩 -->
    <MatContractListPop
        @confirm="handleContractSelect"
        @close="dialogClose"
        />
  </Dialog>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { inject, onMounted, ref } from 'vue';
import MatContractListPop from './MatContractListPop.vue';

const { vWarning, vSuccess} = useAlertStore()
const contractDialogVisible = ref(false);
const dialogRef = inject('dialogRef')
const matPlanList = ref([])

const openContractDialog = () => {
  contractDialogVisible.value = true;
};

const dialogClose = () =>{
    contractDialogVisible.value = false
}

const handleContractSelect = (rows) => {
  if (!Array.isArray(rows)) return;

  addRow(rows)
};

const addRow = (rows) =>{
    const rowItem = rows.map((o, index) => ({
      matRegDate: '',
      poNo: o.poNo,
      itemCd: o.itemCd,
      itemName: o.itemName,
      clientName: o.clientName,
      qty: o.qty,
      matInstructionQty: 0,
      matPlanDate: '',
      clientId: '',
  }));

  if (matPlanList.value.length > 0) {
    matPlanList.value.push(...rowItem);
  } else {
    matPlanList.value = [...rowItem];
  }
}

const validateQty = (value, rowData) => {
  if (value > rowData.qty) {
    vWarning("제조지시량은 수량을 초과할 수 없습니다.");
    rowData.matInstructionQty = 0;   // 0으로 초기화
    return;
  }
};

const saveInfo = async () => {
     console.log('1번재 matPlanList', matPlanList)
    //dialogRef.value.close(matPlanList);
    matPlanList.value = await ApiMat.saveMatPlanList(matPlanList.value)

    closeDialog()
}

onMounted( async () =>{
    if ( !isEmpty(dialogRef.value) ) {

    }
})

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>
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

</style>
