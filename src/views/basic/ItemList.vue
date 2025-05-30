<template>
  <v-breadcrumbs :items="['MES', '기본관리', '품목관리']"></v-breadcrumbs>
  <v-card class="pa-3" style="height: 80px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhItemList'>
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-select
            v-model="form.itemType"
            label="품목구분"
            :items="itemTypeCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            />
          <v-text-field
            v-model="form.itemNm"
            dense
            density="compact"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.itemCd"
            dense
            density="compact"
            label="품목코드"
            placeholder="품목코드를 입력해주세요"
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
        </v-form>
        </v-col>
    </v-row>
  </v-card>
  <v-row class="mb-1">
    <v-col>
      <div class="d-flex ga-4 justify-end">
    <v-btn
        dense
        color = "brown-lighten-4"
        class="mt-3"
        @click="goItemDetail('N')"
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
  :items="itemList"
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

</v-data-table>
</v-sheet>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const title = ref('')
const srhForm = ref(null)
const itemList = ref([])
const loading = ref(false)
const form = reactive({
  itemType : null,
  itemNm: null,
  itemCd: null,
  useYn : 'Y'
})

/**
 *  재직 유무 초기화
 */
const items = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

/**
 *  테이블 헤더
 */
 const headers = ref([
    { title: '품목코드',  key: 'itemId',      align: 'center' },
    { title: '품목명',    key: 'itemNm',      align: 'center' },
    { title: '단위',      key: 'unit',        align: 'center' },
    { title: '규격',      key: 'spec',        align: 'center'},
    { title: '구매처',    key: 'purchaseNm',  align: 'center' },
    { title: '입고단가',  key: 'inPrice',     align: 'center' },
    { title: '출고단가',  key: 'outPrice',    align: 'center' },
    { title: '거래유형',  key: 'trasType',    align: 'center' },
    { title: '제품유형',  key: 'productType', align: 'center' },
])

const router = useRouter()

const goItemDetail = (mode) => {
  if ( mode === 'N') {
    title.value ="품목 신규"
  }else{
    title.value ="품목 상세"
  }

  router.push({name: 'ItemDetail'})

}



/**
 *  검색창 초기화
 */
 const reset = () =>{
  srhForm.value.reset()
}



const srhItemList = () =>{

}
</script>

<style scoped>
.custom-header {
  background-color: #BCAAA4; /* 원하는 색상 */
  color: white;
  text-align: left;
}

</style>
