<template>
<Card style="width: 95rem; height: 24rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-6">
                <div class="flex gap-2 align-items-center">
                <FloatLabel variant="on">
                    <InputText v-model="form.businessNo" class="w-full" />
                    <label>사업자번호</label>
                </FloatLabel>
                <Button
                    label="중복체크"
                    severity="secondary"
                    @click="checkNo"
                    />
                    <span>번호만 입력하세요 ('-' 제외)</span>
                </div>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.clientName" class="w-full" />
                    <label>고객사명(상호)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.regDate" showIcon class="w-full" />
                    <label>등록일자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.establishDate" showIcon class="w-full" />
                    <label>설립일자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.clientType"
                    :options="clientType"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>사업자구분</label>
                </FloatLabel>
            </div>
            <div class="col-3" v-if="isBusinessType" >
                <FloatLabel variant="on" >
                    <InputText v-model="form.clientTypeName" class="w-full" />
                    <label>기타</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.tradeType"
                    :options="tradeTypes"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>거래구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.firstTradeDate" class="w-full" />
                    <label>최초거래일자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.president" class="w-full" />
                    <label>대표자명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.businessType" class="w-full" />
                    <label>업태</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.businessItem" class="w-full" />
                    <label>종목</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.paymentCondition" class="w-full" />
                    <label>결제조건</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.telNo" class="w-full"  @blur="onBlur('T')"/>
                    <label>대표전화</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.faxNo" class="w-full" @blur="onBlur('F')"/>
                    <label>대표팩스</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.homepage" class="w-full" />
                    <label>홈페이지</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.responSalesBiz"
                    :options="responSalesBizs"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>책임판매업</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.saleManagerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('M')" />
                    </IconField>
                    <label>영업담당자(정)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.saleManagerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('S')" />
                    </IconField>
                    <label>영업담당자(부)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.groupCd" class="w-full" />
                    <label>그룹코드</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.groupName" class="w-full" />
                    <label>그룹</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.groupsName" class="w-full" />
                    <label>그룹사코드</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.groupsName" class="w-full" />
                    <label>그룹사명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.paymentCd" class="w-full" />
                    <label>결제회사코드</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.paymentName" class="w-full" />
                    <label>결제회사</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 담당자</h5>
    <div class="flex justify-end gap-2">
    <Button
        label="추가+"
        @click="addRowU"
        class="p-button-xm"
    />
    </div>
</div>
<div class="w-full" ref="tableWrapper">
    <DataTable
        :value="clientManagerList"
        scrollHeight="300px"
        show-gridlines
        scrollable
        class="my-table fixed-datatable"
    >
        <Column field="deptName"           header="부서"    :style="{ width: '100px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.deptName"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="managerName"      header="이름"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.managerName"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="jobPosition"    header="직책"    :style="{ width: '100px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.jobPosition"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="tel"       header="연락처"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.tel"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="directTel"     header="직통번호"    :style="{ width: '120px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.directTel"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="email"     header="이메일"    :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.email"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="actions" header="-"    :style="{ width: '20px'}" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowU(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-4">
    <h5 class="m-0">- 주소</h5>
    <Button
        label="추가+"
        @click="addRowA"
        class="p-button-xm"
    />
</div>
<div class="w-full">
    <DataTable
        :value="clientAddressList"
        scrollable
        scrollHeight="300px"
        show-gridlines
        class="my-table fixed-datatable"
    >
        <Column field="address"       header="주소"     :style="{ width: '600px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.address"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="actions"     header="-"          :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowA(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-4">
    <h5 class="m-0">- 변경이력</h5>
    <Button
        label="추가+"
        @click="addRowH"
        class="p-button-xm"
    />
</div>
<div class="w-full">
    <DataTable
        :value="clientHistoryList"
        scrollable
        scrollHeight="300px"
        show-gridlines
        class="my-table fixed-datatable"
    >
        <Column field="changeDate"       header="변경일"     :style="{ width: '80px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.changeDate"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="historyContents"        header="변경내용"      :style="{ width: '90px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.historyContents"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="actions"     header="-"          :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowH(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" severity="secondary" @click="saveInfo"></Button>
    <Button label="닫기" @click="closeDialog"></Button>
</div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase'
import { ApiCommon } from '@/api/apiCommon'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { isEmpty } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { DatePicker, useDialog } from 'primevue'
import { inject, onMounted, reactive, ref, watch } from 'vue'

const {vSuccess, vInfo, vWarning} = useAlertStore()
const dialog = useDialog()
const { userId} = useAuthStore()
const dialogRef = inject('dialogRef')
const tradeTypes = ref([])
const clientType = ref([])
const responSalesBizs = ref([])
const clientManagerList = ref([])
const clientAddressList = ref([])
const clientHistoryList = ref([])
const isBusinessType = ref(false)
const form = reactive({
    clientId: '',
    businessNo: '',
    clientName: '',
    clientType: '',
    clientTypeName: '',
    tradeType: '',
    regDate: '',
    responSalesBiz: '',
    establishDate: '',
    president: '',
    businessType: '',
    businessItem: '',
    telNo: '',
    faxNo: '',
    homepage: '',
    addressId: '',
    managerId: '',
    paymentCondition: '',
    saleManagerId: '',
    saleManagerIdB: '',
    groupCd: '',
    groupName: '',
    groupsCd: '',
    groupsName: '',
    paymentCd: '',
    paymentName: '',
    useYn: '',
    saleManagerName: '',
    saleManagerNameB: '',

    userId: userId,
})


const saveInfo = async () =>{
    if ( isEmpty(form.clientName)) {
        vInfo('고객사명을 입력하세요.')
        return
    }
    if ( isEmpty(form.businessNo)) {
        vInfo('사업자번호를 입력하세요.')
        return
    }

    const params = {
        clientInfo: form,
        clientManagerList: clientManagerList.value,
        clientAddressList: clientAddressList.value,
        clientHistoryList: clientHistoryList.value,
    }

    try {
        const msg = await ApiBase.saveClientInfo(params)
        vSuccess(msg.data.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const openPop = (type) =>{
    dialog.open(UserListPop, {
        props:{
            header:'사용자 목록',
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
        },
        onClose: (event) => {
            if (type === 'M') {
                form.saleManagerId = event.data.userId
                form.saleManagerName = event.data.memberNm
            }else{
                form.saleManagerIdB = event.data.userId
                form.saleManagerNameB = event.datamemberNm
            }
        }
    })
}

const addRowU = () =>{
    let nextId = clientManagerList.value.length
    clientManagerList.value.push({
        id: nextId++,
        deptName: '',
        managerName:'',
        jobPosition: '',
        tel: '',
        directTel : '',
        email : '',
    })
}
const addRowA = () =>{
    let nextId = clientAddressList.value.length
    clientAddressList.value.push({
        id: nextId++,
        address: '',
    })
}
const addRowH = () =>{
    let nextId = clientHistoryList.value.length
    clientHistoryList.value.push({
        id: nextId++,
        changeDate: '',
        historyContents: '',
    })
}
const removeRowU = (index) =>{
    clientManagerList.value.splice(index, 1)
}
const removeRowA = (index) =>{
    clientAddressList.value.splice(index, 1)
}
const removeRowH = (index) =>{
    clientHistoryList.value.splice(index, 1)
}

watch(() => form.clientType, async (newVal) => {
  if ( form.clientType === 'E' ){
    isBusinessType.value = true
  }else{
    isBusinessType.value = false
  }
})

onMounted( async () =>{
  tradeTypes.value = await ApiCommon.getCodeList('trade_type')
  clientType.value = await ApiCommon.getCodeList('client_type')
  responSalesBizs.value = await ApiCommon.getCodeList('respon_sales_biz')
  form.clientId = dialogRef.value.data

    if (!isEmpty(form.clientId)) {
        const res = await ApiBase.getClientInfo(form.clientId)

        Object.assign(form, res.clientInfo)
        clientManagerList.value = res.clientManagerList || []
        clientHistoryList.value = res.clientHistoryList || []
        clientAddressList.value = res.clientAddressList || []
    }
})

const checkNo = async () => {
  if (isEmpty(form.businessNo)) return vInfo('사업자 번호를 입력하세요')

  const checkVal = await ApiBase.getBusinessNoChecked(form.businessNo)

  if (checkVal === 'Y') {
    vInfo('등록 가능한 사업자 번호입니다.')
  } else {
    vWarning('등록된 사업자 번호입니다.')
    form.businessNo = ''
  }
}

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8px 6px 0.2rem 0.1rem;
  font-size: 16px;
  text-align: center;
  font-family: monaco, Consolas;
}

.fixed-datatable .p-datatable-wrapper {
  height: calc(300px - 42px) !important; /* 헤더 높이 42px 정도 */
}

</style>
