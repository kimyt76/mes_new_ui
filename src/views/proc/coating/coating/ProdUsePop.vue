<template>
    <div class="label mt-2">
         {{ title }}
    </div>

    <div class="mt-3">
        <FloatLabel variant="on">
            <InputNumber
                ref="barcodeInputRef"
                v-model="barcode"
                @keyup.enter="searchByBarcode"
                autofocus
             />
            <label >바코드(시험번호)</label>
        </FloatLabel>
    </div>

    <div class="mt-2">
        <DataTable
            :value="workUseList"
            class="my-table"
        >
         <Column field="testNo"     header="시험번호"   :style="{ width: '100px', textAlign: 'center'}" ></Column>
         <Column field="itemCd"     header="종목코드"   :style="{ width: '120px', textAlign: 'center'}" ></Column>
         <Column field="lotNo"      header="로트번호"   :style="{ width: '200px', textAlign: 'center'}" ></Column>
         <Column field="reqQty"     header="예상소요량" :style="{ width: '100px', textAlign: 'center'}" ></Column>
         <Column field="useQty"     header="사용량"     :style="{ width: '90px', textAlign: 'center'}" ></Column>
         <Column field="badQty"     header="원불량"     :style="{ width: '90px', textAlign: 'center'}" ></Column>
         <Column field="workBadQty" header="작업불량"   :style="{ width: '90px', textAlign: 'center'}" ></Column>
         <Column field="totUsQty"   header="총사용량"   :style="{ width: '100px', textAlign: 'center'}" ></Column>
        </DataTable>
    </div>

    <div class="flex justify-end mt-3 gap-2">
        <Button label="저장" icon="pi pi-check" @click="saveInfo"/>
        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { isEmpty } from '@/util/common';
import { inject, onMounted, ref } from 'vue';

const barcodeInputRef = ref(null)
const barcode = ref('')
const prodUseList = ref([])
const dialogRef = inject('dialogRef')
const workUseList = ref([])
const title = ref('')

const saveInfo = async () => {
    await ApiProc.saveProdUseList(prodUseList.value)

}

const searchByBarcode = async () =>{
console.log(' barcode.value.length',  barcode.value.length)
    if ( barcode.value.length == 11) {
        prodUseList.value = await ApiProc.getProdUseTestNo(barcode.value)
    }
}

onMounted( async () =>{
    let workProcId = dialogRef.value.data.row.workProcId
    title.value = '['+dialogRef.value.data.itemCd+'] '+ dialogRef.value.data.itemName

    setTimeout(() => {
        barcodeInputRef.value?.$el?.querySelector('input')?.focus()
    }, 100)

    if (!isEmpty(workProcId)) {
        prodUseList.value = await ApiProc.getProdUseId(workProcId)
    }
})

const closeDialog = () =>{
    dialogRef.value.close()
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
.label {
  font-weight: 700;
  margin-bottom: 6px;
  font-size: larger;
}
</style>
