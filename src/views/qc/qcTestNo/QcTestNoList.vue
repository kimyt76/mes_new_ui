<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DatePicker v-model="form.strDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <DatePicker v-model="form.toDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
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
                    <InputText id="on_label1" v-model="form.itemCd" style="width: 150px"/>
                    <label for="on_label1">품목코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                    <label for="on_label1">거래처명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.testNo" style="width: 150px" />
                    <label for="on_label1">시험번호</label>
                </FloatLabel>
                <DatePicker v-model="form.shelfDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="바코드" icon="pi pi-barcode"  outlined @click="barcodePrint"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="itemTestNoList"
        dataKey="testNo"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
    >
        <Column selectionMode="multiple" headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="testNo"          header="시험번호"  :style="{ width: '120px', textAlign: 'center' }" />
        <Column field="createDate"      header="입고일"    :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemTypeCd"      header="품목구분"  :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="itemCd"          header="품목코드"  :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="itemName"        header="품목명"    :style="{ width: '350px'}" bodyClass="break-words" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.testNo)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="qty"            header="입고량"   :style="{ width: '100px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="lotNo"           header="로트번호"  :style="{ width: '190px'}" />
        <Column field="expiryDate"      header="사용기한"  :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="customerName"    header="거래처명"  :style="{ width: '250px'}" />
        <Column field="passState"       header="판정상태"  :style="{ width: '90px'}" />
    </DataTable>
</div>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import QcTestNoPop from './QcTestNoPop.vue';

const dt = ref(null);
const { vWarning, vInfo} = useAlertStore()
const dialog = useDialog()
const selectedItem = ref([])
const itemTypeCds = ref([])
const itemTestNoList = ref([])
const form = reactive({
    strDate: '',
    toDate: '',
    itemTypeCd: '',
    itemName: '',
    itemCd: '',
    customerName: '',
    testNo: '',
    shelfDate: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }

    itemTestNoList.value = await ApiQc.getItemTestNoList(params)
}

const selectRowClick = (id) =>{
    dialog.open(QcTestNoPop,{
        props:{
            header:'시험번호 상세',
            modal: true,
            maximizable: false,
            draggable: false,
            // style: {
            //     width: '52vw',          // 🔹 팝업 가로 폭
            //     maxWidth: '800px',
            //     height: '400px',
            //     overflow: 'hidden'
            // },
        },
        data:{
            testNo: id,
        },
        onClose:(event) => {
            srhList();
        },
    })
}

const barcodePrint = () =>{
    if( selectedItem.value.length === 0 ) return vWarning('바코드를 출력할 품목을 선택해주세요.')

    dialog.open(QrCodePop, {
        props:{
            header: 'QR코드 라벨 출력',
            modal: true,
            draggable: true,
            resizable: false,
            style: { width: '80rem', maxWidth: '80rem' },
            contentStyle: { height: '30rem', overflow: 'hidden' },
        },
        data:{
            menuType:'QC',
            itemList : selectedItem.value,
        }
    })
}


const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(itemTestNoList.value, "시험번호별 리스트", cols);
}

onMounted( async () =>{
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')

    form.strDate = todayKST()
    form.toDate = todayKST()
})


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '시험번호내역관리' },
    { label: '시험번호내역' },
    { label: '시험번호내역목록' },
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
