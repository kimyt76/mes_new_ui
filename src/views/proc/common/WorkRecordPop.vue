<template>
<Card style="width: 35rem; height: 12rem;">
    <template #content>
        <div class="grid mt-2">
            <div class="col-4">
                <FloatLabel variant="on"  class="w-full">
                    <SingleDatePicker
                        v-model="form.workDate"
                        fluid
                    />
                    <label >작업일자</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on" class="w-full">
                    <DatePicker
                        v-model="form.workStartTime"
                        timeOnly
                        showIcon
                        hourFormat="12"
                        appendTo="body"
                        :manualInput="false"
                        fluid
                    />
                    <label>시작시간</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on" class="w-full">
                    <DatePicker
                        v-model="form.workEndTime"
                        timeOnly
                        showIcon
                        hourFormat="12"
                        appendTo="body"
                        :manualInput="false"
                        fluid
                    />
                    <label>종료시간</label>
                </FloatLabel>
            </div>
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
            <div class="col-4">
                <FloatLabel variant="on"  class="w-full">
                    <InputNumber
                        v-model="form.prodQty"
                        fluid
                        :suffix="qtySuffix2"
                    />
                    <label>{{ label2 }}</label>
                </FloatLabel>
            </div>
        </div>
         <!-- 3줄: 버튼 -->
        <div class="flex justify-end gap-2 mt-2">
            <Button label="저장" icon="pi pi-check" @click="saveInfo"/>
            <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
        </div>
    </template>
</Card>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import SingleDatePicker from '@/components/SingleDatePicker.vue';
import { todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef');
const workRecordList = ref([])
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

    itemCd : '',
    workRecordId : '',
    workProcId : '',
});

const formatHHmm = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const saveInfo = async () =>{
    try{
        workRecordList.value.push({
            workDate : form.workDate,
            workStartTime: formatHHmm(form.workStartTime),
            workEndTime: formatHHmm(form.workEndTime),
            workerCnt : form.workerCnt,
            useQty : form.useQty,
            prodQty : form.prodQty,
            itemCd : form.itemCd,
            workProcId : form.workProcId,
            workRecordId : form.workRecordId,
        })

        const res = await ApiProc.saveWorkRecordInfo(workRecordList.value)

        dialogRef.value.close({
            ...form,
            workStartTime: formatHHmm(form.workStartTime),
            workEndTime: formatHHmm(form.workEndTime),
        });
    }catch(err){
        handleApiError(err)
    }
}

onMounted( async () => {
    const procCd = dialogRef.value?.data?.form?.procCd
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
        const res = await ApiProc.getWorkRecordInfo(form.workRecordId)

        Object.assign(form, {
            ...res.data,
            workStartTime: toTimeDate(res.data.workStartTime),
            workEndTime: toTimeDate(res.data.workEndTime),
        })
    }
});

const closeDialog = () => {
    dialogRef.value.close();
};

const toTimeDate = (timeStr) => {
    if (!timeStr) return null

    const [hh, mm, ss] = timeStr.split(':')

    const date = new Date()
    date.setHours(Number(hh))
    date.setMinutes(Number(mm))
    date.setSeconds(Number(ss || 0))

    return date
}
</script>

<style scoped>

</style>
