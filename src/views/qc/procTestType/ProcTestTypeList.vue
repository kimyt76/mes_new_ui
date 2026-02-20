<template>
<Breadcrumb :home="home" :model="items"/>
<div class="flex items-center justify-between mb-2 mt-3">
    <!-- 왼쪽: 총 건수 -->
    <div class="font-semibold ml-2">
        총 {{ totalCount }} 건
    </div>
    <!-- 오른쪽: 버튼 -->
    <div class="flex items-center mr-4">
        <!-- <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')" /> -->
    </div>
</div>
<div class="flex flex-col mt-2">
    <DataTable
        :value="procTestTypeList"
        dataKey="procTestTypeId"
        class="my-table"
        showGridlines
        >
        <Column field="testTypeName"          header="공정명"  :style="{ width: '300px'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.testType)" class="clickable-cell">
                    {{ slotProps.data.testTypeName }}
                </div>
            </template>
        </Column>
        <Column field="etc"    header="비고"  :style="{ width: '300px'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useDialog } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import ProcTestTypePop from './ProcTestTypePop.vue';

const dialog = useDialog()
const procTestTypeList = ref([])
const totalCount = computed(() => {
  return Array.isArray(procTestTypeList.value) ? procTestTypeList.value.length : 0
})

const selectRowClick = (testType) => {

    let title = ''
    if ( testType) {
        title = '공정검사유형 상세목록'
    }else{
        title = '공정검사유형 등록'
    }

console.log('title', title)
    dialog.open( ProcTestTypePop, {
        props : {
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: { overflow: 'hidden' },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        data : testType
    })
}

const srhList = async () => {
    procTestTypeList.value = await ApiQc.getProcTestTypeList()
}

onMounted( async ()=>{
    srhList()
})


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: 'QC' },
    { label: '공정검사유형' },
    { label: '공정검사유형목록' },
]);
</script>

<style  scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
</style>
