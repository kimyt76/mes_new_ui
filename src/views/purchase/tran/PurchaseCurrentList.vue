<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <FloatLabel variant="on">
                <DatePicker v-model="form.strDate" inputId="on_label" showIcon iconDisplay="input"/>
                <label for="on_label">시작</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="form.toDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                 :options="areaCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 120px"
            />
            <label for="on_label1">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemTypeCd"
                 :options="itemTypeCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 140px"
                />
                <label for="on_label1">품목구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemName" style="width: 190px" />
                <label for="on_label1">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 140px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                <label for="on_label1">거래처명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.testState"
                 :options="testStates"
                 optionLabel="codeNm" optionValue="code"
                style="width: 120px"
            />
            <label for="on_label1">시험상태</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.passState"
                 :options="passStates"
                 optionLabel="codeNm" optionValue="code"
                style="width: 120px"
                />
                <label for="on_label1">판정상태</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="인쇄" icon="pi pi-print"  outlined @click="print"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    <Button label="바코드" icon="pi pi-barcode"  outlined @click="barcodePrint"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="min-width: 140rem; table-layout: fixed;"

        selectionMode="single"
        class="my-table"
        >
        <Column selectionMode="multiple"    headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="tranDateSeq"         header="일자-No"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="tranDate"            header="입고일"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"        header="거래처명"  :style="{ width: '190px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"              header="품목코드"      :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"            header="품목명"  frozen  :style="{ width: '350px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="testNo"              header="시험번호"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="unit"                header="규격"  :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="qty"                 header="수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.qty).toLocaleString() }}
            </template>
        </Column>
        <Column field="inPrice"  header="단가"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.inPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="supplyPrice"  header="공급가"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.supplyPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="vatPrice"  header="부가세"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.vatPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="sumPrice"  header="합계"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.sumPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="testState"    header="시험상태"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="passState"    header="판정상태"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="areaName"    header="구역"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { useCodeList } from '@/composable/useCodeList';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const { codes: itemTypeCds, loading } = useCodeList("ITEM_TYPE_CD");

const dt = ref(null)
const areaCds = ref([])
const purchaseList = ref([])
const form  = reactive({
    strDate: '',
    toDate: '',
    areaCd: null,
    itemTypeCd: null,
    itemName: '',
    itemCd: '',
    customerName: '',
    testState: null,
    passState: null,
})

const barcodePrint = () =>{

}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('AREA');
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');

    form.toDate = todayKST()
    form.strDate = minMonth(form.toDate)
});

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '구매관리' },
    { label: '구매(입고)' },
    { label: '구매현황목록' },
]);


const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(purchaseList.value, "구매현황 리스트", cols);
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

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
  text-align: left;
}

</style>
