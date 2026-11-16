
<template>
    <Card style="width: 34rem; height: 18rem;">
        <template #content>
            <div class="grid mb-2">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <Select
                            v-model="form.areaCd"
                            :options="areaCds"
                            optionLabel="codeNm"
                            optionValue="code"
                            class="w-full"
                            readonly
                        />
                        <label for="on_label">구역</label>
                    </FloatLabel>
                </div>

                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.workOrderDateSeq"
                            class="w-full"
                            readonly
                        />
                        <label>작업지시번호</label>
                    </FloatLabel>
                </div>

                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.makeNo"
                            class="w-full"
                            readonly
                        />
                        <label>제조번호</label>
                    </FloatLabel>
                </div>

                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.lotNo"
                            class="w-full"
                            readonly
                        />
                        <label>LOT번호</label>
                    </FloatLabel>
                </div>

                <div class="col-12">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.itemName"
                            class="w-full"
                            readonly
                        />
                        <label>품목명</label>
                    </FloatLabel>
                </div>

                <div class="col-12">
                    <FloatLabel variant="on">
                        <Select
                            v-model="form.storageCd"
                            :options="storages"
                            optionLabel="codeNm"
                            optionValue="code"
                            class="w-full"
                        />
                        <label for="on_label">작업처</label>
                    </FloatLabel>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button
                    label="작업시작"
                    class="p-button-secondary"
                    :disabled="writeYn !== 'Y'"
                    @click="saveGuard(saveInfo)"
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
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import { ApiSystem } from '@/api/apiSystem';
import { useConfirmGuard } from '@/composable/useConfirmGuard';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { computed, inject, onMounted, reactive, ref } from 'vue';

// =====================================================
// 1. 공통 함수
// =====================================================
const { confirmGuard } = useConfirmGuard();
const { vSuccess, vWarning } = useAlertStore();
const dialogRef = inject('dialogRef');

// =====================================================
// 2. 조회 데이터
// =====================================================
const areaCds = ref([]);
const allStorages = ref([]);

const filteredStorages = computed(() => {
    if (!form.areaCd) return [];

    return allStorages.value.filter(
        s => s.areaCd === form.areaCd && s.m1Yn === 'Y'
    );
});

const storages = computed(() => filteredStorages.value);

// =====================================================
// 3. Form
// =====================================================
const form = reactive({
    areaCd: '',
    storageCd: '',
    workOrderDateSeq: '',
    makeNo: '',
    lotNo: '',
    itemName: '',

    procCd: '',
    itemCd: '',
    workProcId: '',
    workBatchId: '',
    workOrderId: '',
    procStatus: '11',
    batchStatus: '11',
});

// =====================================================
// 4. 작업시작
// =====================================================
const saveInfo = async () => {

    // 작업처 검증
    if (isEmpty(form.storageCd)) {
        return vWarning('작업처를 등록하세요');
    }

    try {
        console.log('form.workProcId:', form.workProcId);

        // 기존 작업 데이터 건수 조회
        const params = {
            procCd: 'PRC001',
            workProcId: form.workProcId,
        };

        const cntRes = await ApiProc.getProcStartCnt(params);

        // 이미 시작된 작업인지 확인
        if (cntRes.data > 0) {
            vWarning('이미 시작된 칭량 작업입니다.');
            return;
        }

        // =================================================
        // 공통 확인창
        // =================================================
        const confirmed = await confirmGuard({
            header: '칭량시작확인',
            message:
                '해당 작업을 시작하시겠습니까?\n' +
                '내용을 다시 한 번 확인해 주세요.\n' +
                '시작 후에는 취소할 수 없습니다.',
            icon: 'pi pi-exclamation-triangle',
        });

        // 취소한 경우 작업 시작하지 않음
        if (!confirmed) return;

        // =================================================
        // 칭량 작업시작
        // =================================================
        const param = {
            procCd: form.procCd,
            itemCd: form.itemCd,
            workProcId: form.workProcId,
            workBatchId: form.workBatchId,
            storageCd: form.storageCd,
            procStatus: '11',
            batchStatus: '11',
        };

        await ApiProc.startProcWeigh(param);

        vSuccess('칭량 작업이 시작되었습니다.');
        closeDialog();

    } catch (err) {
        handleApiError(err);
    }
};

// =====================================================
// 5. 최초 데이터 조회
// =====================================================
onMounted(async () => {

    areaCds.value = await ApiCommon.getCodeList('area');

    const popupForm = dialogRef.value?.data?.form;

    if (popupForm) {
        Object.assign(form, popupForm);
    }

    allStorages.value = (await ApiSystem.getStorageCodeList())
        .filter(item => !['WS001', 'WS101'].includes(item.code));
});

// =====================================================
// 6. 팝업 닫기
// =====================================================
const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
</style>
