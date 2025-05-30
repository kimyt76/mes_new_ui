<template>
  <v-breadcrumbs :items="['MES', '발주관리', '발주 수정']"></v-breadcrumbs>
  <v-form ref="orderForm" >
    <v-row>
      <v-col>
        <div class="d-flex justify-end">
          <v-table class="approval-table">
            <tbody>
              <tr>
                <th rowspan="3">결<br/><br/><br/>재</th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  기안자
                </th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  <span>영업관리</span>
                </th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  <span>생산관리</span>
                </th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  <span>구매부</span>
                </th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  <span>품질관리</span>
                </th>
                <th style="height: 25px; text-align: center; text-align: center;">
                  <span>연구소</span>
                </th>
              </tr>
              <tr>
                <td>{{ orderInfo.draftNm }}</td>
                <td>{{ approvalInfo.businessUserId }}</td>
                <td>{{ approvalInfo.productUserId }}</td>
                <td>{{ approvalInfo.purchaseUserId }}</td>
                <td>{{ approvalInfo.qcUserId }}</td>
                <td>{{ approvalInfo.labUserId }}</td>
              </tr>
              <tr>
                <td style="height: 25px;">{{ orderInfo.draftDate }}</td>
                <td style="height: 25px;">
                  <span v-if="approvalInfo.businessApprovalDate">
                    {{ approvalInfo.businessApprovalDate }}
                  </span>
                  <span v-else>
                    결재일자
                  </span>
                </td>
                <td style="height: 25px;">
                  <span v-if="approvalInfo.productApprovalDate">
                    {{ approvalInfo.productApprovalDate }}
                  </span>
                  <span v-else>
                    결재일자
                  </span>
                </td>
                <td style="height: 25px;">
                  <span v-if="approvalInfo.purchaseApprovalDate">
                    {{ approvalInfo.purchaseApprovalDate }}
                  </span>
                  <span v-else>
                    결재일자
                  </span>
                </td>
                <td style="height: 25px;">
                  <span v-if="approvalInfo.qcApprovalDate">
                    {{ approvalInfo.qcApprovalDate }}
                  </span>
                  <span v-else>
                    결재일자
                  </span>
                </td>
                <td style="height: 25px;">
                  <span v-if="approvalInfo.labApprovalDate">
                    {{ approvalInfo.labApprovalDate }}
                  </span>
                  <span v-else>
                    결재일자
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col >
        <v-table class="order-table">
          <tbody>
            <tr>
              <th>문서번호</th>
              <td>{{ orderInfo.orderNm }} </td>
              <th>처리기한</th>
              <td>즉시</td>
            </tr>
            <tr>
              <th>보존년한</th>
              <td>5년</td>
              <th>기안일자</th>
              <td>{{ orderInfo.draftDate }}</td>
            </tr>
            <tr>
              <th>기안부서</th>
              <td>{{ orderInfo.draftDept }}</td>
              <th>기안자</th>
              <td>{{ orderInfo.draftNm }}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td colspan="3" style="text-align: start;"><span>{{ orderInfo.customerNm }}</span>&nbsp; <span>{{orderInfo.itemNm}}</span>&nbsp;&nbsp;&nbsp;발주서 및 제품 사양서 검토 요청의 건</td>
            </tr>
            <tr>
              <td colspan="4" style="height: 150px;">
                {{orderInfo.customerNm}} &nbsp;&nbsp;  {{orderInfo.itemNm}} &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
              - 아 래-
              </td>
            </tr>
            <tr>
              <th>고객사명</th>
              <td>
                <v-text-field
                  v-model="orderInfo.customerNm"
                  style="width: 300px; height: 20px; "
                  density="compact"
                  class="mb-4"
                />
              </td>
              <th>품목</th>
              <td>
                <v-text-field
                  v-model="orderInfo.itemNm"
                  style="width: 300px; height: 20px; "
                  density="compact"
                  class="mb-4"
                />
              </td>
            </tr>
            <tr>
              <th>발주수량</th>
              <td>
                <v-text-field
                  v-model="orderInfo.orderQty"
                  v-comma-number
                  density="compact"
                  style="width: 300px; height: 20px;"
                  class="mb-4"
                  />
              </td>
              <th>납기일자</th>
              <td>
                <DateSinglePicker
                  v-model:toDate="orderInfo.dueDate"
                  style="width: 400px; height: 20px;"
                  class="mb-10"
                />
              </td>
            </tr>
            <tr>
              <th>발주서 첨부파일</th>
              <td  style="text-align: left;">
                <SingleFileUpload
                  v-if="isOrder"
                  v-model="orderFile"
                  density="compact"
                  style="width: 300px; height: 20px;"
                  class="mb-4"
                />
                <div v-else>
                  <DownLoadLink
                    :filepath= "orderFilePath|| ''"
                    :fileName= "orderFileName|| ''"
                    />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <v-btn
                    text="삭제"
                    @click="deleteFile('o')"
                    />
                </div>

              </td>
              <th>제품사양서</th>
              <td style="text-align: left;">
                <SingleFileUpload
                  v-if="isProd"
                  v-model="prodFile"
                  style="width: 300px; height: 20px;"
                  class="mb-4"
                />
                <div v-else >
                  <DownLoadLink
                    :filepath= "prodFilePath|| ''"
                    :fileName= "prodFileName|| ''"
                    />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <v-btn
                    text="삭제"
                    density="compact"
                     @click="deleteFile('p')"
                    />
                </div>
              </td>
            </tr>

            <tr>
              <th>
                {{ boardInfo.boardUserId }}
              </th>
               <td colspan="3">
                <v-textarea
                  v-model="boardInfo.boardTxt"
                  class="mt-4"
                  :readonly="!isReadonly"
                  >
                </v-textarea>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex ga-4 justify-end">
          <v-btn
            color = "brown-lighten-4"
            class="mt-1"
            text="저장"
            @click="orderSave"
            />
          <v-btn
            class="mt-1 mr-3"
            text="취소"
            @click="orderCancel"
            />
        </div>
      </v-col>
    </v-row>
  </v-form>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { ApiOrder } from '@/api/apiOrders'
import DateSinglePicker from '@/components/DateSinglePicker.vue'
import DownLoadLink from '@/components/DownLoadLink.vue'
import SingleFileUpload from '@/components/SingleFileUpload.vue'
import { ApiCommon } from '@/api/apiCommon'
import { useAlertStore } from '@/stores/alert'
import { deleteComma} from '@/util/common'
import { useAuthStore } from '@/stores/auth'

const isReadonly = ref(true)
const authStore = useAuthStore()
const { userId } =  authStore;
const { vSuccess, vError } = useAlertStore()
const isOrder = ref(true)
const isProd = ref(true)
const route = useRoute()
const approvalInfo = ref({})
const result = ref('')

const orderFile = ref(null)
const prodFile = ref(null)

const fileId = ref({
  orderAttachFileId: '',
  prodAttachFileId: ''
})

const orderInfo = ref({
  orderNm : '',
  draftDate: '',
  draftNm: '',
  draftDept: '',

  customerNm: '',
  itemNm: '',
  orderQty: '',
  dueDate: '',

  draftUserId: '',
  approvalId: '',
  boardId: '',
})
const boardInfo = ref({
  boardId: '',
  boardUserId: '',
  boardTxt: '',
})


const deleteFile = (gb) => {
  let id = ''
  if ( gb === 'o') {
    id = fileId.value.orderAttachFileId
    fileId.value.orderAttachFileId = null
  }else {
    id = fileId.value.prodAttachFileId
    fileId.value.prodAttachFileId = null
  }

  try{
    const msg = ApiCommon.deleteFile(id)
    vSuccess(msg)
    router.push({ name: 'OrderDetail', params: { id: route.params.id } })
  }catch(err) {
    vError(err)
  }
}

const orderSave = async () =>{

  const formData = new FormData()

  formData.append('orderId', orderInfo.value.orderId)
  formData.append('orderDate', orderInfo.value.orderDate)
  formData.append('seq', orderInfo.value.seq)

  formData.append('customerNm', orderInfo.value.customerNm)
  formData.append('itemNm', orderInfo.value.itemNm)
  formData.append('orderQty', deleteComma(orderInfo.value.orderQty))
  formData.append('dueDate', orderInfo.value.dueDate)

  formData.append('boardTxt', orderInfo.value.boardTxt)
  formData.append('approvalId', orderInfo.value.approvalId)
  formData.append('boardId', orderInfo.value.boardId)
  formData.append('userId', userId)


  // 유무 로그 확인
  const hasOrderFile = orderFile.value instanceof File;
  const hasProdFile = prodFile.value instanceof File;
  // console.log("주문 첨부파일 존재?", hasOrderFile);
  // console.log("제품 첨부파일 존재?", hasProdFile);
  if (hasOrderFile) {
    formData.append("orderFile", orderFile.value);
  }else{
    formData.append("orderAttachFileId", fileId.value.orderAttachFileId)
  }

  if (hasProdFile) {
    formData.append("prodFile", prodFile.value);
  }else{
    formData.append("prodAttachFileId", fileId.value.prodAttachFileId);
  }

  try{
    const msg = await ApiOrder.saveOrderInfo(formData)
    vSuccess(msg)
    router.push({ name: 'OrderDetail', params: { id: route.params.id } })
  }catch(err){
    vError(err)
  }

}


onMounted( async() => {
  //선택한  발주정보 호출
  result.value  = await ApiOrder.getOrderInfo(route.params.id)

  Object.assign( orderInfo.value, result.value.orderInfo)
  orderInfo.value.orderQty = Number(orderInfo.value.orderQty).toLocaleString()

  //결재자 자동호출
  Object.assign( approvalInfo.value, result.value.approvalInfo)

  console.log('result.value.boardInfo', result.value.boardInfo)
  Object.assign( boardInfo.value, result.value.boardInfo)

  //결재자정보 setting
  approvalUserCheck()

  //첨부파일 초기화
  attachInit()

})

//결재자 여부와 승인여부 확인용
const approvalUserCheck = () =>{
  if (  approvalInfo.value.businessUserId === userId ){
    isReadonly.value = true
  }else if (  approvalInfo.value.productUserId === userId ){
    isReadonly.value = true
  }else if (  approvalInfo.value.purchaseUserId === userId ){
    isReadonly.value = true
  }else if (  approvalInfo.value.qcUserId === userId ){
    isReadonly.value = true
  }else if (  approvalInfo.value.labUserId === userId ){
    isReadonly.value = true
  }else{
    if (orderInfo.value.draftUserId === userId){
      isReadonly.value = true
    }
  }
}

const orderFileName = ref('')
const orderFilePath = ref('')
const prodFileName = ref('')
const prodFilePath = ref('')

const attachInit = () => {
  if (result.value.orderAttachFileInfo) {
    isOrder.value = false
    orderFileName.value = result.value.orderAttachFileInfo.fileName
    orderFilePath.value = result.value.orderAttachFileInfo.filePath
    fileId.value.orderAttachFileId = result.value.orderAttachFileInfo.attachFileId
  } else {
    orderFileName.value = ''
    orderFilePath.value = ''
    fileId.value.orderAttachFileId = ''
  }

  if (result.value.prodAttachFileInfo) {
    isProd.value = false
    prodFileName.value = result.value.prodAttachFileInfo.fileName
    prodFilePath.value = result.value.prodAttachFileInfo.filePath
    fileId.value.prodAttachFileId = result.value.prodAttachFileInfo.attachFileId

  } else {
    prodFileName.value = ''
    prodFilePath.value = ''
    fileId.value.prodAttachFileId = ''
  }
}

const router = useRouter()
const orderCancel = () => {
  router.push({name: 'OrderList'})
}

</script>

<style scoped>
/**
결재 테이블
 */
.approval-table tr {
  height: 25px; /* 원하는 높이로 조절 */
  border: 1px solid #ccc;
}
.approval-table th {
  padding: 2px 4px;
  text-align: center;
  vertical-align: middle;
  background-color: #f2f2f2;
  border-left: 1px solid #ccc;
  height: 20px;
}
/* 테이블 셀(td, th) 가운데 정렬 */
.approval-table td {
  text-align: center;
  vertical-align: middle;
  border: 1px solid #ccc;
}
.approval-title {
  width: 20px; /* 원하시는 폭으로 조정하세요 */
  text-align: center;
  vertical-align: middle;
}
/**
 order테이블
 */
.order-table {
  border: solid 1px #D5D5D5;
}
.order-table tr {
  height: 20px; /* 원하는 높이로 조절 */
}

/* 테이블 셀(th) 가운데 정렬 */
.order-table th {
  padding: 4px;
  text-align: center;
  vertical-align: middle;
  background-color: #f2f2f2;
  width: 20%;
  white-space: nowrap;
}

/* 테이블 셀(td) 가운데 정렬 */
.order-table td {
  padding: 4px 8px;
  text-align: center;
  vertical-align: middle;
  width: 30%;
}
.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
