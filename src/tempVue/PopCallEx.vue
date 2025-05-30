<template>
<v-breadcrumbs :items="['MES', '발주관리', '발주 등록']"></v-breadcrumbs>
  <v-form ref="orderForm" >
  <v-row>
    <v-col>
      <div class="d-flex justify-end">
        <v-table class="approval-table" >
          <tbody>
            <tr>
              <th rowspan="3">결<br/><br/><br/>재</th>
              <th style="height: 25px; text-align: center;" >
                기안자
              </th>
              <th style="height: 25px;">
                영업관리
              </th>
              <th style="height: 25px;">
                생산관리
              </th>
              <th style="height: 25px;">
                구매부
              </th>
              <th style="height: 25px;">
                품질관리
              </th>
              <th style="height: 25px;">
                연구소
              </th>
            </tr>
            <tr style="height: 80px;">
              <td>{{ memberNm }}</td>
              <td>홍길동</td>
              <td>김길동</td>
              <td>박길동</td>
              <td>이길동</td>
              <td>강길동</td>
            </tr>
            <tr>
              <td style="height: 25px;">{{ toFullDate }}</td>
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
    <v-col>
      <v-table class="order-table">
        <tbody>
          <tr>
            <th>문서번호</th>
            <td>{{ toFullDate }} - {{ seq }} </td>
            <th>처리기한</th>
            <td>즉시</td>
          </tr>
          <tr>
            <th>보존년한</th>
            <td>5년</td>
            <th>기안일자</th>
            <td>{{ toFullDate }}</td>
          </tr>
          <tr>
            <th>기안부서</th>
            <td>{{ deptNm }}</td>
            <th>기안자</th>
            <td>{{ memberNm }}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td></td>
            <td></td>
            <td>발주서 및 제품 사양서 검토 요청의 건</td>
          </tr>
          <tr>
            <td colspan="4" style="height: 150px;">
              <span>{{customerNm}}</span> &nbsp;&nbsp; <span> {{itemName}}</span> &nbsp;&nbsp; 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
              - 아 래-
            </td>
          </tr>
          <tr>
            <th>고객사명</th>
            <td class="cell-center">
              <v-text-field
                v-model="customerNm"
                density="compact"
              />
            </td>
            <th>품목</th>
           <td class="cell-center">
              <v-text-field
                v-model="itemName"
                density="compact"
                />
            </td>
            <td class="cell-center">
              <v-text-field
                v-model="itemName"
                readonly
                append-inner-icon="mdi-magnify"
                density="compact"
                @click:append-inner="openItemPop"
                />
            </td>

          </tr>
          <tr>
            <th>발주수량</th>
            <td>
              <v-text-field
                v-model="form.orderQty"
                dense
                density="compact"
                />
            </td>
            <th>납기일자</th>
            <td>
              <DateSinglePicker
                v-model="form.limitDate"
              />
            </td>
          </tr>
          <tr>
            <th>발주서 첨부파일</th>
            <td>
              <SingleFileUpload
                v-model="form.orderFile"
              />
            </td>
            <th>제품사양서 </th>
            <td>
              <SingleFileUpload
                v-model="form.prodFile"
              />
            </td>
          </tr>
          <tr>
            <th></th>
            <td colspan="3">

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
          @click="orderSave"
          >저장</v-btn>
        <v-btn
          dense
          class="mt-1 mr-3"
          @click="orderCancel"
          >취소</v-btn>
    </div>
    </v-col>
  </v-row>
</v-form>

  <v-dialog  v-model="customerDialog" height="800px" max-width="1200px" persistent>
      <customerPop
        @selected="customerHandler"
        @close-dialog="customerDialog = false"/>
  </v-dialog>

  <v-dialog  v-model="itemDialog"  height="800px" width="1200px" persistent>
      <ItemListSinglePop
        @selected="itemHandler"
        @close-dialog="itemDialog = false"/>
  </v-dialog>



</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { toDate } from '@/util/common'
import { onMounted, reactive, ref } from 'vue';
//import customerPop from '../basic/CustomerListPop.vue';
import DateSinglePicker from '@/components/DateSinglePicker.vue';
import { useRouter } from 'vue-router';
import SingleFileUpload from '@/components/SingleFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
//import ItemListSinglePop from '../basic/ItemListSinglePop.vue';

const { vError, vSuccess} = useAlertStore()
const orderForm = ref(null)
const authStore = useAuthStore();
const { userId, memberNm, deptNm } =  authStore;
const toFullDate = toDate()
const seq = ref(1)

// onMounted(() => {
//   //문서번호 호출  및 seq 넘버링

//   //값이 있을 경우


//   //결재자가 없을 경우 승인버튼 hide처리

//   //결재자가 있어도 결재일자 정보가 있으면 hide

//   //
// })
const customerNm = ref('')
const itemName =ref('')

const form = reactive({
  limitDate: '',
  orderQty: 0,
  userId,
  orderFile: null,
  prodFile: null,
})

/**
 * 고객사 정보 로직
 */
const customerDialog = ref(false)
const customerNm = ref('')

const openCustomerPop = () => {

}

const customerHandler = () => {

}


/**
 * 품목 정보 로직
 */
const itemDialog = ref(false)
const itemName =ref('')

const openItemPop = () => {
  itemDialog.value = true
}

const itemHandler = (itemCd, itemNm) => {
  form.itemCd = itemCd
  itemName.value = itemNm
}


/**
 * 승인처리
 */
const approvalOk = () => {

}
/**
 *  승인 취소
 */
const approvalCancel = () =>{

}

// const orderSave = ()=> {
//   const formData = new FormData()

//   for (const [key, value] of Object.entries(form.value)) {
//     if (key === 'files') {
//       value.forEach(file => formData.append('files', file))
//     } else {
//       formData.append(key, value)
//     }
//   }

//   // if (form.orderFile.value) {
//   //   formData.append('files', form.orderFile.value)
//   // }
//   // if (form.prodFile.value) {
//   //   formData.append('files', form.prodFile.value)
//   // }
//   console.log('getAll', formData.getAll())

// }

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
  border: 1px solid #ccc;
}
/* 테이블 셀(td, th) 가운데 정렬 */
.approval-table td {
  padding: 4px 8px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #ccc;
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
}

/* 테이블 셀(td) 가운데 정렬 */
.order-table td {
  padding: 4px 8px;
  text-align: center;
  vertical-align: middle;
}
.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
