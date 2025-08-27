<template>
<v-breadcrumbs
    :items="['MES', '영업관리', '수주관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
        <v-col class="d-flex ga-4">
          <v-date-input
            v-model="form.strDate"
            label="수주일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-select
            v-model="form.select"
            label="제목"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.test"
            label="제목"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.manager"
            label="담당자"
            density="compact"
            variant="underlined"
            style="width: 200px;"
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
        @click="go"
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
        :items="list"
        density="compact"
        fixed-header
        height="720px"
        class="custom-table"
        >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';


const srhForm = ref(null)
const list = ref([])

const form = reactive({
  strDate : '',
  test: '',
  manager: '',
  select: '',
})
const headers = [
  { title: '품목코드.',  key: 'itemCd', align: 'center', width: '120px' },
  { title: '품목명.',    key: 'name',   align: 'start', width: '200px' },
  { title: '수량.',      key: 'qty',    align: 'end',  width: '100px' },
]
const dateValue = ref('')

const searchList = () => {
  //list.value
  console.log('date', form.strDate)

}

const go = () => {

}

onMounted(() => {
  console.log('todayKST', todayKST())
  form.strDate = todayKST()
})


/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, list.value, '정보_목록')
}


</script>

<style>
@import '@/assets/css/main.css';
</style>
