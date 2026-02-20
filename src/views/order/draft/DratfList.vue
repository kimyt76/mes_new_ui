<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.draftNaem" style="width: 120px" />
                <label for="on_label1">기안자</label>
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
        :value="draftList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column field="draftDateSeq"    header="문서번호"  frozen :style="{ width: '140px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="itemName"        header="품목명"   frozen :style="{ width: '350px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.draftId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="clientName"      header="고객사명"  :style="{ width: '250px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="draftDate"       header="기안일자"  :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="draftUserName"   header="기안자"     :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="statusType"      header="진행상태"   :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                    {{ slotProps.data.statusType === 'ING' ? '진행중' : '완료' }}
            </template>
        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, shallowRef } from 'vue';
import DraftDetail from './DraftDetail.vue';
import DraftReg from './DraftReg.vue';

const dialog = useDialog()
const dt = ref(null);
const draftList = ref([])
const statusTypes = ref([])
const currentComponent = shallowRef(null)

const form = reactive({
  itemName: '',
  draftNaem: '',
  clientName: '',
  statusType: '',
})

const selectRowClick = (id) =>{
    let title=''
    if (isEmpty(id) ){
        title = '사양서 등록'
        currentComponent.value = DraftReg
    }else{
        title = '사양서 상세'
        currentComponent.value = DraftDetail
    }

    dialog.open(currentComponent, {
        props:{
            header: title,
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
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
    draftList.value = await ApiOrder.getDraftList(params);
}

const handlerSelected = () =>{
    srhList()
}

onMounted( async () => {
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '사양서관리' },
    { label: '사양서목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(draftList.value, "사양서 리스트", cols);
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
