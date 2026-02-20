<template>
<Card style="width: 50rem; height: 27rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-3">
            <div class="col-8 flex gap-2">
                <FloatLabel variant="on">
                    <Select
                      v-model="form.areaCd"
                      :options="areaCds"
                      :option-label="codeNm"
                      :option-value="code"
                      readonly
                    />
                    <label for="areaCd" id="areaCd">구역(공장)</label>
                </FloatLabel>
            </div>
            <div class="col-8 flex gap-2">
                <FloatLabel variant="on">
                    <InputText v-model="form.workOrderDataSeq" readonly />
                </FloatLabel>
                <label for="workOrderData" id="workOrderData">작업지시번호</label>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-8 flex gap-2">
                <FloatLabel variant="on">
                    <InputText v-model="form.makeNo" readonly />
                </FloatLabel>
                <label for="makeNo" id="makeNo">제조번호</label>
            </div>
            <div class="col-8 flex gap-2">
                <FloatLabel variant="on">
                    <InputText v-model="form.lotNo" readonly />
                </FloatLabel>
                <label for="lotNo" id="lotNo">LOT번호</label>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-12 flex">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" readonly />
                </FloatLabel>
                <label for="itemName" id="itemName">품목명</label>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-8 flex gap-2">
                <FloatLabel variant="on">
                    <Select
                      v-model="form.storageCd"
                      :options="storageCds"
                      :option-label="codeNm"
                      :option-value="code"
                    />
                    <label for="areaCd" id="areaCd">작업처</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>

<div class="w-full flex gap-2">
    <Button label="작업시작" class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"></Button>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { useAuthStore } from '@/stores/auth';
import { inject, onMounted, reactive, ref } from 'vue';

const { userId } = useAuthStore()
const dialogRef = inject('dialogRef')
const areaCds = ref([])
const storageCds = ref([])
const form = reactive({
    areaCd: '',
    storageCd: '',
    workOrderDataSeq: '',
    makeNo: '',
    lotNo: '',
    itemName: '',

    userId: userId,
})

const saveInfo =()=>{

}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')

    console.log('dialogRef.value', dialogRef.value.data)
    //storageCds.value = await ApiBase.getStorageList(dialogRef.value.data.areaCd)

})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>

</style>
