<template>
<Card style="width: 70rem; height: 42rem;">
    <template #content>
         <!-- Row 1 -->
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.customerType"
                            :options="customerTypes"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>거래처구분</label>
                </FloatLabel>
            </div>
            <div class="col-6 flex">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerCd" class="w-full" />
                    <label>사업자번호</label>
                </FloatLabel>
                <Button icon="pi pi-search"
                    label="중복체크"
                    class="p-button-text p-mt-2"
                    @click="checkCustomerCd"
                    />
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerName" class="w-full" />
                    <label>상호명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.managerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop"/>
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3" v-if="btnVisible">
                <FloatLabel variant="on">
                    <InputText v-model="form.businessType" class="w-full" />
                    <label>업태</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.businessItem" class="w-full" />
                    <label>종목</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.president" class="w-full" />
                    <label>대표자명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.tel" class="w-full" />
                    <label>전화</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.fax" class="w-full" />
                    <label>팩스</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.presidentTel" class="w-full" />
                    <label>휴대폰</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.email" class="w-full" />
                    <label>이메일</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerManager" class="w-full" />
                    <label>거래처담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerManagerTel" class="w-full" />
                    <label>담당자핸드폰</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.customerGrp1"
                            :options="customerGrp1s"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>그룹유형1</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.customerGrp2"
                            :options="customerGrp2s"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>그룹유형2</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.zipCode" class="w-full" />
                    <label>우편번호</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.tradingMethod" class="w-full" />
                    <label>거래방법</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.address" class="w-full" />
                    <label>주소</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.bankName" class="w-full" />
                    <label>은행명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.accountNo" class="w-full" />
                    <label>계좌번호</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.searchText" rows="3" class="w-full" style="resize: none" />
                    <label>검색창내용</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" rows="3" class="w-full" style="resize: none" />
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Buttons -->
        <div class="flex gap-2 justify-end pt-3">
            <Button label="저장" severity="secondary" @click="saveInfo"></Button>
            <Button label="닫기" @click="closeDialog"></Button>
        </div>
    </template>
</Card>


</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef');
const { userId, memberNm } = useAuthStore()
const { vError, vSuccess, vInfo, vWarning } = useAlertStore()

const btnVisible = ref(false)
const customerTypes = ref([])
const customerGrp1s = ref([])
const customerGrp2s = ref([])
const form = reactive({
    customerTypes: '',
    customerCd: '',
    customerName: '',
    managerName: '',
    manaserId: '',
    businessType: '',
    businessItem: '',
    president: '',
    tel: '',
    fax: '',
    presidentTel: '',
    email: '',
    customerManager: '',
    customerManagerTel: '',
    customerGrp1: '',
    customerGrp2: '',
    zipCode: '',
    tradingMethod: '',
    address: '',
    bankName: '',
    accountNo: '',
    searchText: '',
    etc: '',

    userId: userId,
})

const saveInfo = async () =>{
    try{
        const params = {
        ...form
        }

        const msg = await ApiBase.saveCustomerInfo(params)
        vSuccess(msg)
    }catch(err){
        vError(err.message)
    }
}

onMounted( async () => {
    // 거래처구분 코드조회
    customerTypes.value = await ApiCommon.getCodeList('CUSTOMER_TYPE')
    customerGrp1s.value = await ApiCommon.getCodeList('CUSTOMER_GRP1')
    customerGrp2s.value = await ApiCommon.getCodeList('CUSTOMER_GRP2')

    if ( dialogRef.value.data ) {
        const res = await ApiBase.getCustomerInfo(dialogRef.value.data)
        Object.assign(form, res)
    }else{
        form.managerName = memberNm
        form.manaserId = userId
        btnVisible.value = true
    }
})

const openPop = () => {
    dialog.open( CustomerListPop, {
        props: {
            header: '사용자 조회',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
            // 기타 PrimeVue Dialog props 설정
        },
        // 팝업 B에 전달할 데이터
        onClose:(event) => {
            if (event.data) {
                console.log('부모에서 데이터 수신:', event.data);
                form.managerName = event.data.memberNm;
                form.manaserId = event.data.userId;
            }
        },
    })
}

const checkCustomerCd = async () =>{
    const checkYn = await ApiBase.getCheckCustomerCd(form.customerCd)

    if ( checkYn === 'N') {
        vInfo("사용할 수 있는 번호입니다.")
    }else{
        vWarning("사용할 수 없는 번호입니다.")
        form.customerCd = ''
    }
}

const closeDialog = () => {
  dialogRef.value.close();
};
</script>

<style scoped>

</style>
