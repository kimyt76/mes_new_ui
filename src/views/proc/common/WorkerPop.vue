<template>
<div class="mt-4">
    <DataTable
        v-model:selection="selectItem"
        :value="workerList"
        dataKey="workerId"
        class="my-table"
        showGridlines
        @row-click="onRowClick"
    >
    <Column field="workerName" header="작업자명" style="width: 100px; text-align: center;"></Column>
    <Column field="etc" header="비고" style="width: 100px;"></Column>
    </DataTable>
</div>
  <div class="flex justify-end gap-1 mt-3">
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
  </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef');
const selectItem = ref(null)
const workerList = ref([])

onMounted( async () => {
  console.log('dialogRef.value.data.form', dialogRef.value.data.form)
    let procCd = dialogRef.value?.data?.form?.procCd
    console.log('procCd', procCd)
  const res = await ApiProc.getWorkerList(procCd)
  workerList.value = res.data
});

const onRowClick = (event) => {
  dialogRef.value.close(event.data);
};

const closeDialog = () => {
  dialogRef.value.close();
};
</script>
<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}
</style>
