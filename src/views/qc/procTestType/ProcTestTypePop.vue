<template>
<div class="flex items-center justify-end mb-2 mt-3">
    <!-- 오른쪽: 버튼 -->
    <div class="flex justify-end mr-4">
        <!-- <Button label="신규" icon="pi pi-plus" severity="secondary" @click="addRow" />-->
        <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
    </div>
</div>
<div class="flex flex-col mt-2">
    <DataTable
        :value="procTestTypeMethodList"
        dataKey="procTestTypeMethodId"
        class="my-table"
        showGridlines
        @row-click="addPop"
        >
        <Column field="distOrder"   header="순번"      :style="{ width: '60px' ,textAlign:'center'}" />
        <Column field="testItem"    header="검사항목"  :style="{ width: '550px'}" />
        <Column field="testMethod"  header="검사방법"  :style="{ width: '300px',textAlign:'center'}" />
        <Column field="testTiming"  header="점검시기"  :style="{ width: '130px',textAlign:'center'}" />
        <Column field="testTime"    header="점검시간"  :style="{ width: '130px',textAlign:'center'}" />
        <!-- <Column field="actions"     header="-"        :style="{ width: '20px', 'text-align': 'center'}"  >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column> -->

    </DataTable>
</div>

</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useDialog } from 'primevue';
import { inject, onMounted, ref } from 'vue';
import ProcTestTypeMethodPop from './ProcTestTypeMethodPop.vue';

const dilalog = useDialog()
const procTestTypeMethodList = ref([])
const dialogRef = inject('dialogRef')

const srhList = async () =>{
    procTestTypeMethodList.value =await ApiQc.getProcTestTypeMethod(dialogRef.value.data)
}

onMounted( async ()=>{
    srhList()
 })

 const addPop = (obj) =>{
    dilalog.open(ProcTestTypeMethodPop, {
        props : {
            header : '공정검사유형 수정',
            modal: true,
            maximizable: false,
            draggable: true,
            style: { overflow: 'hidden' },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        data : obj.data
        ,onClose : () => {
            srhList()
        }
    })
 }

const removeRow = (index) =>{
    procTestTypeMethodList.value.splice(index,1)
}

const closeDialog = () =>{
    dialogRef.value.close()
}

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
