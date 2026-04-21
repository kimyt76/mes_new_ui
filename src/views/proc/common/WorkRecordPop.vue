<template>
    <div class="work-popup-wrap">
        <Card class="work-card">
            <template #content>
                <div class="work-form">
                    <!-- 1줄: 날짜 / 시작시간 / 종료시간 -->
                    <div class="form-row row-time">
                        <div class="field-item date-field">
                            <label class="field-label">작업일자</label>
                            <SingleDatePicker
                                v-model="form.workDate"
                                class="w-full"
                            />
                        </div>

                        <div class="field-item time-field">
                            <label class="field-label">시작시간</label>
                            <DatePicker
                                v-model="form.workStartTime"
                                timeOnly
                                showIcon
                                hourFormat="12"
                                appendTo="body"
                                :manualInput="false"
                                class="w-full"
                            />
                        </div>

                        <div class="field-item time-field">
                            <label class="field-label">종료시간</label>
                            <DatePicker
                                v-model="form.workEndTime"
                                timeOnly
                                showIcon
                                hourFormat="12"
                                appendTo="body"
                                :manualInput="false"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <!-- 2줄: 작업인원 / label1 / label2 -->
                    <div class="form-row row-qty">
                        <div class="field-item">
                            <FloatLabel variant="on">
                                <InputNumber
                                    v-model="form.workerCnt"
                                    inputId="workerCnt"
                                    class="w-full"
                                    :suffix="workerSuffix"
                                />
                                <label for="workerCnt">작업인원</label>
                            </FloatLabel>
                        </div>

                        <div class="field-item">
                            <FloatLabel variant="on">
                                <InputNumber
                                    v-model="form.useQty"
                                    inputId="useQty"
                                    class="w-full"
                                    :suffix="qtySuffix1"
                                />
                                <label for="useQty">{{ label }}</label>
                            </FloatLabel>
                        </div>

                        <div class="field-item">
                            <FloatLabel variant="on">
                                <InputNumber
                                    v-model="form.prodQty"
                                    inputId="prodQty"
                                    class="w-full"
                                    :suffix="qtySuffix2"
                                />
                                <label for="matUseQty">{{ label2 }}</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <!-- 3줄: 버튼 -->
                    <div class="button-row">
                        <Button label="저장" icon="pi pi-check" @click="saveInfo"/>
                        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup>
import SingleDatePicker from '@/components/SingleDatePicker.vue';
import { todayKST } from '@/util/common';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef');

const label = ref('사용량');
const label2 = ref('수량');

const workerSuffix = ref(' 명');
const qtySuffix1 = ref(' kg');
const qtySuffix2 = ref(' EA');

const form = reactive({
    workDate: todayKST(),
    workStartTime: '',
    workEndTime: '',
    workerCnt: '',
    useQty: '',
    prodQty: '',
});

const formatHHmm = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};


const saveInfo = () =>{
    console.log('workStartTime',  formatHHmm(form.workStartTime))
    console.log('workEndTime',  formatHHmm(form.workEndTime))

    dialogRef.value.close({
        ...form,
        workStartTime: formatHHmm(form.workStartTime),
        workEndTime: formatHHmm(form.workEndTime),
    });
}

onMounted(() => {
    const procCd = dialogRef.value?.data?.form?.procCd;

    if (procCd === 'PROC003') {
        label.value = '반제품사용량';
        label2.value = '코팅수량';
        qtySuffix1.value = ' kg';
        qtySuffix2.value = ' EA';
    } else if (procCd === 'PROC004') {
        label.value = '벌크제품사용량';
        label2.value = '충전수량';
        qtySuffix1.value = ' kg';
        qtySuffix2.value = ' EA';
    } else if (procCd === 'PROC005') {
        label.value = '포장품사용량';
        label2.value = '포장수량';
        qtySuffix1.value = ' EA';
        qtySuffix2.value = ' EA';
    }
});

const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
.work-popup-wrap {
    width: 36rem;
    max-width: 92vw;
}

.work-card {
    width: 100%;
    border-radius: 14px;
    box-shadow: none;
}

.work-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0;
}

.form-row {
    display: grid;
    gap: 0.65rem;
}

.row-time {
    grid-template-columns: 1.35fr 1fr 1fr;
    align-items: end;
}

.row-qty {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
}

.field-item {
    width: 100%;
}

.field-label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
    line-height: 1.2;
}

.button-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.15rem;
}

:deep(.p-card) {
    box-shadow: none;
}

:deep(.p-card-content) {
    padding: 0.45rem 0.5rem 0.35rem;
}

:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-datepicker),
:deep(.p-inputnumber-input) {
    width: 100%;
}

:deep(.p-inputnumber-input) {
    text-align: left;
}

:deep(.p-floatlabel input) {
    width: 100%;
}

:deep(.p-dialog-content) {
    padding: 0.5rem 0.65rem 0.7rem !important;
}

:deep(.p-datepicker-input) {
    width: 100%;
}

:deep(.p-button) {
    padding-top: 0.55rem;
    padding-bottom: 0.55rem;
}
</style>
