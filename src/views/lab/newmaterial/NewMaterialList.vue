<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.materialName" style="width: 150px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.regName" style="width: 250px" />
                <label for="on_label1">등록자</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success"  @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        paginator :rows="20"
        :value="newMaterialList"
        dataKey="itemCd"
        :rowsPerPageOptions="[20,30,40]"
        scrollable
        scrollHeight="650px"
        showGridlines
        class="my-table"
        >
        <Column field="rowNum"          header="No."  style="width: 20px; text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="newMaterialCd"   header="임시코드"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="materialName"    header="품목명"    :style="{ width: '400px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div
                    style="cursor: pointer; text-decoration: underline;"
                    @click="selectRowClick(slotProps.data.newMaterialCd)" class="clickable-cell">
                    {{ slotProps.data.materialName }}
                </div>
            </template>
        </Column>
        <Column field="customerName"    header="등록자"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCompany"     header="등록일"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"          header="품목코드"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import NewMaterialDetailPop from './NewMaterialDetailPop.vue';

const dialog = useDialog()
const newMaterialList = ref([])

const dt = ref(null)
const form = reactive({
    materialName : '',
    regName: '',
})

const srhList = async () =>{
    const params = {
    ...form
  }

  newMaterialList.value = await ApiLab.getNewMaterialList(params)
}

const selectRowClick = (id) => {
    let title = '신원료 등록'

    if ( !isEmpty(id) ) {
        title = '신원료 상세'
    }

    dialog.open(NewMaterialDetailPop, {
        props: {
        header: title,
        modal: true,
        maximizable: false,
        draggable: true,
        style: {
            width: '112rem',
            height: '60rem' ,
            overflow: 'hidden'
            },
        pt: {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } }
        }
        // 반응형 너비 설정 (선택 사항)
        //   breakpoints:{
        //     '960px':'75vw',
        //     '640px':'90vw'
        //   }
        },
        // 팝업 A로 전달할 데이터 (선택 사항)
        data: id,
        onClose: async (data) => {
        // 팝업이 닫힐 때 실행할 작업 (선택 사항)
        await srhList()
    }

  })
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '신원료관리' },
    { label: '신원료목록' },
]);

onMounted( async () => {
  //const page = store.getPage(routeName)

  //if (!isEmpty(page.searchParams)) {
  //  Object.assign(form, page.searchParams)
  //  srhList()
  //}
})


const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(newMaterialList.value, "신원료 리스트", cols);
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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8.5px 7px 0.3rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

</style>
