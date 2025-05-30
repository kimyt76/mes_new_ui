<template>
<v-breadcrumbs :items="['MES', '시스템관리', '사용자 관리']"></v-breadcrumbs>

<v-card class="pa-3"  style="height: 80px;">
  <v-form ref="srhForm" @submit.prevent="srhUserList">
    <v-row>
      <v-col
        >
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-text-field
            v-model="form.userId"
            dense
            label="사용자 이름"
            placeholder="사용자 이름 입력해주세요"
            variant="underlined"
              />
          <v-text-field
            v-model="form.jobPosition"
            dense
            label="직급"
            placeholder="직급을 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.deptNm"
            label="부서"
            placeholder="부서를 입력해주세요"
            variant="underlined"
            />
          <v-select
            v-model="form.useYn"
            label="재직여부"
            :items="items"
            item-title="text"
            item-value="value"
            variant="underlined"
            />
          <v-btn
            color = "#EFEBE9"
            class="mt-3"
            type="submit"
            >조회</v-btn>
          <v-btn
            class="mt-3"
            @click="reset"
            >초기화</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</v-card>
  <v-row
    class="mb-1"
    >
  <v-col>
    <div class="d-flex ga-4 justify-end">
    <v-btn
        color = "brown-lighten-4"
        class="mt-3"
        @click="openPop('N')"
        >신규</v-btn>
      <v-btn
        class="mt-3 mr-3"
        @click="excel"
        >엑셀</v-btn>
     </div>
  </v-col>
</v-row>
<v-sheet border rounded>
<v-data-table
  :headers="headers"
  :items="userList"
  :loading="loading"
  no-data-text="데이터가 없습니다."
  loading-text="조회중입니다 잠시만 기다려주세요"
  :items-per-page="25"
  >
  <template v-slot:headers="{ columns }">
    <tr style="height: 40px;">
      <th
        v-for="column in columns"
        :key="column.key"
        class="custom-header"
        style="height: 40px;"
      >
        {{ column.title }}
      </th>
    </tr>
  </template>
  <template v-slot:item="{ item }">
    <tr class="custom-th" style="height: 40px;">
      <td  @click="openPop(item.userId)">{{ item.userId}}</td>
      <td>{{ item.memberNm}}</td>
      <td>{{ item.deptNm}}</td>
      <td>{{ item.jobPosition}}</td>
      <td>{{ item.phone}}</td>
      <td>{{ item.email}}</td>
      <td>{{ item.useYn === 'Y' ? '재직' : '퇴직'}}</td>
      <td>{{ item.etc }}</td>
    </tr>
  </template>

</v-data-table>
</v-sheet>

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
import { ApiSystems } from '@/api/apiSystem';
import { ref, reactive, onMounted } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { useAlertStore } from '@/stores/alert';
import UserDtlPop from './UserDtlPop.vue';

const { vError } = useAlertStore()

const dialog = ref(false)
const loading = ref(false)
const srhForm = ref(null)
const userList = ref([])
const id = ref('')
const mode = ref('N')
const title = ref('')
const form = reactive ({
  userId: '',
  deptNm: '',
  jobPosition: '',
  useYn: 'Y'
})

/**
 *  재직 유무 초기화
 */
const items = [
      // { text: '전체', value: 'A' },
      { text: '재직', value: 'Y' },
      { text: '퇴직', value: 'N' },
]

/**
 *  테이블 헤더
 */
const headers = ref([
    { title: '사용자ID',  key: 'userId'},
    { title: '사용자명',  key: 'memberNm'},
    { title: '부서',      key: 'deptNm'},
    { title: '직급',      key: 'jobPosition'},
    { title: '전화번호',  key: 'phone'},
    { title: '이메일',    key: 'email'},
    { title: '재직여부',  key: 'useYn'},
    { title: '비고',      key: 'etc'},
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

/**
 *  사용자 등록 및 수정 팝업 화면 호출
 * @param item : 신규버튼인지, 리스트의 이름으로 호출한건지 구분값
 */
const openPop = (item) =>{
  if ( item === 'N') {
    mode.value= 'N'
    title.value = '사용자 등록'
    id.value = ''
  }else{
    mode.value= 'U'
    id.value = item
    title.value = '사용자 상세정보'
  }
  dialog.value = true
}

/**
 *  검색창 초기화
 */
const reset = () =>{
  srhForm.value.reset()
}

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, userList.value, '사용자_목록')
}

/**
 * 화면 이동시 자동 조회
 */
onMounted(srhUserList)

const handleSaved = (msg) => {
  alert.vSuccess(msg)
  srhUserList()
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
