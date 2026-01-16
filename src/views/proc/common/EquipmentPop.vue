<template>
<div>
    <DataTable
        :value="equipmentList"
        dataKey="equipmentId"
        scrollable
        showGridlines
        class="my-table mt-2"
        @row-click="onRowClick"
     >
        <column field="equipmentCd" header="설비코드" style="width: 150px; text-align: center;"></column>
        <column field="equipmentName" header="설비명" style="width: 150px; text-align: center;"></column>
        <column field="etc" header="비고" style="width: 150px; text-align: center;"></column>
     </DataTable>
</div>
<div class="flex justify-end gap-1 mt-3">
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
  </div>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef');
const equipmentList = ref([])

onMounted( async () =>{
    const res = await ApiMat.getEquipmentList(dialogRef.value.data)
    equipmentList.value = res.data
})

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
