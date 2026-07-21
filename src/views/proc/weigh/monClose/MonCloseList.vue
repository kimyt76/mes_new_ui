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
          <Select
            v-model="form.year"
            :options="years"
            optionLabel="codeNm"
            optionValue="code"
            style="width: 120px"
          />
          <label>년도</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <Select
            v-model="form.month"
            :options="months"
            optionLabel="codeNm"
            optionValue="code"
            style="width: 120px"
          />
          <label>월</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText v-model="form.itemName" style="width: 180px"/>
          <label>품목명</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText v-model="form.itemCd" style="width: 120px" />
          <label>품목코드</label>
        </FloatLabel>
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
    dataKey="itemCd"
    :loading="loading"
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
                {{ slotProps.data.itemCd  }}
            </div>
        </template>
    </Column>
    <Column field="itemName" header="품목명" frozen :style="{ width: '400px'}" bodyClass="break-words"/>
    <Column field="baseQty" header="기초재고" :style="{ width: '120px', textAlign:'right'}" >
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
import DayClosePop from '@/views/proc/weigh/dayClose/DayClosePop.vue';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, watch } from 'vue';

const dialog = useDialog()
const first = ref(0)
const loading = ref(false)
const areaCds = ref([])
const itemList = ref([])
const today = new Date();
const form = reactive({
  areaCd: 'A001',
  year: String(today.getFullYear()),
  month: String(today.getMonth() + 1),
  itemName: '',
  itemCd: '',

  strDate: '',
  endDate: '',
  itemTypeCd: 'M1'
});
const years = ref([
    {code: '2023', codeNm: '2023'},
    {code: '2024', codeNm: '2024'},
    {code: '2025', codeNm: '2025'},
    {code: '2026', codeNm: '2026'},
    {code: '2027', codeNm: '2027'},
    {code: '2028', codeNm: '2028'},
    {code: '2029', codeNm: '2029'},
    {code: '2030', codeNm: '2030'},
])
const months = ref([
    {code: '1', codeNm: '1'},
    {code: '2', codeNm: '2'},
    {code: '3', codeNm: '3'},
    {code: '4', codeNm: '4'},
    {code: '5', codeNm: '5'},
    {code: '6', codeNm: '6'},
    {code: '7', codeNm: '7'},
    {code: '8', codeNm: '8'},
    {code: '9', codeNm: '9'},
    {code: '10', codeNm: '10'},
    {code: '11', codeNm: '11'},
    {code: '12', codeNm: '12'},
])

const selectRowClick = (row) =>{
  console.log(row)
  console.log(row.itemCd)

  dialog.open(DayClosePop, {
    props: {
      header: '월간마감 상세',
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

const pad2 = (value) => {
  return String(value).padStart(2, '0');
};

const setMonthDateRange = () => {
  if (!form.year || !form.month) return;

  const year = Number(form.year);
  const month = Number(form.month);

  form.strDate = `${year}-${pad2(month)}-01`;

  const lastDay = new Date(year, month, 0).getDate();
  form.endDate = `${year}-${pad2(month)}-${pad2(lastDay)}`;
};

watch(() => [form.year, form.month], () => {
    setMonthDateRange();
  },
  { immediate: true }
);

const formatNumber = (value) => {
  return Number(value ?? 0).toLocaleString();
};

const srhList = async () => {
    const params = {
        ...form,
    }

    loading.value = true

    try {
        itemList.value = await ApiProc.getWeighCloseList(params)
        console.log('itemList', itemList.value)
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
  { label: '월간마감' },
  { label: '월간마감목록' },
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
