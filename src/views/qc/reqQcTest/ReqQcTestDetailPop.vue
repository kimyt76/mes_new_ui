<template>
<Card style="width: 50rem; height: 20rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-3">
            <div class="col-3">
                <!-- <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd"
                            :options="itemTypeCds"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full"  disabled=""/>
                    <label>품목구분</label>
                </FloatLabel> -->
                <FloatLabel variant="on">
                    <InputText v-model="form.itemTypeName" class="w-full" readonly/>
                    <label>품목구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.reqDate" class="w-full" readonly/>
                    <label>의뢰일</label>
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
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.reqTesterName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('U')"/>
                    </IconField>
                    <label>시험의뢰자</label>
                </FloatLabel>
            </div>
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
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.testNo" class="w-full" readonly/>
                    <label>시험번호</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.reqQty" :inputStyle="{ width: '156px' }" />
                    <label>검사요청량(kg)</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.lotNo" class="w-full" readonly/>
                    <label>로트번호</label>
                </FloatLabel>
            </div>
        </div>
         <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.testerName" class="w-full" readonly/>
                    <label>시험자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.orderTesterName" class="w-full" readonly/>
                    <label>시험지시자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.testState"
                            :options="testStates"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>시험상태</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.passState"
                            :options="passStates"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>판정상태</label>
                </FloatLabel>
            </div>
         </div>
         <div class="grid mb-3">
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerName" class="w-full" readonly/>
                    <label>거래처</label>
                </FloatLabel>
            </div>
            <div  v-if="isOrderType" class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.orderType" class="w-full" readonly/>
                    <label>거래유형</label>
                </FloatLabel>
            </div>
            <div v-if="isExpirDate" class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.expiryDate" class="w-full" readonly/>
                    <label>사용기한</label>
                </FloatLabel>
            </div>
         </div>
    </template>
</Card>
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="삭제" severity="danger" @click="deleteInfo"></Button>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import StorageListPop from '@/views/system/storage/StorageListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const {vSuccess , vInfo, vWarning} = useAlertStore()
const isExpirDate = ref(false)
const isOrderType = ref(false)
const dialog = useDialog()
const itemTypeCds = ref([])
const testStates = ref([])
const passStates = ref([])
const dialogRef = inject('dialogRef')
const form = reactive({
    reqDate: '',
    reqTesterName: '',
    reqTesterId: '',
    storageName: '',
    storageCd: '',
    areaCd: '',
    lotNo: '',
    reqQty: '',

    testerId: '',
    testerName: '',
    orderTesterId: '',
    orderTesterName: '',
    orderType: '',
    itemTypeCd: '',
    itemTypeName: '',
    customerName: '',
    customerCd: '',
    expiryDate:'',

    testState: '',
    passState: '',

    qcTestId: '',
})

const saveInfo = async () =>{
    const params = {
        ...form
    }

    const res = await ApiQc.updateQcTestDetailInfo(params)
    vSuccess(res.message)
    closeDialog()
}

const deleteInfo = async () =>{
    if(!confirm('정말 삭제하시겠습니까?')){
        return;
    }

    const res = await ApiQc.deleteQcTest(form.qcTestId)
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
    itemTypeCds.value = await ApiCommon.getCodeList('item_Type_Cd')
    testStates.value = await ApiCommon.getCodeList('test_state')
    passStates.value = await ApiCommon.getCodeList('pass_state')
    form.qcTestId = dialogRef.value.data.qcTestId

    const res = await ApiQc.getQcTestDetailInfo(form.qcTestId)
    Object.assign(form , res)

    console.log(  'res ' , res)

    if ( res.itemTypeCd === 'M1') {
        isExpirDate.value =true
        isOrderType.value =true
    }else if ( res.itemTypeCd === 'M2') {
        isOrderType.value =true
    }
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>

</style>
