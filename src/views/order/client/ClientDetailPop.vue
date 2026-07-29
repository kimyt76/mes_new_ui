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
                    <DatePicker v-model="form.clientRegDate" showIcon class="w-full" />
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
        </div>
        <div class="grid mb-1">
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
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.email" class="w-full" />
                    <label>이메일</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.managerRank" class="w-full" />
                    <label>관리등급</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.managerRank2" class="w-full" />
                    <label>관리등급2</label>
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
                    <InputText v-model="form.groupsCode" class="w-full" />
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
    <h5 class="m-0">- 결재조건</h5>
    <div class="flex justify-end gap-2">
        <Button label="추가+" @click="addRowC" class="p-button-xm" />
    </div>
</div>

<div class="w-full" ref="tableWrapper">
    <DataTable
        :value="clientApprovalList"
        scrollHeight="300px"
        show-gridlines
        scrollable
        class="my-table fixed-datatable"
    >
        <Column field="approvalOption"           header="옵션"    :style="{ width: '70px' }"   >
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.approvalOption"
                    class="w-full"
                    :options="approvalOptions"
                    option-label="codeNm"
                    option-value="code"
                />
            </template>
        </Column>
        <Column field="firstAmt"      header="선금(%)"  :style="{ width: '110px'}" >
            <template #body="slotProps">
                 <InputNumber v-model="slotProps.data.firstAmt" suffix=" %" class="w-full" />
            </template>
        </Column>
        <Column field="middleAmt"    header="중도금(%)"    :style="{ width: '100px'}" >
            <template #body="slotProps">
                <InputNumber v-model="slotProps.data.middleAmt" suffix=" %" class="w-full" />
            </template>
        </Column>
        <Column field="lastAmt"       header="잔금(출고전)"  :style="{ width: '120px'}" >
            <template #body="slotProps">
                <InputNumber v-model="slotProps.data.lastAmt" suffix=" %" class="w-full" />
            </template>
        </Column>
        <Column field="credit"     header="신용(%)"    :style="{ width: '120px'}" >
            <template #body="slotProps">
                <InputNumber v-model="slotProps.data.credit" suffix=" %" class="w-full"/>
            </template>
        </Column>
        <Column field="creditPeriod"     header="신용기간"  suffix=" 일"  :style="{ width: '200px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.creditPeriod" class="w-full" />
            </template>
        </Column>
        <Column field="paymentMethod"     header="결재방식"    :style="{ width: '200px'}" >
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.paymentMethod"
                    class="w-full"
                    :options="paymentMethods"
                    option-label="codeNm"
                    option-value="code"
                />
            </template>
        </Column>
        <Column field="actions" header="-" :style="{ width: '50px', textAlign: 'center' }">
            <template #body="slotProps">
                <i  class="pi pi-trash cursor-pointer" @click="removeRowC(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 고객사 거래 정보</h5>
    <div class="flex justify-end gap-2">
        <Button label="추가+" @click="addRowD" class="p-button-xm"/>
    </div>
</div>

<div class="w-full" ref="tableWrapper">
    <DataTable
        :value="clientDealList"
        scrollHeight="300px"
        show-gridlines
        scrollable
        class="my-table fixed-datatable"
    >
        <Column field="year"      header="년도(년)"  :style="{ width: '110px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.year" class="w-full"/>
            </template>
        </Column>
        <Column field="salesAmt"    header="매출금액"    :style="{ width: '100px', textAlign: 'right'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.salesAmt" class="w-full" />
            </template>
        </Column>
        <Column field="dealAmt"       header="거래금액"  :style="{ width: '120px', textAlign: 'right'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.dealAmt" class="w-full"/>
            </template>
        </Column>
        <Column field="orderQty"     header="수주건수"    :style="{ width: '120px', textAlign: 'right'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.orderQty" class="w-full"/>
            </template>
        </Column>
        <Column field="managerName"     header="담당자"    :style="{ width: '200px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.managerName" class="w-full" />
            </template>
        </Column>
        <Column field="lastDealDate"     header="마지막출고일자"    :style="{ width: '200px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.lastDealDate" class="w-full" />
            </template>
        </Column>
        <Column field="actions" header="-" :style="{ width: '50px', textAlign: 'center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowD(slotProps.index)" ></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 담당자</h5>
    <div class="flex justify-end gap-2">
        <Button label="추가+" @click="addRowU" class="p-button-xm" />
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
        <Column field="businessManagerName" header="영업담당자"    :style="{ width: '100px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.businessManagerName" class="w-full"/>
            </template>
        </Column>
        <Column field="regDate"             header="등록일"  :style="{ width: '100px'}" >
            <template #body="slotProps">
                <DatePicker v-model="slotProps.data.regDate" class="w-full" />
            </template>
        </Column>
        <Column field="brandName"           header="브랜드"    :style="{ width: '120px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.brandName" class="w-full" />
            </template>
        </Column>
        <Column field="deptName"       header="부서"  :style="{ width: '120px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.deptName" class="w-full"/>
            </template>
        </Column>
        <Column field="managerName"     header="이름"    :style="{ width: '120px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.managerName" class="w-full"/>
            </template>
        </Column>
        <Column field="jobPosition"     header="직책"    :style="{ width: '100px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.jobPosition" class="w-full"/>
            </template>
        </Column>
        <Column field="tel"     header="연락처"    :style="{ width: '120px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.tel" class="w-full" />
            </template>
        </Column>

        <Column field="directTel"     header="직통전화"    :style="{ width: '120px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.directTel" class="w-full"/>
            </template>
        </Column>

        <Column field="email"     header="이메일"    :style="{ width: '180px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.email" class="w-full" />
            </template>
        </Column>
        <Column field="homepage"     header="홈페이지"    :style="{ width: '200px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.homepage" class="w-full"/>
            </template>
        </Column>
        <Column field="workplace"     header="근무지"    :style="{ width: '100px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.workplace" class="w-full"/>
            </template>
        </Column>
        <Column field="actions" header="-"    :style="{ width: '20px'}" style="text-align: left;" >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowU(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-4">
    <h5 class="m-0">- 사업장 주소</h5>
        <Button label="추가+" @click="addRowA" class="p-button-xm" />
</div>
<div class="w-full">
    <DataTable
        :value="clientAddressList"
        scrollable
        scrollHeight="300px"
        show-gridlines
        class="my-table fixed-datatable"
    >
        <Column field="addressType"     header="구분"    :style="{ width: '200px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.addressType" class="w-full"/>
            </template>
        </Column>
        <Column field="location"     header="소재지"    :style="{ width: '200px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.location" class="w-full"/>
            </template>
        </Column>
        <Column field="address"       header="주소"     :style="{ width: '600px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.address" class="w-full" />
            </template>
        </Column>
        <Column field="actions"     header="-"          :style="{ width: '20px'}" style="text-align: center;" >
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
        <Column field="managerName"       header="담당자"     :style="{ width: '100px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.managerName"  class="w-full"/>
            </template>
        </Column>
        <Column field="changeDate"       header="변경일"     :style="{ width: '100px'}" >
            <template #body="slotProps">
                <DatePicker v-model="slotProps.data.changeDate" class="w-full" />
            </template>
        </Column>
        <Column field="historyContents"        header="변경내용"      :style="{ width: '800px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.historyContents" class="w-full" />
            </template>
        </Column>
        <Column field="actions"     header="-"  :style="{ width: '20px'}" style="text-align: center;" >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowH(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
</div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase'
import { ApiCommon } from '@/api/apiCommon'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { isEmpty, todayKST } from '@/util/common'
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
const clientApprovalList = ref([])
const clientDealList = ref([])
const clientManagerList = ref([])
const clientAddressList = ref([])
const clientHistoryList = ref([])

const deleteApprovalIds = ref([])
const deleteDealIds = ref([])
const deleteManagerIds = ref([])
const deleteAddressIds = ref([])
const deleteHistoryIds = ref([])

const isBusinessType = ref(false)
const form = reactive({
    clientId: '',
    businessNo: '',
    clientName: '',
    clientType: '',
    clientTypeName: '',
    tradeType: '',
    clientRegDate: todayKST(),
    responSalesBiz: '',
    establishDate: null,
    president: '',
    businessType: '',
    businessItem: '',
    telNo: '',
    faxNo: '',
    homepage: '',
    managerRank: '',
    managerRank2: '',
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

const approvalOptions = ref([
    {codeNm: '기본', code: 'B'},
    {codeNm: '신용1', code: 'C1'},
    {codeNm: '신용2', code: 'C2'},
    {codeNm: '조건1', code: 'D'},
])
const paymentMethods = ref([
    {codeNm: 'L/C', code: 'LC'},
    {codeNm: 'T/T', code: 'TT'},
    {codeNm: 'D/P', code: 'DP'},
    {codeNm: 'D/A', code: 'DA'},
    {codeNm: '현금', code: 'CS'},
    {codeNm: '어음', code: 'PN'},
    {codeNm: '국채', code: 'ND'},
])

const validChk = () => {
    if ( isEmpty(form.clientName)) {
        vInfo('고객사명을 입력하세요.')
        return
    }
    if ( isEmpty(form.businessNo)) {
        vInfo('사업자번호를 입력하세요.')
        return
    }
    if ( isEmpty(form.establishDate)) {
        vInfo('설립일자를 입력하세요.')
        return
    }
    if ( isEmpty(form.clientRegDate)) {
        vInfo('등록일자를 입력하세요.')
        return
    }


}

const saveInfo = async () =>{

    if ( !validChk ) return

    const params = {
        clientInfo: form,
        clientApprovalList: clientApprovalList.value,
        clientDealList: clientDealList.value,
        clientManagerList: clientManagerList.value,
        clientAddressList: clientAddressList.value,
        clientHistoryList: clientHistoryList.value,

        deleteApprovalIds: deleteApprovalIds.value,
        deleteDealIds: deleteDealIds.value,
        deleteManagerIds: deleteManagerIds.value,
        deleteAddressIds: deleteAddressIds.value,
        deleteHistoryIds: deleteHistoryIds.value,
    }

    try {
        const res = await ApiBase.saveClientInfo(params)
        vSuccess(res.message)
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

const addRowC = () => {
    clientApprovalList.value.push({
        clientApprovalId: null,
        approvalOption: '',
        firstAmt: 0,
        middleAmt: 0,
        lastAmt: 0,
        credit: '',
        creditPeriod: '',
        paymentMethod: '',
        orderDist: clientApprovalList.value.length + 1,
    })
}

const addRowD = () => {
    clientDealList.value.push({
        clientDealId: null,
        year: null,
        salesAmt: 0,
        dealAmt: 0,
        orderQty: 0,
        managerName: '',
        lastDealDate: '',
        orderDist: clientDealList.value.length + 1,
    })
}

const addRowU = () => {
    clientManagerList.value.push({
        clientManagerId: null,
        managerName: null,
        businessManagerName: '',
        regDate: '',
        brandName: '',
        deptName: '',
        managerName: '',
        jobPosition: '',
        tel: '',
        directTel: '',
        email: '',
        homepage: '',
        workplace: '',
        orderDist: clientManagerList.value.length + 1,
    })
}

const addRowA = () => {
    clientAddressList.value.push({
        clientAddressId: null,
        addressType: '',
        location: '',
        address: '',
        orderDist: clientAddressList.value.length + 1,
    })
}

const addRowH = () => {
    clientHistoryList.value.push({
        clientHistoryId: null,
        managerName: '',
        changeDate: '',
        historyContents: '',
        orderDist: clientHistoryList.value.length + 1,
    })
}

/**
 * 화면에서 행을 제거하고, DB에 저장된 행이면 삭제 ID 목록에 추가한다.
 * 신규 행은 PK가 없으므로 화면에서만 제거된다.
 */
const removeRow = (listRef, index, idField, deleteIdsRef) => {
    const row = listRef.value[index]

    if (!row) return

    const deleteId = row[idField]

    if (!isEmpty(deleteId) && !deleteIdsRef.value.includes(deleteId)) {
        deleteIdsRef.value.push(deleteId)
    }

    listRef.value.splice(index, 1)
    // 삭제 후 순번 재설정
    listRef.value.forEach((item, idx) => {
        item.orderDist = idx + 1
    })
}

const removeRowC = (index) => {
    removeRow(clientApprovalList, index, 'clientApprovalId', deleteApprovalIds)
}

const removeRowD = (index) => {
    removeRow(clientDealList, index, 'clientDealId', deleteDealIds)
}

const removeRowU = (index) => {
    removeRow(clientManagerList, index, 'clientManagerId', deleteManagerIds)
}

const removeRowA = (index) => {
    removeRow(clientAddressList, index, 'clientAddressId', deleteAddressIds)
}

const removeRowH = (index) => {
    removeRow(clientHistoryList, index, 'clientHistoryId', deleteHistoryIds)
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
        clientApprovalList.value = res.clientApprovalList || []
        clientDealList.value = res.clientDealList || []
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
