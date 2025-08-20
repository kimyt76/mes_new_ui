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
        <v-select
          v-model="form.storageType"
          label="창고구분"
          :items="storageTypes"
          item-title="codeNm"
          item-value="code"
          style="width: 200px;"
          variant="underlined"
          />
        <v-text-field
          v-model="form.storageName"
          label="창고명"
          density="compact"
          style="width: 250px;"
          placeholder="창고명을 입력해주세요"
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
          :items="storageList"
          :items-per-page="15"
          density="compact"
          fixed-header
          height="520px"
          class="custom-table"
          @click:row="handleRowClick"
          return-object
        >
      </v-data-table>
      </div>
  </v-card-text>
  <v-card-actions>
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
import { ApiCommon } from '@/api/apiCommon';
import { reactive, ref, onMounted } from 'vue';

const emit = defineEmits(['selected', 'close-dialog'])

const loding = ref(false)
const srcForm = ref(null)
const storageList = ref([])
const storageTypes = ref([])

const form = reactive({
  storageType: '',
  storageName : '',
})

const headers = [
  { title: '창고번호',  key: 'storageCd',     align: 'center', width: '150px' },
  { title: '창고명',    key: 'storageName',   align: 'right', width: '220px' },
  { title: '구분',      key: 'storageTypeName',    align: 'right',  width: '150px' },
  { title: '고객사명',  key: 'outCustomerName',    align: 'right',  width: '220px' },
]

const searchList = async () =>{

  const params = {
    ...form
  }
  storageList.value = await ApiBase.getStorageList(params)
}

const handleRowClick = (event, item) =>{
  //emit('selected', item.item.storageCd, item.item.storageName )
  emit('selected', item.item )
  emit('close-dialog')
}

onMounted( async () => {
  storageTypes.value = await ApiCommon.getCodeList('storage_type')
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
