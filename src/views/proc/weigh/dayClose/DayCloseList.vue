<template>
<Breadcrumb :home="home" :model="items"/>

<form @submit.prevent="srhList" class="space-y-4">
  <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
    <template #start>
      <div class="flex flex-wrap items-center gap-2 w-full">
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

        <Button
          label="검색"
          icon="pi pi-search"
          type="submit"
          class="bg-blue-500 text-white hover:bg-blue-600"
        />
      </div>
    </template>
  </Toolbar>
</form>
<div>
  <DataTable
    ref="dt"
    v-model:first="first"
    :value="itemList"
    :loading="loading"
    dataKey="itemCd"
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
    <Column field="itemCd" header="품목코드" frozen :style="{ width: '110px', textAlign:'center'}">
        <template #body="slotProps">
            <div @click="selectRowClick(slotProps.data)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                {{ slotProps.data.itemCd }}
            </div>
        </template>
    </Column>
    <Column field="itemName" header="품목명" frozen :style="{ width: '400px'}" bodyClass="break-words"/>
    <Column field="baseQty" header="전일재고" :style="{ width: '120px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.baseQty) }}</template>
    </Column>
    <Column field="asQty" header="입고량" :style="{ width: '120px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.asQty) }}</template>
    </Column>
    <Column field="makeQty" header="제조사용량" :style="{ width: '120px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.makeQty) }}</template>
    </Column>
    <Column field="qsQty" header="연구샘플" :style="{ width: '100px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.qsQty) }}</template>
    </Column>
    <Column field="tsQty" header="검사샘플" :style="{ width: '100px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.tsQty) }}</template>
    </Column>
    <Column field="adjQty" header="폐기" :style="{ width: '100px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.adjQty) }}</template>
    </Column>
    <Column field="etcQty" header="기타" :style="{ width: '100px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.etcQty) }}</template>
    </Column>
    <Column field="qty" header="현재고" :style="{ width: '120px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.qty) }}</template>
    </Column>
  </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import { todayKST } from '@/util/common';
import DayClosePop from '@/views/proc/weigh/dayClose/DayClosePop.vue';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const dialog = useDialog()
const first = ref(0)
const loading = ref(false)
const areaCds = ref([])
const itemList = ref([])
const form = reactive({
  areaCd: 'A001',
  stdDate: todayKST(),
  itemName: '',
  itemCd: '',

  strDate: '',
  endDate: '',
  itemTypeCd: 'M1'
});

const selectRowClick = (row) =>{
  console.log(row)
  console.log(row.itemCd)

  dialog.open(DayClosePop, {
    props: {
      header: '일일마감 상세',
      modal: true,
      draggable: true,
      resizable: false,
      width: '1000px',
    },
    data:{
      itemCd: row.itemCd,
      strDate: form.strDate,
      endDate: form.endDate
    }
  })
}

const searchDateAdd = async (day) => {
  form.stdDate = addDay(form.stdDate, day);
  //await srhList();
};

const formatNumber = (value) => {
  return Number(value ?? 0).toLocaleString();
};

const srhList = async () => {
    form.strDate = form.stdDate
    form.endDate = form.stdDate

    const params = {
        ...form,
    }

    loading.value = true

    try {
        console.log('params', params)

        itemList.value = await ApiProc.getWeighCloseList(params)
    } catch (err) {
        handleApiError(err)
        itemList.value = []
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    try {
        areaCds.value = await ApiCommon.getCodeList('AREA')
        await srhList()
    } catch (err) {
        handleApiError(err)
    }
})

const home = ref({
  icon: 'pi pi-home',
});

const items = ref([
  { label: '칭량관리' },
  { label: '일일마감' },
  { label: '일일마감목록' },
]);
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
