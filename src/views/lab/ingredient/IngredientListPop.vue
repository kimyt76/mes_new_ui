<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>성분코드조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srhForm" @submit.prevent="srhIngredientList">
      <v-col class="d-flex flex-row ga-3">
        <v-text-field
          v-model="form.ingredientCode"
          label="성분코드"
          placeholder="성분코드를 입력해주세요"
          density="compact"
          style="width: 150px;"
        />
        <v-text-field
          v-model="form.ingredientName"
          label="성분명"
          placeholder="성분명을 입력해주세요"
          density="compact"
          style="width: 180px;"
        />
        <v-text-field
          v-model="form.functionNm"
          label="function명"
          placeholder="function명을 입력해주세요"
          density="compact"
          style="width: 180px;"
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
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          v-model="selectedItem"
          :headers="headers"
          :items="ingrediantList"
          :loading="loading"
          item-value="ingredientCode"
          density="compact"
          fixed-header
          height="520px"
          show-select
          class="custom-table"
          return-object
        >
      </v-data-table>
      </div>
  </v-card-text>
  <v-card-actions>
    <v-btn
      text="선택"
      variant="flat"
      class="mb-4"
      color="indigo-darken-3"
      @click="handleRowClick"
      />
    <v-btn
      text="닫기"
      variant="tonal"
      class="mb-4 mr-3"
      @click="emit('close-dialog')"
      />
  </v-card-actions>
</v-card>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { reactive, ref } from 'vue';

const emit = defineEmits(['selected', 'close-dialog'])

const loading = ref(false)
const srhForm = ref('')
const selectedItem = ref([])
const ingrediantList = ref([])

const form = reactive({
  ingredientCode: '',
  ingredientName: '',
  functionNm: '',
})

const headers = [
    { title: '성분코드',    key: 'ingredientCode', width: 120},
    { title: '국문성분명',  key: 'krIngredientName', width: 230},
    { title: '영문성분명',  key: 'enIngredientName', width: 230},
    { title: 'CAS No',     key: 'casNo', width:110},
    { title: 'function',   key: 'functionNm', width:130},
]

const srhIngredientList = async () =>{
  loading.value = true
  try{
    const params = {
      ...form
    }

    ingrediantList.value = await ApiLab.getIngredientList(params)

  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

const handleRowClick = () =>{
  emit('selected', selectedItem.value)
}
</script>

<style >
/* .custom-table table {
  table-layout: fixed !important;
} */

.custom-table thead th {
  height: 32px !important;
  background-color: #BCAAA4 !important;
}

.wrap-cell {
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
}
.toolbar-Head {
  color: white;
  background-color:#546E7A;

}
</style>
