<template>
<div>
    <DataTable
        :value="userList"
        scrollable
        showGridlines
        tableStyle="width:100%; table-layout: fixed;"
        class="my-table mt-2"
     >
        <Column field="no" header="" :style="{ width:'40px', textAlign:'center' }" />
        <Column header="작업자" :pt="{ columnHeaderContent:'justify-center' }">
            <template #body="{ data }">
                <span>{{ data.userName }}</span>
            </template>
        </Column>
        <Column field="etc" header="비고" :style="{ width:'40px', textAlign:'center' }" >
            <template #body="{ data }">
                <span>{{ data.etc }}</span>
            </template>
        </Column>
     </DataTable>
</div>
</template>

<script setup>
import { ref } from 'vue';


const userList = ref([
    {no: 1, userName: '안상규', etc: ''},
    {no: 2, userName: '조태희', etc: ''},
    {no: 3, userName: '윤종민', etc: ''},
    {no: 4, userName: '김종원', etc: ''},
])
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
