<template>
<v-breadcrumbs :items="['MES', '발주관리', '발주 상세']"></v-breadcrumbs>
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
                <td>{{ dratfNm }}</td>
                <td>홍길동</td>
                <td>김길동</td>
                <td>박길동</td>
                <td>이길동</td>
                <td>강길동</td>
              </tr>
              <tr>
                <td style="height: 25px;">{{ draftDate }}</td>
                <td style="height: 25px;">결제일자</td>
                <td style="height: 25px;">결제일자</td>
                <td style="height: 25px;">결제일자</td>
                <td style="height: 25px;">결제일자</td>
                <td style="height: 25px;">결제일자</td>
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
              <td>{{ orderDate }} - {{ seq }} </td>
              <th>처리기한</th>
              <td>즉시</td>
            </tr>
            <tr>
              <th>보존년한</th>
              <td>5년</td>
              <th>기안일자</th>
              <td>{{ draftDate }}</td>
            </tr>
            <tr>
              <th>기안부서</th>
              <td>{{ draftDept }}</td>
              <th>기안자</th>
              <td>{{ dratfNm }}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td></td>
              <td></td>
              <td>발주서 및 제품 사양서 검토 요청의 건</td>
            </tr>
            <tr>
              <td colspan="4" style="height: 150px;">
                {{customerNm}}   {{itemName}} 발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br/><br/>
                - 아 래-
              </td>
            </tr>
            <tr>
              <th>고객사명</th>
              <td class="cell-center">
                <v-text-field
                  v-model="customerNm"
                  readonly
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  @click:append-inner="opencustomerPop"
                />
              </td>
              <th>품목</th>
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
  <v-dialog  v-model="customerDialog" max-width="900px" persistent>
      <customerPop
        @selected="customerHandler"
        @close-dialog="customerDialog = false"/>
  </v-dialog>

  <v-dialog  v-model="itemDialog" max-width="900px" persistent>
      <customerPop
        @selected="itemHandler"
        @close-dialog="itemDialog = false"/>
  </v-dialog>



</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { toDate } from '@/util/common'
import { onMounted, reactive, ref , computed} from 'vue';
import customerPop from '../basic/CustomerListPop.vue';
import DateSinglePicker from '@/components/DateSinglePicker.vue';
//import MultiFileUpload from '@/components/MultiFileUpload.vue';
import { useRouter } from 'vue-router';
import SingleFileUpload from '@/components/SingleFileUpload.vue';

const authStore = useAuthStore();
const { userId, memberNm } =  authStore;
const toFullDate = toDate()
const seq = ref(1)


// onMounted(() => {
//   if ( props.mode === 'U' ) {
//     //console.log('mode', props.mode)
//     getUserInfo(props.id);
//     isReadOnly.value = true;
//   }
// })

const form = reactive({
  itemCd : '',
  customerCd: '',
  limitDate: '',
  orderQty: 0,
  userId,
  orderFile: null,
  prodFile: null,
})

// 타이틀 이름을 가변적으로 변경할때 사용
// const breadcrumbs = computed(() => {
//   let label
//   switch (props.mode) {
//     case 'edit':
//       label = '발주 수정'
//       break
//     case 'view':
//       label = '발주 조회'
//       break
//     default:
//       label = '발주 등록'
//   }

//   return ['MES', '발주관리', label]
// })



/**
 * 고객사 정보 로직
 */
const customerDialog = ref(false)
const customerNm = ref('')

const opencustomerPop = () => {

}


/**
 * 품목 정보 로직
 */
const itemDialog = ref(false)
const itemName =ref('')

const openItemPop = () =>[

]


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

const orderSave = ()=> {

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
결제 테이블
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
