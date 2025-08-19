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
      <v-form ref="srcForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
        <v-select
          v-model="form.itemTypeName"
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
          @click="srcForm.reset()"
          />
      </v-col>
      </v-form>
    </v-row>
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          :headers="headers"
          :items="itemList"
          :loading="loading"
          item-value ="itemCd"
          density="compact"
          fixed-header
          height="520px"
          class="custom-table"
          return-object
          @click:row="itemRow"
        >
        <template #item.itemTypeName="{ item }">
          <div class="wrap-cell">{{ item.itemTypeName }}</div>
        </template>
        <template #item.itemCd="{ item }">
          <div class="wrap-cell">{{ item.itemCd }}</div>
        </template>
        <template #item.itemName="{ item }">
          <div class="wrap-cell">{{ item.itemName }}</div>
        </template>
        <template #item.customerName="{ item }">
          <div class="wrap-cell">{{ item.customerName }}</div>
        </template>
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
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits('selected','close-dialog')

const loading = ref(false)
const srcForm = ref('')
const itemTypeCds = ref([])
const itemList = ref([])
const form = reactive({
  itemTypeCd: '',
  itemName: '',
  itemCd: '',
})

const headers = [
  { title: '품목구분',  key: 'itemTypeName',  align: 'center',  width: '80px' },
  { title: '품목코드',  key: 'itemCd', align: 'center', width: '110px' },
  { title: '품목명',    key: 'itemName',   align: 'start', width: '210px' },
  { title: '거래처',    key: 'customerName',   align: 'start', width: '150px' },
]

const searchList = async () =>{
  loading.value = true

  const params = {
    ...form
  }
  itemList.value = await ApiItem.getItemList(params)

  loading.value =false
}

const itemRow = (event, item) =>{
  console.log('item', item.item)
  emit('selected', item.item)
}

onMounted( async () => {
  itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
})

</script>

<style >
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
