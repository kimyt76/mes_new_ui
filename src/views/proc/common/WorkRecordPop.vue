
<template>
    <Card style="width: 35rem; min-height: 12rem;">
        <template #content>
            <div class="grid mt-2">

                <!-- 작업일자 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <SingleDatePicker
                            v-model="form.workDate"
                            fluid
                        />
                        <label>작업일자</label>
                    </FloatLabel>
                </div>

                <!-- 시작시간 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <InputGroup class="time-input-group">
                            <InputText
                                v-model="startTimeText"
                                placeholder="HH:mm"
                                maxlength="5"
                                inputmode="numeric"
                                class="w-full"
                                @input="onTimeInput('start', $event)"
                                @focus="$event.target.select()"
                                @blur="onTimeBlur('start')"
                                @keydown.enter.prevent="saveInfo"
                            />
                            <InputGroupAddon
                                class="time-icon-button"
                                @click="openTimePicker('start')"
                            >
                                <i class="pi pi-calendar"></i>
                            </InputGroupAddon>
                        </InputGroup>
                        <label>시작시간</label>
                    </FloatLabel>
                </div>

                <!-- 종료시간 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <InputGroup class="time-input-group">
                            <InputText
                                v-model="endTimeText"
                                placeholder="HH:mm"
                                maxlength="5"
                                inputmode="numeric"
                                class="w-full"
                                @input="onTimeInput('end', $event)"
                                @focus="$event.target.select()"
                                @blur="onTimeBlur('end')"
                                @keydown.enter.prevent="saveInfo"
                            />
                            <InputGroupAddon
                                class="time-icon-button"
                                @click="openTimePicker('end')"
                            >
                                <i class="pi pi-calendar"></i>
                            </InputGroupAddon>
                        </InputGroup>
                        <label>종료시간</label>
                    </FloatLabel>
                </div>

                <!-- 작업인원 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <InputNumber
                            v-model="form.workerCnt"
                            fluid
                            :suffix="workerSuffix"
                        />
                        <label>작업인원</label>
                    </FloatLabel>
                </div>

                <!-- 사용량 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <InputNumber
                            v-model="form.useQty"
                            fluid
                            :suffix="qtySuffix1"
                        />
                        <label>{{ label }}</label>
                    </FloatLabel>
                </div>

                <!-- 수량 -->
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <InputNumber
                            v-model="form.prodQty"
                            fluid
                            :suffix="qtySuffix2"
                        />
                        <label>{{ label2 }}</label>
                    </FloatLabel>
                </div>
            </div>

            <!-- 버튼 -->
            <div class="flex justify-end gap-2 mt-2">
                <Button
                    label="저장"
                    icon="pi pi-check"
                    @click="saveInfo"
                />
                <Button
                    label="삭제"
                    severity="danger"
                    @click="deleteWorkRecode"
                />
                <Button
                    label="닫기"
                    outlined
                    class="ml-2"
                    @click="closeDialog"
                />
            </div>
        </template>
    </Card>

    <!-- 시간 선택용 DatePicker: 입력창만 화면 밖에 배치 -->
    <div class="time-picker-anchor">
        <DatePicker
            ref="startPickerRef"
            v-model="startTimePicker"
            timeOnly
            hourFormat="24"
            appendTo="body"
            :manualInput="false"
            @update:modelValue="value => onPickerChange('start', value)"
        />

        <DatePicker
            ref="endPickerRef"
            v-model="endTimePicker"
            timeOnly
            hourFormat="24"
            appendTo="body"
            :manualInput="false"
            @update:modelValue="value => onPickerChange('end', value)"
        />
    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import SingleDatePicker from '@/components/SingleDatePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, nextTick, onMounted, reactive, ref } from 'vue';

const { vSuccess, vWarning } = useAlertStore();
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
    workerCnt: null,
    useQty: null,
    prodQty: null,
    itemCd: '',
    workRecordId: '',
    workProcId: '',
});

// 직접 입력값
const startTimeText = ref('');
const endTimeText = ref('');

// DatePicker 값
const startTimePicker = ref(null);
const endTimePicker = ref(null);

// DatePicker 컴포넌트 참조
const startPickerRef = ref(null);
const endPickerRef = ref(null);

// Date -> HH:mm
const formatHHmm = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');

    return `${hh}:${mm}`;
};

// HH:mm 또는 HH:mm:ss -> Date
const toTimeDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(
        String(value).trim()
    );

    if (!match) return null;

    const hh = Number(match[1]);
    const mm = Number(match[2]);
    const ss = Number(match[3] || 0);

    if (hh > 23 || mm > 59 || ss > 59) return null;

    const date = new Date();
    date.setHours(hh, mm, ss, 0);

    return date;
};

// 숫자 4자리 -> HH:mm
const normalizeTime = (value) => {
    const digits = String(value ?? '')
        .replace(/\D/g, '')
        .slice(0, 4);

    if (digits.length === 4) {
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    return digits;
};

// 직접 입력
const onTimeInput = (type, event) => {
    const formatted = normalizeTime(event.target.value);
    const date = toTimeDate(formatted);

    if (type === 'start') {
        startTimeText.value = formatted;
        startTimePicker.value = date;
        form.workStartTime = date ? formatted : '';
    } else {
        endTimeText.value = formatted;
        endTimePicker.value = date;
        form.workEndTime = date ? formatted : '';
    }

    // v-model 값과 실제 입력창을 동기화
    event.target.value = formatted;
};

// 포커스 해제 시 시간 검사
const onTimeBlur = (type) => {
    const value = type === 'start'
        ? startTimeText.value
        : endTimeText.value;

    if (!value) return;

    const date = toTimeDate(value);

    if (!date) {
        vWarning('올바른 시간을 입력해 주세요. (예: 0930)');

        if (type === 'start') {
            startTimeText.value = '';
            startTimePicker.value = null;
            form.workStartTime = '';
        } else {
            endTimeText.value = '';
            endTimePicker.value = null;
            form.workEndTime = '';
        }
    }
};

// 시간 선택 아이콘 클릭
const openTimePicker = async (type) => {
    await nextTick();

    const picker = type === 'start'
        ? startPickerRef.value
        : endPickerRef.value;

    if (!picker) return;

    // PrimeVue DatePicker 오버레이 열기
    if (typeof picker.showOverlay === 'function') {
        picker.showOverlay();
    } else {
        // 버전별 API 차이를 위한 대체 처리
        const input = picker.$el?.querySelector?.('input');
        input?.focus();
        input?.click();
    }
};

// DatePicker에서 시간 선택
const onPickerChange = (type, value) => {
    const formatted = formatHHmm(value);

    if (type === 'start') {
        startTimePicker.value = value;
        startTimeText.value = formatted;
        form.workStartTime = formatted;
    } else {
        endTimePicker.value = value;
        endTimeText.value = formatted;
        form.workEndTime = formatted;
    }
};

// 조회 데이터 동기화
const setTimeValues = (startTime, endTime) => {
    const startDate = toTimeDate(startTime);
    const endDate = toTimeDate(endTime);

    startTimePicker.value = startDate;
    endTimePicker.value = endDate;

    startTimeText.value = formatHHmm(startDate);
    endTimeText.value = formatHHmm(endDate);

    form.workStartTime = startTimeText.value;
    form.workEndTime = endTimeText.value;
};

// 저장
const saveInfo = async () => {
    try {
        const startDate = toTimeDate(startTimeText.value);
        const endDate = toTimeDate(endTimeText.value);

        if (!startDate || !endDate) {
            vWarning('시작시간과 종료시간을 확인해 주세요.');
            return;
        }

        form.workStartTime = formatHHmm(startDate);
        form.workEndTime = formatHHmm(endDate);

        const params = [{
            workDate: form.workDate,
            workStartTime: form.workStartTime,
            workEndTime: form.workEndTime,
            workerCnt: form.workerCnt,
            useQty: form.useQty,
            prodQty: form.prodQty,
            itemCd: form.itemCd,
            workProcId: form.workProcId,
            workRecordId: form.workRecordId,
        }];

        await ApiProc.saveWorkRecordInfo(params);

        vSuccess('저장되었습니다.');

        dialogRef.value.close({
            ...form,
        });
    } catch (err) {
        handleApiError(err);
    }
};

// 삭제
const deleteWorkRecode = async () => {
    try {
        await ApiProc.deleteWorkRecode(form.workRecordId);

        vSuccess('삭제되었습니다.');
        dialogRef.value.close();
    } catch (err) {
        handleApiError(err);
    }
};

// 초기 데이터
onMounted(async () => {
    const procCd = dialogRef.value?.data?.form?.procCd;

    form.workProcId = dialogRef.value?.data?.form?.workProcId;
    form.itemCd = dialogRef.value?.data?.form?.itemCd;
    form.workRecordId = dialogRef.value?.data?.workRecordId;

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

    if (form.workRecordId) {
        try {
            const res = await ApiProc.getWorkRecordInfo(form.workRecordId);

            Object.assign(form, res.data);

            setTimeValues(
                res.data.workStartTime,
                res.data.workEndTime
            );
        } catch (err) {
            handleApiError(err);
        }
    }
});

const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
/* 시간 입력창과 아이콘을 하나의 컨트롤처럼 표시 */
.time-input-group {
    width: 100%;
}

.time-input-group :deep(.p-inputtext) {
    min-width: 0;
    width: 100%;
}

/* 작업일자의 달력 버튼과 비슷한 디자인 */
.time-icon-button {
    min-width: 2.4rem;
    padding: 0 0.65rem;
    background: var(--p-datepicker-dropdown-background, #f1f5f9);
    border-color: var(--p-inputtext-border-color, #cbd5e1);
    color: var(--p-datepicker-dropdown-color, #475569);
    cursor: pointer;
    justify-content: center;
}

.time-icon-button:hover {
    background: var(--p-datepicker-dropdown-hover-background, #e2e8f0);
}

/* 시간 선택용 DatePicker 입력창은 화면 밖에 배치 */
.time-picker-anchor {
    position: fixed;
    left: -9999px;
    top: 0;
    width: 1px;
    height: 1px;
}
</style>
