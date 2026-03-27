<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DatePicker v-model="form.strDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
            <DatePicker v-model="form.endDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
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
                <Select v-model="form.endYn"
                 :options="endYns"
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
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="인쇄" icon="pi pi-printInfo" outlined @click="printOut"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="purchaseList"
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
        <Column field="purDateSeq"      header="일자-No"  :style="{ width: '100px', textAlign:'center'}" />
        <Column field="customerName"    header="거래처명"  :style="{ width: '190px'}" />
        <Column field="itemName"        header="품목명"  frozen  :style="{ width: '350px'}" bodyClass="break-words" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.purId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="totQty"          header="수량합계"   :style="{ width: '80px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.totQty).toLocaleString() }}</template>
        </Column>
        <Column field="totPrice"        header="금액합계"   :style="{ width: '80px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.totPrice).toLocaleString() }}</template>
        </Column>
        <Column field="storageName"     header="입고창고"  :style="{ width: '100px', textAlign:'center'}" />
        <Column field="orderType"       header="발주구분"  :style="{ width: '80px', textAlign:'center'}" />
        <Column field="managerName"     header="담당자"    :style="{ width: '80px', textAlign:'center'}" />
    </DataTable>
</div>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiPurchase } from '@/api/apiPurchase';
import { useAlertStore } from '@/stores/alert';
import { addMonth, isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import PurchaseTranDetailPop from './PurchaseTranDetailPop.vue';
import PurchaseTranPop from './PurchaseTranPop.vue';

const { vSuccess} = useAlertStore()
const dt = ref(null)
const dialog = useDialog()
const selectedItem = ref([])
const purchaseList = ref([])
const itemTypeCds = ref([])
const endYns = ref([
    { code: 'N', codeNm: '진행중' },
    { code: 'Y', codeNm: '완료' },
])
const areaCds  = ref([])

const form  = reactive({
    strDate: minMonth(todayKST(), 2),
    endDate: addMonth(todayKST(), 1),
    areaCd: null,
    itemName: '',
    itemCd: '',
    customerName: '',
    endYns: null,
})

const selectRowClick = (id) =>{
    let title = ''
    let component = ''

    if ( !isEmpty(id)) {
        title = '구매 상세'
        component = PurchaseTranDetailPop
    }else{
        title = '구매 등록'
        component = PurchaseTranPop
    }

    dialog.open( component, {
        props: {
            header: title,
            modal: true,
            draggable: true,
            resizable: false,
            style: { width: '120rem', maxWidth: '120rem' },
            contentStyle: { height: '38rem', overflow: 'hidden' },
        },
        data: {
            id: id,
        },
        onClose: (event) => {
            const closeData = event?.data

            if (closeData?.purId) {
                selectRowClick(closeData.purId)

                setTimeout(() => {
                    if (closeData?.message) vSuccess(closeData.message)
                }, 0)

                return
            }

            srhList()
        }
    });
}

const srhList = async() =>{
    const params = {
        ...form
    }

    purchaseList.value = await ApiPurchase.getPurchaseList(params)
}

const printOut = async () =>{
    const params = {
        ...form
    }

    // PDF 새창(미리보기) + 인쇄 다이얼로그
    const win = window.open("", "_blank"); // 먼저 열어두고
    const pdfBlob = await ApiPurchase.printOut(params);
    const url = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    win.location.href = url;
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
    { label: '구매' },
    { label: '구매목록' },
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
