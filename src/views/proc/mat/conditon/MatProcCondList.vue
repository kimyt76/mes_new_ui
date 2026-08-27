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
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>

<div>
    <DataTable
        :value="matList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column field="poNo"        header="PO No"    :style="{ width: '120px', textAlign: 'center'}" ></Column>
        <Column field="areaName"    header="공장"      :style="{ width: '80px', textAlign: 'center'}" ></Column>
        <Column field="prodDate"    header="제조일자"  :style="{ width: '110px', textAlign: 'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.prodDate }}
                </div>
            </template>
        </Column>
        <Column field="itemCd"      header="품목코드"  :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"    :style="{ width: '400px'}" bodyClass="break-words"  ></Column>
        <Column field="orderQty"    header="제조량"   :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="clientName"  header="납품처명"  :style="{ width: '220px'}" />
        <Column field="equipmentCd"      header="제조설비"  :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="procStatusName"   header="제조상태"   :style="{ width: '80px', textAlign: 'center'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import { minMonth, todayKST } from '@/util/common';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import MatCondPop from './MatCondPop.vue';

const dialog = useDialog()
const areaCds = ref([])
const matList = ref([])
const form = reactive({
    strDate: minMonth(todayKST(), 6),
    endDate: todayKST(),
    areaCd: '',
    itemCd: '',
    itemName: '',
    clientName : '',

    procCd: 'PRC002'
})

const selectRowClick = (row) =>{
    dialog.open(MatCondPop, {
        props:{
            header: '공정조건 상세',
            modal: true,
            draggable: true,
            style: {
                width: '85vw',          // 🔹 팝업 가로 폭
                maxWidth: '1400px',
                height: '500px',
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: {
            row: row,
        },
        onClose:(event) => {
            if(event){
                srhList()
            }
        },
    })
}


const handleDateChange = () =>{}

const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    matList.value = await ApiProc.getMatProcCondList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '제조공정' },
    { label: '공정조건(온도RPM)' },
    { label: '공정조건(온도RPM) 목록' },
]);

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
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  /* text-decoration: underline;
  cursor: pointer; */
}

</style>
