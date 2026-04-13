<template>
 <div class="mt-3">
     <span class="font-bold size-6">-  인쇄매수를 확인하고 출력하세요 </span>
 </div>
<div class="mt-3">
    <DataTable
      :value="itemList"
      class="my-table"
      showGridlines
    >
        <Column field="itemCd"      header="품목코드"   :style="{ width: '110px',textAlign:'center'}" />
        <Column field="itemName"    header="품목명"     :style="{ width: '400px'}"/>
        <Column field="lotNo"       header="LOT번호"    :style="{ width: '150px',textAlign:'center'}" />
        <Column field="testNo"      header="시험번호"   :style="{ width: '140px',textAlign:'center'}" />
        <Column field="expiryDate"  header="사용기한"   :style="{ width: '120px',textAlign:'center'}" />
        <Column field="qty"         header="수량"       :style="{ width: '100px' ,textAlign:'right'}">
            <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.qty"
                        class="w-full"
                        :min="1"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
                </template>
        </Column>
        <Column field="printCnt"        header="인쇄매수"   :style="{ width: '70px'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.printCnt"
                        class="w-full"
                        :min="1"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
                </template>
        </Column>

    </DataTable>
</div>
<div class="flex  justify-end gap-2 mt-3">
    <Button label="인쇄" icon="pi pi-print"   @click="barcodePrint"></Button>
    <Button label="닫기" outlined @click="closeDialog"/>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef')
const itemList = ref([])
const menuType = ref('')

const barcodePrint = async() =>{
    // const params = {
    //     reqPrinting: itemList.value.map(v => ({ testNo: v.testNo,  qty: v.qty,printCnt: v.printCnt ?? 1 }))
    // }
    const params = itemList.value.map(v => ({
        testNo: v.testNo,
        qty: v.qty,
        printCnt: v.printCnt ?? 1
    }))

    const win = window.open("", "_blank"); // 먼저 열어두고
    const pdfBlob = await ApiCommon.barcodePrint(params);
    const url = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    win.location.href = url;

    // 메모리 해제
    win.onload = () => {
        URL.revokeObjectURL(url)
    }
}

onMounted(() =>{
    menuType.value = dialogRef.value.data.menuType
    itemList.value = dialogRef.value.data.itemList
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
}
</style>
