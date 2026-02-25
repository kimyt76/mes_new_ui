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
        :value="rawMatList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="min-width:180rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="rowNum"      header="No."        frozen  :style="{ width: '40px', textAlign:'center'}" />
        <Column field="itemCd"      header="품목코드"   frozen :style="{ width: '140px', textAlign:'center'}" />
        <Column field="itemName"    header="품목명"     frozen :style="{ width: '300px'}"/>
        <Column field="testNo"      header="시험번호"   frozen :style="{ width: '120px', textAlign:'center'}" />
        <Column field="expiraDate"  header="사용기한"   frozen  :style="{ width: '110px', textAlign:'center'}" />
        <Column field="remainDays"  header="잔여일"     frozen  :style="{ width: '100px', textAlign:'right'}"/>
        <Column field="totQty"      header="합계"       frozen :style="{ width: '100px', textAlign:'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.totQty).toLocaleString() }}</template>
        </Column>
        <Column field="s1Qty"     header="[시화]원재료창고"    :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.s1Qty).toLocaleString() }}</template>
        </Column>
        <Column field="s2Qty"     header="[시화]2층 칭량실"    :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.s2Qty).toLocaleString() }}</template>
        </Column>
        <Column field="s3Qty"     header="[시화]3층 칭량실"    :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.s3Qty).toLocaleString() }}</template>
        </Column>
        <Column field="a1Qty"     header="[안산]원재료창고"    :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.a1Qty).toLocaleString() }}</template>
        </Column>
        <Column field="a2Qty"     header="[안산]칭량실"        :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.a2Qty).toLocaleString() }}</template>
        </Column>
        <Column field="e1Qty"     header="[기타]한진창고"      :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.e1Qty).toLocaleString() }}</template>
        </Column>
        <Column field="e2Qty"     header="[기타]한일창고"      :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.e2Qty).toLocaleString() }}</template>
        </Column>
        <Column field="e3Qty"     header="[기타]외주창고"      :style="{ width: '150px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.e3Qty).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { addDay, addMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { computed, onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const areaCds = ref([])
const rawMatList = ref([])
const totalCount = computed(() => {
  return Array.isArray(rawMatList.value) ? rawMatList.value.length : 0
})
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
    areaCds.value = await ApiCommon.getCodeList('area')

    form.toDate = todayKST()
    form.strDate = addMonth(form.toDate, -3)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '재고관리' },
    { label: '사용기한(원재료)' },
    { label: '사용기한(원재료목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(rawMatList.value, "사용기한(원재료) 리스트", cols);
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
