<template>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>주문서 목록</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
<v-card
    elevation="16"
  >
    <v-card-item>
      <v-card-subtitle class="mt-4">
        판매조회 : {{ props.no }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-item class="py-1">
      <v-row>
        <v-col>
          <v-data-table-virtual
            :headers="headers"
            :items="saleItemList"
            class="my-data-table"
            fixed-header
            >
            <template #item.itemCd="{ item }">
              <span class="cell fixed" style="cursor: pointer;"> {{ item.itemCd }} </span>
            </template>
            <template #item.itemName="{ item }">
              <span class="cell wrap" style="text-decoration: underline;"> {{ item.itemName }} </span>
            </template>
            <template #item.unit="{ item }">
              <span class="cell fixed"> {{ item.unit }} </span>
            </template>
            <template #item.qty="{ item }">
              <span class="cell fixed"> {{ formatComma(item.qty) }} </span>
            </template>
             <template #item.contractDateSeq="{ item }">
              <span class="cell fixed"  style="text-decoration: underline; cursor: pointer" @click="goContractDetail(item.contractId)"> {{ item.contractDateSeq }} </span>
            </template>
          </v-data-table-virtual>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end" >
          <v-btn
            text="닫기"
            variant="tonal"
            @click="emit('close-dialog')"
            />
        </v-col>
      </v-row>
    </v-card-item>
</v-card>>

<v-dialog>
  <ContractDetailPop
    :id="saleId"
    @close-dialog="dialog = false"
    />
</v-dialog>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { onMounted, ref } from 'vue';
import ContractDetailPop from '../contract/ContractDetailPop.vue';
import { isEmpty, formatComma } from '@/util/common';

const saleItemList = ref([])
const emit = defineEmits(['close-dialog'])

const props = defineProps({
  id: {
    type: String,
  },
  no: {
    type:String,
  }
})

const headers = [
  { title: '품목코드', key: 'itemCd',           align: 'center',      width: '120px'},
  { title: '품목명',   key: 'itemName',         align: 'left',        width: '250px'  },
  { title: '규격',     key: 'unit',             align: 'center' ,     width: '60px'},
  { title: '수량',     key: 'qty',              align: 'center' ,     width: '120px'},
  { title: '주문서',   key: 'contractDateSeq',  align: 'center',      width: '110px'},
]

onMounted( async () => {
  saleItemList.value = await ApiOrder.getSaleItemList(props.id)
})

const goContractDetail = () =>{

}

</script>

<style scoped>
/* .v-card-item  {
  height: 45px;
  background-color:#BCAAA4
} */
::v-deep(.my-data-table thead th) {
  height: 32px !important;
  background-color: #BCAAA4 !important;
}
/* 열 너비 고정 */
::v-deep(.col-itemCd) {
  width: 120px !important;
}
::v-deep(.col-itemName) {
  width: 180px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep(.col-unit) {
  width: 50px !important;
}
::v-deep(.col-qty) {
  width: 60px !important;
}
::v-deep(.col-contractDateSeq) {
  width: 100px !important;
}

</style>
