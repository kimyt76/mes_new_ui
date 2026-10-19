<template>
<div class="mt-4">
    <DataTable
        v-model:selection="selectItem"
        :value="weightList"
        dataKey="bagWeightId"
        class="my-table"
        showGridlines
        @row-click="onRowClick"
    >
    <Column field="bagWeightName" header="칭량용기명" style="width: 100px; text-align: center;"></Column>
    <Column field="weight" header="무게" style="width: 100px;"></Column>
    </DataTable>
</div>
  <div class="flex justify-end gap-1 mt-3">
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
  </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { inject, onMounted, ref } from 'vue';

const {vSuccess, vWarning} = useAlertStore()
const dialogRef = inject('dialogRef');
const selectItem = ref(null)
const weightList = ref([])
const workProcId = ref(null)
const weighId = ref(null)

onMounted( async () => {
  const res = await ApiProc.getBagWeightList()
  weightList.value = res.data
  workProcId.value = dialogRef.value.data.row.workProcId
  weighId.value = dialogRef.value.data.row.weighId
});

const onRowClick = async (event) => {

    if (isEmpty(weighId.value) )  return vWarning('품목값이 없습니다. 관리자에게 문의하세요!!')
    const params ={
        workProcId: workProcId.value,
        weighId: weighId.value,
        bagWeight: event.data.weight
    }

    const res = ApiProc.updateBagWeigh(params)
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
