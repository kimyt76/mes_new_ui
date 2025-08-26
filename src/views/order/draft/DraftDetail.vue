<template>
  <v-breadcrumbs :items="['MES', '영업관리', '기안서 상세']"></v-breadcrumbs>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col class="d-flex justify-end pa-1">
          <v-table style="border: 0.1px solid #ccc;">
            <tbody>
              <tr>
                <th rowspan="3" style="vertical-align: middle; width: 20px;">결<br /><br /><br />재</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">기안자</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">영업관리</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">생산관리</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">구매부</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">품질관리</th>
                <th style="height: 30px; width: 120px; text-align: center; border-left: 1px solid #ccc;">연구소</th>
              </tr>
              <tr>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ form.draftUserName }}</td>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ approvalInfo.businessUserName }}</td>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ approvalInfo.productUserName }}</td>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ approvalInfo.purchaseUserName }}</td>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ approvalInfo.qcUserName }}</td>
                <td style="height: 80px; text-align: center; border-left: 1px solid #ccc;">{{ approvalInfo.labUserName }}</td>
              </tr>
              <tr>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">{{ form.draftDate }}</td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.businessApprovalDate">결재일자</span>
                  <span v-else>{{ approvalInfo.businessApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.productApprovalDate">결재일자</span>
                  <span v-else>{{ approvalInfo.productApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.purchaseApprovalDate">결재일자</span>
                  <span v-else>{{ approvalInfo.purchaseApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.qcApprovalDate">결재일자</span>
                  <span v-else>{{ approvalInfo.qcApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.labApprovalDate">결재일자</span>
                  <span v-else>{{ approvalInfo.labApprovalDate }}</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-row v-if="isApproval">
      <v-col>
        <div class="d-flex  ga-4 justify-end">
          <v-btn
            color="brown-lighten-4"
            class="mt-1 mr-3"
            text="승인"
            @click="approvalOk"
            />
        </div>
      </v-col>
    </v-row>
    <v-card-text>
      <v-row>
        <v-col>
          <v-table class="compact-table" >
            <tbody>
              <tr>
                <th>문서번호</th>
                <td>{{ form.draftDate }}-{{ form.seq }}</td>
                <th>처리기한</th>
                <td>즉시</td>
              </tr>
              <tr>
                <th>보존년한</th>
                <td>5년</td>
                <th>기안일자</th>
                <td>{{ form.draftDate }}</td>
              </tr>
              <tr>
                <th>기안부서</th>
                <td>{{ form.draftDept }}</td>
                <th>기안자</th>
                <td>{{ form.draftUserName }}</td>
              </tr>
              <tr>
                <th>제목</th>
                <td colspan="3">
                  {{ form.customerName }} &nbsp;&nbsp; {{ form.itemName }} &nbsp;&nbsp; 발주서 및 제품 사양서 검토 요청의 건
                </td>
              </tr>
              <tr>
                <td colspan="4" style="height: 100px; text-align: center;">
                  {{ form.customerName }} &nbsp;&nbsp; {{ form.itemName }} &nbsp;&nbsp;
                  발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br /><br />
                  - 아 래 -
                </td>
              </tr>
              <tr>
                <th>고객사명</th>
                <td>
                  <v-text-field
                    v-model="form.customerName"
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    class="cell-input"
                  />
                </td>
                <th>품목</th>
                <td>
                  <v-text-field
                    v-model="form.itemName"
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    class="cell-input"
                  />
                </td>
              </tr>
              <tr>
                <th>발주수량</th>
                <td>
                  <v-text-field
                    v-model="form.orderQty"
                    v-comma-number
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    style="text-align: right;"
                    class="cell-input"
                  />
                </td>
                <th>납기일자</th>
                <td>
                  <v-date-input
                    v-model="form.dueDate"
                    :display-format="formatDate"
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    class="cell-input"
                  />
                </td>
              </tr>
              <tr>
                <th>발주서 첨부파일</th>
                <td colspan="3">
                  <DownLoadLink
                    :fileName="attachInfo.orderFileName|| ''"
                    :attachFileId="attachInfo.orderFileAttachFileId|| ''"
                    :seq="attachInfo.orderSeq|| ''"
                    />
                </td>
              </tr>
              <tr>
                <th>제품사양서 첨부</th>
                <td colspan="3" style="border-bottom: 1px solid #ccc;">
                  <DownLoadLink
                    :fileName= "attachInfo.prodFileName|| ''"
                    :attachFileId= "attachInfo.prodFileAttachFileId|| ''"
                    :seq= "attachInfo.prodSeq|| ''"
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
        <v-col class="d-flex ga-4 justify-end mb-3">
          <v-btn
            v-if="isEditBtn"
            color="brown-lighten-4"
            text="수정"
            @click="goEdit"
            />
          <v-btn
            v-if="isSaveBtn"
            text="저장"
            class="gt-2"
            color="brown-lighten-4"
            @click="saveInfo"
          />
          <v-btn
            text="목록"
            class="mr-3"
            @click="goList"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="dialog" height="800px" width="900px" persistent>
    <UserListPop
      @selected="userHandler"
      @close-dialog="dialog = false"
    />
  </v-dialog>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders'
import { useAuthStore } from '@/stores/auth'
import { useAlertStore } from '@/stores/alert';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, computed } from 'vue'
import DownLoadLink from '@/components/DownLoadLink.vue'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { isEmpty, toDate, formatComma, todayKST, formatDate, deleteComma } from '@/util/common';

const route = useRoute()
const router = useRouter()
const draftId = route.params.id
const { userId, memberNm, deptNm} = useAuthStore()
const { vError, vSuccess, vInfo} = useAlertStore()

const orderFile =ref([])
const prodFile =ref([])
const boardInfo = ref([])

const otherBoards = computed(() =>
  boardInfo.value.filter( item => item.boardUserId !== userId)
)

const dialog = ref(false)         //사용자팝업
const isApprovalUser = ref(false)   // 의견
const isApproval = ref(false)   //
const isEditBtn = ref(false)    //수정버튼
const isSaveBtn = ref(false)    //저장버튼

let getField = ref('')
const myBoardTxt = ref('')
let approvalDate = ref(null)

const form = reactive({
  draftDate: toDate(),
  seq: '',
  customerName: '',
  itemName: '',
  orderQty: 0,
  dueDate: '',
  draftUserName: '',
  draftDept: '',
  draftUserId: '',

  userId: userId,
})
const approvalInfo = ref({
  businessUserId : '',
  productUserId: '',
  purchaseUserId: '',
  qcUserId: '',
  labUserId: '',

  businessUserName : '',
  productUserName: '',
  purchaseUserName: '',
  qcUserName: '',
  labUserName: '',

  businessApprovalDate: '',
  productApprovalDate: '',
  purchaseApprovalDate: '',
  qcApprovalDate: '',
  labApprovalDate: '',
})

const attachInfo = ref({
  orderFileName : '',
  orderFilePath : '',
  orderFileAttachFileId : '',
  orderSeq : '',
  prodFileName : '',
  prodFilePath : '',
  prodFileAttachFileId : '',
  prodSeq : '',
})

const userHandler = (obj) =>{
  approvalInfo.value.labUserName = obj.memberNm
  approvalInfo.value.labUserId = obj.userId
}

const saveInfo = async () => {

  const params = {
    userId: userId,
    field : getField.value,
    boardId : form.boardId,
    approvalId : form.approvalId,
    boardTxt : myBoardTxt.value,
    appDate: approvalDate.value,
    draftId : draftId,
  }

  console.log('param',params)
  try{
    const msg = await ApiOrder.updateInfo(params)
    console.log('msg', msg)
    vSuccess(msg)
    router.push({name: 'DraftList'})
  }catch(err){
    console.log('err', err.msg)
    vError(err)
  }
}

const  draftCheck = () =>{
  // 기안자 이면 수정버튼 생성
  if (form.draftUserId === userId ) {
    //버튼 숨김 해제
    isEditBtn.value =true
  }

  const userList = Object.values(approvalInfo.value);
  const isUserExist = userList.includes(userId);

  const { businessCheckYn, productCheckYn, purchaseCheckYn, qcCheckYn, labCheckYn, businessUserId, productUserId, purchaseUserId, qcUserId, labUserId } = approvalInfo.value
  //console.log('findUserKeyById', findUserKeyById(userId))
  if (!isEmpty(findUserKeyById(userId))) {
    isSaveBtn.value =true
  }

  if ( form.draftUserId !== userId ){
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

const findUserKeyById = (targetUserId) => {
  // approvalInfo.value 의 key:value 쌍을 순회
  for (const [key, value] of Object.entries(approvalInfo.value)) {
    // userId 와 관련된 key만 검사
    if (key.endsWith("UserId") && value === targetUserId) {
      return key; // 예: "businessUserId"
    }
  }
  return null; // 못 찾으면 null
};

onMounted( async () => {
  const result = await ApiOrder.getDraftInfo(draftId)

  Object.assign( form, result.draftInfo)
  Object.assign( approvalInfo.value, result.approvalInfo)
  boardInfo.value = result.boardInfo || []; // fallback 방지

  draftCheck()
  const matched = boardInfo.value.find(item => item.boardUserId === userId);
  myBoardTxt.value = matched ? matched.boardTxt : ''
  attachInit(result)
})

const attachInit = result => {
  if ( result.orderAttachFileInfo !== null ) {
    attachInfo.value.orderFileName = result.orderAttachFileInfo.fileName
    attachInfo.value.orderFilePath = result.orderAttachFileInfo.filePath
    attachInfo.value.orderFileAttachFileId = result.orderAttachFileInfo.attachFileId
    attachInfo.value.orderSeq = result.orderAttachFileInfo.seq
  }
  if ( result.prodAttachFileInfo !== null ){
    attachInfo.value.prodFileName = result.prodAttachFileInfo.fileName
    attachInfo.value.prodFilePath = result.prodAttachFileInfo.filepath
    attachInfo.value.prodFileAttachFileId = result.prodAttachFileInfo.attachFileId
    attachInfo.value.prodSeq = result.prodAttachFileInfo.seq
  }
}

const approvalOk = () => {
  if (approvalInfo.value.businessUserId.includes(userId) ){
    if (isEmpty(approvalInfo.value.businessApprovalDate)) {
      approvalInfo.value.businessApprovalDate = toDate()
      approvalDate.value = toDate()
      getField.value = 'business_approval_date'
    }else{
      approvalDate.value = approvalInfo.value.businessApprovalDate
    }
  }else if ( approvalInfo.value.productUserId.includes(userId) ){
    if (isEmpty(approvalInfo.value.productApprovalDate)) {
      approvalInfo.value.productApprovalDate = toDate()
      approvalDate.value = toDate()
      getField.value = 'product_Approval_Date'
    }else{
      approvalDate.value = approvalInfo.value.productApprovalDate
    }
  }else if ( approvalInfo.value.purchaseUserId.includes(userId) ){
    if (isEmpty(approvalInfo.value.purchaseApprovalDate)) {
      approvalInfo.value.purchaseApprovalDate = toDate()
      approvalDate.value = toDate()
      getField.value = 'purchase_Approval_Date'
    }else{
      approvalDate.value = approvalInfo.value.purchaseApprovalDate
    }
  }else if ( approvalInfo.value.qcUserId.includes(userId) ){
    if (isEmpty(approvalInfo.value.qcApprovalDate)) {
      approvalInfo.value.qcApprovalDate = toDate()
      approvalDate.value = toDate()
      getField.value = 'qc_Approval_Date'
    }else{
      approvalDate.value = approvalInfo.value.qcApprovalDate
    }
  }else if ( approvalInfo.value.labUserId.includes(userId) ){
    if (isEmpty(approvalInfo.value.labApprovalDate)) {
      approvalInfo.value.labApprovalDate = toDate()
      approvalDate.value = toDate()
      getField.value = 'lab_Approval_Date'
    }else{
      approvalDate.value = approvalInfo.value.labApprovalDate
    }
  }
  isApproval.value = false
}

/**
 * 기안서 편집
 */
const goEdit = () =>{
  router.push({ name: 'DraftEdit', params: { id: draftId } })
}

/**
 *  기안서 목록
 */
const goList = () => {
  router.push({name: 'DraftList'})
}

</script>

<style scoped>
.compact-table {
  width: 100%;
  border: 0.5px solid #ccc;
  /* border-collapse: collapse; */
}

.compact-table .v-table__wrapper {
  max-height: none !important;
  height: auto !important;
  overflow: visible !important;   /* y 스크롤 제거 + 컨텐츠만큼 늘어남 */
  /* 필요 시 가로만 스크롤 유지하고 싶다면: */
  /* overflow-x: auto; */
}

.compact-table th {
  padding: 4px;
  height: 30px;
  width: 20%;
  text-align: center;
  vertical-align: middle;          /* th 높이 */
  background-color: #EEEEEE;  /* th 배경색 */
}
.compact-table td {
  height: 30px;
  width: 30%;
  padding: 1px; /* 필요시 0~8px 사이로 조절 */
  vertical-align: middle;
  /* border-collapse: collapse;   */
}
.custom-table td {
  height: 30px;               /* td 높이 */
  border: 0.5px solid #ccc;
  padding: 4px;
  vertical-align: middle;
}
/* 입력칸이 셀 너비를 꽉 채우도록 */
.cell-input {
  width: 100%;
  max-width: 100%;
}
/* Vuetify 필드 내부 여백을 살짝 줄여 높이 낭비 최소화 */
.cell-input .v-field__input {
  padding-top: 2px;
  padding-bottom: 2px;
}

</style>
