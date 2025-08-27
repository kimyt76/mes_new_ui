<template>
<v-breadcrumbs
    :items="['MES', '시스템관리', '공통코드 관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhCommonList">
        <v-col class="d-flex ga-4">
          <v-text-field
            v-model="form.comTypeCd"
            label="코드구분"
            placeholder="코드구분명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 200px;"
              />
          <v-text-field
            v-model="form.codeNm"
            label="코드명"
            placeholder="코드명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 200px;"
            />
          <v-select
            v-model="form.useYn"
            label="사용여부"
            :items="useYns"
            item-title="codeNm"
            item-value="code"
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
        :items="commonList"
        :items-per-page="15"
        density="compact"
        fixed-header
        height="700px"
        class="custom-table"
        return-object
        >
        <template #item.comTypeCd="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.comTypeCd }}
          </div>
        </template>
        <template #item.useYn="{ item, index }">
            {{ item.useYn === 'Y' ? '사용': '미사용' }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog  v-model="dialog" max-width="600px" persistent>
    <CommonDetailPop
      :title="title"
      :mode="mode"
      :id="id"
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
import CommonDetailPop from './CommonDetailPop.vue';
import { isEmpty, formatComma } from '@/util/common';

const { vError, vSuccess } = useAlertStore()

const dialog = ref(false)
const loading = ref(false)
const srhForm = ref(null)
const commonList = ref([])
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

const selectRowClick = (item, index) => {
  if (isEmpty(item.comId)) {
    title.value = '공통코드 등록'
    id.value = null
  }else{
    mode.value= 'U'
    id.value = item.comId
    title.value = '공통코드 수정'
  }

  dialog.value = true
}

/**
 *  테이블 헤더
 */
const headers = ref([
    { title: '코드구분',  key: 'comTypeCd',   align: 'center' ,      align: 'center', width: '180px'},
    { title: '구분명',    key: 'comTypeNm',   align: 'center' ,      align: 'center', width: '120px'},
    { title: '코드',      key: 'code',        align: 'center' ,      align: 'center', width: '120px'},
    { title: '코드명',    key: 'codeNm',      align: 'center',      align: 'start', width: '180px'},
    { title: '사용여부',  key: 'useYn',       align: 'center' ,      align: 'center', width: '100px'},
    { title: '비고',      key: 'descrition',  align: 'center',      align: 'center', width: '150px' },
])

/**
 * 사용자 정보 조회
 */
const srhCommonList= async () => {
  loading.value =true

  try{
    const params = {
      ...form,
    }
    commonList.value = await ApiCommon.getCommonList(params)
  }catch(err){
    vError(err)
  }finally{
    loading.value =false
  }
}

const handleSaved = (msg) => {
  vSuccess(msg)
  srhCommonList()
}

onMounted( async () => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  srhCommonList()
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, commonList.value, '공통코드_목록')
}

</script>

<style>
@import '@/assets/css/main.css';


</style>
