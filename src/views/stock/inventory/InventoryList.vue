<template>
    <div>

    </div>
</template>

<script setup>




const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '부자재 수불부' },
    { label: '부자재 수불부 목록' },
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
