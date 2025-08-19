<template>
<v-breadcrumbs
  :items="['MES', '영업관리', '출하지시서관리']"
  class="custom-breadcrumbs"
  />
  <v-card class="pa-1" style="height: 60px;">
    <v-row>
      <v-form ref="srhForm" @submit.prevent ='srhShipmentList'>
      <v-col class="d-flex ga-5 ml-2 mr-2">
            <v-text-field
              v-model="form.itemName"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              density="compact"
              />
            <v-text-field
              v-model="form.releaseUserName"
              label="담당자명"
              placeholder="담당자을 입력해주세요"
              variant="underlined"
              density="compact"
              />
            <v-text-field
              v-model="form.customerName"
              label="거래처명"
              placeholder="거래처명을 입력해주세요"
              variant="underlined"
              density="compact"
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
      <v-col class="d-flex ga-4 justify-end"  style="gap: 8px; margin-top: 8px;">
        <v-btn
            dense
            color = "brown-lighten-4"
            text="신규"
            @click="goShipment()"
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
          :items="shipmentList"
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
              <td style="width: 100px; height: 30px; text-align: center; text-decoration: underline; cursor: pointer;" @click="goShipment(item.shipmentId)">{{ item.shipmentDateSeq }}</td>
              <td style="width: 200px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="goShipment(item.shipmentId)">{{item.itemName}}</td>
              <td style="width: 200px; height: 30px; text-align: center;">{{item.customerName}}</td>
              <td style="width: 90px; height: 30px; text-align: center;">{{item.releaseUserName}}</td>
              <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.totQty) }}</td>
              <td style="width: 90px; height: 30px; text-align: center;">{{item.dueDate}}</td>
              <td style="width: 90px; height: 30px; text-align: center;">{{item.releaseTime}}</td>
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
              <td style="width: 60px; height: 30px; text-align: center; cursor: pointer;" @click="goShipmentItem(item.shipmentId, item.shipmentDateSeq)">판매</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog" width="900px" height="400px" persistent>
      <ShipmentPop
        :id="shipmentId"
        :no="shipmenDateSeq"
        @close-dialog="dialog = false"
        />
    </v-dialog>


</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { onMounted, reactive, ref } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { isEmpty, formatComma } from '@/util/common';
import { useRouter } from 'vue-router';
import ShipmentPop from './ShipmentPop.vue';


let shipmenDateSeq = ref('')
let shipmentId = ref('')
const router = useRouter()
const dialog = ref(false)
const loading = ref(false)
const srhForm = ref('')
const shipmentList = ref([])

const form =reactive({
  itemName: '',
  releaseUserName: '',
  customerName: '',
})

const headers =[
  { title: '일자-No.',      key: 'shipmentDateSeq',   align: 'center' },
  { title: '품목명',        key: 'itemName',          align: 'center'},
  { title: '거래처명',      key: 'customerName',      align: 'center' },
  { title: '담당자명',      key: 'releaseUserName',   align: 'center' },
  { title: '수량합계',      key: 'totQty',            align: 'center'},
  { title: '출하예정일',    key: 'dueDate',           align: 'center'},
  { title: '출고시간',      key: 'releaseTime',       align: 'center' },
  { title: '창고명',        key: 'descStorageName',   align: 'center' },
  { title: '인쇄',          key: 'printYn',           align: 'center' },
  { title: '판매',          key: 'shipmentId',        align: 'center' },
]


const goShipmentItem = (id, no) => {
  shipmentId.value = id
  shipmenDateSeq.value = no
  dialog.value =true
}

const goShipment = (id) =>{
  if ( isEmpty(id)) {
    router.push({ name: 'ShipmentReg' })
  }else{
    router.push({ name: 'ShipmentDetail', params: { id } })
  }
}

const srhShipmentList = async () =>{
  loading.value =true

  const params = {
    ...form
  }

  shipmentList.value = await ApiOrder.getShipmentList(params)
  loading.value = false
}

onMounted( async() =>{
  srhShipmentList()
})

const excel = () => {
  exportToExcel(headers, shipmentList.value, '출하지시서_목록')
}
</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
