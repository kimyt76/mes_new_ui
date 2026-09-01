<template>
<div class="flex flex-col mt-2">
    <DataTable
        :value="orderStockList"
        scrollable
        scrollHeight="flex"
        showGridlines
        class="my-table"
        >
        <Column header="No" :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="itemTypeName"  header="품목구분"   frozen :style="{ width: '90px', textAlign:'center'}" />
        <Column field="matName"       header="BOM"  frozen :style="{ width: '90px', textAlign:'center'}" />
        <Column field="requiredQuantity"         header=" 소요량"   :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">
                {{ (slotProps.data.requiredQuantity ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="reqQty"         header=" 필요량"   :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">
                {{ (slotProps.data.reqQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="orderType" header="공급"     :style="{ width: '80px', textAlign:'center'}" />
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>

import { ApiOrder } from '@/api/apiOrders';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const first = ref(0)
const orderStockList = ref([])

const form = reactive({
    itemCd : '',
    poNo: '',
})


onMounted( async () => {
    form.itemCd = dialogRef.value.data.itemCd
    form.poNo =  dialogRef.value.data.poNo

    const params = {
        itemCd: form.itemCd,
        poNo: form.poNo,
    }

    const res  = await ApiOrder.getRequiredQuantityList(params)

    orderStockList.value = res.orderStockList
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
