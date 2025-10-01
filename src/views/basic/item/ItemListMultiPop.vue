<template>
<v-card style="width: 900px;">
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>품목코드조회</v-toolbar-title>
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
        <v-select
          v-model="form.itemTypeCd"
          label="품목구분"
          :items="itemTypeCds"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          style="width: 200px;"
          density="compact"
          />
        <v-text-field
          v-model="form.itemName"
          label="품목명"
          density="compact"
          placeholder="품목명을 입력해주세요"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.itemCd"
          label="품목코드"
          density="compact"
          style="width: 150px;"
          placeholder="품목코드를 입력해주세요"
        />
        <v-btn
          text="조회"
          color = "brown-lighten-4"
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
          :items="itemList"
          :loading="loading"
          item-value ="itemCd"
          density="compact"
          fixed-header
          height="520px"
          show-select
          return-object
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header pa-1"
              >
              {{ column.title }}
            </th>
          </tr>
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
      @click="itemRow"
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
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits(['selected','close-dialog'])

const loading = ref(false)
const srhForm = ref('')
const itemTypeCds = ref([])
const itemList = ref([])
const selectedItem = ref(null)
const form = reactive({
  itemTypeCd: '',
  itemName: '',
  itemCd: '',
})

const headers = [
  { title: '품목구분',  key: 'itemTypeName',  align: 'center',  width: '80px' },
  { title: '품목코드',  key: 'itemCd',        align: 'center', width: '100px' },
  { title: '품목명',    key: 'itemName',      align: 'start', width: '250px' },
  { title: '거래처',    key: 'customerName',   align: 'start', width: '200px' },
]

const searchList = async () =>{
  loading.value = true

  const params = {
    ...form
  }
  itemList.value = await ApiItem.getItemList(params)

  loading.value =false
}

const itemRow = () =>{
  //console.log('selectedItem', selectedItem.value)
  emit('selected', selectedItem.value)
}

onMounted( async () => {
  itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
})

</script>

<style >
@import '@/assets/css/main.css';
.custom-table thead th {
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
