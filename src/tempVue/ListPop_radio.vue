<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>제목</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srcForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
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
          color = "brown-lighten-4"
          type="submit"
          />
        <v-btn
          text="초기화"
          @click="srcForm.reset()"
          />
      </v-col>
      </v-form>
    </v-row>
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          :headers="headers"
          :items="list"
          density="compact"
          fixed-header
          height="520px"
          show-select
          select-strategy="single"
          class="custom-table"
        >
        <template #item.itemCd="{ item }">
          <div class="wrap-cell">{{ item.itemCd }}</div>
        </template>
        <template #item.name="{ item }">
          <div class="wrap-cell">{{ item.name }}</div>
        </template>
        <template #item.qty="{ item }">
          <div class="wrap-cell text-right">{{ item.qty }}</div>
        </template>
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
import { reactive, ref } from 'vue';


const emit = defineEmits('close-dialog')

const list = ref([])

const form = reactive({
  test: '',
  manager: '',
})

const headers = [
  { title: '품목코드.',  key: 'itemCd', align: 'center', width: '120px' },
  { title: '품목명.',    key: 'name',   align: 'start', width: '500px;' },
  { title: '수량.',      key: 'qty',    align: 'end',  width: '100px;' },
]

const searchList = () =>{

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
