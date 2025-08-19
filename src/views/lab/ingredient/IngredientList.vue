<template>
  <v-breadcrumbs
    :items="['MES', '연구관리', '성분정보']"
    class="custom-breadcrumbs"
    />
  <v-card
    class="pa-3"
    color="blue-grey-lighten-5"
     style="height: 60px;"
    >
    <v-form ref="srhForm" @submit.prevent="srhList">
      <v-row>
        <v-col style="background-color: #ECEFF1">
          <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-text-field
            v-model="form.ingredientName"
            label="성분명"
            placeholder="성분명을 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-text-field
            v-model="form.functionNm"
            label="function명"
            placeholder="function명을 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-text-field
            label="등록자"
            placeholder="등록자를 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-btn
            color="#EFEBE9"
            class="mt-2"
            type="submit"
            density="compact"
            text="조회"
            />
          <v-btn
            @click="reset"
            class="mt-2"
            density="compact"
            text="초기화"
            />
        </div>
      </v-col>
      </v-row>
    </v-form>
  </v-card>
  <v-row class="mb-1">
  <v-col>
    <div class="d-flex ga-4 justify-end">
    <v-btn
        color = "brown-lighten-4"
        class="mt-3"
        density="compact"
        @click="openPop('N')"
        text="신규"
        />
      <v-btn
        class="mt-3 mr-3 excel-btn"
        text="엑셀"
        density="compact"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
     </div>
  </v-col>
</v-row>
<div class="table-wrapper">
  <v-data-table
    :headers="headers"
    :loading="loading"
    :items="ingredientList"
    class="scrollable-table"
    style="height: 700px;"
    :items-per-page="25"
    no-data-text="데이터가 없습니다."
    loading-text="조회중입니다 잠시만 기다려주세요"
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
    <!-- 리스트 영역 커스터마이징 -->
    <template #item="{ item }">
      <tr style="height: 30px;">
        <td class="custom-row" style="width: 100px; height: 30px; padding: 0; cursor: pointer;" @click="handleRowClick(item.ingredientCode)">{{ item.ingredientCode }}</td>
        <td style="width: 200px; height: 30px;">{{item.krIngredientName}}</td>
        <td style="width: 200px; height: 30px;">{{item.enIngredientName}}</td>
        <td style="width: 200px; height: 30px;">{{item.cnIngredientName}}</td>
        <td style="width: 100px; height: 30px;">{{item.casNo}}</td>
        <td style="width: 150px; height: 30px;">{{item.functionNm}}</td>
        <td class="custom-row"  style="width: 100px; height: 30px;">{{item.updNm}}</td>
        <td class="custom-row"  style="width: 100px; height: 30px;">{{item.updDate}}</td>
        <td style="width: 100px; height: 30px;">{{item.etc}}</td>
      </tr>
    </template>
  </v-data-table>
</div>

<v-dialog  v-model="dialog" max-width="800px" persistent>
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

const { vError, vSuccess } = useAlertStore()
const ingredientCode = ref('')
const dialog = ref(false)
const loading = ref(false)
const srhForm = ref(null)
const ingredientList = ref([])
const form = reactive({
  ingredientName: '',
  functionNm : '',
  casNo: '',
})

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

/**
 *  테이블 헤더
 */
const headers = ref([
    { title: '성분코드',    key: 'ingredientCode', width: 100},
    { title: '국문성분명',  key: 'krIngredientName', width: 200},
    { title: '영문성분명',  key: 'enIngredientName', width: 200},
    { title: '중문성분명',  key: 'cnIngredientName', width: 200},
    { title: 'CAS No',     key: 'casNo', width:100},
    { title: 'function',   key: 'functionNm', width:150},
    { title: '수정자',      key: 'updNm', width:100},
    { title: '수정일자',    key: 'updDate', width:100},
    { title: '비고',        key: 'etc', width:100},
])

const handleRowClick = (item) => {
  ingredientCode.value = item;
  openPop('U')
}

const handleSaved = (msg) => {
  vSuccess(msg)
  srhList()
}

const mode = ref('')
const title = ref('')

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

onMounted(srhList)

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, ingredientList.value, '성분_목록')
}

/**
 *  검색창 초기화
 */
const reset = () =>{
  srhForm.value.reset()
}

</script>

<style scoped>
@import '@/assets/css/main.css';

/*
.table-wrapper {
  overflow-x: auto;
}
.scrollable-table ::v-deep .v-table {
  min-width: 3000px;
}

.scrollable-table ::v-deep th.column-name,
.scrollable-table ::v-deep td.column-name {
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  min-width: 150px;
  max-width: 150px;
}
*/
</style>
