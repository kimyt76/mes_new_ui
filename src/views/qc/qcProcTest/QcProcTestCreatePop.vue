<template>
<Card style="width: 30rem; height: 10rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="flex gap-2">
            <div >
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.testerName" class="w-full pr-10"/>
                        <InputIcon class="pi pi-search"  @click="openPop"/>
                    </IconField>
                    <label>점검자</label>
                </FloatLabel>
            </div>
            <div>
                <FloatLabel variant="on">
                    <Select v-model="form.qcProcTestType"
                            :options="qcProcTestTypes"
                            optionLabel="codeNm"
                            optionValue="code"
                            style="width: 200px;" />
                    <label>검사구분</label>
                </FloatLabel>
            </div>
        </div>
        <div class="mt-3">
            <span style="color: #e53935; font-weight: 600;">* 검사구분은 공정검사 생성 후에는 변경할 수 없습니다.</span>
        </div>
        <div class="flex justify-end gap-1 mt-3">
            <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
            <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
        </div>
    </template>
</Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const {memberNm, userId} = useAuthStore()
const { vSuccess, vWarning } = useAlertStore()
const dialogRef = inject('dialogRef')
const dialog = useDialog()
const qcProcTestTypes = ref([])
const form = reactive({
    testerName: '',
    testerId: '',
    qcProcTestType: '',
    workBatchId: '',
    testState: 'I',
})

const saveInfo = async () =>{
    if (  isEmpty(form.qcProcTestType) ) return vWarning("검사구분을 선택해주세요!!")
    if (  isEmpty(form.testerId) ) return vWarning("검사자를 등록해주세요!!")

    try{
        const param = {
            ...form
        }

        const res = await ApiQc.createQcProcTestInfo(param)
        vSuccess(res.message)
        closeDialog()
    }catch(err) {
        handleApiError(err)
    }
}

const openPop = () =>{
    dialog.open(UserListPop, {
        props: {
            header: '검사자 목록',
            modal: true,
            draggable: false,
        },
        onClose: event =>{
            if ( event) {
                form.testerId = event.data.memberNm
                form.testerId = event.data.userId
            }
        }
    })
}

onMounted( async ()  =>{
    qcProcTestTypes.value = await ApiCommon.getCodeList('QC_PROC_TEST_TYPE')

    form.workBatchId = dialogRef.value.data.id
})

const closeDialog = () =>{
    dialogRef.value.close()
}
</script>

<style scoped>

</style>
