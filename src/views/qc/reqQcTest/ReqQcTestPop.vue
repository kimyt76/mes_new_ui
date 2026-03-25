<template>
 <div class="flex w-full">
    <!-- 왼쪽 폼 -->
    <div class="left-panel mt-3 ml-2">
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.reqDate" class="w-full" readonly/>
                    <label>의뢰일</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.reqTesterName" class="w-full" readonly/>
                    <label>시험의뢰자</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerName" class="w-full" readonly/>
                    <label>구매처</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemTypeName" class="w-full" readonly/>
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
                    <InputText v-model="form.lotNo" class="w-full" readonly/>
                    <label>로트번호</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.makeNo" class="w-full" readonly/>
                    <label>제조번호</label>
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
                    <IconField iconPosition="left">
                        <InputText v-model="form.testerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('T')"/>
                    </IconField>
                    <label>시험접수자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.testState"
                            :options="testStates"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full"/>
                    <label>시험상태</label>
                </FloatLabel>
            </div>
            <div class="col-3 req-date-box">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.testDate" showIcon
                        :pt="{
                            input: { style: 'width: 80px;' }  // input만 줄임
                        }"
                    />
                    <label>시험일</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.orderTesterName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('O')"/>
                    </IconField>
                    <label>시험지시자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.confirmTesterName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('C')"/>
                    </IconField>
                    <label>시험확인자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.passState"
                            :options="passStates"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full"/>
                    <label>판정상태</label>
                </FloatLabel>
            </div>
            <div class="col-3 req-date-box">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.confirmDate" showIcon
                        :pt="{
                            input: { style: 'width: 80px;' }  // input만 줄임
                        }"
                    />
                    <label>판정일자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-3">
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.sampleTesterName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('S')"/>
                    </IconField>
                    <label>검체채취자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.sampleQty" class="w-full" :inputStyle="{ width: '70px', 'text-align': 'right' }"/>
                    <label>검체채취량(ea)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.testQty" class="w-full" :inputStyle="{ width: '70px', 'text-align': 'right' }"/>
                    <label>검사샘플량(ea)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.orderType" class="w-full" />
                    <label>QC코드</label>
                </FloatLabel>
            </div>
         <div class="grid mb-3"></div>
            <div v-if="isOrderType" class="col-3">
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
        <div class="grid mb-3">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" rows="4"  class="w-full"  style="resize: none;"/>
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </div> <!-- 왼쪽 폼  end-->
    <!-- 오른쪽 리스트 -->
    <div class="right-panel mt-3 ml-2">
        <div class="flex gap-2 items-center">
            <Button label="검사유형" outlined size="small" @click="openPop('M')" />
            <Button label="항목 +" outlined size="small" @click="addRow"/>
        </div>
        <div class="mt-2">
            <CommonEditTable
                v-model="qcTestTypeMethodList"
                v-model:selection="selectItem"
                :columns="methodColumns"
                dataKey="qcTestMethodId"
                :selectable="true"
                selectionMode="multiple"
                :showDelete="true"
                :validators="validators"
                @remove-row="removeRow"
            />
        </div>
    </div>
 </div>
 <div class="flex gap-2 mt-3 ">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="성적서(PDF)" outlined />
    <Button label="성적서(EXCEL)" outlined />
    <Button label="시험일지(EXCEL)" outlined />
    <Button label="닫기" outlined @click="closeDialog" />
 </div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import CommonEditTable from '@/components/CommonEditTable.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { todayKST } from '@/util/common';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import QcTestTypeListPop from '../qcTestType/QcTestTypeListPop.vue';

const { memberNm } = useAuthStore()
const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialogRef = inject('dialogRef')
const dialog = useDialog()
const isAllSelected = computed(() => {
  return (
    qcTestTypeMethodList.value.length > 0 &&
    selectItem.value.length === qcTestTypeMethodList.value.length
  )
})
const isOrderType = ref(false)
const isExpirDate = ref(false)
const selectItem = ref([])
const testStates = ref([])
const passStates = ref([])
const deleteIds = ref([])
const qcTestTypeMethodList = ref([])
const form = reactive({
    reqDate: '',
    itemCd: '',
    itemTypeName: '',
    itemTypeCd: '',
    itemName: '',
    lotNo : '',
    makeNo: '',
    testNo: '',
    testDate: '',
    confirmDate: '',

    reqTesterId: '',
    reqTesterName: '',

    testerName: '',
    testerId: '',
    orderTesterName: '',
    orderTesterId: '',
    confirmTesterName:'',
    confirmTesterId:'',
    sampleTesterName: '',
    sampleTesterId: '',

    testState: '',
    passState: '',
    qcCd: '',

    sampleQty: '',
    testQty: '',
    orderType: '',
    expiryDate: '',
    etc: '',

    qcTestId: '',
})

const methodColumns = [
  { field: 'distOrder',     header: 'No', width: '40px', editor: 'number', align: 'center' },
  { field: 'testItem',      header: '검사항목', width: '100px', editor: 'text', align: 'center' },
  { field: 'testMethod',    header: '시험방법', width: '320px', editor: 'textarea', multiline: true },
  { field: 'testSpec',      header: '시험기준', width: '220px', editor: 'textarea', multiline: true },
  { field: 'testResult',    header: '시험결과', width: '140px', editor: 'textarea', multiline: true },
  { field: 'testDateString', header: '시험일자', width: '120px', editor: 'text', align: 'center' , multiline: true },
  { field: 'testerName',    header: '시험자', width: '90px', editor: 'text', align: 'center' },
  { field: 'passState',     header: '판정', width: '100px', editor: 'text', align: 'center' }
]

const validators = {
  distOrder: (value) => {
    const num = Number(value)
    if (Number.isNaN(num) || num < 0) return false
    return num
  },
  testItem: (value) => String(value ?? '').trim(),
  testMethod: (value) => String(value ?? '').trim(),
  testSpec: (value) => String(value ?? '').trim(),
  testResult: (value) => String(value ?? '').trim(),
  testDateString: (value) => String(value ?? '').trim(),
  testerName: (value) => String(value ?? '').trim(),
  passState: (value) => String(value ?? '').trim()
}

const saveInfo = () =>{
    const params = {
        qcTestInfo : form,
        deleteIds : deleteIds.value,
        qcTestTypeMethodList
    }

    const res = ApiQc.updateQcTestInfo(params)
}

const openPop = (type) =>{
    let title = ''
    let componentPop = ''

    if (  type === 'M' ) {
        title = '검사유형 선택'
        componentPop = QcTestTypeListPop
    }else{
        title = '담당자 목록'
        componentPop = UserListPop
    }

    dialog.open(componentPop, {
        props:{
            header: title,
            modal: true,
            draggable: false,
        },
        onClose: (event) =>{
            if ( event ) {
                if ( type === 'T' ) {
                    form.testerId = event.data.userId
                    form.testerName = event.data.memberNm
                }else if( type === 'O' ) {
                    form.orderTesterId = event.data.userId
                    form.orderTesterName = event.data.memberNm
                }else if( type === 'C' ) {
                    form.confirmTesterId = event.data.userId
                    form.confirmTesterName = event.data.memberNm
                }else if( type === 'S' ) {
                    form.sampleTesterId = event.data.userId
                    form.sampleTesterName = event.data.memberNm
                }else if( type === 'M' ) {
                    if ( event.data.length === 0 ){
                        vWarning("검사유형 정보가 없습니다. 품목검사정보를 등록하세요!!")
                        return
                    }else{
                        addRows(event.data)
                    }
                }
            }
        }
    })
}


const addRows = (rows)  =>{
    if (!Array.isArray(rows) || rows.length === 0) return

    const startOrder = qcTestTypeMethodList.value.length

    const mappedRows = rows.map((row, idx) => ({
        testTypeMethodId: row.testTypeMethodId ?? null,
        distOrder: startOrder+idx+1,
        testItem: row.testItem ?? '',
        testMethod: row.testMethod ?? '',
        testSpec: row.testSpec ?? '',
        testResult: row.testResult ?? '',
        testDateString: row.testDateString ?? '',
        testerName: row.testerName ?? '',
        passState: row.passState ?? ''
    }))

    qcTestTypeMethodList.value.push(...mappedRows)

    resetOrder()
}

const addRow = () => {
  const newRow = {
    testTypeMethodId: null,
    distOrder: qcTestTypeMethodList.value.length + 1,
    testItem: '',
    testMethod: '',
    testSpec: '',
    testResult: '',
    testDateString: todayKST(),
    testerName: memberNm,
    passState: '시험중'
  }

  qcTestTypeMethodList.value.push(newRow)

  resetOrder()
}

//순서
const resetOrder = () => {
  qcTestTypeMethodList.value = qcTestTypeMethodList.value.map((row, idx) => ({
    ...row,
    distOrder: idx + 1
  }))
}

const removeRow = (index) =>{
    if (isAllSelected.value) {
        qcTestTypeMethodList.value.forEach(row => {
            if (row.testTypeMethodId) {
                deleteIds.value.push(row.testTypeMethodId)
            }
        })

        qcTestTypeMethodList.value = []
        return
    }

    const row = qcTestTypeMethodList.value[index]

    if (row.testTypeMethodId) {
        deleteIds.value.push(row.testTypeMethodId)
    }
    qcTestTypeMethodList.value.splice(index, 1)
}

onMounted( async () =>{
    testStates.value = await ApiCommon.getCodeList('test_state')
    passStates.value = await ApiCommon.getCodeList('pass_state')

    form.qcTestId =  dialogRef?.value?.data?.qcTestId

    const res = await ApiQc.getQcTestInfo(form.qcTestId)

    if ( res.qcTestInfo.itemTypeCd === 'M1') {
        isExpirDate.value =true
        isOrderType.value =true
    }else if(res.qcTestInfo.itemTypeCd === 'M2') {
        isOrderType.value =true
    }

    Object.assign(form, res.qcTestInfo)

    if ( res.qcTestTypeMethodList.length > 0  ){
        qcTestTypeMethodList.value = res.qcTestTypeMethodList
    }else{
        vWarning("검사유형 정보가 없습니다. 품목검사정보를 등록하세요!!")
        return
    }
})

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
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
.my-table .p-datatable-wrapper {
    height: 300px;       /* 전체 높이 고정 */
}
.my-table .p-datatable-table {
    height: auto !important;   /* 테이블은 내용만큼만 */
}

.left-panel {
  flex: 0 0 30%;
  min-width: 0; /* 중요 */
  border: 1px solid #dcdfe6;
  padding: 18px 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.right-panel {
  flex: 0 0 70%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  padding: 18px 16px;
  box-sizing: border-box;
}

.req-date-box :deep(.p-datepicker) {
  width: auto;
}

.req-date-box :deep(.p-inputtext) {
  width: 100px;
}

::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
}


</style>
