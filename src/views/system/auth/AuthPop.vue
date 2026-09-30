<template>
    <div>
        권한복사
    </div>

    <div>
        <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.srcMemberNm" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('S')" />
            </IconField>
            <label>복사 원본자</label>
          </FloatLabel>
          -
        <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.tarMemberNm" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('T')" />
            </IconField>
            <label>복사 대상자</label>
          </FloatLabel>
    </div>
    <div>
        <Button label="권한복사" icon="pi pi-copy" severity="secondary" @click="authCopy" />
        <Button label="닫기" outlined @click="closeDialog" />
    </div>
</template>

<script setup>
import { ApiSystem } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive } from 'vue';
import UserListPop from '../user/UserListPop.vue';


const {vSuccess, vWarning } = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const form = reactive({
    srcMemberNm: '',
    srcUserId: '',
    tarMemberNm: '',
    tarUserId: '',
})

const openPop = (type) =>{
    dialog.open(UserListPop, {
        props:{
            header: '사용자 조회',
            modal: true,
            draggable: false
        },
        onClose : (event) => {
            if (event?.data) {
                if ( type === 'T') {
                    form.tarMemberNm = event.data.memberNm
                    form.tarUserId = event.data.userId
                }else{
                    form.srcMemberNm = event.data.memberNm
                    form.srcUserId = event.data.userId
                }
            }
        }
    })
}

const authCopy = async () =>{
    if(isEmpty(form.srcUserId)) return vWarning('복사할 인원을 입력하세요')
    if(isEmpty(form.tarUserId)) return vWarning('복사할 인원을 입력하세요')

    try{

        const params = {
            srcUserId: form.srcUserId,
            tarUserId: form.tarUserId
        }

        await ApiSystem.copyMenuAuthInfo(params)
        vSuccess('복사가 정상적으로 완료되었습니다.')

    }catch(err){
        handleApiError(err)
    }
}

onMounted( () =>{
    form.srcMemberNm = dialogRef.value.data.srcMemberNm
    form.srcUserId = dialogRef.value.data.srcUserId
})

const closeDialog =() =>{
    dialogRef.value.close()
}

</script>

<style lang="scss" scoped>

</style>
