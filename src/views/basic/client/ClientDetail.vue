<template>
  <div :id="$attrs.id"></div>
  <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
  <v-card>
    <v-form @submit.prevent="saveInfo">
    <v-card-text>
      <v-row>
        <v-col class="d-flex">
          <v-text-field
            v-model="form.businessNo"
            label="사업자번호"
            variant="underlined"
            density="compact"
            style="width: 200px;"
            />
          <v-btn
            text="중복체크"
            color="brown-lighten-4"
            density="compact"
            @click="checkNo"
            />
            <span> &nbsp;번호만 입력하세요 ('-' 제외)</span>
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col col="2">
          <v-text-field
            v-model="form.clientName"
            label="고객사명(상호)"
            variant="underlined"
            density="compact"
            style="width: 780px;"
            />
        </v-col>
        <v-col >
          <v-date-input
            v-model="form.regDate"
            label="등록일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-date-input
            v-model="form.establishDate"
            label="설립일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="form.clientType"
            :items="clientType"
            item-title="codeNm"
            item-value="code"
            label="사업자구분"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            />
          </v-col>
          <v-col>
          <v-text-field
            v-if="isBusinessType"
            v-model="form.clientTypeName"
            label="기타"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-select
            v-model="form.tradeType"
            :items="tradeTypes"
            item-title="codeNm"
            item-value="code"
            label="거래구분"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.firstTradeDate"
            label="최초거래일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            readonly
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.president"
            label="대표자명"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.businessType"
            label="업태"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.businessItem"
            label="종목"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.paymentCondition"
            label="결재조건"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.telNo"
            label="대표 전화"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            @onKeyup="formatNumber"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.faxNo"
            label="대표 팩스"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.homepage"
            label="홈페이지"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-select
            v-model="form.responSalesBiz"
            :items="responSalesBizs"
            item-title="codeNm"
            item-value="code"
            label="책임판매업"
            density="compact"
            variant="underlined"
            style="width: 300px;"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.saleManagerName"
            label="영업담당자(정)"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openUserPop('M')"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.saleManagerNameB"
            label="영업담당자(부)"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openUserPop('S')"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.groupCd"
            label="그룹코드"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.groupName"
            label="그룹"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.groupCds"
            label="그룹사코드"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.groupsName"
            label="그룹사명"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.paymentCd"
            label="결재회사코드"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.paymentName"
            label="결재회사"
            variant="underlined"
            density="compact"
            style="width: 300px;"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>담당자</v-card-title>
        </v-col>
        <v-col>
          <v-btn
            text="추가+"
            @click="addRowU"
            />
        </v-col>
          <v-data-table-virtual
              :headers="managerHeaders"
              :items="clienManagerList"
              class="custom-table"
            >
            <template #item.deptName="{ item, index }">
              <input
                v-model="clienManagerList[index].deptName"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.managerName="{ item, index }">
              <input
                v-model="clienManagerList[index].managerName"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.jobPosition="{ item, index }">
              <input
                v-model="clienManagerList[index].jobPosition"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.tel="{ item, index }">
              <input
                v-model="clienManagerList[index].tel"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.directTel="{ item, index }">
              <input
                v-model="clienManagerList[index].directTel"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.email="{ item, index }">
              <input
                v-model="clienManagerList[index].email"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.actions="{ item }">
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item)"></v-icon>
            </template>
          </v-data-table-virtual>
      </v-row>
      <v-row>
         <v-col>
          <v-card-title>주소</v-card-title>
        </v-col>
        <v-col>
          <v-btn
            text="추가+"
             @click="addRowA"
            />
        </v-col>
          <v-data-table-virtual
            :headers="addressHeadeers"
            :items="clineAddressList"
            class="custom-table"
            >
            <template #item.address="{ item, index }">
              <input
                v-model="clineAddressList[index].address"
                type="text"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.actions="{ item }">
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow1(item)"></v-icon>
            </template>
          </v-data-table-virtual>
      </v-row>
      <v-row>
        <v-col>
          <v-card-title>변경이력</v-card-title>
        </v-col>
        <v-col>
          <v-btn
            text="추가+"
            @click="addRowH"
            />
        </v-col>
        <v-data-table-virtual
          :headers="clientHistoryHeader"
          :items="clineHistroryList"
          class="custom-table"
          >
          <template #item.changeDate="{ item, index }">
            <input
              v-model="clineHistroryList[index].changeDate"
              type="text"
              style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
              class="custom-line"
            />
          </template>
          <template #item.historyContents="{ item, index }">
            <input
              v-model="clineHistroryList[index].historyContents"
              type="text"
              style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
              class="custom-line"
            />
          </template>
          <template #item.actions="{ item }">
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow2(item)"></v-icon>
          </template>
        </v-data-table-virtual>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row>
        <v-col class="d-flex justify-end ga-4" >
          <v-btn
            text="저장"
            color="brown-lighten-4"
            type="submit"
            />
          <v-btn
            text="목록"
            @click="goList"
            />
        </v-col>
      </v-row>
    </v-card-text>
    </v-form>
  </v-card>

<v-dialog  v-model="dialog" height="800" width="900px" persistent>
    <UserListPop
      @selected="handleSelected"
      @close-dialog="dialog = false"
      />
</v-dialog>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {formatDate} from '@/util/common'
import UserListPop from '@/views/system/user/UserListPop.vue';

const {vError, vSuccess, vInfo}  = useAlertStore()
const {userId} = useAuthStore()
const router = useRouter()
const route = useRoute()
const tradeTypes = ref([])
const clientType = ref([])
const responSalesBizs = ref([])
const clienManagerList = ref([])
const clineAddressList = ref([])
const clineHistroryList = ref([])

const isBusinessType = ref(false)
const dialog = ref(false)
const currentField = ref(null)
const clientId = route.params.id

const breadcrumbItems = computed(() => [
  'MES',
  '기본관리',
  !isEmpty(clientId) ? '고객사 상세' : '고객사 신규'
])

const clientHistoryHeader = [
  { title: '변경일.',   key: 'changeDate',        align: 'center', width: '100px'},
  { title: '변경내용.',  key: 'historyContents',   align: 'center', width: '500px'},
  { title: '-',         key: 'actions',           align: 'center' ,width : '10px'},
]
const addressHeadeers = [
  { title: '주소.',  key: 'address',       align: 'center', width: '500px'},
  { title: '-',      key: 'actions',       align: 'center' ,width : '10px'},
]
const managerHeaders = [
  { title: '부서',        key: 'deptName',     align: 'center', width: '150px'},
  { title: '이름',        key: 'managerName',  align: 'center', width: '80px'},
  { title: '직책',        key: 'jobPosition',  align: 'center', width: '80px'},
  { title: '연락처',      key: 'tel',          align: 'center', width: '100px'},
  { title: '직통번호',    key: 'directTel',    align: 'center', width: '100px'},
  { title: '이메일번호',  key: 'email',         align: 'center', width: '120px'},
  { title: '-',          key: 'actions',       align: 'center' ,width : '10px'},
]

const form = reactive({
  clientId:'',
  businessNo:'',
  clientName:'',
  clientType:'',
  clientTypeName:'',
  tradeType:'',
  regDate:'',
  responSalesBiz:'',
  establishDate:'',
  president:'',
  businessType:'',
  businessItem:'',
  telNo:'',
  faxNo:'',
  homepage:'',
  addressId:'',
  managerId:'',
  paymentCondition:'',
  saleManagerId:'',
  saleManagerIdB:'',
  groupCd:'',
  groupName:'',
  groupsCd:'',
  groupsName:'',
  paymentCd:'',
  paymentName:'',
  useYn:'',
  saleManagerName:'',
  saleManagerNameB:'',

  userId: userId,
})

const saveInfo = async () => {
  if ( isEmpty(form.clientName)) {
    vInfo('고객사명을 입력하세요.')
    return
  }
  if ( isEmpty(form.businessNo)) {
    vInfo('사업자번호를 입력하세요.')
    return
  }

  const params = {
    ...form
  }

  params.regDate = formatDate(params.regDate)
  params.establishDate = formatDate(params.establishDate)

  console.log('params', params)

  const res = await ApiBase.saveClient(params)

  // if ( res.result === 'OK') {
  //   vSuccess('저장되었습니다.')
  //   if ( isEmpty(form.clientId)) {
  //     //신규 저장후 고객사ID 세팅
  //     form.clientId = res.clientId
  //   }
  // }else{
  //   vError(res.message)
  // }
}

watch(() => form.clientType, async (newVal) => {
  if ( form.clientType === 'E' ){
    isBusinessType.value = true
  }else{
    isBusinessType.value = false
  }
})

const addRowU = () => {
  let nextId = clienManagerList.value.length

  clienManagerList.value.push({
    id: nextId++,
    deptName: '',
    managerName:'',
    jobPosition: '',
    tel: '',
    directTel : '',
    email : '',
  })
}
const addRowA = () => {
  let nextId = clineAddressList.value.length
  clineAddressList.value.push({
    id: nextId++,
    address: '',
  })
}
const addRowH = () => {
  let nextId = clineHistroryList.value.length
  clineHistroryList.value.push({
    id: nextId++,
    changeDate: '',
    historyContents: '',
  })
}

// 행 삭제
const removeRow = (index) => {
  clienManagerList.value.splice(index, 1)
}
// 행 삭제
const removeRow1 = (index) => {
  clineAddressList.value.splice(index, 1)
}
// 행 삭제
const removeRow2 = (index) => {
  clineHistroryList.value.splice(index, 1)
}

onMounted( async () => {
  //console.log('clientId', clientId)
  tradeTypes.value = await ApiCommon.getCodeList('trade_type')
  clientType.value = await ApiCommon.getCodeList('client_type')

  if ( !isEmpty(clientId)) {
    //신규
    const res = await ApiBase.getClientList(clientId)
  }
})

const openUserPop = (target) =>{
   currentField.value = target
   dialog.value = true
}

const handleSelected = (obj) =>{
  if ( currentField.value === 'M' ) {
    form.saleManagerId = obj.userId
    form.saleManagerName = obj.memberNm
  }else{
    form.saleManagerIdB = obj.userId
    form.saleManagerNameB = obj.memberNm
  }
}

const formatNumber = (num) =>{

}

const checkNo = async ()=>{
  if ( isEmpty(form.businessNo)) return vInfo("사업자 번호를 입력하세요")

  const checkVal = await ApiBase.getBusinessNoChecked(form.businessNo)

  if ( checkVal === 'Y') {
    vInfo("등록 가능한 사업자 번호입니다.")
    return
  }else{
    vInfo("등록된 사업자 번호입니다.")
    return
  }
}

const goList = () =>{
  router.push({name:'ClientList'})
}
 </script>

 <style scoped>
 @import '@/assets/css/main.css';

.custom-line {
  border: 0.5px solid;
  background: #f1f3f4;
  padding: 2px;
}
 </style>
