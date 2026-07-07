<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DateRangePicker
                v-model:startDate="form.strDate"
                v-model:endDate="form.endDate"
                @change="handleDateChange"
            />
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
        class="my-table"
        >
        <Column field="testNo"        header="시험번호"         :style="{ width: '110px', textAlign: 'center' }" />
        <Column field="itemCdM1"      header="품목코드(원료)"   :style="{ width: '110px', textAlign: 'center' }" />
        <Column field="itemNameM1"    header="품목명(원료)"     :style="{ width: '350px'}" />
        <Column field="itemCdM0"      header="사용품목코드"     :style="{ width: '110px', textAlign: 'center' }" />
        <Column field="itemNameM0"    header="사용품목명"       :style="{ width: '350px'}" />
        <Column field="procOrderDate" header="사용일자"         :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="lotNo"         header="Lot No."          :style="{ width: '150px'}" />
        <Column field="qty"           header="사용량"           :style="{ width: '90px'}" >
            <template #body="slotProps">
                {{ Number(slotProps.data.qty || 0).toLocaleString() }}
            </template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiStock } from '@/api/apiStock';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    itemName: '',
    itemCd: '',
    testNo: '',
})
const testUseList = ref([])
const handleDateChange = () =>{

}
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    testUseList.value = await ApiStock.getTestUseList(params);
}

onMounted( async () => {

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
