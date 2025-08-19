<template>
  <v-breadcrumbs :items="['MES', '연구관리', '원료상세']"></v-breadcrumbs>
  <v-card>

  </v-card>
  <v-card
    >
    <template v-slot:title>
      <span class="font-weight-black">품목코드 상세등록</span>
    </template>
    <v-row>
      <v-col>

      </v-col>
    </v-row>
  </v-card>
  <v-row>
    <v-col>
      <div class="d-flex ga-4 justify-end">
        <v-btn
          color = "brown-lighten-4"
          class="mt-3"
          text="추가+"
          @click="openPop"
          />
        <v-btn
          class="mt-3 mr-3"
          @click="removeItem"
          text="삭제+"
          />
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table-virtual
        :headers="headers"
        :items="ingredientList"
        item-value="id"
        show-select
        v-model:selected="selectedItems"
      >
        <template v-slot:headers="{ columns}">
          <tr style="height: 30px; background-color: #BCAAA4;">
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width+'px', height: '30px', textAlign: 'center'} "
              style="border: 1px solid #ccc;"
              >
              {{ column.title }}
            </th>
          </tr>
        </template>
      </v-data-table-virtual>
    </v-col>
  </v-row>


  <v-dialog  v-model="dialog" max-width="800px" persistent>
    <IngredientListPop
      @saved="handleSaved"
      @close-dialog="dialog = false"/>
  </v-dialog>



</template>

<script setup>
import { ref } from 'vue';
import { isEmpty } from '@/util/common';
import IngredientListPop from '@/views/lab/ingredient/IngredientListPop.vue';

const dialog =ref(false)

const ingredientList = ref([])

const headers = [
    { title: '성분코드',     key: 'ingredientCode',    width: 100},
    { title: '국문성분명',   key: 'krIngredientName',  width: 200},
    { title: '영어성분명',   key: 'enIngredientName',  width: 200},
    { title: '국내함량',     key: 'DomesticContent',   width: 100},
    { title: '수출용함량',   key: 'ExportContent',     width: 100},
    { title: 'CAS No',      key: 'casNo',             width: 100} ,
    { title: 'function',    key: 'functionNm',        width: 100},
    { title: '한도 국가',    key: 'limitCountry',      width: 80},
    { title: '금지 국가',    key: 'banCountry',        width: 80},
]

let nextId = 1
const selectedItems = ref([])

const addItem = () =>{
   ingredientList.value.push({
    id: nextId++,
    ingredientCode: '',
    ingredientCode: '',
    krIngredientName: '',
    enIngredientName: '',
    DomesticContent: '',
    ExportContent: '',
    casNo: '',
    functionNm: '',
    limitCountry: '',
    banCountry: '',
   })
}

const removeItem = () => {
  console.log('Selected Items:', selectedItems.value)
  const selectedIds = selectedItems.value.map(item => item.id)

  console.log('Selected IDs:', selectedIds)
  ingredientList.value = ingredientList.value.filter(
    item => !selectedIds.includes(item.id)
  )
  selectedItems.value = []

}

const handleSaved = () => {

}

const openPop = () =>{

  dialog.value = true
}

</script>

<style scoped>

</style>
