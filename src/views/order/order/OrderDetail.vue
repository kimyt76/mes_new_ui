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
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col >
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
          <tr v-if="isApprovalUser">
            <th>{{ memberNm }}</th>
            <td colspan="3">
              <v-text-field
                v-model="myBoardTxt"
                :readonly="false"
                density="compact"
                style="height: 20px"
                class="mb-4"
              />
            </td>
          </tr>
          <tr v-for="(item, index) in otherBoards" :key="item.boardId || index">
            <th>{{ item.boardUserId }}</th>
            <td colspan="3">
              <v-text-field
                v-model="item.boardTxt"
                :readonly="true"
                density="compact"
                style="height: 20px"
                class="mb-4"
              />
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
import {ref, onMounted, computed} from 'vue'
import DownLoadLink from '@/components/DownLoadLink.vue'
import { useAuthStore } from '@/stores/auth';
import { ApiOrder } from '@/api/apiOrders';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { toDate, isEmpty } from '@/util/common';

const { userId, memberNm} = useAuthStore()
const { vError, vSuccess} = useAlertStore()
const isApprovalUser = ref(false)
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

const boardInfo = ref([])


const attachInfo = ref({
  orderFileName : '',
  orderFilePath : '',
  prodFileName : '',
  prodFilePath : '',
})

const approvalDate = ref(null)

const saveInfo = async () =>{

  const params = {
    userId : userId,
    field : getField(userId),
    boardTxt : myBoardTxt.value,
    approvalId : orderInfo.value.approvalId,
    boardId : orderInfo.value.boardId,
    orderId: orderId,
    appDate: approvalDate.value,
  }

  console.log('params', params.boardTxt)
  //console.log('params', params.appDate)
  try{
      const msg = await ApiOrder.updateInfo(params)
      vSuccess(msg)

      router.push({ name: 'OrderDetail', params: { id: orderId } })
  }catch(err){
    vError(err)
  }
}

const getField = id => {
  const { businessUserId, productUserId, purchaseUserId, qcUserId,  labUserId} = approvalInfo.value
  let field = "";

  if( id === businessUserId){
    field = 'business_approval_date'
  }else if ( id === productUserId){
    field = 'product_approval_date'
  }else if ( id === purchaseUserId){
    field = 'purchase_approval_date'
  }else if ( id === qcUserId){
    field = 'qc_approval_date'
  }else if ( id === labUserId){
    field = 'lab_approval_date'
  }

  return field
}


const approvalOk = () => {
  const { businessUserId, productUserId, purchaseUserId, qcUserId,  labUserId} = approvalInfo.value

  if( userId === businessUserId){
    if (isEmpty(approvalInfo.value.businessApprovalDate)) {
      approvalInfo.value.businessApprovalDate = toDate()
      approvalDate.value = toDate()
      isApproval.value = false
    }else{
      approvalDate.value = approvalInfo.value.businessApprovalDate
    }
  }else if ( userId === productUserId){
    if (isEmpty(approvalInfo.value.productApprovalDate)) {
      approvalInfo.value.productApprovalDate = toDate()
      approvalDate.value =  toDate()
      isApproval.value = false
    }else{
      approvalDate.value = approvalInfo.value.productApprovalDate
    }
  }else if ( userId === purchaseUserId){
    if (isEmpty(approvalInfo.value.purchaseApprovalDate)) {
      approvalInfo.value.purchaseApprovalDate = toDate()
      approvalDate.value = toDate()
      isApproval.value = false
    }else{
      approvalDate.value = approvalInfo.value.purchaseApprovalDate
    }
  }else if ( userId === qcUserId){
    if (isEmpty(approvalInfo.value.qcApprovalDate)) {
      approvalInfo.value.qcApprovalDate = toDate()
      approvalDate.value = toDate()
      isApproval.value = false
    }else{
      approvalDate.value = approvalInfo.value.qcApprovalDate
    }
  }else if ( userId === labUserId){
    if (isEmpty(approvalInfo.value.labApprovalDate)) {
      approvalInfo.value.labApprovalDate = toDate()
      approvalDate.value = toDate()
      isApproval.value = false
    }else{
      approvalDate.value = approvalInfo.value.labApprovalDate
    }
  }

}

const draftCheck = () => {
  if (userId === orderInfo.value.draftUserId ){
    btnChange.value = true
  }

  const userList = Object.values(approvalInfo.value);
  const isUserExist = userList.includes(userId);

  const { businessCheckYn, productCheckYn, purchaseCheckYn, qcCheckYn, labCheckYn, businessUserId, productUserId, purchaseUserId, qcUserId, labUserId } = approvalInfo.value

  if ( orderInfo.value.draftUserId !== userId ){
    isApprovalUser.value = true
  }

  const isDateCheck = ref(false)

  if( userId === businessUserId && businessCheckYn === "N" ){
    isDateCheck.value = true
  }else if ( userId === productUserId && productCheckYn === "N"){
    isDateCheck.value = true
  }else if ( userId === purchaseUserId && purchaseCheckYn === "N"){
    isDateCheck.value = true
  }else if ( userId === qcUserId && qcCheckYn === "N"){
    isDateCheck.value = true
  }else if ( userId === labUserId && labCheckYn === "N"){
    isDateCheck.value = true
  }

  if ( isUserExist && isDateCheck.value){
    isApproval.value = true
  }
}

onMounted( async() => {
  //console.log('orderId',orderId)
  const result = await ApiOrder.getOrderInfo(orderId)

  Object.assign( orderInfo.value, result.orderInfo)
  Object.assign( approvalInfo.value, result.approvalInfo)
  boardInfo.value = result.boardInfo || []; // fallback 방지

  draftCheck()
  const matched = boardInfo.value.find(item => item.boardUserId === userId);
  myBoardTxt.value = matched ? matched.boardTxt : ''

  attachInit(result)
})

const myBoardTxt = ref('')

const otherBoards = computed(() =>
  boardInfo.value.filter( item => item.boardUserId !== userId)
)

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
  height: 760px;
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
