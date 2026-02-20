<template>
 <Card style="width: 30rem; height: 16rem;">
    <template #content>
            <!-- Row 1 -->
            <div class="grid mt-2 mb-2">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <Select v-model="form.areaCd"
                                :options="areaCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>구역(공장)</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <Select v-model="form.processCd"
                                :options="processCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>공정</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
             <div class="grid mb-2">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.workerName" class="w-full" />
                        <label>작업자명</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <Select v-model="form.useYn"
                                :options="useYns"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>사용유무</label>
                    </FloatLabel>
                </div>
             </div>
            <div class="grid mb-2">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.etc" class="w-full" style="resize: none;" />
                        <label>비고</label>
                    </FloatLabel>
                </div>
            </div>
    </template>
  </Card>
    <!-- Buttons -->
    <div class="flex gap-2 justify-end pt-3">
        <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
        <Button label="닫기"   outlined class="ml-2"  @click="closeDialog"></Button>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiWorkOrder } from '@/api/apiWorkOrder';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive, ref } from 'vue';

const {userId} = useAuthStore()
const { vInfo, vWarning, vSuccess} = useAlertStore()
const dialogRef = inject('dialogRef')
const areaCds = ref([])
const processCds = ref([])
const useYns = ref([])
const form = reactive({
    areaCd: '',
    processCd: '',
    workerName: '',
    useYn: 'Y',
    etc : '',

    userId: userId,
})

const saveInfo = async () =>{
    if ( isEmpty(form.areaCd) ) return vWarning('구역(공장) 정보를 선택하세요!!')
    if ( isEmpty(form.processCd) ) return vWarning('공정을 선택하세요!!')
    if ( isEmpty(form.workerName) ) return vWarning('작업자이름을 선택하세요!!')

    try {
        const params = {
            ...form
        }

        const res =  await ApiWorkOrder.saveWorkerInfo(params)
        vSuccess(res.message)
    }catch(err){
        handleApiError(err)
    }
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    useYns.value = await ApiCommon.getCodeList('use_yn')
    processCds.value = (await ApiCommon.getCodeList('PROCESS_CD')).filter(i => !['PRC009'].includes(i.code))
    if ( !isEmpty(dialogRef.value.data) ){
        const res = await ApiWorkOrder.getWorkerInfo(dialogRef.value.data)
        console.log('res', res)
        Object.assign(form, res)
    }
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>

</style>
