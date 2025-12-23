<template>
<v-card style="width: 900px;">
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>판매 조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-saleDialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
        <v-text-field
          v-model="form.itemName"
          label="품목명"
          density="compact"
          placeholder="품목명을 입력해주세요"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.itemCd"
          label="담당자명"
          density="compact"
          style="width: 150px;"
          placeholder="담당자명을 입력해주세요"
        />
        <v-text-field
          v-model="form.customerName"
          label="거래처명"
          density="compact"
          style="width: 150px;"
          placeholder="담당자명을 입력해주세요"
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
          v-model="selected"
          :headers="headers"
          :items="saleList"
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
      @click="selectRows"
      />
    <v-btn
      text="닫기"
      variant="tonal"
      class="mb-4 mr-3"
      @click="emit('close-saleDialog')"
      />
  </v-card-actions>
</v-card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders'
import { reactive, ref } from 'vue'

const emit = defineEmits(['selected','close-saleDialog'])

const loading = ref(false)
const srhForm = ref('')
const saleList = ref([])
const selected = ref(null)

const form = reactive({
  itemName: '',
  managerName: '',
  customerName: ''
})

const headers = [
  { title: '일자-No.',         key: 'saleDateSeq',      align: 'center', width: 110 },
  { title: '품목명',           key: 'itemName',          align: 'center', width: 200 },
  { title: '거래처명',         key: 'customerName',      align: 'center', width: 150 },
  { title: '담당자명',         key: 'managerName',       align: 'center', width: 90 },
  { title: '거래유형',         key: 'transactionTypeName',       align: 'center', width: 90 },
  { title: '금액합계',         key: 'totPrice',           align: 'center', width: 90 },
  { title: '진행상태',         key: 'statusType',        align: 'center', width: 70 }
]

const searchList =  () =>{
  loading.value = true

  const param = {
    ...form
  }

  setTimeout( async () => {
    loading.value = false
    saleList.value = await ApiOrder.getSaleList(param);
  }, 1000)
}

const selectRows = () =>{
  console.log('selected', selected.value)
  emit('selected', selected.value)
}


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
