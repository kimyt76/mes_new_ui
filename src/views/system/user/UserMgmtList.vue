<template>
<v-breadcrumbs
    :items="['MES', '시스템관리', '사용자 관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhUserList">
        <v-col class="d-flex ga-4">
          <v-text-field
            v-model="form.userId"
            label="사용자 이름"
            placeholder="사용자 이름 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 200px;"
              />
          <v-text-field
            v-model="form.jobPosition"
            label="직급"
            placeholder="직급을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 200px;"
            />
          <v-text-field
            v-model="form.deptNm"
            label="부서"
            placeholder="부서를 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 200px;"
            />
          <v-select
            v-model="form.useYn"
            label="재직여부"
            :items="items"
            item-title="text"
            item-value="value"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-btn
            text="조회"
            color="brown-lighten-4"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srhForm.reset()"
            />
        </v-col>
      </v-form>
    </v-row>
    </v-card-text>
  </v-card>
  <v-spacer></v-spacer>
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
      <v-btn
        color="brown-lighten-4"
        text="신규"
        @click="selectRowClick"
        />
      <v-btn
        class="excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0">
      <v-data-table
        :headers="headers"
        :items="userList"
        :items-per-page="15"
        density="compact"
        fixed-header
        height="700px"
        class="custom-table"
        return-object
        >
        <template #item.userId="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.userId }}
          </div>
        </template>
        <template #item.memberNm="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.memberNm }}
          </div>
        </template>
        <template #item.useYn="{ item, index }">
            {{ item.useYn === 'Y' ? '재직': '퇴직' }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog  v-model="dialog" max-width="800px" persistent>
    <UserDtlPop
      :mode="mode"
      :id="id"
      :title="title"
      @saved="handleSaved"
      @close-dialog="dialog = false"/>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { ApiSystems } from '@/api/apiSystem';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import UserDtlPop from './UserDtlPop.vue';
import { isEmpty, formatComma } from '@/util/common';

const { vError, vSuccess } = useAlertStore()

const dialog = ref(false)
const loading = ref(false)
const srhForm = ref(null)
const userList = ref([])
const useYns = ref([])

const id = ref('')
const mode = ref('N')
const title = ref('')
const form = reactive ({
  userId: '',
  deptNm: '',
  jobPosition: '',
  useYn: ''

})
/**
 *  재직 유무 초기화
 */
const items = [
      { text: '재직', value: 'Y' },
      { text: '퇴직', value: 'N' },
]

const selectRowClick = (item, index) => {
  if (isEmpty(item.userId)) {
    mode.value= 'N'
    title.value = '사용자 등록'
    id.value = ''
  }else{
    mode.value= 'U'
    id.value = item.userId
    title.value = '사용자 상세정보'
  }

  dialog.value = true
}

/**
 *  테이블 헤더
 */
const headers = ref([
    { title: '사용자ID',  key: 'userId',      align: 'center', width: '120px'},
    { title: '사용자명',  key: 'memberNm',    align: 'center', width: '150px'},
    { title: '부서',      key: 'deptNm',      align: 'center', width: '170px'},
    { title: '직급',      key: 'jobPosition', align: 'center', width: '100px'},
    { title: '전화번호',  key: 'phone',       align: 'center', width: '130px'},
    { title: '이메일',    key: 'email',       align: 'center', width: '150px'},
    { title: '재직여부',  key: 'useYn',       align: 'center', width: '70px'},
    { title: '비고',      key: 'etc',         align: 'center', width: '150px'},
])

/**
 * 사용자 정보 조회
 */
const srhUserList= async () => {
  loading.value =true

  try{
    const params = {
      ...form,
    }
    userList.value = await ApiSystems.getUserList(params)
  }catch(err){
    vError(err)
  }finally{
    loading.value =false
  }
}

const handleSaved = (msg) => {
  vSuccess(msg)
  srhUserList()
}

onMounted( async () => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  srhUserList()
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, userList.value, '사용자_목록')
}

</script>

<style>
@import '@/assets/css/main.css';


</style>
