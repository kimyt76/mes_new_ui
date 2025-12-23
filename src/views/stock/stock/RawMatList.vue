<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <DatePicker v-model="form.strDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">시작</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="form.toDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료</label>
            </FloatLabel>

                <FloatLabel variant="on">
                <Select v-model="form.itemGrp1" :options="itemGrp1s"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">관리구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="rawMatList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="min-width:180rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="rowNum"          header="No."      frozen  :style="{ width: '60px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"          header="관리구분"  frozen :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"          header="품목코드"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"        header="품목명"    frozen :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="itemName"        header="납품업체"  frozen  :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="inPrice"         header="단가"  frozen :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
        </Column>
        <Column field="orderQty"        header="기초재고수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="orderAmt"        header="기초재고금액"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="inQty"        header="입고수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="inAmt"        header="입고금액"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="출고수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outAmt"        header="출고금액"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="반품조정수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="검사샘플수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="연구샘플수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="실사조정수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="과입조정수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="계정변경수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="매출조정수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="사용조정수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="기말재고수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="outQty"        header="기말재고금액"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { addMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const itemGrp1s = ref([])
const form = reactive({
    strDate: '',
    toDate: '',
    itemGrp1: '',
    itemTypeCd : '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST(),
})
const rawMatList = ref([])
// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    //stockList.value = await ApiStock.getStockList(params);
}

onMounted( async () => {
    itemGrp1s.value = await ApiCommon.getCodeList('item_grp1')

    form.toDate = todayKST()
    form.strDate = addMonth(form.toDate, -3)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '원재료수불부' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(rawMatList.value, "원재료수불부 리스트", cols);
}


</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
</style>
