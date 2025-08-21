<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>주문 조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-contractDialog')">
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
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.managerName"
          label="담당자명"
          density="compact"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.customerName"
          label="거래처명"
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
          :items="contractList"
          item-value="contractId"
          density="compact"
          fixed-header
          height="520px"
          show-select
          class="custom-table"
          return-object
        >
        <template #item.name="{ item }">
          <div class="wrap-cell">{{ item.name }}</div>
        </template>
        <template #item.qty="{ item }">
          <div class="wrap-cell text-right">{{ formatComma(item.qty) }}</div>
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
      @click="emit('close-contractDialog')"
      />
  </v-card-actions>
</v-card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { reactive, ref } from 'vue';
import { isEmpty, formatComma } from '@/util/common';

const emit = defineEmits(['selected', 'close-contractDialog'])

const loading = ref(false)
const selected = ref([])
const contractList = ref([])

const form = reactive({
  itemName: '',
  managerName: '',
  customerName: ''
})

const headers = [
  { title: '일자-No.',    key: 'contractDateSeq', align: 'center', width: '120px' },
  { title: '품목명',      key: 'itemName',   align: 'start', width: '250px' },
  { title: '납기일자',    key: 'dueDate',   align: 'start', width: '100px' },
  { title: '거래처명',    key: 'customerName',   align: 'start', width: '150px' },
  { title: '현재합계',    key: 'totQty',    align: 'end',  width: '110px' },
  { title: '주문수량합계',  key: 'totQty',    align: 'end',  width: '100px' },
  { title: '주문공급가액합계',  key: 'totSupplyPrice',    align: 'end',  width: '110px' },
]

const searchList = async () =>{
  const param = {
    ...form
  }

    setTimeout(async () => {
      loading.value = false
      // 실제 검색 로직 넣으면 됨
      contractList.value = await ApiOrder.getContractList(param);
    }, 1000)
}

const selectRows = () => {
  console.log('선택된 행:', selected.value)
  emit('selected', selected.value)
  emit('close-contractDialog')
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
