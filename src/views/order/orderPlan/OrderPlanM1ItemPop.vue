```vue
<template>
    <div class="order-plan-pop">
        <div class="form-area">
            <FloatLabel variant="on" class="w-full">
                <InputText
                    v-model="form.poNo"
                    class="w-full"
                    readonly
                />
                <label>발주번호</label>
            </FloatLabel>

            <FloatLabel variant="on" class="w-full">
                <InputText v-model="form.value" class="w-full" @keyup.enter="saveInfo" />
                <label>발주구분</label>
            </FloatLabel>
        </div>

        <div class="button-area">
            <Button label="저장" icon="pi pi-check" severity="secondary" size="small" @click="saveInfo" />
            <Button label="닫기" icon="pi pi-times" severity="secondary" size="small" outlined @click="closeDialog" />
        </div>
    </div>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive } from 'vue';

const { vSuccess, vWarning } = useAlertStore();

const dialogRef = inject('dialogRef');

const form = reactive({
    value: '',
    poNo: '',
    itemType: 'M1',
    field: 'm1Yn',
});

const saveInfo = async () => {

    if (!form.value) {
        vWarning('발주구분을 입력해주세요.');
        return;
    }

    try {
        const params = {
            ...form
        };

        await ApiOrder.updateOrderPlanYn(params);
        vSuccess('저장되었습니다.');
        dialogRef.value.close();

    } catch (err) {
        handleApiError(err);
    }
};

onMounted(() => {
    form.poNo = dialogRef.value?.data?.poNo ?? '';
    form.m1Yn = dialogRef.value?.data?.m1Yn ?? '';
});

const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
.order-plan-pop {
    width: 270px;
    padding: 8px 2px 2px;
}

.form-area {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 8px 2px 18px;
}

.button-area {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    padding: 12px 2px 2px;
    border-top: 1px solid #e5e7eb;
}

:deep(.p-inputtext) {
    width: 100%;
    height: 36px;
    font-size: 13px;
}

:deep(.p-button) {
    min-width: 70px;
    height: 32px;
    font-size: 12px;
}
</style>
```
