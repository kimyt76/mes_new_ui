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
                <label for="on_label">구역</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" />
                <label for="on_label1">납품처명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" />
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.procStatus" :options="procStatuss"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 100px"
                />
                <label for="on_label">포장상태</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="이동요청" severity="secondary"  @click="moveReq"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
         v-model:selection="selectedItem"
        :value="packingList"
        dataKey="workProcId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple" headerStyle="width: 3rem" style="text-align: center;" />
        <Column field="poNo"        header="PO No"    :style="{ width: '110px', textAlign: 'right'}" ></Column>
        <Column field="areaName"    header="구역"       :style="{ width: '80px', textAlign: 'right'}" ></Column>
        <Column field="weighDate"   header="코팅지시일"  :style="{ width: '110px', textAlign: 'right'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.weighId)" class="clickable-cell" style="text-decoration: underline; point">
                    {{ slotProps.data.weighDate }}
                </div>
            </template>
        </Column>
        <Column field="lotNo"       header="LOT번호"  :style="{ width: '150px', textAlign: 'right'}" />
        <Column field="makeNo"       header="제조번호"  :style="{ width: '150px', textAlign: 'right'}" />
        <Column field="itemCd"      header="품목코드"  :style="{ width: '110px', textAlign: 'right'}" />
        <Column field="itemName"    header="품목명"    :style="{ width: '380px', textAlign: 'left'}" bodyClass="break-words"  ></Column>
        <Column field="orderQty"         header="지시수량"   :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="processState" header="배치상태"   :style="{ width: '80px', textAlign: 'right'}" />
        <Column field="moveReqYn"    header="이동요청"   :style="{ width: '80px', textAlign: 'right'}" />
        <Column field="procStatus"   header="포장상태"   :style="{ width: '80px', textAlign: 'right'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const selectedItem = ref([])
const dialog = useDialog()
const dt = ref(null);
const packingList = ref([])
const processStates = ref([])
const areaCds = ref([])

const form = reactive({
  strDate: '',
  endDate: '',
  areaCd: '',
  itemCd: '',
  itemName: '',
  clientName: '',
  procStatus: '',
  processState: '',

  proseccCd : 'PRC005',
})

const selectRowClick = (id) =>{
    // dialog.open(MatRegPop, {
    //     props:{
    //         header: '포장지시 및 기록',
    //         modal: true,
    //         maximizable: false,
    //         draggable: false,
    //         style: {
    //             width: '90vw',          // 🔹 팝업 가로 폭
    //             maxWidth: '1800px',
    //             height: '800px',
    //             overflow: 'hidden'
    //         },
    //         pt: {
    //             root: { style: { overflow: 'hidden' } },
    //             content: { style: { overflow: 'hidden' } }
    //         },
    //     },
    //     data: id,
    //     onClose:(event) => {
    //     },
    // })
}

const moveReq = () =>{
    //selectedItem.value





}


// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    packingList.value = await ApiProc.getPackingList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    procStatus.value = await ApiCommon.getCodeList('PROC_STATUS')
    const want = ["00", "51", "52", "99"];
    procStatus.value = procStatus.value.filter(v => want.includes(v.code));

    form.endDate = todayKST()
    form.strDate = minMonth(form.endDate)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '충전' },
    { label: '충전 작업지시목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(packingList.value, "포장 리스트", cols);
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
