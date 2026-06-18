<template>
<Card>


</Card>
<div>

</div>
<div>
    <DataTable

     >


     </DataTable>

</div>

<div class="w-full flex gap-2 justify-end mt-2">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { todayKST } from '@/util/common'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning, vInfo } = useAlertStore()
const { userId } = useAuthStore()
const dialogRef = inject('dialogRef')
const itemList = ref([])
const form = reactive({
    adjustDate: '',
    seq:  0,
    tranCd: '',
    managerName: '',
    managerId: '',
    storageCd: '',
    storageName: '',
    etc: '',

    userId: userId,
})

const saveInfo = () =>{
    const params = {
        adjustInfo : form,
        adjustList : itemList,
    }


}

onMounted( async ()=>{
    form.adjustDate = todayKST()

    dialogRef.value.data
})

const closeDialog = () =>{
    dialogRef.value.close()
}
</script>

<style scoped>

</style>
