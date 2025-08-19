<template>
<v-breadcrumbs
  :items="['MES', '수주관리', '판매관리']"
  class="custom-breadcrumbs"
  />
    <v-card class="pa-1" style="height: 60px;">
    <v-row>
      <v-form ref="srhForm" @submit.prevent ='srhSaleList'>
      <v-col class="d-flex flex-row ga-3 ml-2 mr-2">
          <v-text-field
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-text-field
            v-model="form.managerName"
            label="담당자명"
            placeholder="담당자을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-text-field
            v-model="form.customerName"
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-btn
            text="조회"
            variant="tonal"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srhForm.reset()"
            />
          </v-col>
        </v-form>
    </v-row>
  </v-card>
  <v-row style="height: 70px;">
      <v-col class="d-flex justify-end align-center mr-2" style="gap: 8px; margin-top: 8px;">
        <v-btn
            dense
            color="brown-lighten-4"
            text="신규"
            @click="gosale()"
            />
          <v-btn
            class="mr-2 excel-btn"
            text="엑셀"
            prepend-icon="mdi-microsoft-excel"
            @click="excel"
            />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="saleList"
          :loading="loading"
          no-data-text="데이터가 없습니다."
          loading-text="조회중입니다 잠시만 기다려주세요"
          :items-per-page="15"
          >
      <template v-slot:headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="custom-header"
            style="height: 30px;"
            :style="{textAlign: 'center' } "
            >
            {{ column.title }}
          </th>
        </tr>
      </template>
      <!-- 리스트 영역 커스터마이징 -->
      <template #item="{ item }">
        <tr style="height: 30px;">
          <td style="width: 100px; height: 30px; text-align: center; text-decoration: underline; cursor: pointer;" @click="gosale(item.saleId)">{{ item.saleDateSeq }}</td>
          <td style="width: 200px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="gosale(item.saleId)">{{item.itemName}}</td>
          <td style="width: 90px; height: 30px; text-align: center;">{{item.managerName}}</td>
          <td style="width: 200px; height: 30px; text-align: left;">{{item.customerName}}</td>
          <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.totPrice) }}</td>
          <td style="width: 90px; height: 30px; text-align: center;">{{item.transactionTypeName}}</td>
          <td style="width: 90px; height: 30px; text-align: center;">{{item.descStorageName}}</td>
          <td style="width: 40px; height: 30px; text-align: center;">
            <p
            style="padding: 4px; text-align: center; cursor: pointer;"
            :style="{
              backgroundColor: item.printYn === 'Y' ? '#FFAB91' : 'transparent'
            }"
              @click="onPrint"
              >
              인쇄
            </p>
          </td>
          <td style="width: 60px; height: 30px; text-align: center; cursor: pointer;" @click="goSaleItem(item.saleId, item.saleDateSeq)">주문서</td>
        </tr>
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

let saleDateSeq = ref('')
let saleId = ref('')
const dialog = ref(false)
const saleList = ref([])
const router = useRouter()
const loading = ref(false)
const form = reactive({
  itemName: '',
  managerName: '',
  customerName: '',
  customerCd: '',
})

const headers = ref([
  { title: '일자-No.',          key: 'saleDateSeq',   align: 'center' },
  { title: '품목명',            key: 'itemName',      align: 'start'},
  { title: '담당자명',          key: 'managerName',   align: 'center' },
  { title: '거래처명',          key: 'customerName',  align: 'start' },
  { title: '금액 합계',         key: 'totPrice',      align: 'end'},
  { title: '거래유형명',        key: 'totUnitPrice',  align: 'center'},
  { title: '창고명',            key: 'statusType',    align: 'center' },
  { title: '인쇄',              key: 'printYn',       align: 'center' },
  { title: '주문서',            key: 'saleId',        align: 'center' },
])


onMounted( async () => {
  srhSaleList()
})

const gosale = (id) =>{
  if ( isEmpty(id)) {
    router.push({ name: 'SaleReg' })
  }else{
    router.push({ name: 'SaleDetail', params: { id } })
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

const goSaleItem = (id, no) =>{
  saleId.value = id
  saleDateSeq.value = no
  dialog.value = true
}


const excel = () => {
  exportToExcel(headers, saleList.value, '수주_목록')
}
</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
