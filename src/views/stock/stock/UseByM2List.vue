<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.period"
                   :options="periods"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">기간</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                   :options="areaCds"
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
        :value="subMatList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="rowNum"      header="No."         :style="{ width: '40px', textAlign:'center'}" />
        <Column field="testNo"      header="시험번호"    :style="{ width: '120px', textAlign:'center'}" />
        <Column field="itemCd"      header="품목코드"    :style="{ width: '150px', textAlign:'center'}" />
        <Column field="itemName"    header="품목명"      :style="{ width: '300px'}" bodyClass="break-words"   />
        <Column field="customerName" header="구매처명"     :style="{ width: '300px'}" bodyClass="break-words"   />
        <Column field="expiraDate"  header="경과일수(일)"     :style="{ width: '100px', textAlign:'center'}" />
        <Column field="inDays"      header="입고일"       :style="{ width: '110px', textAlign:'right'}"/>
        <Column field="inPrice"      header="단가"        :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
        </Column>
        <Column field="qty"      header="수량"        :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="amount"      header="금액"        :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.amount).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { computed, onMounted, reactive, ref } from 'vue';

const subMatList = ref([])
const areaCds = ref([])
const totalCount = computed(() => {
  return Array.isArray(subMatList.value) ? subMatList.value.length : 0
})
const form = reactive({
    period: '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: '',
})
const periods = ref([
    { code: '2' , codeNm: '3개월미만'},
    { code: '3' , codeNm: '3개월이상'},
    { code: '6' , codeNm: '6개월이상'},
    { code: '12', codeNm: '1년이상'},
    { code: '24', codeNm: '2년이상'},
])
const searchDateAdd = (day) =>{
    form.stdDate = addDay(form.stdDate, day)
}

const srhList = async () =>{
    const params={
        ...form
    }
    //subMatList.value = await ApiStock.getUseByM2List(params)
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    form.stdDate = todayKST()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '부자재 수불부' },
    { label: '부자재 수불부 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(subMatList.value, "사용기한(부자재) 리스트", cols);
}

</script>

<style  scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
</style>
