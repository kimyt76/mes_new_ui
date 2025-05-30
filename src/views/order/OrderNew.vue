<template>
<v-breadcrumbs :items="['MES', '발주관리', '발주 등록']"></v-breadcrumbs>
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
              <td>{{ memberNm }}</td>
              <td>{{ approvalInfo.businessUserId }}</td>
              <td>{{ approvalInfo.productUserId }}</td>
              <td>{{ approvalInfo.purchaseUserId }}</td>
              <td>{{ approvalInfo.qcUserId }}</td>
              <td>
                <span>{{ lapApprovalUserNm }}</span>
                <v-btn
                  width="20px"
                  text="결재자"
                  v-model="lapApprovalUserNm"
                  @click= "userDialog = true"
                />
              </td>
            </tr>
            <tr>
              <td style="height: 25px;">{{ orderDate }}</td>
              <td style="height: 25px;">결재일자</td>
              <td style="height: 25px;">결재일자</td>
              <td style="height: 25px;">결재일자</td>
              <td style="height: 25px;">결재일자</td>
              <td style="height: 25px;">결재일자</td>
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
            <th style="height: 40px; text-align: center;">문서번호</th>
            <td style="height: 40px; text-align: center;">{{ orderDate }} - {{ seq }} </td>
            <th style="height: 40px; text-align: center;">처리기한</th>
            <td style="height: 40px; text-align: center;">즉시</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">보존년한</th>
            <td style="height: 40px; text-align: center;">5년</td>
            <th style="height: 40px; text-align: center;">기안일자</th>
            <td style="height: 40px; text-align: center;">{{ orderDate }}</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">기안부서</th>
            <td style="height: 40px; text-align: center;">{{ deptNm }}</td>
            <th style="height: 40px; text-align: center;">기안자</th>
            <td style="height: 40px; text-align: center;">{{ memberNm }}</td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: start;">제목</th>
            <td colspan="3">{{ customerNm }}&nbsp;&nbsp; {{itemNm}} &nbsp;&nbsp;&nbsp;발주서 및 제품 사양서 검토 요청의 건</td>
          </tr>
          <tr>
            <td colspan="4" style="height: 150px;">
              {{customerNm}} &nbsp;&nbsp;  {{itemNm}} &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
              - 아 래-
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">고객사명</th>
            <td style="vertical-align: center; height: 40px;">
              <v-text-field
                v-model="customerNm"
                style="width: 300px; height: 20px; "
                density="compact"
                class="mb-4"
              />
            </td>
            <th style="height: 40px; text-align: center;">품목</th>
            <td style="height: 20px;">
              <v-text-field
                v-model="itemNm"
                style="width: 300px; height: 20px; vertical-align: center; "
                density="compact"
                class="mb-4"
                />
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">발주수량</th>
            <td style="vertical-align: center; height: 20px;">
              <v-text-field
                v-model="orderQty"
                v-comma-number
                density="compact"
                style="width: 300px; height: 20px;"
                class="mb-4"
                />
            </td>
            <th style="height: 40px; text-align: center;">납기일자</th>
            <td  style="vertical-align: center; height: 20px;">
              <DateSinglePicker
                v-model="dueDate"
                style="width: 400px; height: 20px;"
                class="mb-10"
              />
            </td>
          </tr>
          <tr>
            <th style="height: 40px; text-align: center;">발주서 첨부파일</th>
            <td>
              <SingleFileUpload
                v-model="orderFile"
                style="width: 300px; height: 20px;"
                class="mb-4"
              />
            </td>
            <th style="text-align: center; text-align: center;">제품사양서 </th>
            <td>
              <SingleFileUpload
                v-model="prodFile"
                style="width: 300px; height: 20px;"
                class="mb-4"
              />
            </td>
          </tr>
          <tr>
            <th style="height: 80px; text-align: center;">{{ memberNm }}</th>
            <td colspan="3">
              <v-textarea
                v-model="boardTxt"
                class="mt-4"
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
          dense
          color = "brown-lighten-4"
          class="mt-1"
          text="저장"
          @click="orderSave"
          />
        <v-btn
          dense
          class="mt-1 mr-3"
          text="취소"
          @click="orderCancel"
          />
    </div>
    </v-col>
  </v-row>
</v-form>

<v-dialog  v-model="userDialog" height="700" width="900px" persistent>
    <UserListPop
      @selected="userHandler"
      @close-dialog="userDialog = false" />
  </v-dialog>

</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { toDate, deleteComma} from '@/util/common'
import { onMounted, ref } from 'vue';
import DateSinglePicker from '@/components/DateSinglePicker.vue';
import { useRouter } from 'vue-router';
import SingleFileUpload from '@/components/SingleFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { ApiOrder } from '@/api/apiOrders';
import UserListPop from '../system/UserListPop.vue';

const userDialog = ref(false)
const { vError, vSuccess} = useAlertStore()
const authStore = useAuthStore();
const { userId, memberNm, deptNm } =  authStore;
const orderDate = ref(toDate())
const seq = ref(1)
const orderQty = ref(0)
const dueDate = ref('')
const orderFile = ref([])
const prodFile = ref([])
const customerNm = ref('')
const itemNm =ref('')
const boardTxt = ref('')

const lapApprovalUserNm = ref('')
const lapApprovalId = ref('')
const approvalInfo =ref({
  labApprovalDate: '',
  labUserId : '',
})

onMounted( async () => {
  //문서번호 호출  및 seq 넘버링
  seq.value = await ApiOrder.getSeq()

  //결재자 자동호출
  approvalInfo.value = await ApiOrder.getApprovalInfo()
})

const orderSave = async ()=> {
  const formData = new FormData()
  approvalInfo.value.labUserId = lapApprovalId.value

//   const entries = [
//     ["orderDate", orderInfo.value.orderDate],
//     ["seq", orderInfo.value.seq],
//     ["customerNm", orderInfo.value.customerNm],
//     ["itemNm", orderInfo.value.itemNm],
//     ["orderQty", deleteComma(orderInfo.value.orderQty)],
//     ["dueDate", orderInfo.value.dueDate],
//     ["approvalId", orderInfo.value.approvalId],
//     ["boardId", orderInfo.value.boardId],
//     ["userId", userId],
// ];

  formData.append('orderDate', orderDate.value)
  formData.append('seq', seq.value)
  formData.append('draftDept', deptNm)
  formData.append('draftUserId', userId)
  formData.append('draftDate', orderDate.value)
  formData.append('customerNm', customerNm.value)
  formData.append('itemNm', itemNm.value)
  formData.append('orderQty', deleteComma(orderQty.value))
  formData.append('dueDate', orderDate.value)
  formData.append('labUserId', approvalInfo.value.labUserId)
  //console.log('approvalVo', JSON.stringify(approvalInfo.value))
  formData.append('boardTxt', boardTxt.value)

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
    vError(err)
  }
}

const userHandler = (id, nm) => {
  console.log('id', id)
  lapApprovalId.value = id
  lapApprovalUserNm.value = nm
}


/**
 *  발주 취소
 */
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
