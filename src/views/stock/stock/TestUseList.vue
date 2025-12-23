<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <DatePicker v-model="form.strDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">시작</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="form.toDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 200px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.testNo" style="width: 150px" />
                <label for="on_label1">시험번호</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="testUseList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width:180rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="testNo"      header="시험번호"  frozen :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="품목코드"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"    header="품목명"    frozen :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="itemCd"      header="사용품목코드"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="사용품목명"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="useDate"     header="사용일자"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="lotNo"       header="LOt No."  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="사용량"  frozen :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { addMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const form = reactive({
    strDate: '',
    toDate: '',
    itemName: '',
    itemCd: '',
    testNo: '',
})
const testUseList = ref([])
// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    //testUseList.value = await ApiStock.getTestUseList(params);
}

onMounted( async () => {
    form.toDate = todayKST()
    form.strDate = addMonth(form.toDate, -3)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '시험번호별사용현황' },
    { label: '시험번호별사용현황 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(testUseList.value, "시험번호별 리스트", cols);
}


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
