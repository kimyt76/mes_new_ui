<template>
  <v-card class="pa-3">
    <v-card-item title="성분 조회"
      style="height: 30px;"
    ></v-card-item>
    <v-row>
      <v-col class="mt-7"  style="height: 20px; padding: 3px;">
        <v-form ref="srhForm" @submit.prevent="srhIngredientList">
          <div class="d-flex ga-4 ml-4">
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
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5">
        <v-data-table
          :headers="headers"
          :items="ingrediantList"
          style="height: 600px;"
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
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="mt-10" style="height: 70px;">
      <v-col>
        <div class="d-flex ga-4 justify-end">
          <v-btn
            text="선택"
            color = "brown-lighten-4"
            />
          <v-btn
            text="닫기"
            variant="tonal"
            @click="emit('close-dialog')"
            />
        </div>
      </v-col>
    </v-row>
  </v-card>

</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { reactive, ref } from 'vue';

const { vError } = useAlertStore()
const emit = defineEmits(['selected', 'close-dialog'])
const ingrediantList = ref([])

const  srhForm = ref('')
const loading = ref(false)

const headers = [
    { title: '성분코드',    key: 'ingredientCode', width: 100},
    { title: '국문성분명',  key: 'krIngredientName', width: 200},
    { title: '영문성분명',  key: 'enIngredientName', width: 200},
    { title: 'CAS No',     key: 'casNo', width:100},
    { title: 'function',   key: 'functionNm', width:150},
]

const form = reactive({
  ingredientName: '',
  functionNm: '',
})

const srhIngredientList = () =>{
  loading.value = true

  try{
    const params = {
      ...form
    }

    ingrediantList.value = ApiLab.getIngredientList(params)

  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}


const reset = () =>{
  srhForm.value.remove()
}
</script>

<style scoped>
@import '@/assets/css/main.css';
.v-card-item  {
  background-color:#BCAAA4
}
</style>
