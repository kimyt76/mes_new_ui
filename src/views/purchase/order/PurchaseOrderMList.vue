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
                <DatePicker v-model="form.endDate" inputId="on_label" showIcon iconDisplay="input" />
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
                <Select v-model="form.inYn" :options="inYns"
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
    <Button label="인쇄" icon="pi pi-print"  outlined @click="printOut"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="purchaseOrderList"
        dataKey="purOrderItemId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="min-width:120rem; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple"    headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="purOrderDateSeq"     header="일자"   frozen :style="{ width: '130px', textAlign:'center'}" />
        <Column field="purOrderDate"        header="발주일"  frozen :style="{ width: '120px', textAlign:'center'}" />
        <Column field="deliveryDate"        header="납기일"     :style="{ width: '120px', textAlign:'center'}" />
        <Column field="customerName"        header="거래처명"  :style="{ width: '280px'}" />
        <Column field="itemCd"              header="품목코드"  :style="{ width: '120px', textAlign:'center'}" />
        <Column field="itemName"            header="품목명"    :style="{ width: '350px'}" bodyClass="break-words">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.purOrderItemId, slotProps.data.purOrderId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="storageName"  header="입고창고"  :style="{ width: '140px', textAlign:'center'}" />
        <Column field="qty"          header="발주수량"   :style="{ width: '90px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="inQty"       header="입고수량"    :style="{ width: '90px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.inQty).toLocaleString() }}</template>
        </Column>
        <Column field="supplyPrice" header="공급가액"    :style="{ width: '90px', textAlign:'center'}">
            <template #body="slotProps">{{ Number(slotProps.data.supplyPrice).toLocaleString() }}</template>
        </Column>
        <Column field="inYn"        header="입고상태"   :style="{ width: '90px', textAlign:'center'}" />
        <Column field="endYn"       header="진행상태"   :style="{ width: '90px', textAlign:'center'}" />
        <Column field="mailYn"      header="발주서발송" :style="{ width: '100px', textAlign:'center'}" />
        <Column field="managerName" header="담당자"     :style="{ width: '90px', textAlign:'center'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiPurchaseOrder } from '@/api/apiPurchaseOrder';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import PurchaseOrderDetailPop from './PurchaseOrderDetailPop.vue';
import PurchaseOrderPop from './PurchaseOrderPop.vue';

const totalCount = computed(() => {
  return Array.isArray(purchaseOrderList.value) ? purchaseOrderList.value.length : 0
})
const selectedItem = ref();
const purchaseOrderList = ref([])
const dialog = useDialog()
const dt = ref(null);
const areaCds = ref([])
const itemTypeCds = ref([])
const inYns = ref([
    { codeNm: '미입고', code: 'N' },
    { codeNm: '입고', code: 'Y' },
])
const endYns = ref([
    { codeNm: '진행중', code: 'N' },
    { codeNm: '종결', code: 'Y' },
])
const form = reactive({
    strDate: '',
    endDate: '',
    itemTypeCd: 'M1',
    itemCd: '',
    itemName: '',
    customerName: '',
    customerCd: '',
    inYn: '',
    endYn: '',
})

const selectRowClick = (id, purOrderId) =>{
    let title = ''
    let component = ''

    if (!isEmpty(id) ){
        title = '발주서 상세'
        component = PurchaseOrderDetailPop
    }else{
        title = '발주서 등록'
        component = PurchaseOrderPop
    }

    dialog.open(component, {
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
        data: {
            purOrderItemId : id,
            purOrderId : purOrderId,
            itemTypeCd : form.itemTypeCd
        },
        onClose:(event) => {
            srhList()
        },
    })
}

const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    purchaseOrderList.value = await ApiPurchaseOrder.getPurchaseOrderList(params);
}

const printOut = async () => {
    const purOrderIds = [
        ...new Set(
        (selectedItem.value?.length
        ? selectedItem.value
        : purchaseOrderList.value
        ).map(r => r.purOrderId)
    )
    ];
    const params = {
        purOrderIds,
        itemTypeCd : form.itemTypeCd
    }

    // PDF 새창(미리보기) + 인쇄 다이얼로그
    const win = window.open("", "_blank"); // 먼저 열어두고
    const pdfBlob = await ApiPurchaseOrder.printOut(params);
    const url = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    win.location.href = url;

    srhList()
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('AREA');
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');

    form.endDate = todayKST()
    form.strDate = minMonth(form.endDate)
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
    return;
  }
  exportToExcel(purchaseOrderList.value, "발주 리스트", cols);
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
