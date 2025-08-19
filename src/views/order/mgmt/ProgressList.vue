<template>
<v-breadcrumbs
    :items="['MES', '수주관리', '진행현황']"
    class="custom-breadcrumbs"
    />
<v-card class="pa-1" style="height: 60px;">
  <v-row>
    <v-form ref="srhForm" @submit.prevent ='srhProgressList'>
    <v-col class="d-flex flex-row ga-3  ml-2 mr-2">
        <!-- <v-select
          v-model="form.contractTypeCd"
          label="수주구분"
          :items="contractTypeCds"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
          style="width: 150px;"
          /> -->
        <!-- <v-date-input
            v-model="form.strDate"
            label="일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          /> -->
        <v-text-field
          v-model="form.itemName"
          density="compact"
          label="품목명"
          variant="underlined"
          placeholder="품목명을 입력해주세요"
          style="width: 180px;"
          />
        <v-text-field
          v-model="form.managerName"
          density="compact"
          label="담당자"
          placeholder="담당자를 입력해주세요"
          variant="underlined"
          style="width: 150px;"
          />
        <v-text-field
          v-model="form.customerName"
          density="compact"
          label="거래처명"
          placeholder="거래처명을 입력해주세요"
          variant="underlined"
          style="width: 180px;"
          />
        <v-btn
          color="#EFEBE9"
          text="조회"
          type="submit"
          />
        <v-btn
          class="mr-2"
          text="초기화"
          @click="srhForm.reset()"
          />
        </v-col>
      </v-form>
  </v-row>
</v-card>
<v-row>
  <v-col>
    <v-data-table
      :headers="headers"
      :items="progressList"
      :loading="loading"
      density="compact"
      class="custom-table"
      >
      <template #item.qty ="{ item }">
        {{ formatComma(item.qty) }}
      </template>
      <template #item.supplyPrice ="{ item }">
        {{ formatComma(item.supplyPrice) }}
      </template>
      <template #item.vatPrice ="{ item }">
        {{ formatComma(item.vatPrice) }}
      </template>
      <template #item.totPrice ="{ item }">
        {{ formatComma(item.totPrice)}}
      </template>
    </v-data-table>
  </v-col>
</v-row>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';

const { userId } = useAuthStore()

const progressList = ref([])
const loading = ref(false)
const contractTypeCds = ref([])
const form = reactive({
  strDate: '',
  contractTypeCd : '',
  itemName: '',
  managerName: '',
  customerName: '',

  userId: userId,
})

const headers = [
  { title: '품목코드',  key: 'itemCd',        align: 'center', width: '100px' },
  { title: '품목명',    key: 'itemName',      align: 'start',   width: '220px' },
  { title: '고객사',    key: 'customerName',  align: 'start',   width: '200px' },
  { title: '수주일',    key: 'contractDate',  align: 'center', width: '100px' },
  { title: '판매일',    key: 'saleDate',      align: 'center', width: '100px' },
  { title: '출하일',    key: 'shipmentDate',  align: 'center', width: '100px' },
  { title: '수량',      key: 'qty',           align: 'end',   width: '100px' },
  { title: '공급가액',  key: 'supplyPrice',   align: 'end',   width: '100px' },
  { title: '부가세',    key: 'vatPrice',      align: 'end',   width: '100px' },
  { title: '합계금액',   key: 'totPrice',    align: 'end',   width: '100px' },
  { title: '담당자',    key: 'managerName',   align: 'center', width: '90px' },
]


const srhProgressList = async () =>{
  loading.value = true
  const params = {
    ...form
  }
  progressList.value = await ApiOrder.getProgressList(params)

  loading.value =false
}

onMounted( () =>{
  form.strDate = todayKST()
  srhProgressList()
})

</script>

<style>
.custom-table thead th {
  background-color: #BCAAA4 !important;
  color: white;
}
</style>
