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
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.managerName" style="width: 120px" />
                <label for="on_label1">담당자명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.statusType" :options="statusTypes"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 90px"
                />
                <label for="on_label">진행상태</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.orderType" :options="orderTypes"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 90px"
                />
                <label for="on_label">수주유형</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.vatType" :options="vatTypes"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 90px"
                />
                <label for="on_label">거래유형</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="contractList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column field="contractDateSeq" header="일자-No"  frozen :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="poNo"            header="PO No"   frozen :style="{ width: '130px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="itemCd"          header="품목코드" frozen :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"        header="품목명"   frozen :style="{ width: '380px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.contractId)" class="clickable-cell" style="text-decoration: underline; point">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="expectedDueDate" header="납기예정일자"  :style="{ width: '110px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="clientName"      header="고객사명"  :style="{ width: '250px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="managerName"     header="담당자명"  :style="{ width: '90px', textAlign: 'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="orderType"       header="수주유형"  :style="{ width: '70px', textAlign: 'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="qty"             header="수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="unitPrice"       header="단가"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.unitPrice).toLocaleString() }}</template>
        </Column>
        <Column field="supplyPrice" header="공급가액"   :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '120px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.supplyPrice).toLocaleString() }}</template>
        </Column>
        <Column field="prodType"         header="제품유형"   :style="{ width: '100px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="statusType"       header="진행상태"   :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="paymentCondition" header="결재조건" :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, shallowRef } from 'vue';
import ContractDetailPop from './ContractDetailPop.vue';
import ContractReg from './ContractReg.vue';

const dialog = useDialog()
const dt = ref(null);
const contractList = ref([])
const statusTypes = ref([])
const vatTypes = ref([])
const orderTypes = ref([])
const currentComponent = shallowRef(null)

const form = reactive({
  strDate: '',
  toDate: '',
  itemCd: '',
  itemName: '',
  managerName: '',
  customerName: '',
  orderType: '',
  vatType: '',
  statusType: '',
})

const selectRowClick = (id) =>{
    let title=''
    if (isEmpty(id) ){
        title = '주문서 등록'
        currentComponent.value = ContractReg
    }else{
        title = '주문서 상세'
        currentComponent.value = ContractDetailPop
    }

    dialog.open(currentComponent, {
        props:{
            header: title,
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                width: '90vw',          // 🔹 팝업 가로 폭
                maxWidth: '1800px',
                height: '800px',
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: id,
        onClose:(event) => {
            srhList()
        },
    })
}

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    contractList.value = await ApiOrder.getContractList(params);
}

const handlerSelected = () =>{
    srhList()
}

onMounted( async () => {
    statusTypes.value = await ApiCommon.getCodeList('status_type')
    orderTypes.value = await ApiCommon.getCodeList('order_type')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')

    form.toDate = todayKST()
    form.strDate = minMonth(form.toDate)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '주문서관리' },
    { label: '주문서목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(contractList.value, "주문서 리스트", cols);
}


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
