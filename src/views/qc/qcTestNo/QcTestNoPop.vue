<template>
<Card style="width: 50rem; height: 22rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.testNo" class="w-full" readonly/>
                    <label>시험번호</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.createDate" class="w-full" readonly/>
                    <label>입고일</label>
                </FloatLabel>
            </div>
             <div class="col-6">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.customerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop"/>
                    </IconField>
                    <label>관련고객사</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd"
                            :options="itemTypeCds"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full"
                            readonly
                            />
                    <label>품목구분</label>
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
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.lotNo" class="w-full" />
                    <label>로트번호</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.makeNo" class="w-full" />
                    <label>제조번호</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-5">
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.expiryDate" class="w-full" showIcon inputClass="w-full"/>
                    <label>사용기한</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.shelfDate" class="w-full" showIcon inputClass="w-full" />
                    <label>보관기한</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.endYn"
                            :options="useYns"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>종료여부</label>
                </FloatLabel>
            </div>
        </div>
         <div class="grid mb-5">
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
    </template>
</Card>
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="바코드" icon="pi pi-barcode"  outlined @click="barcodePrint"></Button>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const { vSuccess, vInfo, vWarning} = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const itemTypeCds = ref([])
const testStates = ref([])
const passStates = ref([])
const selectedItem = ref([])
const useYns = ref([])
const form  = reactive({
    itemTypeCd: null,
    itemCd: null,
    itemName: null,
    createDate: null,
    lotNo: null,
    makeNo: null,
    testNo: null,
    expiryDate: null,
    shelfDate: null,
    customerName: null,
    testState: null,
    passState: null,
    endYn: null,


    qty: 0,

    testId: '',
})

const saveInfo = async () =>{
    try{
        const params = {
            ...form
        }

        const res = await ApiQc.updateItemTestNoInfo(params)
        vSuccess(res.message)

    }catch(err){
        handleApiError(err)
    }
}

const openPop = () =>{
    dialog.open(CustomerListPop, {
        props:{
            header: '거래처 검색',
            modal: true,
            draggable: true,
            resizable: false,
        },
        onClose:(event) => {
            if(event){
                console.log ('event', event)
                form.customerName = event.data.customerName
                form.customerCd = event.data.customerCd
            }
        },
    })
}

const barcodePrint = () =>{
    const itemList = [
        {
            itemCd: form.itemCd,
            itemName: form.itemName,
            lotNo: form.lotNo,
            testNo: form.testNo,
            expiryDate: form.expiryDate,
            qty: form.qty,
            printCnt: 1
        }
    ]

    dialog.open(QrCodePop, {
        props:{
            header: 'QR코드 라벨 출력',
            modal: true,
            draggable: true,
            resizable: false,
            style: { width: '80rem', maxWidth: '80rem' },
            contentStyle: { height: '30rem', overflow: 'hidden' },
        },
        data:{
            menuType:'QC',
            itemList ,
        }
    })
}

onMounted(async () =>{
    // 공통코드 조회
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    testStates.value = await ApiCommon.getCodeList('TEST_STATE')
    passStates.value = await ApiCommon.getCodeList('PASS_STATE')
    useYns.value = await ApiCommon.getCodeList('USE_YN')

    const res = await ApiQc.getItemTestNoInfo(dialogRef.value.data.testNo)
    // Initialize form with retrieved data
    Object.assign(form, res)
})

const closeDialog =() =>{
    dialogRef.value.close()
}

</script>

<style scoped>

</style>
