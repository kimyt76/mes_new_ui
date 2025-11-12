<template>
<v-breadcrumbs
    :items="['MES', '영업관리', '주문서 목록']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhContractList">
        <v-col class="d-flex flex-row ga-3">
          <v-date-input
            v-model="form.strDate"
            label="주문시작일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
            style="width: 150px;"
          />
          <v-date-input
            v-model="form.toDate"
            label="주문종료일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
            style="width: 150px;"
          />
          <v-text-field
              v-model="form.itemCd"
              dense
              density="compact"
              label="품목코드"
              placeholder="품목코드를 입력해주세요"
              variant="underlined"
              style="width: 120px;"
              />
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
              style="width: 120px;"
              />
          <v-text-field
              v-model="form.clientName"
              dense
              density="compact"
              label="고객사명"
              placeholder="고객사명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
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
          <v-select
            v-model="form.orderType"
            label="수주유형"
            :items="orderTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            style="width: 100px;"
            />
          <v-select
            v-model="form.vatType"
            label="거래유형"
            :items="vatTypes"
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
            @click="reset"
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
        :items="contractList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        fixed-header
        height="690px"
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

        <template #item.contractDateSeq="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.contractDateSeq }}
          </div>
        </template>
        <template #item.qty ="{ item }">
          {{ formatComma(item.qty) }}
        </template>
        <template #item.unitPrice ="{ item }">
          {{ formatComma(item.unitPrice) }}
        </template>
        <template #item.supplyPrice ="{ item }">
          {{ formatComma(item.supplyPrice)}}
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted, computed } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';
import { useSortedItems } from 'vuetify/lib/components/VDataTable/composables/sort';

const router = useRouter()
const { vError } = useAlertStore()
const loading = ref(false)
const contractList = ref([])
const statusTypes = ref([])
const vatTypes = ref([])
const orderTypes = ref([])
const srhForm = ref('')

const form = reactive({
  strDate: '',
  toDate: '',
  itemCd: '',
  itemName: '',
  managerName: '',
  customerName: '',
  orderType: '',
  vatType: '',
  statusType: '',
})

const headers = [
  { title: '일자-No',          key: 'contractDateSeq',   align: 'center' , width: '120px'},
  { title: 'PO No',            key: 'poNo',              align: 'center' , width: '120px'},
  { title: '품목코드',          key: 'itemCd',            align: 'center',   width: '120px'},
  { title: '품목명',            key: 'itemName',          align: 'start',   width: '340px'},
  { title: '납기예정일자',      key: 'expectedDueDate',   align: 'center' , width: '120px'},
  { title: '고객사명',          key: 'clientName',        align: 'center',   width: '200px'},
  { title: '담당자명',          key: 'managerName',       align: 'center' , width: '100px'},
  { title: '수주유형',          key: 'orderType',       align: 'center' , width: '80px'},
  { title: '수량',              key: 'qty',              align: 'end',     width: '80px'},
  { title: '단가',              key: 'unitPrice',           align: 'end',     width: '80px'},
  { title: '공급가액',          key: 'supplyPrice',       align: 'end',    width: '100px'},
  { title: '제품유형',          key: 'prodType',          align: 'center',    width: '100px'},
  { title: '진행상태',          key: 'statusType',        align: 'center' , width: '80px'},
  { title: '결재조건',          key: 'paymentCondition',  align: 'center',  width: '80px'},
]

const selectRowClick = (item, index) => {
  if ( isEmpty(item.contractId)) {
    router.push({ name: 'ContractReg' })
  }else{
    router.push({ name: 'ContractDetail', params: { id:item.contractId } })
  }
}

/**
 * 리스트 조회
 */
const srhContractList = async () => {
  //loading.value = true

  try{
    const params = {
      ...form
    }
    //params.contractDate = formatDate(params.contractDate)

    contractList.value = await ApiOrder.getContractList(params)
  }catch(err){
    vError(err.message)
  }finally{
   // loading.value = false
  }
}


/**
 * 초기화
 */
onMounted( async () =>{
  statusTypes.value = await ApiCommon.getCodeList('status_type')
  orderTypes.value = await ApiCommon.getCodeList('order_type')
  vatTypes.value = await ApiCommon.getCodeList('vat_type')
  form.strDate = todayKST()
  form.toDate = todayKST()

  //srhContractList()
})

 const reset =()=>{
   srhForm.value.reset()

   form.strDate = todayKST()
   form.toDate = todayKST()
 }

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, contractList.value, '수주_목록')
}


</script>

<style>
@import '@/assets/css/main.css';

</style>
