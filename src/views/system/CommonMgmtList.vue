<template>
  <v-breadcrumbs :items="['MES', '시스템관리', '공통코드 관리']"></v-breadcrumbs>

  <v-card
    class="pa-3"
    color="blue-grey-lighten-5"
    >
    <v-form ref="srhForm" @submit.prevent="srhCommonList">
      <v-row>
        <v-col
          style="background-color: #ECEFF1"
          >
          <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
            <v-text-field
              v-model="form.comTypeCd"
              dense
              label="코드구분"
              placeholder="코드구분명을 입력해주세요"
              variant="underlined"
                />
            <v-text-field
              v-model="form.codeNm"
              dense
              label="코드명"
              placeholder="직급을 입력해주세요"
              variant="underlined"
              />
            <v-select
              v-model="form.useYn"
              label="사용여부"
              :items="items"
              item-title="text"
              item-value="value"
              variant="underlined"
            />
          <v-btn
            dense
            color = "#EFEBE9"
            class="mt-3"
            type="submit"
            >조회</v-btn>
          <v-btn
            dense
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
          dense
          color = "brown-lighten-4"
          class="mt-3"
          @click="openPop('N')"
          >신규</v-btn>
        <v-btn
          dense
          class="mt-3 mr-3"
          @click="excel"
          >엑셀</v-btn>
       </div>
    </v-col>
  </v-row>

  <v-sheet border rounded>
  <v-data-table
    :headers="headers"
    :items="commonList"
    :loading="loading"
    no-data-text="데이터가 없습니다."
    loading-text="조회중입니다 잠시만 기다려주세요"
    :items-per-page="25"
    >
    <template v-slot:headers="{ columns }">
    <tr>
      <th
        v-for="column in columns"
        :key="column.key"
        class="custom-header"
      >
        {{ column.title }}
      </th>
    </tr>
  </template>
  <template v-slot:item="{ item }">
    <tr class="custom-list">
      <td>{{ item.comTypeCd}}</td>
      <td>{{ item.comTypeNm}}</td>
      <td>{{ item.code}}</td>
      <td>{{ item.codeNm}}</td>
      <td>{{ item.descrition}}</td>
      <td>{{ item.useYn === 'Y' ? '사용' : '미사용'}}</td>
    </tr>
  </template>
  </v-data-table>
  </v-sheet>


  </template>


<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const srhForm = ref(null)
const loading = ref(false)
const mode = ref('N')
const commonList = ref([])

/**
 *  사용 유무 초기화
 */
 const items = [
      { text: '사용', value: 'Y' },
      { text: '미사용', value: 'N' },
]

/**
 *  테이블 헤더
 */
 const headers = ref([
    { title: '코드구분',  key: 'comTypeCd',   align: 'center' },
    { title: '구분명',    key: 'comTypeNm',   align: 'center' },
    { title: '코드',      key: 'code',        align: 'center' },
    { title: '코드명',    key: 'codeNm',      align: 'center'},
    { title: '비고',      key: 'descrition',  align: 'center' },
    { title: '사용여부',  key: 'useYn',       align: 'center' },
])

const form = reactive({
  comTypeCd : null,
  codeNm : null,
  useYn : 'Y'
})

const srhCommonList = () => {
  loading.value = true

  const params = {
    ...form
  }

  try{
      ApiCommon.getCommonList(params).then(res => {
        commonList.value = res
      })

  }catch(err){
    alert(err)
  }finally{
    loading.value = false
  }
}

onMounted(srhCommonList)

const reset = () =>{
  srhForm.value.reset()
  form.useYn = 'Y'
}

const excel = () =>{
  exportToExcel(headers, commonList.value, '공통코드_목록')
}
</script>

<style scoped>
@import '@/assets/css/main.css';


</style>
