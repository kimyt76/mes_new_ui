<template>
<div class="mt-4">
  <DataTable
    v-model:first="first"
    :value="itemList"
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
    <Column field="tranTypeName" header="구분"      :style="{ width: '100px', textAlign:'center'}"/>
    <Column field="tranDate"    header="일자"       :style="{ width: '110px', textAlign:'center'}" />
    <Column field="storageName" header="대상창고"   :style="{ width: '150px', textAlign:'center'}" />
    <Column field="testNo"      header="시험번호"   :style="{ width: '100px', textAlign:'center'}" />
    <Column field="qty"         header="수량"       :style="{ width: '100px', textAlign:'right'}" >
      <template #body="slotProps">{{ formatNumber(slotProps.data.qty) }}</template>
    </Column>
    <Column field="makeNo"      header="제조번호"   :style="{ width: '180px', textAlign:'center'}" />
    <Column field="itemName"    header="품목명"     :style="{ width: '400px'}" />
  </DataTable>
</div>

</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { inject, onMounted, ref } from 'vue';

const first = ref(0)
const dialogRef = inject('dialogRef')
const itemList = ref([])

const formatNumber = (value) => {
  return Number(value ?? 0).toLocaleString();
};

onMounted(async () => {
  const params = {
        itemCd: dialogRef.value.data.itemCd,
        strDate: dialogRef.value.data.strDate,
        endDate: dialogRef.value.data.endDate,
    }
  itemList.value = await ApiProc.getItemCloseList(params);
});

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
