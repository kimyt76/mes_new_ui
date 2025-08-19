<template>
  <v-breadcrumbs :items="['MES', '원료관리', '원료정보']"></v-breadcrumbs>

  <v-card>
    <v-form ref="srhForm" @submit.prevent="srhList">
      <v-row>
        <v-col>
          <div class="d-flex ga-4 ml-2">
            <v-text-field
              v-model="form.itemName"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              density="compact"
              />
            <v-text-field
              v-model="form.itemCd"
              label="품목코드"
              placeholder="품목코드를 입력해주세요"
              variant="underlined"
              density="compact"
              />
            <v-text-field
              v-model="form.ingredientNm"
              label="성분명"
              placeholder="성분명을 입력해주세요"
              variant="underlined"
              density="compact"
              />
            <v-text-field
              v-model="form.customerNm"
              label="거래처명"
              placeholder="거래처명을 입력해주세요"
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
          @click="goDetail('1111')"
          class="mt-3 mr-3"
          density="compact"
          text="임시등록"
          />
        <v-btn
          @click="excel"
          class="mt-3 mr-3"
          density="compact"
          text="엑셀"
          />
      </div>
    </v-col>
  </v-row>
  <v-data-table
    :headers="headers"
    :loading="loading"
    :items="itemList"
    class="scrollable-table"
    style="height: 800px;"
    :items-per-page="25"
    no-data-text="데이터가 없습니다."
    loading-text="조회중입니다 잠시만 기다려주세요"
    @click:row="handleRowClick"
    >
    <template v-slot:headers="{ columns }">
      <tr style="height: 30px; background-color: #BCAAA4;">
        <th
          v-for="column in columns"
          :key="column.key"
          :style="{ width: column.width+'px', height: '30px'}"
          class="custom-header"
          >
          {{ column.title }}
        </th>
      </tr>
    </template>


  </v-data-table>

</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const srhForm = ref('')
const loading = ref(false)
const itemList = ref([])

const headers = [
    { title: '품목코드',  key: 'itemCd', width: 100},
    { title: '품목명',    key: 'itemName', width: 250},
    { title: '구매처',    key: 'customerNm', width: 150},
    { title: '제조원',    key: 'cnIngredientName', width: 150},
    { title: '입고단가',  key: 'inPrice', width: 80},
    { title: '출고단가',  key: 'outPrice', width: 80},
    { title: 'Vegan',    key: 'vegan', width: 30},
    { title: 'Halal',    key: 'halal', width: 30},
    { title: 'RSPO',     key: 'rspo', width: 30},
    { title: '거래유형',  key: 'etc', width: 60},
]


const goDetail = (itemCd) =>{
  router.push({ name: 'MaterialDetail', params: { id: itemCd } })
}

const srhList = () =>{

}

const form = reactive({
  itemName: '',
  itemCd: '',
  ingredientNm: '',
  customerNm: '',
})

const reset = () =>{
  srhForm.value.reset()
}

const excel = () =>{

}


</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
