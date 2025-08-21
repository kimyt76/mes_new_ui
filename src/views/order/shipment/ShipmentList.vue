<template>
<v-breadcrumbs
    :items="['MES', '영업관리', '출하지시서관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhShipmentList">
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
        :items="shipmentList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        fixed-header
        height="720px"
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

        <template #item.shipmentDateSeq="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.shipmentDateSeq }}
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
        <template #item.totQty ="{ item }">
          {{ formatComma(item.totQty) }}
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
        <template #item.shipmentId="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="goShipmentItem"
          >
           판매
          </div>
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
  managerName: '',
  managerId: '',
  customerName: '',
  customerCd: '',
})


const headers = [
  { title: '일자-No.',      key: 'shipmentDateSeq',   align: 'center' , width: '100px'},
  { title: '품목명',        key: 'itemName',          align: 'center', width: '100px'},
  { title: '거래처명',      key: 'customerName',      align: 'center' , width: '100px'},
  { title: '담당자명',      key: 'managerName',       align: 'center' , width: '100px'},
  { title: '수량합계',      key: 'totQty',            align: 'center', width: '100px'},
  { title: '출하예정일',    key: 'dueDate',           align: 'center', width: '100px'},
  { title: '출고시간',      key: 'releaseTime',       align: 'center' , width: '100px'},
  { title: '창고명',        key: 'descStorageName',   align: 'center' , width: '100px'},
  { title: '인쇄',          key: 'printYn',           align: 'center' , width: '100px'},
  { title: '판매',          key: 'shipmentId',        align: 'center' , width: '100px'},
]

const goShipmentItem = (item, index) => {
  shipmentId.value = item.shipmentId
  shipmenDateSeq.value = item.shipmentDateSeq

  dialog.value =true
}

const selectRowClick = (item, index) =>{
  if ( isEmpty(item.shipmentId)) {
    router.push({ name: 'ShipmentReg' })
  }else{
    router.push({ name: 'ShipmentDetail', params: { id:item.shipmentId } })
  }
}

/**
 * 리스트 조회
 */
const srhShipmentList = async () =>{

  try{
    loading.value =true

    const params = {
      ...form
    }

    shipmentList.value = await ApiOrder.getShipmentList(params)
  }catch(err){
    loading.value = false
  }



}

/**
 * 초기화
 */
onMounted( async() =>{
  srhShipmentList()
})


/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, shipmentList.value, '출하지시서_목록')
}

</script>

<style>
@import '@/assets/css/main.css';
</style>
