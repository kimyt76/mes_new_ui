<template>
<v-breadcrumbs :items="['MES', '발주관리', '발주 상세']"></v-breadcrumbs>
  <v-form ref="orderForm" >
  <v-row>
    <v-col>
      <div class="d-flex justify-end">
        <v-table class="approval-table" >
          <tbody>
            <tr>
              <th rowspan="3" class="approval-title">결<br/><br/><br/>재</th>
              <th style="height: 25px; text-align: center; text-align: center;" >
                기안자
              </th>
              <th style="height: 25px; width: 100px; text-align: center;">
                영업관리
              </th>
              <th style="height: 25px;  width: 100px; text-align: center;">
                생산관리
              </th>
              <th style="height: 25px;  width: 100px; text-align: center;">
                구매부
              </th>
              <th style="height: 25px;  width: 100px; text-align: center;">
                품질관리
              </th>
              <th style="height: 25px;  width: 100px; text-align: center;">
                연구소
              </th>
            </tr>
            <tr style="height: 80px;">
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
  <v-row
    v-if="isApproval"
     >
      <v-col>
        <div class="d-flex ga-4 justify-end">
          <v-btn
            color = "brown-lighten-4"
            class="mt-1"
            density="compact"
            @click="approvalOk"
            >승인</v-btn>
          <v-btn
            class="mt-1 mr-3"
            density="compact"
            @click="approvalCancel"
            >승인취소</v-btn>
        </div>
      </v-col>
    </v-row>
  <v-row>
    <v-col >
      <v-table class="order-table">
        <tbody>
          <tr>
            <th style="height: 40px; text-align: center;">문서번호</th>
            <td style="height: 40px; text-align: center;">{{ orderInfo.orderNm }} </td>
            <th style="height: 40px; text-align: center;">처리기한</th>
            <td style="height: 40px; text-align: center;">즉시</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">보존년한</th>
            <td style="height: 40px; text-align: center;">5년</td>
            <th style="height: 40px; text-align: center;">기안일자</th>
            <td style="height: 40px; text-align: center;">{{ orderInfo.draftDate }}</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">기안부서</th>
            <td style="height: 40px; text-align: center;">{{ orderInfo.draftDept }}</td>
            <th style="height: 40px; text-align: center;">기안자</th>
            <td style="height: 40px; text-align: center;">{{ orderInfo.draftNm }}</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">제목</th>
            <td colspan="3" style="height: 40px; text-align: start;">{{ orderInfo.customerNm }} &nbsp;&nbsp;&nbsp;{{ orderInfo.itemNm}} &nbsp;&nbsp;&nbsp;&nbsp;발주서 및 제품 사양서 검토 요청의 건</td>
          </tr>
          <tr>
            <td colspan="4" style="height: 150px;">
              {{orderInfo.customerNm}} &nbsp;&nbsp;  {{orderInfo.itemNm}} &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
              - 아 래-
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">고객사명</th>
            <td style="vertical-align: center; height: 40px;">
              {{ orderInfo.customerNm }}
            </td>
            <th style="height: 40px; text-align: center;">품목</th>
            <td style="height: 20px;">
              {{ orderInfo.itemNm }}
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">발주수량</th>
            <td style="vertical-align: center; height: 20px;">
              {{ Number(orderInfo.orderQty).toLocaleString() }}
            </td>
            <th style="height: 40px; text-align: center;">납기일자</th>
            <td  style="vertical-align: center; height: 20px;">
              {{ orderInfo.dueDate }}
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center; height: 40px;">발주서 첨부파일</th>
            <td style="height: 40px; text-align: center; height: 40px;">
              <DownLoadLink
                :filepath=  "orderFilePath"
                :fileName=  "orderFileName"
                />
            </td>
            <th style="text-align: center; text-align: center; height: 40px;">제품사양서 </th>
            <td style="height: 40px; text-align: center; height: 40px;">
              <DownLoadLink
                :filepath= "prodFilePath"
                :fileName= "prodFileName"
                />
            </td>
          </tr>
          <tr >
            <th style="height: 80px; text-align: center;">
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
          v-if="!btnChange"
          color = "brown-lighten-4"
          class="mt-1"
          text="저장"
          @click="approvalSave"
          />
        <v-btn
          v-else
          color = "brown-lighten-4"
          class="mt-1"
          text="수정"
          @click="goOrderEdit"
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
import { ApiOrder } from '@/api/apiOrders'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import DownLoadLink from '@/components/DownLoadLink.vue'

const isReadonly = ref(true)
const isApproval = ref(false)
const route = useRoute()
const { vError, vSuccess} = useAlertStore()
const authStore = useAuthStore();

const { userId, memberNm } =  authStore;
const orderId = route.params.id

const btnChange = ref(false)
const router = useRouter()
const approvalInfo = ref([])
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
})

const boardInfo = ref({
  boardId: '',
  boardUserId: '',
  boardTxt: '',
})
const orderFileName = ref('')
const orderFilePath = ref('')
const prodFileName = ref('')
const prodFilePath = ref('')
const result = ref('')

//결재 승인
const approvalOk = () => {

}

//결재 취소
const approvalCancel = () =>{

}

//댓글 저장
const approvalSave = ()=>{

  const params = {
    userId,
    boardTxt: '',
  }

  try {
    //const msg = ApiOrder.saveApprovalInfo(params)
    //vSuccess(msg)
  }catch(err){
    vError(err)
  }

}

const goOrderEdit = () =>{
  router.push({ name: 'OrderEdit', params: { id: orderId } })
}

//결재자 여부와 승인여부 확인용
const approvalUserCheck = () =>{
  if (  approvalInfo.value.businessUserId === userId ){
    if (!approvalInfo.value.businessApprovalDate){
      isApproval.value = true
    }
    isReadonly.value = true
  }else if (  approvalInfo.value.productUserId === userId ){
    if (!approvalInfo.value.productApprovalDate){
      isApproval.value = true
    }
    isReadonly.value = true
  }else if (  approvalInfo.value.purchaseUserId === userId ){
    if (!approvalInfo.value.purchaseApprovalDate){
      isApproval.value = true
    }
    isReadonly.value = true
  }else if (  approvalInfo.value.qcUserId === userId ){
    if (!approvalInfo.value.qcApprovalDate){
      isApproval.value = true
    }
    isReadonly.value = true
  }else if ( approvalInfo.value.labUserId === userId ){
    if (!approvalInfo.value.labApprovalDate){
      isApproval.value = true
    }
    isReadonly.value = true
  }else{
    if (orderInfo.value.draftUserId === userId){
      isReadonly.value = true
    }
  }
}

const draftCheck = () => {
  if (userId ===  orderInfo.value.draftUserId ){
    btnChange.value = true
  }
}


onMounted( async() => {
  //선택한  발주정보 호출
  result.value  = await ApiOrder.getOrderInfo(orderId)
  Object.assign( orderInfo.value, result.value.orderInfo)

  draftCheck()

  //결재자 자동호출
  Object.assign( approvalInfo.value, result.value.approvalInfo)
  //결재자정보 setting
  approvalUserCheck()
  //게시판
  console.log('result.value.boardInfo', result.value.boardInfo)
  Object.assign( boardInfo.value, result.value.boardInfo)

  //첨부파일
  attachInit()
})

const attachInit = () => {
  if (result.value.orderAttachFileInfo) {
    orderFileName.value = result.value.orderAttachFileInfo.fileName
    orderFilePath.value = result.value.orderAttachFileInfo.filePath
  } else {
    orderFileName.value = ''
    orderFilePath.value = ''
  }

  if (result.value.prodAttachFileInfo) {
    prodFileName.value = result.value.prodAttachFileInfo.fileName
    prodFilePath.value = result.value.prodAttachFileInfo.filePath
  } else {
    prodFileName.value = ''
    prodFilePath.value = ''
  }
}


/**
 *  발주 취소
 */
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
