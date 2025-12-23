<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DatePicker v-model="form.strDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
            <DatePicker v-model="form.toDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                 :options="areaCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
                />
                <label for="on_label1">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemTypeCd"
                 :options="itemTypeCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
            />
            <label for="on_label1">품목구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.passState"
                 :options="passStates"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
            />
            <label for="on_label1">진행상태</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemName" style="width: 180px" />
                <label for="on_label1">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 180px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                <label for="on_label1">거래처명</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick"></Button>
    <Button label="인쇄" icon="pi pi-file-print"  @click="print"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    <Button label="복사하기" icon="pi pi-file-print" severity="secondary" @click="rowCopy"></Button>
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
        tableStyle="min-width: 100rem; table-layout: fixed;"
        selectionMode="single"
        class="my-table"
        >
        <Column selectionMode="multiple" headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="tranDateSeq"    header="일자-No"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"    header="거래처명"  :style="{ width: '190px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"        header="품목명"  frozen  :style="{ width: '350px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="sumQty"  header="수량합계"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.qty).sumQty() }}
            </template>
        </Column>
        <Column field="sumPrice"  header="금액합계"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px'}" style="text-align: right;">
            <template #body="slotProps">
                {{ Number(slotProps.data.sumPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="testNo"          header="입고창고"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="unit"            header="발주구분"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="manaserName"     header="담당자"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { isEmpty, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import PurchaseTranPop from './PurchaseTranPPop.vue';

const dt = ref(null)
const dialog = useDialog()
const purchaseList = ref([])
const itemTypeCds = ref([])
const passState = ref([])
const areaCds  = ref([])

const form  = reactive({
    strDate: todayKST(),
    toDate: todayKST(),
    areaCd: null,
    itemTypeCd: null,
    itemName: '',
    itemCd: '',
    customerName: '',
    testState: null,
    passState: null,
})

const selectRowClick = (id) =>{
    let title = '구매 등록'

    if ( !isEmpty(id)) {
        title = '구매 상세'
    }
    dialog.open( PurchaseTranPop, {
        props: {
            header: title,
            modal: true,
            draggable: false,
            resizable: false,
            style: { width: '92rem', maxWidth: '120rem' },
            contentStyle: { height: '38rem', overflow: 'hidden' },
        },
        data: id,
        onClose: () => {
            srhList();
        }
    });
}

const srhList = () =>{

}

const print = () =>{
    //인쇄로직
}

const rowCopy = () =>{

}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('AREA');
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '구매관리' },
    { label: '구매(구매)' },
    { label: '구매(구매)목록' },
]);


const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(purchaseList.value, "구매 리스트", cols);
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
