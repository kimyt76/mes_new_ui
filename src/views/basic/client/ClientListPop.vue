<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>고객사 목록</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
        <v-text-field
          v-model="form.clientName"
          label="고객사명"
          density="compact"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.businessNo"
          label="사업자번호"
          density="compact"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.managerName"
          label="담당자"
          density="compact"
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
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          :headers="headers"
          :items="clientList"
          density="compact"
          fixed-header
          height="520px"
          class="custom-table"
          @click:row="handleRowClick"
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
import { ApiBase } from '@/api/apiBase';
import { onMounted, reactive, ref } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput'

const emit = defineEmits(['selected','close-dialog'])

const srhForm = ref(null)
const clientList = ref([])
const form = reactive({
  clientName: '',
  managerName: '',
  businessNo: '',
})

const headers = [
  { title: 'No.',         key: 'rowNum',     align: 'center', width: '20px' },
  { title: '고객사명',     key: 'clientName', align: 'start', width: '270px' },
  { title: '사업자번호.',  key: 'businessNo', align: 'center',  width: '120px;' },
  { title: '대표자명',     key: 'president',  align: 'center',  width: '90px;' },
]

const searchList = async () =>{

  const params = {
    ...form
  }

  clientList.value = await ApiBase.getClientList(params)
}

const handleRowClick = (event, item) =>{
  emit('selected', item.item)
  emit('close-dialog')
}
onMounted( async() => {

})
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
