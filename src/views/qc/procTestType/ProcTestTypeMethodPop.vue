<template>
<Card>
 <template #content>
    <!-- Row 1 -->
    <div class="grid mb-5">
        <div class="col-12">
            <FloatLabel variant="on">
                <InputText v-model="form.testItem" class="w-full" />
                <label>검사항목</label>
            </FloatLabel>
        </div>
        <div class="col-12">
            <FloatLabel variant="on">
                <InputText v-model="form.testMethod" class="w-full" />
                <label>검사방법</label>
            </FloatLabel>
        </div>
        <div class="col-12">
            <FloatLabel variant="on">
                <InputText v-model="form.testTiming" class="w-full" />
                <label>점검시기</label>
            </FloatLabel>
        </div>
        <div class="col-12">
            <FloatLabel variant="on">
                <InputText v-model="form.testTime" class="w-full" />
                <label>점검시간</label>
            </FloatLabel>
        </div>
    </div>
</template>
</Card>
<div class="flex items-center justify-end mb-2 mt-3">
    <!-- 오른쪽: 버튼 -->
    <div class="flex justify-end mr-4">
        <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
        <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
    </div>
</div>
</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive } from 'vue';

const { vSuccess, vError} = useAlertStore()
const {userId} = useAuthStore()
const dialogRef = inject('dialogRef')
const form = reactive({
    testItem : '',
    testMethod : '',
    testTiming : '',
    testTime : '',

    procTestTypeMethodId:'',
    userId: userId,
})

const saveInfo = async () =>{
    try {
        const param = {
            ...form
        }

        const res = await ApiQc.saveProcTestTypeMethod(param)
        vSuccess(res.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

onMounted( async ()=>{
    form.procTestTypeMethodId = dialogRef.value.data.procTestTypeMethodId

    const res = await ApiQc.getProcTestTypeMethodInfo(form.procTestTypeMethodId)
    Object.assign(form, res)
 })

 const closeDialog = () =>{
    dialogRef.value.close()
}


</script>

<style scoped>

</style>
