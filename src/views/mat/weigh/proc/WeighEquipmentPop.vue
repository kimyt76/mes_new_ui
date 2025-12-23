<template>
<div>
    <DataTable
        :value="equipmentList"
        scrollable
        showGridlines
        tableStyle="width:100%; table-layout: fixed;"
        class="my-table mt-2"
     >
        <
     </DataTable>
</div>
</template>

<script setup>
import { ApiSystems } from '@/api/apiSystem';
import { onMounted, ref } from 'vue';


const equipmentList = ref([])


onMounted( async () =>{
    let storageCd = ''

    equipmentList.value = ApiSystems.getEquipmentList(storageCd)
})


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
