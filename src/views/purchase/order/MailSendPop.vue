<template>
<div style="width: 35rem; height: 15rem;" class="mt-3">
    <div class="mt-2">
        <FloatLabel variant="on">
            <InputText v-model="form.toName" class="w-full" />
            <label>수신자명</label>
        </FloatLabel>
    </div>
    <div class="mt-2">
        <FloatLabel variant="on">
            <InputText v-model="form.to" class="w-full" />
            <label>수신자 이메일</label>
        </FloatLabel>
    </div>
    <div class="mt-2">
        <FloatLabel variant="on">
            <InputText v-model="form.cc" class="w-full" />
            <label>참조 이메일</label>
        </FloatLabel>
    </div>
    <div class="mt-2">
        <FloatLabel variant="on">
            <InputText v-model="form.from" class="w-full"  readonly/>
            <label>발신자 이메일</label>
        </FloatLabel>
    </div>
    <div class="mt-2">
        <FloatLabel variant="on">
            <Textarea v-model="form.memo" class="w-full"  style="resize: none" />
            <label>메모</label>
        </FloatLabel>
    </div>
</div>

<div class="flex justify-end gap-2 mt-3">
    <Button label="발송하기" class="p-button-secondary" @click="sendMail"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { ApiPurchase } from '@/api/apiPurchase';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { inject, reactive } from 'vue';

const { vWarning, vSuccess} = useAlertStore()
const dialogRef = inject('dialogRef');
const form = reactive({
    toName: '',
    to: '',
    cc: '',
    from: 'purchase@jincostech.com',
    memo: '',
})

const sendMail = async () =>{
    if ( isEmpty(form.toName)) return vWarning('수신자 이름을 입력해주세요.')
    if ( isEmpty(form.to)) return vWarning('수신자 이메일을 입력해주세요.')

    try{
        const params = {
            ...form
        }

        const res = await ApiPurchase.orderMail(params)
        vSuccess(res.message)
    }catch(err) {
        handleApiError(err)
    }
}

const closeDialog = () =>{
    dialogRef.value.close();
}

</script>

<style scoped>

</style>
