<template>
  <v-breadcrumbs :items="['MES', '영업관리', '사양서 수정']"></v-breadcrumbs>

  <v-card>
    <v-card-text class="overflow-y-hidden">
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
                  <span v-if="!approvalInfo.businessApprovalDate">결제일자</span>
                  <span v-else>{{ approvalInfo.businessApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.productApprovalDate">결제일자</span>
                  <span v-else>{{ approvalInfo.productApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.purchaseApprovalDate">결제일자</span>
                  <span v-else>{{ approvalInfo.purchaseApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.qcApprovalDate">결제일자</span>
                  <span v-else>{{ approvalInfo.qcApprovalDate }}</span>
                </td>
                <td style="height: 30px; text-align: center; border-left: 1px solid #ccc;">
                  <span v-if="!approvalInfo.labApprovalDate">결제일자</span>
                  <span v-else>{{ approvalInfo.labApprovalDate }}</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="overflow-y-hidden">
      <v-row>
        <v-col>
          <v-table class="compact-table" style="height: 590px;">
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
                <td>{{ deptNm }}</td>
                <th>기안자</th>
                <td>{{ memberNm }}</td>
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
                    class="cell-input"
                  />
                </td>
              </tr>
              <tr>
                <th>발주서첨부</th>
                <td colspan="3">
                  <SingleFileUpload
                    v-if="isOrderFile"
                    v-model="orderFile"
                    style="height: 20px; width: 1100px;"
                    class="mb-4"
                  />
                  <div v-else >
                    <DownLoadLink
                      :fileName="attachInfo.orderFileName|| ''"
                      :attachFileId="attachInfo.orderFileAttachFileId|| ''"
                      :seq="attachInfo.orderSeq|| ''"
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
                <th>제품사양서첨부</th>
                <td colspan="3">
                  <SingleFileUpload
                    v-if="isProdFile"
                    v-model="prodFile"
                    style="height: 20px; width: 1100px;"
                    class="mb-4"
                  />
                  <div v-else >
                  <DownLoadLink
                    :fileName= "attachInfo.prodFileName|| ''"
                    :attachFileId= "attachInfo.prodFileAttachFileId|| ''"
                    :seq= "attachInfo.prodSeq|| ''"
                    />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <v-btn
                        text="삭제"
                        density="compact"
                        @click="deleteFile('p')"
                        />
                </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex ga-4 justify-end mb-3">
          <v-btn
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
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import DownLoadLink from '@/components/DownLoadLink.vue';
import SingleFileUpload from '@/components/SingleFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { formatDate, toNumber } from '@/util/common';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const { userId, memberNm, deptNm} = useAuthStore()
const { vError, vSuccess} = useAlertStore()

const draftId = route.params.id
const orderFile =ref([])
const prodFile =ref([])
const dialog = ref(false)
const isOrderFile = ref(false)
const isProdFile = ref(false)
const form = reactive({
  draftDate: '',
  seq: '',
  customerName: '',
  itemName: '',
  orderQty: 0,
  dueDate: '',
  draftUserName: '',
  draftDept: '',
  draftUserId: '',

  draftId: draftId,
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
  const formData = new FormData();

  const params = {
    ...form
  }
  params.dueDate = formatDate(form.dueDate)
  params.orderQty = toNumber(form.orderQty)
    console.log('params', params)
    console.log('approval', approvalInfo.value)
  //  console.log('orderFile', orderFile.value)
  //  console.log('prodFile', prodFile.value)
  formData.append("draftInfo", JSON.stringify(params))
  formData.append("approval", JSON.stringify(approvalInfo.value))

    // 유무 로그 확인
  const hasOrderFile = orderFile.value instanceof File;
  const hasProdFile = prodFile.value instanceof File;

  if (hasOrderFile) {
    formData.append("orderFile", orderFile.value);
  }else{
    formData.append("orderAttachFileId", attachInfo.value.orderFileAttachFileId)
  }

  if (hasProdFile) {
    formData.append("prodFile", prodFile.value);
  }else{
    formData.append("prodAttachFileId", attachInfo.value.prodFileAttachFileId);
  }
  try{
    const msg = await ApiOrder.saveDraftInfo(formData)
    //console.log('msg', msg)
    vSuccess(msg)
    router.push({name: 'DraftDetail',  params: { id: draftId }})
  }catch(err){
    vError(err.response)
  }
}

const attachInit = result => {
  if ( result.orderAttachFileInfo === null ) {
    isOrderFile.value =true
  }else{
    attachInfo.value.orderFileName = result.orderAttachFileInfo.fileName
    attachInfo.value.orderFileAttachFileId = result.orderAttachFileInfo.attachFileId
    attachInfo.value.orderSeq = result.orderAttachFileInfo.seq
  }
  if ( result.prodAttachFileInfo === null ) {
    isProdFile.value =true
  }else{
    attachInfo.value.prodFileName = result.prodAttachFileInfo.fileName
    attachInfo.value.prodFileAttachFileId = result.prodAttachFileInfo.attachFileId
    attachInfo.value.prodSeq = result.prodAttachFileInfo.seq
  }
}

const deleteFile = async gb => {
  let id = ''
  if ( gb === 'o') {
    id = attachInfo.value.orderFileAttachFileId
    attachInfo.value.orderFileAttachFileId = null
  }else {
    id = attachInfo.value.prodFileAttachFileId
    attachInfo.value.prodFileAttachFileId = null
  }

  const seq = 1
  try{
    const msg = await ApiCommon.deleteFile(id, seq)
    vSuccess(msg)
  }catch(err) {
    vError(err)
  }
}

onMounted( async () => {
  const result = await ApiOrder.getDraftInfo(draftId)

  //결제자 자동호출
  Object.assign( form, result.draftInfo)
  Object.assign( approvalInfo.value, result.approvalInfo)

  attachInit(result)
})

/**
 *  기안서 목록
 */
const goList = () => {
  router.push({name: 'DraftList'})
}

</script>

<style scoped>
.compact-table {
  table-layout: fixed;
  width: 100%;
  border: 0.5px solid #ccc;
  /* border-collapse: collapse; */
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
.overflow-y-hidden {
  overflow-y: hidden !important; /* !important는 필요에 따라 사용 */
}
</style>
