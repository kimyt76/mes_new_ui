<template>
<Card style="width: 100rem; height: 8rem;">
<template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.selfSuppliedDate" fluid  show-icon/>
                    <label>부자재 계획일자(자급)</label>
                </FloatLabel>
            </div>
            <div>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.selfSuppliedQty" :inputStyle="{ width: '100px', 'text-align': 'center' }" />
                    <label>부자재 계획수량(자급)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.customerSuppliedDate" fluid  show-icon/>
                    <label>부자재 계획일자(사급)</label>
                </FloatLabel>
            </div>
            <div>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.customerSuppliedQty" :inputStyle="{ width: '100px', 'text-align': 'center' }" />
                    <label>부자재 계획수량(사급)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.requestedDispatchDate" fluid  show-icon/>
                    <label>출고희망일자</label>
                </FloatLabel>
            </div>
            <div>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.requestedDispatchQty" :inputStyle="{ width: '100px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>출고희망수량</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>


</template>

<script setup>
import { todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, reactive } from 'vue';

const dialogRef = inject('dialogRef')
const form = reactive({
    selfSuppliedDate: todayKST(),
    selfSuppliedQty: 0,
    customerSuppliedDate: todayKST(),
    customerSuppliedQty: 0,
    requestedDispatchDate: todayKST(),
    expecrequestedDispatchQty: 0


});

const saveInfo = () =>{
    try{


    }catch(err){
        handleApiError(err)
    }

}

const closeDialog = () => {
    // 다이얼로그 닫기 로직
    // 예: emit 이벤트를 통해 부모 컴포넌트에 알리거나, 상태를 변경하여 다이얼로그를 숨김
    dialogRef.value.close();
};

</script>

<style scoped>

</style>
