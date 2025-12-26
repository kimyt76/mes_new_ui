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
                <Select v-model="form.process" :options="processs"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">관리구분</label>
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
        :value="itemUseList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full table-layout: fixed;"
        class="my-table"
        >
        <Column field="rowNum"      header="No."        :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemGrp1"    header="관리구분"   :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="chingDate"   header="칭량일자"   :style="{ width: '120px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="제조번호"   :style="{ width: '150px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"    header="품목명"     :style="{ width: '300px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="inPrice"     header="생산량"     :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="unit"        header="단위"       frozen :style="{ width: '60px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="품목코드"   frozen :style="{ width: '120px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"    header="품목명"     frozen :style="{ width: '300px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="spec"        header="규격"       frozen :style="{ width: '100px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="outQty"      header="소요량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { addMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const itemGrp1s = ref([])
const form = reactive({
    strDate: '',
    toDate: '',
    itemGrp1: '',
    itemTypeCd : '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST(),
})
const itemUseList = ref([])
const processs = ref([
    { code: 'ALL', codeNm: '전체' },
    { code: 'PRC001', codeNm: '칭량/제조' },
    { code: 'PRC003', codeNm: '코팅' },
    { code: 'PRC004', codeNm: '충전' },
    { code: 'PRC005', codeNm: '포장' }
])
// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    //itemUseList.value = await ApiStock.getStockList(params);
}

onMounted( async () => {
    itemGrp1s.value = await ApiCommon.getCodeList('item_grp1')

    form.toDate = todayKST()
    form.strDate = addMonth(form.toDate, -3)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '품목별사용량' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(itemUseList.value, "품목별사용량 리스트", cols);
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
