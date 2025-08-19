<template>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>판매 목록</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
<v-card>
  <v-spacer></v-spacer>
  <v-card-item>
    <v-card-subtitle>
      판매조회 : {{ props.no }}
    </v-card-subtitle>
  </v-card-item>
  <v-card-item>
    <v-data-table-virtual
        :headers="headers"
        :items="saleItemList"
        density="compact"
        fixed-header
        height="300px"
        class="custom-table"
      >
      <template #item.qty="{ item }">
        <div class="wrap-cell text-right">{{ formatComma(item.qty) }}</div>
      </template>
    </v-data-table-virtual>
  </v-card-item>
  <v-row>
    <v-col class="d-flex justify-end">
      <v-btn
        text="닫기"
        variant="tonal"
        class="mb-4 mr-4"
        @click="emit('close-dialog')"
        />
    </v-col>
  </v-row>

</v-card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { onMounted,  ref } from 'vue';
import { isEmpty, formatComma } from '@/util/common';

const emit = defineEmits(['close-dialog'])

const saleItemList = ref([])
const props = defineProps({
  id: {
    type: String,
  },
  no: {
    type:String,
  }
})

const headers = [
  { title: '품목코드',  key: 'itemCd',      align: 'center',   width: '120px' },
  { title: '품목명',    key: 'itemName',    align: 'start', width: '250px' },
  { title: '수량',      key: 'qty',         align: 'end',      width: '120px' },
  { title: '판매',      key: 'saleDateSeq', align: 'center',  width: '110px' },
]

const searchList = async () =>{
  saleItemList.value = await ApiOrder.getShipmentItemList(props.id)
}

onMounted( async() => {
  searchList()
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
