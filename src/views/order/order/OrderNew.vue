<template>
<v-breadcrumbs :items="['MES', '발주관리', '발주 등록']"></v-breadcrumbs>
<v-row class="flex-wrap">
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
              <td style="height: 80px;">{{ memberNm }}</td>
              <td>
                <span>{{  approvalInfo.businessUserId }}</span>
              </td>
              <td>
                <span >{{  approvalInfo.productUserId }}</span>
              </td>
              <td>
                <span >{{  approvalInfo.purchaseUserId }}</span>
              </td>
              <td>
                <span >{{  approvalInfo.qcUserId }}</span>
              </td>
              <td>
                <span>{{ approvalUserNm }}</span>
                <v-btn
                  width="20px"
                  text="결재자"
                  @click= "userDialog = true"
                />
              </td>
            </tr>
            <tr  class="approval-date">
              <td style="height: 30px;">{{ orderInfo.orderDate }}</td>
              <td style="height: 30px;">결재일자</td>
              <td style="height: 30px;">결재일자</td>
              <td style="height: 30px;">결재일자</td>
              <td style="height: 30px;">결재일자</td>
              <td style="height: 30px;">결재일자</td>
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
          <td>{{ orderInfo.orderDate}} - {{ orderInfo.seq }}</td>
          <th>처리기한</th>
          <td>즉시</td>
        </tr>
        <tr>
          <th>보존년한</th>
          <td>5년</td>
          <th>기안일자</th>
          <td>{{ orderInfo.orderDate }}</td>
        </tr>
        <tr>
          <th>기안부서</th>
          <td>{{ deptNm }}</td>
          <th>기안자</th>
          <td>{{ memberNm }}</td>
        </tr>
        <tr>
          <th>제목</th>
          <td colspan="3">
            {{ orderInfo.customerNm }}&nbsp;&nbsp; {{orderInfo.itemName}} &nbsp;&nbsp;&nbsp;발주서 및 제품 사양서 검토 요청의 건
          </td>
        </tr>
        <tr>
          <td colspan="4" style="height: 120px; text-align: center;">
            {{orderInfo.customerNm}} &nbsp;&nbsp;  {{orderInfo.itemName}} &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
              - 아 래-
          </td>
        </tr>
        <tr>
          <th>고객사명</th>
          <td>
            <v-text-field
              v-model="orderInfo.customerNm"
              style="width: 500px; height: 20px; "
              density="compact"
              class="mb-4"
              label="고객사명"
              />
          </td>
          <th>품목</th>
          <td>
            <v-text-field
              v-model="orderInfo.itemName"
              style="width: 500px; height: 20px; vertical-align: center; "
              density="compact"
              class="mb-4"
              label="품명"
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
              style="width: 500px; height: 20px; text-align: right;"
              class="mb-4"
              label="발주수량"
              @click="nuberInit"
              />
          </td>
          <th>납기일자</th>
          <td>
            <DateSinglePicker
              v-model="orderInfo.dueDate"
              title="납기일자"
              style="width: 500px; height: 20px; vertical-align: middle;"
              class="mb-10"
              />
          </td>
        </tr>
        <tr>
          <th>발주서 첨부파일</th>
          <td>
            <SingleFileUpload
              v-model="orderFile"
              style="height: 20px; width: 500px;"
              class="mb-4"
              />
          </td>
          <th>제품사양서</th>
          <td>
            <SingleFileUpload
              v-model="prodFile"
              style="height: 20px; width: 500px;"
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
        text="저장"
        class="gt-2"
        color = "brown-lighten-4"
        @click="orderSave"
        />
      <v-btn
        text="목록"
        class="mr-3"
        @click="goList"
      />
    </div>
  </v-col>
</v-row>

<v-dialog  v-model="userDialog" height="700" width="900px" persistent>
    <UserListPop
      @selected="userHandler"
      @close-dialog="userDialog = false" />
  </v-dialog>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import { useAuthStore } from '@/stores/auth';
import { toDate, deleteComma} from '@/util/common'
import DateSinglePicker from '@/components/DateSinglePicker.vue';
import SingleFileUpload from '@/components/SingleFileUpload.vue';
import { ApiOrder } from '@/api/apiOrders';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import UserListPop from '@/views/system/user/UserListPop.vue';



const userDialog = ref(false)
const { userId, memberNm, deptNm} = useAuthStore()
const { vError, vSuccess} = useAlertStore()

const orderInfo = ref({
  orderDate : toDate(),
  seq : '',
  customerNm : '',
  itemName : '',
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
})

const approvalUserNm  = ref('')
const orderFile = ref(null)
const prodFile = ref(null)

const userHandler = (id, nm) =>{
  approvalUserNm.value = nm
  approvalInfo.value.labUserId = id
}


const orderSave = async () => {
  orderInfo.value.draftNm = memberNm
  orderInfo.value.draftDept = deptNm
  orderInfo.value.draftDate = toDate()
  orderInfo.value.draftUserId = userId
  orderInfo.value.orderQty =   deleteComma(orderInfo.value.orderQty)

  const formData = new FormData();
  // console.log('dueDate', orderInfo.value.dueDate)
  // console.log('orderInfo', orderInfo.value)
  // console.log('approval', approvalInfo.value)
  formData.append("orderInfo", JSON.stringify(orderInfo.value))
  formData.append("approval", JSON.stringify(approvalInfo.value))

  if (orderFile.value) {
    formData.append('orderFile', orderFile.value)
  }
  if (prodFile.value) {
    formData.append('prodFile', prodFile.value)
  }

  try{
    const msg = await ApiOrder.saveOrderInfo(formData)
    vSuccess(msg)
    router.push({name: 'OrderList'})
  }catch(err){
    vError(err.response)
  }
}

onMounted( async () => {
  //문서번호 호출  및 seq 넘버링
  orderInfo.value.seq = await ApiOrder.getSeq()

  //결재자 자동호출
  const result = await ApiOrder.getApprovalInfo()
  Object.assign(approvalInfo.value, result);
})

/**
 *
 */
const nuberInit = () =>{
  if (orderInfo.value.orderQty === 0 ){
    orderInfo.value.orderQty = ''
  }
}

/**
 *  발주 목록
 */
const router = useRouter()
const goList = () => {
  router.push({name: 'OrderList'})
}

</script>

<style  scoped>
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
  height: 600px;
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
