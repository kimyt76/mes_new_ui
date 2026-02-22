<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select
                    v-model="form.itemTypeCd"
                    :options="itemTypeCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                   />
                 <label for="on_label">품목구분</label>
           </FloatLabel>
           <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
           </FloatLabel>
           <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemCd" style="width: 180px"/>
                <label for="on_label">품목코드</label>
           </FloatLabel>
           <FloatLabel variant="on">
                <Select
                    v-model="form.regYn"
                    :options="regYns"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                   />
           </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600"></Button>
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
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
        </div>
    </div>
<div>
    <DataTable
        ref="dt"
        :value="qcTestTypeList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        columnResizeMode="fit"
        scrollable
        showGridlines
        class="my-table"
        @row-click="selectRowClick"
        >
        <Column field="itemCd"              header="품목코드"  :style="{ width: '100px', textAlign:'center'}" />
        <Column field="itemTypeName"        header="품목구분"  :style="{ width: '120px', textAlign:'center'}" />
        <Column field="itemName"            header="품목명"    :style="{ width: '400px'}" bodyClass="break-words">
            <template #body="slotProps">
                    {{ slotProps.data.itemName }}
            </template>
        </Column>
        <Column field="testItemJoin"  header="시험항목"  :style="{ width: '400px', textAlign:'center'}" />
        <Column field="regYn"         header="등록여부"  :style="{ width: '100px', textAlign:'center'}" />
     </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import QcTestTypePop from './QcTestTypePop.vue';

const dialog = useDialog()
const qcTestTypeList = ref([])
const itemTypeCds = ref([])
const totalCount = computed(() => {
  return Array.isArray(qcTestTypeList.value) ? qcTestTypeList.value.length : 0
})
const regYns = ref([
    { codeNm: '전체', value: '' },
    { codeNm: '등록', value: 'Y' },
    { codeNm: '미등록', value: 'N' },
])
const form = reactive({
    itemName: '',
    itemCd: '',
    itemTypeCd: '',
    regYn : '',
})

const selectRowClick = (obj) =>{
    dialog.open(QcTestTypePop, {
        props:{
            header: '검사유형 수정',
            modal: true,
            maximizable: false,
            draggable: true,
            style: { overflow: 'hidden' },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'auto' } }
            }
        },
        data: obj.data,
        onClose: () => {
            srhList()
        }
    })
}

const srhList = async () =>{
    const param = {
        ...form
    }
    qcTestTypeList.value = await ApiQc.getQcTestTypeList(param)
}

onMounted( async () => {
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    srhList()
})


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '품질관리' },
    { label: '품질검사유형' },
    { label: '품질검사유형목록' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(qcTestTypeList.value, "품질검사유형리스트", cols);
}

</script>

<style scoped>
:deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
</style>
