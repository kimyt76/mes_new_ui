<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.type" :options="types"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">정보표시</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">품목구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.areaCd" :options="areaCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <div class="flex items-center gap-2">
            <Button
                rounded
                icon="pi pi-chevron-left"
                class="tw-ml-5 p-button-sm"
                @click="searchDateAdd(-1)"
                />
                <Calendar
                ref="val_stdDate"
                v-model="form.stdDate"
                showIcon
                dateFormat="yy-mm-dd"
                placeholder="기준일자"
                class="tw-w-32 tw-ml-3 tw-mt-1 tw-mr-3"
                />
                <Button
                rounded
                icon="pi pi-chevron-right"
                class="tw-mr-5 p-button-sm"
                @click="searchDateAdd(1)"
                />
            </div>

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
        v-model:selection="selectedItem"
        :value="stockList"
        dataKey="itemCd"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        selectionMode="single"
        tableStyle="min-width:120rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="itemCd"          header="품목코드"  :style="{ width: '120px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"        header="품목명"    :style="{ width: '400px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="orderDateSeq"    header="[시화]"  frozen :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="orderDate"       header="발주일"  frozen :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="deliveryDate"    header="납기일"  :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"    header="거래처명"  :style="{ width: '250px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="srcStorageName"  header="입고창고"  :style="{ width: '110px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="orderQty"        header="발주수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="inQty"       header="입고수량"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.inQty).toLocaleString() }}</template>
        </Column>
        <Column field="supplyPrice" header="공급가액"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.supplyPrice).toLocaleString() }}</template>
        </Column>
        <Column field="regYn"       header="입고상태"   :style="{ width: '90px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="endYn"       header="진행상태"   :style="{ width: '90px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="mailYn"      header="발주서발송" :style="{ width: '100px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="managerName" header="담당자"     :style="{ width: '90px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { addDay, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const types = ref([])
const areaCds = ref([])
const itemTypeCds = ref([])
const selectedItem = ref([])
const form = reactive({
    type: '',
    itemTypeCd : '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST(),
})
const stockList = ref([])
// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    //stockList.value = await ApiStock.getStockList(params);
}

const searchDateAdd = (day) =>{
    form.stdDate = addDay(form.stdDate, day)
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('AREA');
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '재고관리' },
    { label: '재고조회' },
    { label: '재고목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(matOrderlist.value, "재고 리스트", cols);
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
