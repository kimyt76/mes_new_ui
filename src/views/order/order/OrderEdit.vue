<template>
  <div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '발주관리', '발주 수정']"></v-breadcrumbs>
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
<v-row>
  <v-col>
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
              />
          </td>
          <th>품목</th>
          <td>
            <v-text-field
              v-model="orderInfo.itemName"
              style="width: 500px; height: 20px; vertical-align: center; "
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
              style="width: 500px; height: 20px;"
              class="mb-4"
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
              v-if="isOrderFile"
              v-model="orderFile"
              style="height: 20px; width: 500px;"
              class="mb-4"
              />
              <div v-else>
                <DownLoadLink
                  :filepath= "attachInfo.orderFilePath|| ''"
                  :fileName= "attachInfo.orderFileName|| ''"
                  />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <v-btn
                  text="삭제"
                  @click="deleteFile('o')"
                  />
              </div>
          </td>
          <th>제품사양서</th>
          <td>
            <SingleFileUpload
              v-if="isProdFile"
              v-model="prodFile"
              style="height: 20px; width: 500px;"
              class="mb-4"
              />
            <div v-else >
              <DownLoadLink
                :filepath= "attachInfo.prodFilePath|| ''"
                :fileName= "attachInfo.prodFileName|| ''"
                />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <v-btn
                    text="삭제"
                    density="compact"
                    @click="deleteFile('p')"
                    />
            </div>
          </td>
        </tr>

<!--
        <tr>
          <th>
            <span
              v-if="!boardInfo.boardUserId"
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
              style="height: 20px; "
              density="compact"
              class="mb-4"
              />
          </td>
        </tr> -->

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
</template>

<script setup>
import DateSinglePicker from '@/components/DateSinglePicker.vue'
import SingleFileUpload from '@/components/SingleFileUpload.vue'
import DownLoadLink from '@/components/DownLoadLink.vue';
import { useAuthStore } from '@/stores/auth';
import { ApiOrder } from '@/api/apiOrders';
import {ref, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert'
import { ApiCommon } from '@/api/apiCommon';


const route = useRoute()
const router = useRouter()
const { vSuccess, vError } = useAlertStore()
const { userId, memberNm} = useAuthStore()

const orderId = route.params.id
const isOrderFile =ref(false)
const isProdFile =ref(false)
const orderFile = ref(null)
const prodFile = ref(null)

const orderInfo = ref({
  customerNm : '',
  itemName : '',
  orderQty : '',
  dueDate : '',

  approvalId: '',
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

//const boardInfo = ref([])

const attachInfo = ref({
  orderFileName : '',
  orderFilePath : '',
  prodFileName : '',
  prodFilePath : '',
})

const orderSave = async () =>{
  //boardInfo.value.boardUserId = userId
  //boardInfo.value.boardId = orderInfo.value.boardId
  const formData = new FormData()

  formData.append("orderInfo", JSON.stringify(orderInfo.value))
  //formData.append("board", JSON.stringify(boardInfo.value))
  formData.append("board", null)
  formData.append("approval", null)

  // 유무 로그 확인
  const hasOrderFile = orderFile.value instanceof File;
  const hasProdFile = prodFile.value instanceof File;
  // console.log("주문 첨부파일 존재?", hasOrderFile);
  // console.log("제품 첨부파일 존재?", hasProdFile);
  if (hasOrderFile) {
    formData.append("orderFile", orderFile.value);
  }else{
    formData.append("orderAttachFileId", orderInfo.value.orderAttachFileId)
  }

  if (hasProdFile) {
    formData.append("prodFile", prodFile.value);
  }else{
    formData.append("prodAttachFileId", orderInfo.value.prodAttachFileId);
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
  const result = await ApiOrder.getOrderInfo(orderId)

  Object.assign( orderInfo.value, result.orderInfo)
  Object.assign( approvalInfo.value, result.approvalInfo)
  //boardInfo.value = result.boardInfo || []; // fallback 방지
  attachInit(result)
})



const attachInit = result => {
  //  console.log('orderAttachFileInfo', result.orderAttachFileInfo)
  //  console.log('prodAttachFileInfo', result.prodAttachFileInfo)
  if ( result.orderAttachFileInfo === null ) {
    isOrderFile.value =true
  }else{
    attachInfo.value.orderFileName = result.orderAttachFileInfo.fileName
    attachInfo.value.orderFilePath = result.orderAttachFileInfo.filePath
  }
  if ( result.prodAttachFileInfo === null ) {
    isProdFile.value =true
  }else{
    attachInfo.value.prodFileName = result.prodAttachFileInfo.fileName
    attachInfo.value.prodFilePath = result.prodAttachFileInfo.filePath
  }
}

const deleteFile = async gb => {
  let id = ''
  if ( gb === 'o') {
    id = orderInfo.value.orderAttachFileId
    orderInfo.value.orderAttachFileId = null
  }else {
    id = orderInfo.value.prodAttachFileId
    orderInfo.value.prodAttachFileId = null
  }

  const seq = 1
  try{
    const msg = await ApiCommon.deleteFile(id, seq)
    vSuccess(msg)
    router.push({ name: 'OrderDetail', params: { id: route.params.id } })
  }catch(err) {
    vError(err)
  }
}

const goList = ()=>{
  router.push({name: 'OrderList'})
}
</script>

<style scoped>
.approval-table {
  border-collapse: collapse;
}

.approval-table th {
  background-color: #f2f2f2;
  border: 0.1px solid #ccc;
  text-align: center;
  width: 110px;
}

.approval-user td{
  text-align: center;
  border: 0.1px solid #ccc;
}

.approval-date tr {
  height: 30px;
}

.approval-date td {
  height: 30px;
  text-align: center;
  border: 0.1px solid #ccc;
}

.order-table {
  border-collapse: collapse;
  width: 100%;
  height: 530px;
}

.order-table tr {
  height: 20px;
}
.order-table th {
  background-color: #f2f2f2;
  width: 300px;
  height: 20px;
}

.order-table td {
  border: 0.1px solid #ccc;
  width: 500px;
}
</style>
