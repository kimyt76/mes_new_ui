<template>
<div class="flex flex-col mt-2">
    <DataTable
        :value="workOrderList"
        scrollable
        scrollHeight="flex"
        showGridlines
        class="my-table"
        >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="poNo"            header="지시일"   :style="{ width: '120px'}" />
        <Column field="workProcDate"    header="제조번호"    :style="{ width: '150px'}" />
        <Column field="lotNo"           header="LOT번호"    :style="{ width: '150px'}" />
    </DataTable>
</div>
<div class="flex gap-2 justify-end pt-3">
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const workOrderList = ref([])
const form = reactive({
    procCd: 'PRC002',
    poNo : '',

})

const srhList = async () =>{

    const params = {
        ...form
    }

    const res = await ApiOrder.getMatWorkOrder(params)
    workOrderList.value = res
}

onMounted(() => {
    form.poNo = dialogRef.value.data.poNo
    srhList()
})

const closeDialog = () => {
    // 다이얼로그 닫기 로직
    // 예: emit 이벤트를 통해 부모 컴포넌트에 알리거나, 상태를 변경하여 다이얼로그를 숨김
    dialogRef.value.close();
};

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
