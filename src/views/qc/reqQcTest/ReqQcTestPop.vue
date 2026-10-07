<template>
  <div class="popup-wrap">


  <div class="content-wrap">
        <!-- 왼쪽 폼 -->
    <div class="left-panel mt-3 ml-2">

      <!-- 1행 -->
      <div class="grid mb-2">
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.reqDate" class="w-full" readonly />
            <label>의뢰일</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.reqTesterName" class="w-full" readonly />
            <label>시험의뢰자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.testNo" class="w-full" readonly />
            <label>시험번호</label>
          </FloatLabel>
        </div>
      </div>

      <!-- 2행 -->
      <div class="grid mb-2">
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.itemTypeName" class="w-full" readonly />
            <label>품목구분</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.itemCd" class="w-full" readonly />
            <label>품목코드</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.qcCd" class="w-full" />
            <label>QC코드</label>
          </FloatLabel>
        </div>
      </div>

      <!-- 3행 : 긴 항목 -->
      <div class="grid mb-3">
        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.customerName" class="w-full" readonly />
            <label>구매처</label>
          </FloatLabel>
        </div>
        <div class="col-8">
          <FloatLabel variant="on">
            <InputText v-model="form.itemName" class="w-full" readonly />
            <label>품목명</label>
          </FloatLabel>
        </div>
      </div>

      <!-- 4행 : LOT / 제조번호 -->
      <div class="grid mb-3">
        <div class="col-6">
          <FloatLabel variant="on">
            <InputText v-model="form.lotNo" class="w-full" readonly />
            <label>로트번호</label>
          </FloatLabel>
        </div>
        <div class="col-6">
          <FloatLabel variant="on">
            <InputText v-model="form.makeNo" class="w-full" readonly />
            <label>제조번호</label>
          </FloatLabel>
        </div>
      </div>

      <!-- 5행 -->
      <div class="grid mb-3">
        <div class="col-4">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.testerId" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('T')" />
            </IconField>
            <label>시험접수자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.sampleTesterId" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('S')" />
            </IconField>
            <label>검체채취자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.orderTesterId" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('O')" />
            </IconField>
            <label>시험지시자</label>
          </FloatLabel>
        </div>
      </div>
      <!-- 6행 -->
      <div class="grid mb-3">
        <div class="col-4">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.confirmTesterId" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('C')" />
            </IconField>
            <label>시험확인자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputNumber
              v-model="form.sampleQty"
              class="w-full"
              :minFractionDigits="0"
              :maxFractionDigits="6"
              :inputStyle="{ width: '100%', 'text-align': 'right' }"
            />
            <label> 검체채취량 ({{ ['원재료', '반제품'].includes(form.itemTypeName) ? ' kg' : 'ea' }}) </label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <InputNumber
              v-model="form.testQty"
              class="w-full"
              :minFractionDigits="0"
              :maxFractionDigits="6"
              :inputStyle="{ width: '100%', 'text-align': 'right' }"
            />
             <label> 검사샘플량 ({{ !['원재료', '반제품'].includes(form.itemTypeName) ? 'kg' : 'ea' }}) </label>
          </FloatLabel>
        </div>
      </div>

      <!-- 7행 -->
      <div class="grid mb-3">
        <div class="col-4 req-date-box">
          <FloatLabel variant="on">
            <DatePicker
              v-model="form.testDate"
              showIcon
              class="w-full"
            />
            <label>시험일자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.testState"
              :options="testStates"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
            />
            <label>시험상태</label>
          </FloatLabel>
        </div>
        <div v-if="isOrderType" class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.orderType" class="w-full" readonly />
            <label>거래유형</label>
          </FloatLabel>
        </div>
      </div>
      <!-- 8행 -->
      <div class="grid mb-3">
        <div class="col-4 req-date-box">
          <FloatLabel variant="on">
            <DatePicker
              v-model="form.confirmDate"
              showIcon
              class="w-full"
            />
            <label>판정일자</label>
          </FloatLabel>
        </div>
        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.passState"
              :options="passStates"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
            />
            <label>판정상태</label>
          </FloatLabel>
        </div>
        <div v-if="isExpirDate" class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.expiryDate" class="w-full" readonly />
            <label>사용기한</label>
          </FloatLabel>
        </div>
      </div>

      <!-- 비고 -->
      <div class="grid mb-3">
        <div class="col-12">
          <FloatLabel variant="on">
            <Textarea
              v-model="form.etc"
              rows="3"
              class="w-full"
              style="resize: none;"
            />
            <label>비고</label>
          </FloatLabel>
        </div>
      </div>
    </div>

    <!-- 오른쪽 리스트 -->
    <div class="right-panel mt-3 ml-2">
      <div class="right-toolbar flex gap-2 items-center">
        <Button label="검사유형" outlined size="small" @click="openPop('M')" />
        <Button label="항목 +" outlined size="small" @click="addRow" />
        <Button label="삭제" outlined severity="danger" size="small" @click="removeRow" />
      </div>

      <div class="table-area mt-2">
        <BaseHotTable
          ref="hotTable"
          :data="qcTestTypeMethodList"
          :colHeaders="colHeaders"
          :columns="columns"
          :rowHeaders="false"
          :height="430"
          stretchH="none"
          :afterChange="onAfterChange"
        />
      </div>
    </div>
  </div>

  <div class="flex gap-2 mt-3">
    <Button label="저장" class="p-button-success" @click="saveInfo"></Button>
    <Button label="성적서(PDF)"  class="p-button-info"  @click="printPdf"  />
    <Button label="성적서(EXCEL)" icon="pi pi-file-excel" severity="success"  @click="downLoadExcel('C')" />
    <Button label="시험일지(EXCEL)" icon="pi pi-file-excel" severity="success"  @click="downLoadExcel('T')"/>
    <Button label="닫기" outlined @click="closeDialog" />
  </div>

 </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import BaseHotTable from '@/components/BaseHotTable.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';
import QcTestTypeListPop from '../qcTestType/QcTestTypeListPop.vue';

const { userId, memberNm } = useAuthStore()
const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialogRef = inject('dialogRef')
const dialog = useDialog()
const hotTable = ref(null)
const isOrderType = ref(false)
const isExpirDate = ref(false)
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
    testDate: todayKST(),
    confirmDate: null,

    reqTesterId: '',
    reqTesterName: '',

    testerId: userId,
    orderTesterId: '',
    confirmTesterId:'',
    sampleTesterId: '',

    testState: '',
    passState: '',
    qcCd: '',

    sampleQty: 0,
    testQty: 0,
    orderType: '',
    expiryDate: null,
    etc: '',

    qcTestId: '',
    tranYn: '',
})

const colHeaders = [
    '',
    'NO',
    '검사항목',
    '시험방법',
    '시험기준',
    '시험결과',
    '시험일자',
    '시험자',
    '판정'
]

const columns = [
    {
      data: 'orderDist',
      readOnly: true,
      className: 'htCenter',
      width: 50
    },
  {
    data: 'checked',
    type: 'checkbox',
    className: 'htCenter',
    width: 40
  },
  {
    data: 'testItem',
    type: 'text',
    className: 'htCenter',
    width: 110
  },
  {
    data: 'testMethod',
    type: 'text',
    className: 'htLeft',
    width: 330
  },
  {
    data: 'testSpec',
    type: 'text',
    className: 'htLeft',
    width: 210
  },
  {
    data: 'testResult',
    type: 'text',
    className: 'htLeft',
    width: 130
  },
  {
    data: 'testDateString',
    type: 'text',
    className: 'htCenter',
    width: 120
  },
  {
    data: 'testerName',
    type: 'text',
    className: 'htCenter',
    width: 100
  },
  {
    data: 'passState',
    type: 'text',
    className: 'htCenter',
    width: 100
  }
]

const onAfterChange = (changes, source) => {
    if (!changes || source === 'loadData') return
}

const saveInfo = async () =>{

    if(isEmpty(form.sampleTesterId)) return vWarning('검체채취자 정보를 입력하세요')
    if(isEmpty(form.orderTesterId)) return vWarning('시험지시자 정보를 입력하세요')

    try{
        const params = {
            qcTestInfo : form,
            deleteIds : deleteIds.value,
            qcTestTypeMethodList: qcTestTypeMethodList.value
        }

        const res = await ApiQc.updateQcTestInfo(params)
        vSuccess(res.message)
    }catch(err){
        handleApiError(err)
    }

}

const printPdf = async () =>{
    try {
        // 체크된 row에서 qcTestId만 추출
        const qcTestIds = [form.qcTestId]

        // 서버에 PDF 생성 요청
        const res = await ApiQc.getPrintAll(qcTestIds)

        // blob 생성
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
    } catch (err) {
        handleApiError(err)
    }
}

const downLoadExcel = async (type) =>{
    try {
        let data

        if ( type === 'C') {
            data = await ApiQc.certificateDownloadExcel(form.qcTestId)
        }else{
            data = await ApiQc.tesetDownloadExcel(form.qcTestId)
        }

        const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = type === 'C'? `[${form.testNo}] 시험지시 및 성적서.xlsx`: `[${form.testNo}] 시험일지.xlsx`;
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    } catch(err) {
        handleApiError(err)
    }
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
        checked: false,
        testTypeMethodId: row.testTypeMethodId ?? null,
        orderDist: startOrder+idx+1,
        testItem: row.testItem ?? '',
        testMethod: row.testMethod ?? '',
        testSpec: row.testSpec ?? '',
        testResult: row.testResult ?? '',
        testDateString: row.testDateString ?? todayKST(),
        testerName: row.testerName ?? memberNm,
        passState: row.passState ?? '시험중'
    }))

    qcTestTypeMethodList.value.push(...mappedRows)

    resetOrder()
}

const addRow = () => {
  const newRow = {
    checked: false,
    testTypeMethodId: null,
    orderDist: qcTestTypeMethodList.value.length + 1,
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
  qcTestTypeMethodList.value.forEach((row, idx) => {
    row.orderDist = idx + 1
  })
}

//체크항목 삭제
const removeRow = () =>{

    const checkedRows = qcTestTypeMethodList.value.filter(row => row.checked === true)

    if (checkedRows.length === 0) {
        vWarning('삭제할 항목을 체크하세요.')
        return
    }

    checkedRows.forEach(row => {

        if (row.testTypeMethodId) {

            if (!deleteIds.value.includes(row.testTypeMethodId)) {
                deleteIds.value.push(row.testTypeMethodId)
            }
        }
    })

    qcTestTypeMethodList.value = qcTestTypeMethodList.value.filter(row => row.checked !== true)

    resetOrder()
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

     // DB 값이 없으면 기본값 적용
    if (!form.testDate) {
        form.testDate = todayKST()
    }

    if (!form.testerId) {
        form.testerId = userId
    }

    if (!form.testerName) {
        form.testerName = memberNm
    }

    if ( res.qcTestTypeMethodList.length > 0  ){
        qcTestTypeMethodList.value = res.qcTestTypeMethodList.map(row => ({
            ...row,
            checked: false,
            testDateString: row.testDateString || todayKST(),
            testerName: row.testerName || memberNm,
            passState: row.passState || '시험중'
        }))
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
.popup-wrap {
  display: flex;
  flex-direction: column;
  height: 620px;
  min-height: 0;
  overflow: hidden;
}

.content-wrap {
  display: flex;
  width: 100%;
  height: 520px;
  min-height: 0;
  overflow: hidden;
}

.left-panel {
  flex: 0 0 32%;
  min-width: 0;
  min-height: 0;
  border: 1px solid #dcdfe6;
  padding: 12px 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.right-panel {
  flex: 0 0 68%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  padding: 12px 8px;
  box-sizing: border-box;
}

.right-toolbar {
  flex: 0 0 auto;
}

.table-area {
  flex: 1;
  min-height: 0;
  overflow: hidden;
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
  cursor: pointer;
}
</style>
