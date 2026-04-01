<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 55rem; height: 4rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-2">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.itemName" style="width: 180px" />
                    <label for="on_label1">품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.managerName" style="width: 180px" />
                    <label for="on_label1">담당자명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                    <label for="on_label1">고객사명</label>
                </FloatLabel>
                <Button
                    label="검색"
                    icon="pi pi-search"
                    severity="secondary"
                    type="submit"
                    class="search-button"
                />
            </div>
          </form>
        </div>
      </div>
    </template>
</Card>
    <!-- 🔹 리스트 영역 (높이 제한) -->
    <div class="list-section mt-3 h-[500px]">
        <div class="overflow-auto">
        <DataTable
            :value="contractList"
            dataKey="contractItemId"
            paginator
            :rows="15"
            :rowsPerPageOptions="[15,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollable
            scrollHeight="500px"
            showGridlines
            selectionMode="single"
            @row-select="selectedRow"
        >
            <Column field="contractDateSeq"   header="일자-No." :style="{ width: '140px'}" style="text-align: center;" />
            <Column field="poNo"              header="PO No."  :style="{ width: '150px'}" style="text-align: left;" />
            <Column field="itemName"          header="품목명"  :style="{ width: '280px'}" style="text-align: left;" />
            <Column field="dueDate"           header="납기일자" :style="{ width: '110px'}" style="text-align: left;" />
            <Column field="clientName"        header="고객사명" :style="{ width: '180px'}" style="text-align:  center;" />
            <Column field="qty"               header="총수량" :style="{ width: '100px'}" style="text-align:  center;" >
                <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
            </Column>
            <Column field="reQty"             header="남은수량" :style="{ width: '100px'}" style="text-align:  center;" >
                <template #body="slotProps">{{ Number(slotProps.data.reQty).toLocaleString() }}</template>
            </Column>
        </DataTable>
        </div>
    </div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
</div>

</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const contractList = ref([])
const form = reactive({
  itemName: '',
  managerName: '',
  clientName: ''
})

const searchList = async () =>{
    const params = {
        ...form
    }
    contractList.value = await ApiOrder.getContractList(params);
}

onMounted(()=>{
    if (dialogRef?.value) {
        // 팝업 전체 너비 변경
        dialogRef.value.options.props.style = {
            ...dialogRef.value.options.props.style,
            width: '1100px',     // 원하는 width로 변경
            maxWidth: 'none',    // PrimeVue 기본 제한 해제
        }
    }
})

const selectedRow = (event) =>{
    dialogRef.value.close(event.data);
}

const closeDialog = () =>{
    dialogRef.value.close();
}
</script>

<style scoped>
/* 검색 영역 아래 구분선 */
.search-section {
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}

/* 🔥 검색폼을 한 줄로, 간격 최소 */
.search-form {
  display: flex;
  flex-wrap: nowrap;      /* 한 줄 유지 */
  gap: 0.25rem;           /* 필드 간 간격 */
  align-items: flex-end;  /* 라벨/인풋/버튼 하단 맞춤 */
  width: 100%;
}
/* 리스트 영역: 남은 공간 일부만 사용하도록 */
.list-section {
  flex: 0 0 auto;
  margin-top: 0.75rem;
}
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

</style>
