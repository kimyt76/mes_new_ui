<template>
<v-breadcrumbs
    :items="['MES', '관리', '관리']"
    class="custom-breadcrumbs"
    >
  </v-breadcrumbs>
  <v-card>
    <v-card-text >
      <v-row class="custom-height">
      <v-form ref="srcForm" @submit.prevent="searchList">
        <v-col class="d-flex flex-row ga-3">
          <v-select
            v-model="form.select"
            label="제목"
            density="compact"
            :items="lists"
          item-title="codeNm"
          item-value="code"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.test"
            label="제목"
            density="compact"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.manager"
            label="담당자"
            density="compact"
            style="width: 200px;"
          />
          <v-btn
            text="조회"
            color="brown-lighten-4"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srcForm.reset()"
            />
        </v-col>
      </v-form>
    </v-row>
    </v-card-text>
  </v-card>
  <v-spacer></v-spacer>
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 8px; margin-top: 8px;">
      <v-btn
        color="brown-lighten-4"
        text="신규"
        @click="goNew"
        />
      <v-btn
        class="excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
    </v-col>
  </v-row>
  <v-row class="py-0">
    <v-col>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="list"
        item-value="id"
        density="compact"
        fixed-header
        height="520px"
        show-select
        class="custom-table"
        @click:row="selectRowClick"
        >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';

const srcForm = ref(null)
const list = ref([])
const lists = ref([])
const selected = ref([])
const form = reactive({
  test: '',
  manager: '',
  select: '',
})
const headers = [
  { title: '품목코드',  key: 'itemCd', align: 'center', width: '120px' },
  { title: '품목명',    key: 'name',   align: 'start', width: '200px' },
  { title: '수량',      key: 'qty',    align: 'end',  width: '100px' },
]

const searchList = () => {
  //list.value
}

const goNew = () => {

}

const selectRowClick = () => {

}

onMounted( async() => {

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
.custom-height {
  height: 60px;
}
</style>
