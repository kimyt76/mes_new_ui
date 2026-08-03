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
        <Column field="poNo"        header="지시일"  frozen :style="{ width: '120px'}" />
        <Column field="matRegDate"  header="제조번호"   frozen :style="{ width: '120px'}" />
        <Column field="matRegDate"  header="LOT번호"   frozen :style="{ width: '120px'}" />
    </DataTable>
</div>
<div class="flex gap-2 justify-end pt-3">
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef')
const workOrderList = ref([])

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
