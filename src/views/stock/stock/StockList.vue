<template>
<Breadcrumb :home="home" :model="items"/>

<form @submit.prevent="srhList" class="space-y-4">
  <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
    <template #start>
      <div class="flex flex-wrap items-center gap-2 w-full">
        <FloatLabel variant="on">
          <Select
            v-model="form.type"
            :options="types"
            optionLabel="codeNm"
            optionValue="code"
            style="width: 120px"
          />
          <label>정보표시</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select
            v-model="form.itemTypeCd"
            :options="itemTypeCds"
            optionLabel="codeNm"
            optionValue="code"
            style="width: 120px"
          />
          <label>품목구분</label>
        </FloatLabel>

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

<div class="flex items-center justify-end gap-2 mb-2">
  <Button
    label="엑셀"
    icon="pi pi-file-excel"
    severity="success"
    @click="downloadExcel"
  />
</div>

<div>
  <DataTable
    ref="dt"
    v-model:first="first"
    :value="stockList"
     :key="tableKey"
    dataKey="_rowKey"
    paginator
    :rows="20"
    :rowsPerPageOptions="[20,30,40]"
    scrollHeight="700px"
    scrollable
    showGridlines
    tableStyle="min-width:120rem; table-layout: fixed;"
    class="my-table"
  >
    <Column header="No" :style="{ width: '40px', textAlign:'center'}">
        <template #body="slotProps">
            {{ slotProps.index + 1 + first }}
        </template>
    </Column>
    <Column field="itemCd" header="품목코드" frozen :style="{ width: '120px', textAlign:'center'}" />
    <Column field="itemName" header="품목명" frozen :style="{ width: '400px'}" bodyClass="break-words"/>

    <Column
      v-if="form.type === 'TEST'"
      field="testNo"
      header="시험번호"
      frozen
      :style="{ width: '120px', textAlign:'center'}"
    />

    <Column
      v-for="col in dynamicColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :style="{ width: '140px', minWidth: '140px', textAlign:'right' }"
      :pt="{ columnHeaderContent: 'justify-center' }"
    >
      <template #body="{ data }">
        <div class="text-right">
          {{ formatQty(data[col.field]) }}
        </div>
      </template>
    </Column>
    <Column field="inReQty" header="발주(입고예정)" :style="{ width: '140px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.inReQty) }}</template>
    </Column>
    <Column field="totQty" header="합계" :style="{ width: '90px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.totQty) }}</template>
    </Column>
    <Column field="safeStockQty" header="안전재고" :style="{ width: '90px', textAlign:'right'}">
      <template #body="slotProps">{{ formatNumber(slotProps.data.safeStockQty) }}</template>
    </Column>
  </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { addDay, formatQty, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref, watch } from 'vue';

const dt = ref(null);
const first = ref(0)
const types = ref([
  { code: 'ITEM', codeNm: '품목' },
  { code: 'TEST', codeNm: '시험번호' },
]);

const areaCds = ref([]);
const itemTypeCds = ref([]);
const dynamicColumns = ref([]);
const stockList = ref([]);

const form = reactive({
  type: 'ITEM',
  itemTypeCd: '',
  areaCd: '',
  itemName: '',
  itemCd: '',
  stdDate: todayKST(),
});


const tableKey = ref(0)

const srhList = async () => {
  first.value = 0

  dynamicColumns.value = []
  stockList.value = []

  const params = {
    ...form,
  }

  const res = await ApiStock.getStockItemList(params)
console.log('API 전체 응답:', res)
console.log('rows:', res.rows)
console.log('rows 개수:', res.rows?.length)
  dynamicColumns.value = res.dynamicColumns || []

  stockList.value = (res.rows || []).map((row, index) => ({
    ...row,
    _rowKey:
      form.type === 'TEST'
        ? `${row.itemCd}_${row.testNo ?? ''}_${index}`
        : `${row.itemCd}_${index}`,
  }))

  tableKey.value++
}

watch(
  () => form.areaCd,
  async () => {
    await srhList();
  }
);

watch(
  () => form.type,
  async () => {
    await srhList();
  }
);

const searchDateAdd = async (day) => {
  form.stdDate = addDay(form.stdDate, day);
  await srhList();
};

const formatNumber = (value) => {
  return Number(value ?? 0).toLocaleString();
};

const downloadExcel = () => {
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn('재고목록이 없습니다.');
    return;
  }

  exportToExcel(stockList.value, '재고 리스트', cols);
};

onMounted(async () => {
  areaCds.value = await ApiCommon.getCodeList('AREA');
  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');

  await srhList();
});

const home = ref({
  icon: 'pi pi-home',
});

const items = ref([
  { label: '재고관리' },
  { label: '재고조회' },
  { label: '재고조회목록' },
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
