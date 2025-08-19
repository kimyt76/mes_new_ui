<template>
  <v-dialog v-model="dialog" width="1000px">
    <v-card class="pa-4">
      <!-- 제목 + 닫기 아이콘 -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">판매 조회</span>
        <!-- <v-btn icon @click="dialog = false" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
      </v-card-title>

      <!-- 조회 영역 -->
      <v-row dense class="mb-4">
        <v-col>
            <div class="d-flex ga-4 justify-end">
            <v-text-field v-model="form.itemName" label="품목명" density="compact" />
            <v-text-field v-model="form.managerName" label="담당자명" density="compact" />
            <v-text-field v-model="form.customerName" label="거래처명" density="compact" />
            <v-btn color="primary" @click="doSearch">조회</v-btn>
          </div>
          </v-col>
      </v-row>

      <!-- 리스트 -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="saleList"
        item-value="saleId"
        show-select
        class="my-data-table mb-4"
        :loading="loading"
        no-data-text="데이터가 없습니다."
        loading-text="조회 중입니다..."
        density="compact"
        fixed-header
        height="400px"
        return-object
      />

      <!-- 하단 버튼 -->
      <v-card-actions class="justify-end">
        <v-btn color="indigo-darken-4" variant="tonal" @click="selectRows">선택</v-btn>
        <v-btn variant="tonal" @click="emit('close-saleDialog')">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders'
import { reactive, ref } from 'vue'

const emit = defineEmits(['selected', 'close-contractDialog'])

const dialog = ref(true)

const form = reactive({
  itemName: '',
  managerName: '',
  customerName: ''
})

const loading = ref(false)
const selected = ref([])
const saleList = ref([])

const headers = [
  { title: '일자-No.',         key: 'saleDateSeq',      align: 'center', width: 110 },
  { title: '품목명',           key: 'itemName',          align: 'center', width: 200 },
  { title: '거래처명',         key: 'customerName',      align: 'center', width: 150 },
  { title: '담당자명',         key: 'managerName',       align: 'center', width: 90 },
  { title: '거래유형',         key: 'transactionTypeName',       align: 'center', width: 90 },
  { title: '금액합계',         key: 'totPrice',           align: 'center', width: 90 },
  { title: '진행상태',         key: 'statusType',        align: 'center', width: 70 }
]

const doSearch = async () => {
  loading.value = true

  const param = {
    ...form
  }

  saleList.value = await ApiOrder.getSaleList(param);

  loading.value = false
  setTimeout(() => {
    loading.value = false
    // 실제 검색 로직 넣으면 됨
  }, 1000)
}

const selectRows = () => {
  console.log('선택된 행:', selected.value)
  emit('selected', selected.value)
  emit('close-saleDialog')
}
</script>
<style>
::v-deep(.my-data-table thead th) {
  height: 32px !important;
  background-color: #BCAAA4 !important;
}

</style>
