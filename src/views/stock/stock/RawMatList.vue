<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DateRangePicker
                    v-model:startDate="form.strDate"
                    v-model:endDate="form.endDate"
                    @change="handleDateChange"
                />
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
        <Column field="orderType"       header="관리구분"  frozen :style="{ width: '120px', textAlign:'center'}" />
        <Column field="itemCd"          header="품목코드"  frozen :style="{ width: '150px', textAlign:'center'}" />
        <Column field="itemName"        header="품목명"    frozen :style="{ width: '400px'}" bodyClass="break-words"   />
        <Column field="customerName"    header="납품업체"  frozen  :style="{ width: '300px'}" bodyClass="break-words"  />
        <Column field="inPrice"         header="단가"  frozen  :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
        </Column>
        <Column field="basicQty"        header="기초재고수량"   :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.basicQty).toLocaleString() }}</template>
        </Column>
        <Column field="basicAmt"        header="기초재고금액"   :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.basicAmt).toLocaleString() }}</template>
        </Column>
        <Column field="asQty"        header="입고수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.asQty).toLocaleString() }}</template>
        </Column>
        <Column field="asAmt"        header="입고금액"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.asAmt).toLocaleString() }}</template>
        </Column>
        <Column field="esQty"        header="출고수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.esQty).toLocaleString() }}</template>
        </Column>
        <Column field="esAmt"        header="출고금액"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.esAmt).toLocaleString() }}</template>
        </Column>
        <Column field="psQty"        header="반품조정수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.psQty).toLocaleString() }}</template>
        </Column>
        <Column field="tsQty"        header="검사샘플수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.tsQty).toLocaleString() }}</template>
        </Column>
        <Column field="qsQty"        header="연구샘플수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.qsQty).toLocaleString() }}</template>
        </Column>
        <Column field="ssQty"        header="실사조정수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.ssQty).toLocaleString() }}</template>
        </Column>
        <Column field="vQty"        header="과입조정수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.vsQty).toLocaleString() }}</template>
        </Column>
        <Column field="wsQty"        header="계정변경수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.wsQty).toLocaleString() }}</template>
        </Column>
        <Column field="xsQty"        header="매출조정수량"   :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.xsQty).toLocaleString() }}</template>
        </Column>
        <Column field="usQty"        header="사용조정수량"   :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.usQty).toLocaleString() }}</template>
        </Column>
        <Column field="finalQty"        header="기말재고수량"   :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.finalQty).toLocaleString() }}</template>
        </Column>
        <Column field="finalAmt"        header="기말재고금액"   :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.finalAmt).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const itemGrp1s = ref([])
const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    itemGrp1: '',
    itemTypeCd : 'M1',
    itemName: '',
    itemCd: '',
})
const rawMatList = ref([])
const handleDateChange = () =>{

}

const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    rawMatList.value = await ApiStock.getTranLedger(params)
    console.log('rawMatList.value', rawMatList.value)
}

onMounted( async () => {
    itemGrp1s.value = await ApiCommon.getCodeList('item_grp1')
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '원재료수불부' },
    { label: '원재료수불부 목록' },
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
  padding: 0.6rem 0.7rem;
}
</style>
