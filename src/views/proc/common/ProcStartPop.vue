<template>
<Card style="width: 34rem; height: 18rem;">
    <template #content>
        <div class="grid mb-2">
            <div class="col-6">
                <FloatLabel variant="on">
                    <Select v-model="form.areaCd" :options="areaCds"
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
                    <InputText v-model="form.workOrderDateSeq" class="w-full" readonly  />
                    <label>작업지시번호</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                 <FloatLabel variant="on">
                    <InputText v-model="form.makeNo" class="w-full" readonly />
                    <label>제조번호</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                 <FloatLabel variant="on">
                    <InputText v-model="form.lotNo" class="w-full" readonly />
                    <label>LOT번호</label>
                </FloatLabel>
            </div>
            <div class="col-12">
                 <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-full" readonly />
                    <label>품목명</label>
                </FloatLabel>
            </div>
            <div class="col-12">
                <FloatLabel variant="on">
                    <Select v-model="form.storageCd" :options="storages"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label for="on_label">작업처</label>
                </FloatLabel>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <Button label="작업시작" class="p-button-secondary" @click="saveInfo" />
            <Button label="닫기" outlined class="ml-2" @click="closeDialog"></Button>
        </div>
    </template>

</Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiProc } from '@/api/apiProc';
import { ApiSystems } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { useConfirm } from 'primevue';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const confirm = useConfirm()
const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialogRef = inject('dialogRef')
const areaCds = ref([])
const allStorages = ref([]);
const filteredStorages = computed(() => {
    if (!form.areaCd) return [];
    return allStorages.value.filter(s => s.areaCd === form.areaCd && s.m1Yn === 'Y');
});
const storages = computed(() => filteredStorages.value);

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
})

const saveInfo = () => {
    if ( isEmpty(form.storageCd)) return vWarning('작업처를 등록하세요')

    confirm.require({
        header: '칭량시작확인',
        message: '해당 작업을 시작하시겠습니까?\n내용을 다시 한 번 확인해 주세요.\n시작 후에는 취소할 수 없습니다.',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                const param = {
                    procCd: form.procCd,
                    itemCd: form.itemCd,
                    workProcId: form.workProcId,
                    workBatchId: form.workBatchId,
                    storageCd: form.storageCd,
                    procStatus: '11',
                    batchStatus: '11',
                }

                const res = await ApiProc.startProcWeigh(param)
                vSuccess(res.message)
                closeDialog()
            } catch (err) {
                handleApiError(err)
            }
        }
    });
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    const popupForm = dialogRef.value?.data?.form

    if (popupForm) {
        Object.assign(form, popupForm)
    }
    Object.assign(form, popupForm)
    allStorages.value = await ApiSystems.getStorageCodeList()
})

const closeDialog = () =>{
    dialogRef.value.close()
}


</script>

<style scoped>

</style>
