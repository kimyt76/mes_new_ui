<template>
<div class="condition-header mb-3">
    <div class="info-row">
        <div class="info-item">
            <span class="info-label">작업지시번호</span>
            <span class="info-value">{{ workOrderDateSeq }}</span>
        </div>

        <div class="info-item">
            <span class="info-label">제조일자</span>
            <span class="info-value">{{ prodDate }}</span>
        </div>

        <div class="info-item">
            <span class="info-label">제조번호</span>
            <span class="info-value">{{ makeNo }}</span>
        </div>

        <div class="info-item flex-2">
            <span class="info-label">제조설비</span>
            <span class="info-value">{{ equipmentNames }}</span>
        </div>
    </div>

    <div class="info-row mt-2">
        <div class="info-item flex-2">
            <span class="info-label">품명</span>
            <span class="info-value">{{ itemNames }}</span>
        </div>

        <div class="info-item">
            <span class="info-label">제조량</span>
            <span class="info-value text-right">{{ orderQty }} Kg</span>
        </div>
    </div>
</div>
<div class="mt-2">
    <Button label="새로고침"  class="p-button-secondary" @click="srcList" />
</div>
<div class="mt-2">
    <DataTable
            :value="conditionList"
            scrollHeight="700px"
            scrollable
            showGridlines
            tableStyle="width:100%; table-layout:fixed;"
            class="my-table"
        >
            <Column
                field="phase"
                header="제조상태"
                :style="{ width: '90px', textAlign: 'center' }"
            />

            <Column
                field="temperature"
                header="온도 (℃)"
                :style="{ width: '90px', textAlign: 'center' }"
            >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.temperature"
                        class="w-full"
                        :min="0"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        :useGrouping="false"
                        inputClass="table-number-input"
                        @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>

            <Column
                field="homo"
                header="HOMO (RPM)"
                :style="{ width: '100px', textAlign: 'center' }"
            >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.homo"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        inputClass="table-number-input"
                        @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>

            <Column
                field="disper"
                header="DISPER (RPM)"
                :style="{ width: '105px', textAlign: 'center' }"
            >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.disper"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        inputClass="table-number-input"
                        @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>

            <Column
                field="paddle"
                header="PADDLE (RPM)"
                :style="{ width: '105px', textAlign: 'center' }"
            >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.paddle"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        inputClass="table-number-input"
                        @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>
            <Column field="startTime" header="시작시간" :style="{ width: '100px' }">
                <template #body="slotProps">
                    <InputText
                        v-model="slotProps.data.startTime"
                        type="time"
                        class="w-full"
                        @change="onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>

            <Column field="endTime" header="종료시간" :style="{ width: '100px' }">
                <template #body="slotProps">
                    <InputText
                        v-model="slotProps.data.endTime"
                        type="time"
                        class="w-full"
                        @change="onChangeRow(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>
</div>

<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
</div>


</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, ref } from 'vue';

const {vSuccess, vWarning} = useAlertStore()
const dialogRef = inject('dialogRef')
const conditionList = ref([])
const itemNames = ref('')
const workOrderDateSeq = ref('')
const prodDate = ref('')
const makeNo = ref('')
const equipmentNames = ref('')
const orderQty = ref('')
const workProcId = ref('')

const saveInfo = async () =>{
    try{
        const saveList = conditionList.value.map(item => ({
            ...item,
            workProcId: workProcId.value,
            startTime: combineDateTime(prodDate.value, item.startTime),
            endTime: combineDateTime(prodDate.value, item.endTime)
        }))

        const res = await ApiProc.saveMatCondition(saveList)
        vSuccess("저장되었습니다.")
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const combineDateTime = (date, time) => {
    if (!date || !time) return null
    // time이 08:30 형식이면 초 추가
    const formattedTime = time.length === 5
        ? `${time}:00`
        : time

    return `${date}T${formattedTime}`
}

const srcList = async () =>{
    const res = await ApiProc.getConditionList(workProcId.value)
    conditionList.value = res.map(item => ({
        ...item,
        startTime: getTime(item.startTime),
        endTime: getTime(item.endTime)
    }))
}

const getTime = (dateTime) => {
    if (!dateTime) return null
    // 2026-08-21T08:30:00 → 08:30
    return dateTime.substring(11, 16)
}
onMounted( async () =>{
    workOrderDateSeq.value = dialogRef.value.data.row.workOrderDateSeq
    workProcId.value = dialogRef.value.data.row.workProcId
    prodDate.value = dialogRef.value.data.row.prodDate
    makeNo.value = dialogRef.value.data.row.makeNo
    orderQty.value = dialogRef.value.data.row.orderQty
    equipmentNames.value = "["+dialogRef.value.data.row.equipmentCd+"] "+dialogRef.value.data.row.equipmentName
    itemNames.value = "["+dialogRef.value.data.row.itemCd+"] "+dialogRef.value.data.row.itemName

    await srcList()
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
.condition-header {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px 14px;
    background: #fafafa;
}

.info-row {
    display: flex;
    gap: 12px;
}

.info-item {
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    background: white;
}

.info-item.flex-2 {
    flex: 2;
}

.info-label {
    min-width: 95px;
    padding: 7px 10px;
    background: #efebe9;
    color: #5d4037;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
    border-right: 1px solid #ddd;
}

.info-value {
    flex: 1;
    padding: 7px 10px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-right {
    text-align: right;
}

/* 테이블 Header */
::v-deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: Monaco, Consolas;
    padding: 5px 6px;
}

/* 테이블 Body 셀 공백 줄이기 */
::v-deep(.my-table .p-datatable-tbody > tr > td) {
    padding: 3px 5px;
    height: 34px;
}

/* InputNumber 내부 input */
::v-deep(.my-table .table-number-input) {
    width: 100%;
    height: 28px;
    padding: 2px 5px;
    font-size: 13px;
    text-align: right;
}

/* 시간 입력 */
::v-deep(.my-table .table-time .p-inputtext) {
    width: 100%;
    height: 28px;
    padding: 2px 5px;
    font-size: 13px;
    text-align: center;
}

/* DatePicker 아이콘 영역도 작게 */
::v-deep(.my-table .table-time .p-datepicker-input-icon-container) {
    width: 28px;
}

::v-deep(.break-words) {
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
}
</style>
