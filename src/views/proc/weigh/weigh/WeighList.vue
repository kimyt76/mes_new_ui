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
                <InputText id="on_label1" v-model="form.makeNo" />
                <label for="on_label1">제조번호</label>
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
                <label for="on_label">칭량상태</label>
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
        :value="weighList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column field="areaCd"          header="구역"       :style="{ width: '70px', textAlign: 'center'}" ></Column>
        <Column field="procOrderDate"   header="칭량지시일"  :style="{ width: '90px', textAlign: 'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workProcId, slotProps.data.itemCd, slotProps.data.procStatus)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.procOrderDate  }}
                </div>
            </template>
        </Column>
        <Column field="poNo"        header="PO No"    :style="{ width: '110px', textAlign: 'center'}" ></Column>
        <Column field="makeNo"      header="제조번호"  :style="{ width: '160px', textAlign: 'center'}" />
        <Column field="lotNo"       header="LOT번호"  :style="{ width: '200px', textAlign: 'center'}" />
        <Column field="itemCd"      header="품목코드"  :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"    :style="{ width: '430px', textAlign: 'left'}" bodyClass="break-words"  ></Column>
        <Column field="orderQty"    header="지시수량"   :style="{ width: '90px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="procStatus"  header="배치상태"   :style="{ width: '80px', textAlign: 'center'}" >

        </Column>
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
import WeighRegPop from './WeighRegPop.vue';

const dialog = useDialog()
const dt = ref(null);
const weighList = ref([])
const procStatuss = ref([])
const areaCds = ref([])

const form = reactive({
  strDate: '',
  endDate: '',
  areaCd: '',
  makeNo: '',
  itemCd: '',
  itemName: '',
  procStatus: '',
  processState: '',

})

const selectRowClick = (id, itemCd, procStatus) =>{
    dialog.open(WeighRegPop, {
        props:{
            header: '칭량지시 및 기록서',
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                width: '90vw',          // 🔹 팝업 가로 폭
                maxWidth: '1800px',
                height: '850px',
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: {
            workProcId: id,
            itemCd : itemCd,
            procStatus: procStatus,
        },
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
    weighList.value = await ApiProc.getWeighList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    procStatuss.value = await ApiCommon.getCodeList('PROC_STATUS')
    const want = ["00", "11", "12", "99"];
    procStatuss.value = procStatuss.value.filter(v => want.includes(v.code));

    form.strDate = minMonth(todayKST(), 3)
    form.endDate = todayKST()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '칭량' },
    { label: '칭량목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(weighList.value, "칭량 리스트", cols);
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
