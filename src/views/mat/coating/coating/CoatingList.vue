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
                <Select v-model="form.areaCd" :options="areaCds"
                   optionLabel="codeNm"
                   optionValue="code"
                   style="width: 120px"
                />
                <label for="on_label">구역</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.matNo" />
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
                <Select v-model="form.processState" :options="processStates"
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
    <Button label="이동요청" icon="pi pi-file-excel"  @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="coatingList"
        dataKey="coatingId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="areaName"    header="구역"       :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="weighDate"   header="코팅지시일"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.coatingId)" class="clickable-cell" style="text-decoration: underline; point">
                    {{ slotProps.data.weighDate }}
                </div>
            </template>
        </Column>
        <Column field="poNo"        header="PO No"    :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="matNo"       header="제조번호"  :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="logNo"       header="LOT번호"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"      header="품목코드"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"    header="품목명"    :style="{ width: '380px', textAlign: 'left'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="qty"         header="지시수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="processState" header="배치상태"   :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="processState" header="제조상태"   :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="moveStatse"   header="이동요청"   :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, shallowRef } from 'vue';

const dialog = useDialog()
const dt = ref(null);
const coatingList = ref([])
const processStates = ref([])
const areaCds = ref([])
const currentComponent = shallowRef(null)

const form = reactive({
  strDate: '',
  toDate: '',
  areaCd: '',
  matNo: '',
  itemCd: '',
  itemName: '',
  processState: '',
})

const selectRowClick = (id) =>{
    let title = ''
    let currentComponent = ''
    if ( isEmpty(id) ) {
        title = '코팅 자재이동 요청'
        currentComponent = ''
    }else{
        title = '코팅지시 및 기록서'
        currentComponent = ''
    }

    dialog.open(WeighRegPop, {
        props:{
            header:  title ,
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
    coatingList.value = await ApiMat.getCoatingList(params);
}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    processStates.value = await ApiCommon.getCodeList('process_state')

    form.toDate = todayKST()
    form.strDate = minMonth(form.toDate)
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '제조' },
    { label: '제조목록' },
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
