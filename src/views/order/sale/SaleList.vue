<template>
<v-breadcrumbs
    :items="['MES', '영업관리', '판매관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhSaleList">
        <v-col class="d-flex flex-row ga-3">
          <v-text-field
              v-model="form.itemName"
              dense
              density="compact"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.managerName"
              dense
              density="compact"
              label="담당자명"
              placeholder="담당자명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.customerName"
              dense
              density="compact"
              label="거래처명"
              placeholder="거래처명을 입력해주세요"
              variant="underlined"
              style="width: 150px;"
              />
          <v-select
            v-model="form.statusType"
            label="진행상태"
            :items="statusTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            style="width: 100px;"
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
    </v-card-text>
  </v-card>
  <v-spacer></v-spacer>
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
      <v-btn
        color="brown-lighten-4"
        text="신규"
        @click="selectRowClick"
        />
      <v-btn
        class="excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0">
      <v-data-table
        :headers="headers"
        :items="saleList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        fixed-header
        height="690px"
        return-object
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header"
              style="height: 40px;"
              :style="{textAlign: 'center'} "
              >
              {{ column.title }}
            </th>
          </tr>
        </template>

        <template #item.saleDateSeq="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;  width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.saleDateSeq }}
          </div>
        </template>
        <template #item.itemName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.itemName }}
          </div>
        </template>
        <template #item.totPrice ="{ item }">
          {{ formatComma(item.totPrice) }}
        </template>

        <template #item.statusType="{ item, index }">
            {{ item.statusType === 'ING' ?  '진행중' : '종료'}}
        </template>
        <template #item.printYn="{ item, index }">
           <p style="padding: 4px;
              text-align: center;
              cursor: pointer;"
              :style="{backgroundColor: item.printYn === 'Y' ? '#FFAB91' : 'transparent'}"
              @click="onPrint"
            >인쇄
          </p>
        </template>
        <template #item.saleId="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="goSaleItem(item, index)"
          >
            주문서
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog v-model="dialog" width="1000px" height="400px" persistent>
      <SalePop
        :id="saleId"
        :no="saleDateSeq"
        @close-dialog="dialog = false"
        />
    </v-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { exportToExcel } from '@/util/exportToExcel';
import { isEmpty, formatComma } from '@/util/common';
import { ApiOrder } from '@/api/apiOrders';
import SalePop from './SalePop.vue';
import { ApiCommon } from '@/api/apiCommon';

let srhForm = ref('')
let saleDateSeq = ref('')
let saleId = ref('')
const dialog = ref(false)
const router = useRouter()
const statusTypes = ref([])
const saleList = ref([])
const loading = ref(false)
const form = reactive({
  itemName: '',
  managerName: '',
  customerName: '',
  customerCd: '',
})

const headers = ref([
  { title: '일자-No.',          key: 'saleDateSeq',   align: 'center' , width: '100px'},
  { title: '품목명',            key: 'itemName',      align: 'start', width: '370px'},
  { title: '담당자명',          key: 'managerName',   align: 'center' , width: '90px'},
  { title: '거래처명',          key: 'customerName',  align: 'start' , width: '220px'},
  { title: '금액 합계',         key: 'totPrice',      align: 'end', width: '100px'},
  { title: '거래유형명',        key: 'totUnitPrice',  align: 'center', width: '100px'},
  { title: '창고명',            key: 'descStorageName',    align: 'center', width: '150px' },
  { title: '인쇄',              key: 'printYn',       align: 'center', width: '40px' },
  { title: '주문서',            key: 'saleId',        align: 'center', width: '80px' },
])

onMounted( async () => {
  statusTypes.value = await ApiCommon.getCodeList('status_type')
  srhSaleList()
})

const selectRowClick = (item, index) =>{
  if ( isEmpty(item.saleId)) {
    router.push({ name: 'SaleReg' })
  }else{
    router.push({ name: 'SaleDetail', params: { id: item.saleId } })
  }
}

const srhSaleList = async () =>{
  loading.value = true

  const params = {
    ...form
  }

  saleList.value = await ApiOrder.getSaleList(params)

  loading.value = false

}

const goSaleItem = (item, index) =>{
  saleId.value = item.saleId
  saleDateSeq.value = item.saleDateSeq
  dialog.value = true
}


const excel = () => {
  exportToExcel(headers, saleList.value, '판매_목록')
}

</script>

<style>
@import '@/assets/css/main.css';
</style>
