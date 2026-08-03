<template>
<div class="flex flex-col mt-2">
    <DataTable
        :value="orderStockList"
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
        <Column field="poNo"        header="품목코드"  frozen :style="{ width: '120px'}" />
        <Column field="matRegDate"  header="품목구분"   frozen :style="{ width: '120px'}" />
        <Column field="matRegDate"  header="품목명"   frozen :style="{ width: '120px'}" />
        <Column field="matRegDate"  header="담당자"   frozen :style="{ width: '120px'}" />
        <Column field="qty"         header=" 소요량"   :style="{ width: '120px', textAlign:'right'}">
            <template #body="slotProps">
                {{ (slotProps.data.qty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="qty"         header=" 필요량"   :style="{ width: '120px', textAlign:'right'}">
            <template #body="slotProps">
                {{ (slotProps.data.qty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="matPlanDate" header="공급"     :style="{ width: '120px'}" />
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>


</template>

<script setup>

import { inject, onMounted, ref } from 'vue';
const dialogRef = inject('dialogRef')
const first = ref(0)
const orderStockList = ref([])

onMounted(() => {
    srhList()
})

const closeDialog = () => {
    // 다이얼로그 닫기 로직
    // 예: emit 이벤트를 통해 부모 컴포넌트에 알리거나, 상태를 변경하여 다이얼로그를 숨김
    dialogRef.value.close();
};

</script>

<style scoped>

</style>
