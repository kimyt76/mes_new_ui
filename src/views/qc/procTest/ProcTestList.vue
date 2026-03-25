<template>
<Breadcrumb :home="home" :model="items"/>
</template>

<script setup>
import { ref } from 'vue';


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '공정검사' },
    { label: '공정검사목록' },
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
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}
</style>
