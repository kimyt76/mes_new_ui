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
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="mt-2">
    <DataTable
        :value="workOrderList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="table-layout: fixed;"
        class="my-table"
        >
        <Column field="areaName"    header="구역"       :style="{ width: '80px'}" ></Column>
        <Column field="weighDate"   header="칭량지시일"  :style="{ width: '110px'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.weighId)" class="clickable-cell" style="text-decoration: underline; point">
                    {{ slotProps.data.weighDate }}
                </div>
            </template>
        </Column>
        <Column field="poNo"        header="PO NO"    :style="{ width: '110px'}" ></Column>
        <Column field="makeNo"      header="제조번호"  :style="{ width: '150px'}" />
        <Column field="logNo"       header="LOT번호"  :style="{ width: '200px'}" />
        <Column field="itemCd"      header="품목코드"  :style="{ width: '110px'}" />
        <Column field="itemName"    header="품목명"    :style="{ width: '380px', textAlign: 'left'}" bodyClass="break-words"  ></Column>
        <Column field="qty"         header="지시수량"   :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="batchStatusName" header="배치상태"   :style="{ width: '80px'}" />
        <Column field="procTest"    header="공정검사"   :style="{ width: '80px'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { minMonth, todayKST } from '@/util/common';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import WeighProcTestPop from './WeighProcTestPop.vue';

const dialog = useDialog()
const matList = ref([])
const processStates = ref([])
const areaCds = ref([])
const form = reactive({
  strDate: minMonth(todayKST(), 10),
  endDate: todayKST(),
  areaCd: '',
  makeNo: '',
  itemCd: '',
  itemName: '',
})

const handleDateChange = () =>{
}


const selectRowClick = (id) =>{
    dialog.open(WeighProcTestPop, {
        props:{
            header: '공정검사(칭량)',
            modal: true,
            closeOnEscape: false,
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
        },
    })
}

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    matList.value = await ApiMat.getMatList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    processStates.value = await ApiCommon.getCodeList('process_state')
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '칭량관리' },
    { label: '공정검사' },
    { label: '공정검사 목록' },
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

</style>
