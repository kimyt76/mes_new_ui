<template>
<div class="mt-3">
    <span style="font-size: large; font-weight: bold;"> 품목 :  {{ itemCd }} / {{ itemName }} </span>
</div>
<div class="flex items-center gap-4 mt-3 mb-2" >
    <Button label="배치+" @click="addRow" />
</div>
<div>
    <DataTable
        v-model:selection="selectedRows"
        ref="dt"
        :value="qcTestTypeMethodList"
        dataKey="testTypeMethodId"

        columnResizeMode="fit"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column selectionMode="multiple"  headerStyle="width: 2.5rem" style="text-align: center;"/>
        <Column field="testItem"    header="검사항목"  :style="{ width: '140px', textAlign:'center'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.testItem" style="width: 100%;" />
            </template>
        </Column>
        <Column field="testMethod"  header="시험방법"  :style="{ width: '450px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.testMethod" style="width: 100%;"/>
            </template>
        </Column>
        <Column field="testSpec"    header="시험기준"  :style="{ width: '220px', textAlign:'center'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.testSpec" style="width: 100%;"/>
            </template>
        </Column>
        <Column field="testResult"  header="시험결과"  :style="{ width: '150px', textAlign:'center'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.testResult" style="width: 100%;"/>
            </template>
        </Column>
        <Column field="distOrder"   header="표시순서"  :style="{ width: '90px', textAlign:'center'}" >
            <template #body="slotProps">
                <InputNumber
                   v-model="slotProps.data.distOrder"
                   :inputStyle="{ width: '40px', 'text-align': 'center' }"
                   />
            </template>
        </Column>
        <Column field="actions"     header="-"        :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>

     </DataTable>
</div>
<div class="flex justify-end gap-2 mt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="닫기" outlined class="mr-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { computed, inject, onMounted, ref } from 'vue';

const { vSuccess } = useAlertStore()
const qcTestTypeMethodList = ref([])
const selectedRows = ref([])
const dialogRef = inject('dialogRef')
const itemCd = ref('')
const itemName = ref('')
const isAllSelected = computed(() => {
  return (
    qcTestTypeMethodList.value.length > 0 &&
    selectedRows.value.length === qcTestTypeMethodList.value.length
  )
})

const saveInfo = async () =>{
    qcTestTypeMethodList.value.forEach(row => {
        row.itemCd = itemCd.value
    })
    const res = await ApiQc.saveQcTestTypeMethod(qcTestTypeMethodList.value)
    vSuccess(res.message)
    closeDialog()
}

const addRow = (selectItem = [], addBlank = true) => {
  if (!Array.isArray(qcTestTypeMethodList.value)) {
    qcTestTypeMethodList.value = []
  }

  let sortNum = qcTestTypeMethodList.value.length > 0 ? Math.max(...qcTestTypeMethodList.value.map(row => row.distOrder)) + 1 : 1

  // ✅ 항상 마지막에 빈 row 추가
  qcTestTypeMethodList.value.push({
    itemCd: itemCd.value,
    testItem: '',
    testMethod: '',
    testSpec: '',
    testResult: '',
    distOrder: sortNum
  })
  //renumberDistOrder()
}

// const renumberDistOrder = () => {
//   if (!Array.isArray(qcTestTypeMethodList.value)) return

//   qcTestTypeMethodList.value.forEach((row, index) => {
//     row.distOrder = index + 1
//   })
// }

const removeRow = (index) => {
    if ( isAllSelected.value ) {
        qcTestTypeMethodList.value = []
        return
    }else{
        qcTestTypeMethodList.value.splice(index, 1)
    }
}

onMounted( async () => {
    // 초기 데이터 로드
    itemCd.value = dialogRef.value.data.itemCd
    itemName.value = dialogRef.value.data.itemName

    qcTestTypeMethodList.value = await ApiQc.getQcTestTypeMethod(itemCd.value)
});

const closeDialog = () =>{
    dialogRef.value.close()
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
</style>
