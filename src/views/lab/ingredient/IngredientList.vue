<template>
<v-breadcrumbs
    :items="['MES', '연구관리', '성분정보']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhList">
        <v-col class="d-flex flex-row ga-3">
          <v-text-field
              v-model="form.ingredientName"
              density="compact"
              label="성분명"
              placeholder="성분명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.functionNm"
              density="compact"
              label="function명"
              placeholder="function명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.regName"
              density="compact"
              label="등록자"
              placeholder="등록자명을 입력해주세요"
              variant="underlined"
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
        :items="ingredientList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        fixed-header
        height="690px"
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header"
              style="height: 40px;"
              :style="{textAlign: 'center'} "
              >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #item.ingredientCode="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.ingredientCode }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog  v-model="dialog" width="800px" height="750px" persistent>
    <IngredientDetailPop
      :title="title"
      :mode="mode"
      :id="ingredientCode"
      @saved="handleSaved"
      @close-dialog="dialog = false"/>
  </v-dialog>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab'
import {onMounted, reactive, ref} from 'vue'
import { exportToExcel } from '@/util/exportToExcel';
import { useAlertStore } from '@/stores/alert';
import IngredientDetailPop from './IngredientRegPop.vue';
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';

const { vError, vSuccess } = useAlertStore()
const ingredientCode = ref('')
const dialog = ref(false)
const loading = ref(false)
const srhForm = ref(null)
const ingredientList = ref([])
const mode = ref('')
const title = ref('')

const form = reactive({
  ingredientName: '',
  functionNm : '',
  casNo: '',
})

const headers = ref([
    { title: '성분코드',    key: 'ingredientCode',   align: 'center',  width: '70px'},
    { title: '국문성분명',  key: 'krIngredientName',   align: 'start',width: '240px'},
    { title: '영문성분명',  key: 'enIngredientName',   align: 'start', width: '240px'},
    { title: '중문성분명',  key: 'cnIngredientName',   align: 'start', width: '250px'},
    { title: 'CAS No',     key: 'casNo',              align: 'start', width: '150px'},
    { title: 'function',   key: 'functionNm',     align: 'start', width: '150px'},
    { title: '등록자',      key: 'regName',     align: 'center', width: '70px'},
    { title: '수정자',      key: 'updName',     align: 'center', width: '70px'},
    { title: '수정일자',    key: 'updDate',     align: 'center', width: '100px'},
    { title: '비고',        key: 'etc',         align: 'start', width: '110px'},
])


const selectRowClick = (item, index) => {
  console.log('item',item.ingredientCode)
  if ( isEmpty(item.ingredientCode)) {
    mode.value = 'N'
    title.value = '성분 등록'
  }else{
     mode.value= 'U'
     title.value = '성분 상세정보'
     ingredientCode.value = item.ingredientCode
  }
  dialog.value = true
}

const handleSaved = (msg) => {
  vSuccess(msg)
  srhList()
}

/**
 * 리스트 조회
 */
const srhList = async () => {
  loading.value = true

  try{
    const params = {
      ...form,
    }
    ingredientList.value = await ApiLab.getIngredientList(params)

  }catch(err){
    vError("조회 중 오류가 발생했습니다."+err)
  }finally{
    loading.value = false
  }
}

const openPop = (gb) => {
  if (gb === 'N' ) {
     mode.value= 'N'
     title.value = '성분 등록'
     ingredientCode.value = ''
  }else{
     mode.value= 'U'
     title.value = '성분 상세정보'
  }
  dialog.value = true
}


/**
 * 초기화
 */
onMounted( async () =>{
  srhList()
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, ingredientList.value, '성분_목록')
}


</script>

<style>
@import '@/assets/css/main.css';
</style>
