<template>
<Card style="width: 50rem; height: 17rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-3">
            <div class="col-3 req-date-box">
                <FloatLabel variant="on">
                <DatePicker
                    v-model="form.reqDate"
                    showIcon
                    :pt="{
                        input: { style: 'width: 110px;' }  // input만 줄임
                    }"
                />
                <label>의뢰일</label>
            </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.reqTesterName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('U')"/>
                    </IconField>
                    <label>시험의뢰자</label>
                </FloatLabel>
            </div>
             <div class="col-6">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.storageName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('S')"/>
                    </IconField>
                    <label>창고</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-6 flex">
                <div class="flex align-items-center gap-2">
                    <FloatLabel variant="on">
                        <InputText v-model="form.testNo" style="width: 156px;" readonly/>
                        <label>시험번호</label>
                    </FloatLabel>
                    <span>-</span>
                    <FloatLabel style="width: 60px" variant="on">
                        <InputNumber
                            v-model="form.seq"
                            inputClass="text-center"
                            :inputStyle="{ width: '48px' }"
                            readonly
                        />
                        <label>순번</label>
                    </FloatLabel>
                </div>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" class="w-full" readonly/>
                    <label>품목코드</label>
                </FloatLabel>
            </div>
             <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-full" readonly/>
                    <label>품목명</label>
                </FloatLabel>
            </div>
        </div>
         <div class="grid mb-5">
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.lotNo" class="w-full" readonly/>
                    <label>로트번호</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.reqQty" class="w-full" />
                    <label>검사요청량(kg)</label>
                </FloatLabel>
            </div>
         </div>
    </template>
</Card>
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import StorageListPop from '@/views/system/storage/StorageListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive } from 'vue';

const {vSuccess , vInfo, vWarning} = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const form = reactive({
    reqDate: '',
    retestYn: '',
    seq: '',
    reqTesterName: '',
    reqTesterId: '',
    storageName: '',
    storageCd: '',
    areaCd: '',
    lotNo: '',
    reqQty: '',

    qcTestId: '',
})

const saveInfo = async () =>{
    const params = {
        ...form
    }

    const res = await ApiQc.insertRetestInfo(params)
    vSuccess(res.message)
    closeDialog()
}

const openPop = (type) =>{
    let title = ''
    let componentPop = null

    if (type === 'U'){
        title = '시험의뢰자 검색'
        componentPop = UserListPop
    }else{
        title = '창고 검색'
        componentPop = StorageListPop
    }

    dialog.open(componentPop, {
        props:{
            header: title,
            modal: true,
            draggable: true,
            resizable: false,
        },
        onClose:(event) => {
            if(event){
                if(type === 'U'){
                    form.reqTesterName = event.data.memberNm
                    form.reqTesterId = event.data.userId
                }else{
                    form.storageName = event.data.storageName
                    form.storageCd = event.data.storageCd
                    form.areaCd = event.data.areaCd
                }
            }
        },
    })
}

onMounted( async () =>{
    form.qcTestId = dialogRef.value.data.qcTestId

    const res = await ApiQc.getQcTestDetailInfo(form.qcTestId)
    Object.assign(form , res)
})

const closeDialog = () =>{
    dialogRef.value.close()
}
</script>

<style scoped>
.req-date-box :deep(.p-datepicker) {
  width: auto;
}

.req-date-box :deep(.p-inputtext) {
  width: 120px;
}
</style>
