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
                <Select v-model="form.areaCd" :options="areaCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">품목구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                <label for="on_label1">거래처명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.regYn" :options="regYns"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 90px"
                />
                <label for="on_label">입고상태</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.endYn" :options="endYns"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 90px"
                />
                <label for="on_label">진행상태</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    <Button label="복사" icon="pi pi-file-excel"  @click="copyRow"></Button>
    <Button label="인쇄" icon="pi pi-file-excel"  @click="print"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        selectionMode="single"
        tableStyle="min-width:120rem; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple"    headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="orderDateSeq"        header="일자"  frozen :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="orderDate"           header="발주일"  frozen :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="deliveryDate"        header="납기일"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"        header="거래처명"  :style="{ width: '250px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"              header="품목코드"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"            header="품목명"    :style="{ width: '400px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="srcStorageName"  header="입고창고"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="orderQty"        header="발주수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="inQty"       header="입고수량"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.inQty).toLocaleString() }}</template>
        </Column>
        <Column field="supplyPrice" header="공급가액"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '90px'}" style="text-align: right;">
            <template #body="slotProps">{{ Number(slotProps.data.supplyPrice).toLocaleString() }}</template>
        </Column>
        <Column field="regYn"       header="입고상태"   :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="endYn"       header="진행상태"   :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="mailYn"      header="발주서발송" :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="managerName" header="담당자"     :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>
<!--
<Dialog
    v-model:visible="matOrderDialog"
    header="발주서정보"
    modal
    :draggable="false"
    :resizable="false"
    :style="{ width: '92rem', maxWidth: '120rem' }"
    :contentStyle="{ height: '38rem', overflow: 'hidden' }"
    >
    <MatOrderPop
        :id="matOrderId"
        @selected = "handlerSelected"
        @close="dialogClose"
    />

</Dialog> -->

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import PurchaseOrderPop from './PurchaseOrderMPop.vue';

const matOrderDialog = ref(false)
const dialog = useDialog()
const dt = ref(null);
const areaCds = ref([])
const itemTypeCds = ref([])
const regYns = ref([
    { codeNm: '미입고', code: 'N' },
    { codeNm: '입고', code: 'Y' },
])
const endYns = ref([
    { codeNm: '진행중', code: 'N' },
    { codeNm: '종결', code: 'Y' },
])

const form = reactive({
    strDate: '',
    toDate: '',
    itemTypeCd: '',
    itemCd: '',
    itemName: '',
    customerName: '',
    customerCd: '',
    regYn: '',
    endYn: '',
    selectedCity: '',
})

// 리스트에서 체크박스,  radio 있을 경우
const selectedProducts = ref();
//  select 가 있을 경우
const cities = ref([])
//리스트
const matOrderlist = ref([])

let matOrderId = ''
const selectRowClick = (id) =>{
    let title = '발주서 등록'

    if (!isEmpty(id) ){
        title = '발주서 상세'
    }

    dialog.open(PurchaseOrderPop, {
        props:{
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: id,
        onClose:(event) => {

        },
    })
}

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    list.value = await ApiCommon.getCodeList(params);
}

const print = () => {

}

const copyRow = () =>{

}

const handlerSelected = () =>{
    srhList()
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('AREA');
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');

    form.toDate = todayKST()
    form.strDate = minMonth(form.toDate)

})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '발주관리' },
    { label: '발주목록(생산)' },
    { label: '발주목록(생산)목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(matOrderlist.value, "발주 리스트", cols);
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
