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
                <Select v-model="form.procStatus"
                   :options="procStatuss"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 100px"
                />
                <label for="on_label">코팅상태</label>
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
        :value="coatingList"
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
        <Column field="poNo"            header="PO No"    :style="{ width: '130px', textAlign: 'center'}" ></Column>
        <Column field="areaName"        header="구역"       :style="{ width: '80px', textAlign: 'right'}" ></Column>
        <Column field="procOrderDate"   header="코팅지시일"  :style="{ width: '100px', textAlign: 'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workProcId, slotProps.data.itemCd)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.procOrderDate }}
                </div>
            </template>
        </Column>
        <Column field="lotNo"       header="LOT번호"  :style="{ width: '180px', textAlign: 'center'}" />
        <Column field="makeNo"       header="제조번호"  :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="itemCd"      header="품목코드"  :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"    :style="{ width: '440px'}" bodyClass="break-words"  ></Column>
        <Column field="orderQty"         header="지시수량"   :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="batchStatusName"  header="배치상태"   :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="moveReqYn"    header="이동요청"   :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="procStatusName"   header="코팅상태"   :style="{ width: '80px', textAlign: 'center'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import MoveReqPop from '../../common/MoveReqPop.vue';
import CoatingPop from './CoatingPop.vue';


const { vInfo, vWarning} = useAlertStore()
const selectedItem = ref([])
const dialog = useDialog()
const dt = ref(null);
const coatingList = ref([])
const procStatuss = ref([])
const batchStatus = ref([])
const areaCds = ref([])

const form = reactive({
  strDate: minMonth(todayKST(), 2),
  endDate: todayKST(),
  areaCd: '',
  itemCd: '',
  itemName: '',
  clientName: '',
  processState: '',

  procCd : 'PRC003',
})

const handleDateChange = () =>{

}

const selectRowClick = (id, cd) =>{
    dialog.open(CoatingPop, {
        props:{
            header: '코팅지시 및 기록',
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                width: '88vw',
                maxWidth: '1600px',
                height: '90vh'
            },
            contentStyle: {
                overflow: 'hidden',
                padding: '0'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data:{
            workProcId: id,
            procCd: form.procCd,
            itemCd: cd,
        },
        onClose:(event) => {
            srhList()
        },
    })
}

const moveReq = () =>{
    //selectedItem.value
    if ( !selectedItem.value.length ) {
        vWarning("이동 요청할 항목을 선택해주세요.");
        return;
    }

    dialog.open(MoveReqPop, {
        props:{
            header: '이동 요청',
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'auto' } }
            },
        },
        data: selectedItem.value,
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
    coatingList.value = await ApiProc.getCoatingList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    procStatuss.value = await ApiCommon.getCodeList('PROC_STATUS')
    const want = ["00", "31", "32", "99"];
    procStatuss.value = procStatuss.value.filter(v => want.includes(v.code));
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '코팅' },
    { label: '코팅 작업지시 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(coatingList.value, "코팅 리스트", cols);
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
