<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText  v-model="form.comTypeCd" style="width: 150px"/>
                <label for="on_label">코드구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText v-model="form.codeNm" style="width: 180px" />
                <label for="jobPosition">코드명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.useYn"
                 :options="useYns"
                 optionLabel="codeNm" optionValue="code"
                 style="width: 150px"
                />
                <label for="on_label1">사용여부</label>
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
        :value="commonList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="comTypeCd"    header="코드구분"  style="text-align: center;"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.comId)" class="clickable-cell">
                    {{ slotProps.data.comTypeCd }}
                </div>
            </template>
        </Column>
        <Column field="comTypeNm"  header="구분명"  style="text-align: center;"    :style="{ width: '130px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.comId)" class="clickable-cell">
                    {{ slotProps.data.comTypeNm }}
                </div>
            </template>
        </Column>
        <Column field="code"    header="코드" style="text-align: center;"  :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="codeNm"    header="코드명" style="text-align: center;"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="useYn"    header="사용여부" style="text-align: center;"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="descrition"    header="비고" style="text-align: left;"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import CommonDetailPop from './CommonDetailPop.vue';

const dialog = useDialog()
const dt = ref(null);
const commonList = ref([])
const form = reactive({
    comTypeCd: '',
    codeNm: '',
    useYn: ''
})

const useYns = ref([])
// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    commonList.value = await ApiCommon.getCommonList(params);
}

onMounted( async () =>{
    useYns.value = await ApiCommon.getCodeList('USE_YN')
} )

const selectRowClick = (id) =>{
     let title = '공통코드 등록'

    if (!isEmpty(id)) {
        title = '공통코드 상세'
    }
    dialog.open(CommonDetailPop, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        data: id
    })
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '시스템관리' },
    { label: '공통코드관리' },
    { label: '공통코드목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(commonList.value, "공통코드 리스트", cols);
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
/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
  text-align: left;
}

::v-deep(.my-table .p-datatable-thead > tr > td) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
}
</style>
