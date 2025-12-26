<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                  :options="areaCds"
                   optionLabel="codeNm"
                    optionValue="code"
                    style="width: 150px"
                />
                <label for="on_label">공장명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                <label for="on_label1">업체명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemName" style="width: 200px" />
                <label for="on_label1">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.businessManagerName" style="width: 110px" />
                <label for="on_label1">영업담당자명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.labManagerName" style="width: 110px" />
                <label for="on_label1">연구담당자명</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>

<div class="flex items-center justify-between mb-2">
    <!-- 왼쪽: 총 건수 -->
    <div class="font-semibold ml-2">
        총 {{ totalCount }} 건
    </div>

    <!-- 오른쪽: 버튼 -->
    <div class="flex items-center gap-2">
        <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        :value="sampleList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollable
        scrollHeight="650px"
        showGridlines
        class="my-table"
        >
        <Column field="areaName"    header="공장명"  :style="{ width: '70px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="clientName"  header="업체명"  :style="{ width: '220px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"    header="품목명"  :style="{ width: '180px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.sampleId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="formulationCd"       header="제형"  :style="{ width: '70px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="businessManagerName" header="영업담당자명"  :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="labManagerName"      header="연구담당자명"  :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="reqDate"             header="의뢰일자"  :style="{ width: '80px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="prodMgmtNo"          header="제품관리번호"  :style="{ width: '70px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="countQty"            header="횟수"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '50px', textAlign:'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.countQty).toLocaleString() }}
            </template>
        </Column>
        <Column field="qty"  header="수량"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '50px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ Number(slotProps.data.qty).toLocaleString() }}
            </template>
        </Column>
        <Column field="etc"    header="특이사항"  :style="{ width: '180px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import SampleDetailPop from './SampleDetailPop.vue';

const dialog = useDialog()
const dt = ref(null)
const sampleList = ref([])
const totalCount = computed(() => {
  return Array.isArray(sampleList.value) ? sampleList.value.length : 0
})
const areaCds = ref([])
const form = reactive({
  areaCd:'',
  clientName: '',
  itemName: '',
  busisnessManagerName: '',
  labManagerName: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }
    sampleList.value = await ApiLab.getSampleList(params)
}

const selectRowClick = (id) =>{
    let type = '신규'
    if ( !isEmpty(id)) {
        type = '상세'
    }

    dialog.open( SampleDetailPop, {
        props: {
            header: '샘플송부('+type+')',
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
            // 기타 PrimeVue Dialog props 설정
        },
        // 팝업 B에 전달할 데이터
        data: id,
        onClose:(event) => {
            // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.
            srhList()
        },
    })
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('AREA')
    areaCds.value = areaCds.value.filter(i => !['A003'].includes(i.code))
})

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(sampleList.value, "샘플송부 리스트", cols);
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '연구관리' },
    { label: '샘플관리' },
    { label: '샘플송부목록' },
]);

</script>

<style scoped>
/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

</style>
