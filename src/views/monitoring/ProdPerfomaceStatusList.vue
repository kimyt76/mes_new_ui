<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
  <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
    <template #start>
      <div class="flex flex-wrap items-center gap-2 w-full">
        <DateRangePicker
                    v-model:startDate="form.strDate"
                    v-model:endDate="form.endDate"
                    @change="handleDateChange"
                />
        <FloatLabel variant="on">
          <Select
            v-model="form.areaCd"
            :options="areaCds"
            optionLabel="codeNm"
            optionValue="code"
            style="width: 120px"
          />
          <label>구역(공장)</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText v-model="form.itemName" style="width: 180px"/>
          <label>품목명</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText v-model="form.itemCd" style="width: 120px" />
          <label>품목코드</label>
        </FloatLabel>

        <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
      </div>
    </template>
  </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
  <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
</div>

<div>
<DataTable
    ref="dt"
    v-model:first="first"
    :value="workOrderList"
    paginator
    :rows="20"
    :rowsPerPageOptions="[20,30,40]"
    scrollHeight="700px"
    scrollable
    showGridlines
    class="my-table"
  >

    <Column header="No" :style="{ width: '40px', textAlign:'center'}">
        <template #body="slotProps">
            {{ slotProps.index + 1 + first }}
        </template>
    </Column>
    <Column field="areaName" header="구역" frozen :style="{ width: '90px', textAlign:'center'}" />
    <Column field="itemCd" header="품목코드" frozen :style="{ width: '120px', textAlign:'center'}" />
    <Column field="itemName" header="품목명" frozen :style="{ width: '400px'}" bodyClass="break-words"/>
    <Column field="makeNo" header="제조번호" frozen :style="{ width: '170px', textAlign:'center'}" />
    <Column field="lotNo" header="1차포장LOT" frozen :style="{ width: '170px', textAlign:'center'}" />
    <Column field="lotNo2" header="2차포장LOT" frozen :style="{ width: '170px', textAlign:'center'}" />
    <Column field="batchStatus" header="배치상태" frozen :style="{ width: '90px', textAlign:'center'}" />
    <Column field="prodQty" header="제조량" :style="{ width: '100px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.prodQty) }}</template>
    </Column>
    <Column field="coatingQty" header="코팅량" :style="{ width: '100px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.coatingQty) }}</template>
    </Column>
    <Column field="chargingQty" header="충전량" :style="{ width: '100px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.chargingQty) }}</template>
    </Column>
    <Column field="packingQty" header="포장량" :style="{ width: '100px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.packingQty) }}</template>
    </Column>
  </DataTable>

</div>
</template>

<script setup>
import { ApiMonitoring } from '@/api/apiMonitoring';
import { addMonth, formatNumber, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { reactive, ref } from 'vue';

const dt = ref(null);
const first = ref(0)
const areaCds = ref([])
const workOrderList = ref([])
const form = reactive({
    strDate: minMonth(todayKST(), 2),
    endDate: addMonth(todayKST(), 1),
    areaCd: '',
    itemCd:'',
    itemName: '',
})
const handleDateChange =()=>{}

const srhList = async () =>{
    const params = {
        ...form
    }

    const res = await ApiMonitoring.getProdPerformaceStatus(params)
 console.log('res',   res)
    workOrderList.value = res
}


const downloadExcel = () => {
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn('재고목록이 없습니다.');
    return;
  }

  exportToExcel(workOrderList.value, '생산실적현황 리스트', cols);
};

const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
  { label: '모니터링' },
  { label: '모니터링' },
  { label: '생산실적현황' },
]);


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
