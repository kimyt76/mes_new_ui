<template>
  <div :id="$attrs.id"></div>
  <v-breadcrumbs :items="['MES', '발주관리', '발주 상세']"></v-breadcrumbs>
  <v-row>
    <v-col>
      <div class="d-flex justify-end">
        <v-table class="approval-table">
          <tbody>
            <tr>
              <th style="width: 10px;" rowspan="3">결<br/><br/><br/>재</th>
              <th style="height: 30px; text-align: center;">기안자</th>
              <th style="height: 30px; text-align: center;">영업관리</th>
              <th style="height: 30px; text-align: center;">생산관리</th>
              <th style="height: 30px; text-align: center;">구매부</th>
              <th style="height: 30px; text-align: center;">품질관리</th>
              <th style="height: 30px; text-align: center;">연구소</th>
            </tr>
            <tr class="approval-user">
              <td style="height: 80px;">{{ orderInfo.draftNm }}</td>
              <td>{{ approvalInfo.businessUserId }}</td>
              <td>{{ approvalInfo.productUserId }}</td>
              <td>{{ approvalInfo.purchaseUserId }}</td>
              <td>{{ approvalInfo.qcUserId }}</td>
              <td>{{ approvalInfo.labUserId }}</td>
            </tr>
            <tr  class="approval-date">
              <td style="height: 30px;">{{ orderInfo.draftDate }}</td>
              <td style="height: 30px;">
                <span
                  v-if="!approvalInfo.businessApprovalDate"
                  >
                  결재일자
                </span>
                <span
                  v-else
                  >
                  {{ approvalInfo.businessApprovalDate }}
                </span>
              </td>
              <td style="height: 30px;">
                <span
                  v-if="!approvalInfo.productApprovalDate"
                  >
                  결재일자
                </span>
                <span
                  v-else
                  >
                  {{ approvalInfo.productApprovalDate }}
                </span>
              </td>
              <td style="height: 30px;">
                <span
                  v-if="!approvalInfo.purchaseApprovalDate"
                  >
                  결재일자
                </span>
                <span
                  v-else
                  >
                  {{ approvalInfo.purchaseApprovalDate }}
                </span>
              </td>
              <td style="height: 30px;">
                <span
                  v-if="!approvalInfo.qcApprovalDate"
                  >
                  결재일자
                </span>
                <span
                  v-else
                  >
                  {{ approvalInfo.qcApprovalDate }}
                </span>
              </td>
              <td style="height: 30px;">
                <span
                  v-if="!approvalInfo.labApprovalDate"
                  >
                  결재일자
                </span>
                <span
                  v-else
                  >
                  {{ approvalInfo.labApprovalDate }}
                </span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-col>
  </v-row>
  <v-row v-if="isApproval">
    <v-col>
      <div class="d-flex  ga-4 justify-end">
        <v-btn
          color = "brown-lighten-4"
          class="mt-1"
          density="compact"
          text="승인"
          @click="approvalOk"
          />
        <v-btn
          class="mt-1 mr-3"
          density="compact"
          text="승인취소"
          @click="approvalCancel"
          />
      </div>
    </v-col>
  </v-row>
  <v-row class="flex-wrap">
    <v-col style="flex-wrap: wrap; overflow: hidden;">
      <v-table class="order-table">
        <tbody>
          <tr>
            <th>문서번호</th>
            <td>{{ orderInfo.orderNm}}</td>
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
            <td colspan="3">
              {{ orderInfo.customerNm }}&nbsp;&nbsp; {{orderInfo.itemNm}} &nbsp;&nbsp;&nbsp;발주서 및 제품 사양서 검토 요청의 건
            </td>
          </tr>
          <tr>
            <td colspan="4" style="height: 120px; text-align: center;">
              {{orderInfo.customerNm}} &nbsp;&nbsp;  {{orderInfo.itemNm}} &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
                - 아 래-
            </td>
          </tr>
          <tr>
            <th>고객사명</th>
            <td>
              {{orderInfo.customerNm}}
            </td>
            <th>품목</th>
            <td>
              {{orderInfo.itemNm}}
            </td>
            </tr>
            <tr>
              <th>발주수량</th>
              <td>
                {{  Number(orderInfo.orderQty).toLocaleString() }}
              </td>
              <th>납기일자</th>
              <td>
                {{ orderInfo.dueDate }}
              </td>
            </tr>
            <tr>
              <th>발주서 첨부파일</th>
              <td>
                <DownLoadLink
                  :filepath=  "attachInfo.orderFilePath|| ''"
                  :fileName=  "attachInfo.orderFileName|| ''"
                  />
              </td>
              <th>제품사양서 </th>
              <td>
                <DownLoadLink
                  :filepath= "attachInfo.prodFilePath|| ''"
                  :fileName= "attachInfo.prodFileName|| ''"
                  />
              </td>
            </tr>
            <tr>

              <th>
                <span> {{ memberNm }}</span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="boardInfo.boardTxt"
                  density="compact"
                  style="height: 20px; "
                  class="mb-4"
                  />
              </td>
<!--
              <th>
                <span
                  v-if="boardInfo.boardUserId === userId"
                 > {{ memberNm }}
                </span>
                <span
                  v-else
                  >
                  {{ boardInfo.boardUserId }}
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="boardInfo.boardTxt"
                  density="compact"
                  style="height: 20px; "
                  class="mb-4"
                  />
              </td>
-->

            </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="d-flex ga-4 justify-end">
        <v-btn
        v-if="btnChange"
        color = "brown-lighten-4"
        class="mt-1"
        text="수정"
        @click="goEdit"
        />
        <v-btn
          color = "brown-lighten-4"
          class="mt-1"
          text="저장"
          @click="saveInfo"
          />
        <v-btn
          class="mt-1 mr-3"
          text="목록"
          @click="goList"
          />
    </div>
    </v-col>
  </v-row>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import DownLoadLink from '@/components/DownLoadLink.vue'
import { useAuthStore } from '@/stores/auth';
import { ApiOrder } from '@/api/apiOrders';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { getField } from '@/util/form'
import { toDate } from '@/util/common';


const { userId, memberNm} = useAuthStore()
const { vError, vSuccess} = useAlertStore()

const isApproval = ref(false)
const btnChange = ref(false)
const route = useRoute()
const router = useRouter()
const orderId = route.params.id

const orderInfo = ref({
  orderDate : '',
  seq : '',
  customerNm : '',
  itemNm : '',
  orderQty : 0,
  dueDate : '',
  draftNm : '',
  draftDept : '',
  draftDate: '',
  draftUserId: '',
})
const approvalInfo = ref({
  businessUserId : '',
  productUserId: '',
  purchaseUserId: '',
  qcUserId: '',
  labUserId: '',

  businessApprovalDate: '',
  productApprovalDate: '',
  purchaseApprovalDate: '',
  qcApprovalDate: '',
  labApprovalDate: '',

  approvalId:'',
})
const boardInfo = ref({
  boardId : '',
  boardUserId : '',
  boardTxt: '',
})
const attachInfo = ref({
  orderFileName : '',
  orderFilePath : '',
  prodFileName : '',
  prodFilePath : '',
})


const saveInfo = async () =>{
  const params = {
    userId : userId,
    field : getField(userId),
    boardTxt : boardInfo.value.boardTxt,
    approvalId : orderInfo.value.approvalId,
    boardId : orderInfo.value.boardId,
    orderId: orderId,
  }

  try{
     const msg = await ApiOrder.updateInfo(params)
     vSuccess(msg)
  }catch(err){
    vError(err)
  }
}

const approvalOk = () => {
  switch(userId) {
    case '박승훈' :
      approvalInfo.value.productApprovalDate = toDate()
      break
    case '원신호' :
      approvalInfo.value.businessApprovalDate = toDate()
      break
    case '김승남' :
      approvalInfo.value.purchaseApprovalDate = toDate()
      break
    case '김상훈' :
      approvalInfo.value.qcApprovalDate = toDate()
      break
    default :
      approvalInfo.value.labApprovalDate = toDate()
  }
}

const approvalCancel = () => {
  switch(userId) {
    case '박승훈' :
      approvalInfo.value.productApprovalDate = ''
      break
    case '원신호' :
      approvalInfo.value.businessApprovalDate = ''
      break
    case '김승남' :
      approvalInfo.value.purchaseApprovalDate = ''
      break
    case '김상훈' :
      approvalInfo.value.qcApprovalDate = ''
      break
    default :
      approvalInfo.value.labApprovalDate = ''
  }
}

const draftCheck = () => {
  if (userId === orderInfo.value.draftUserId ){
    btnChange.value = true
  }

  const userList = Object.values(approvalInfo.value);
  const isUserExist = userList.includes(userId);

  if ( isUserExist ){
    isApproval.value = true
  }
}


onMounted( async() => {
  //console.log('orderId',orderId)
  const result = await ApiOrder.getOrderInfo(orderId)

  Object.assign( orderInfo.value, result.orderInfo)
  Object.assign( approvalInfo.value, result.approvalInfo)
  Object.assign( boardInfo.value, result.boardInfo)

  draftCheck()

  attachInit(result)
})

const attachInit = result => {
  if ( result.orderAttachFileInfo !== null ) {
    attachInfo.value.orderFileName = result.orderAttachFileInfo.fileName
    attachInfo.value.orderFilePath = result.orderAttachFileInfo.filePath
  }
  if ( result.prodAttachFileInfo !== null ){
    attachInfo.value.prodFileName = result.prodAttachFileInfo.fileName
    attachInfo.value.prodFilePath = result.prodAttachFileInfo.filepath
  }
}

const goEdit = ()=>{
  router.push({ name: 'OrderEdit', params: { id: orderId } })
}
const goList = ()=>{
  router.push({name: 'OrderList'})
}

</script>

<style scoped>
.approval-table {
  border-collapse: collapse; /* 테두리 간격 제거 */
}

.approval-table th {
  background-color: #f2f2f2;
  border: 0.1px solid #ccc; /* 얇은 선 */
  text-align: center;
  width: 110px;
}

.approval-user td{
  text-align: center;
  border: 0.1px solid #ccc; /* 얇은 선 */
}

.approval-date tr {
  height: 30px;
}

.approval-date td {
  height: 30px;
  text-align: center;
  border: 0.1px solid #ccc; /* 얇은 선 */
}

.order-table {
  border-collapse: collapse; /* 테두리 간격 제거 */
  width: auto;
  height: auto;
}

.order-table th {
  background-color: #f2f2f2;
  width: 300px;
}

.order-table td {
  border: 0.1px solid #ccc; /* 얇은 선 */
  width: 500px;
}
</style>
