<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '영업관리', '주문상세']" class="custom-breadcrumbs"/>
  <v-card>
    <v-card-item title="주문서입력"/>
      <v-form ref="vform">
        <v-card-text>
          <v-row>
            <v-col class="d-flex ga-2 pa-1">
              <v-date-input
                v-model="form.contractDate"
                label="주문일자"
                density="compact"
                :display-format="formatDate"
                variant="underlined"
                prepend-icon=""
                append-inner-icon="mdi-calendar"
                style="width: 200px;"
                readonly
              />
              <v-text-field
                v-model="form.seq"
                density="compact"
                style="width: 40px;"
                readonly
              />
            </v-col>
            <v-col>
            <v-date-input
                v-model="form.expectedDueDate"
                label="납기예정일자"
                density="compact"
                :display-format="formatDate"
                variant="underlined"
                prepend-icon=""
                append-inner-icon="mdi-calendar"
                style="width: 200px;"
                hide-details
                readonly
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.paymentCondition"
                label="결제조건"
                variant="underlined"
                density="compact"
                style="width: 200px;"
                hide-details
                readonly
              />
            </v-col>
              <v-col>
                <v-text-field
                  v-model="form.managerName"
                  label="담당자명"
                  variant="underlined"
                  density="compact"
                  style="width: 200px;"
                  readonly
                />
              </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" >
              <v-text-field
                v-model="form.clientName"
                label="고객사명"
                variant="underlined"
                density="compact"
                readonly
              />
            </v-col>
            <v-col>
              <v-select
                v-model="form.vatType"
                label="거래유형"
                :items="vatTypes"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                style="width: 200px;"
                readonly
                />
            </v-col>
            <v-col>
              <v-select
                v-model="form.orderType"
                label="수주유형"
                :items="orderTypes"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                style="width: 200px;"
                readonly
                />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <MultiFileUpload
                v-model="attachFile"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>
              <v-card-subtitle>
                - 품목
              </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table-virtual
                :headers = "headers"
                :items="itemList"
                density="compact"
                item-value="id"
                class="custom-table no-padding-table"
                >
                <template #item.statusType="{ item }">
                  <v-select
                    v-model="item.statusType"
                    :items="statusTypes"
                    item-title="codeNm"
                    item-value="code"
                    density="compact"
                    variant="outlined"
                    style="width: 120px; height:40px"
                    readonly
                  />
                </template>
                <template #item.qty="{ item, index }">
                  <input
                    v-model="itemList[index].qty"
                    style="text-align: right; width: 90%;"
                  />
                </template>
                <template #item.unitPrice="{ item, index }">
                  <input
                    v-model="itemList[index].unitPrice"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                  />
                </template>
                <template #item.supplyPrice="{ item, index }">
                  <input
                    v-model="itemList[index].supplyPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                  />
                </template>
                <template #item.vatPrice="{ item, index }">
                  <input
                    v-model.number="itemList[index].vatPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                  />
                </template>
                <template #item.totPrice="{ item, index }">
                  <input
                    v-model.number="itemList[index].totPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                  />
                </template>
                <template #item.etc="{ item, index }">
                  <input
                    v-model="itemList[index].etc"
                    type="text"
                    style="text-align: left; width: 90%; min-width: 90%; max-width: 90%;"
                  />
                </template>
              </v-data-table-virtual>
            </v-col>
          </v-row>
          <v-row class="mt-2 mb-2" >
            <v-col class="d-flex ga-4 justify-end">
                <v-btn
                  text="수정"
                  class="gt-2"
                  color = "brown-lighten-4"
                  @click="goEdit"
                  />
                <v-btn
                  text="목록"
                  class="mr-3"
                  @click="goList"
                />
            </v-col>
          </v-row>
          </v-card-text>
      </v-form>
  </v-card>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { onMounted, reactive, ref, shallowRef, watch, computed} from 'vue';
import { isEmpty, formatComma, todayKST, formatDate, calculateVAT } from '@/util/common';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiOrder } from '@/api/apiOrders';
import { useAuthStore } from '@/stores/auth';
import MultiFileUpload from '@/components/MultiFileUpload.vue';

const {userId} = useAuthStore()

const { vError, vSuccess} = useAlertStore()
const router = useRouter()
const route = useRoute()
const contractId = route.params.id
const itemList = ref([])
const orderTypes = ref([])
const vatTypes = ref([])
const statusTypes = ref([])
const attachFile = ref([])

const form = reactive({
  contractDate: '',
  seq:'',
  expectedDueDate:'',
  clientName:'',
  clientId:'',
  managerName:'',
  managerId:'',
  paymentCondition:'',
  vatType:'',
  orderType:'',

  userId:userId,
})

const headers = [
  { title: 'PO No ',     key: 'poNo',     align: 'center'  ,width : '120px'},
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : '120px'},
  { title: '품목명',      key: 'itemName',   align: 'start', width : '380px'},
  { title: '규격',        key: 'unit',       align: 'center' ,width : '80px' },
  { title: '제품유형',     key: 'itemGrp1',   align: 'center' ,width : '100px' },
  { title: '수량',        key: 'qty',         align: 'center' ,width : '80px'},
  { title: '단가',        key: 'unitPrice',   align: 'center' ,width : '80px'},
  { title: '공급가액',    key: 'supplyPrice', align: 'center',width : '110px'},
  { title: '부가세',      key: 'vatPrice',    align: 'center',width : '100px'},
  { title: '합계',        key: 'totPrice',    align: 'center',width : '100px'},
  { title: '차수   ',    key: 'orderCnt',     align: 'center' ,width : '80px'},
  { title: '진행상태',    key: 'statusType',  align: 'center' ,width : '110px'},
  { title: '비고',        key: 'etc',         align: 'center' ,width : '100px'},
  { title: '-',          key: 'actions',      align: 'center' ,width : '10px'},
]

// 1. 수량 합계
const totalQty = computed(() => {
  // .value로 실제 배열에 접근합니다.
  return itemList.value.reduce((sum, item) => sum + Number(item.qty || 0), 0);
});
// 2. 공급가액 합계
const totalSupplyPrice = computed(() => {
  return itemList.value.reduce((sum, item) => sum + Number(item.supplyPrice || 0), 0);
});
// 3. 부가세 합계
const totalVatPrice = computed(() => {
  return itemList.value.reduce((sum, item) => sum + Number(item.vatPrice || 0), 0);
});
// 4. 총 금액 (다른 computed 속성을 참조)
const totalAmount = computed(() => {
  // 다른 computed 속성의 값에 접근할 때도 .value를 사용합니다.
  return totalSupplyPrice.value + totalVatPrice.value;
});

onMounted( async () => {
  orderTypes.value = await ApiCommon.getCodeList('order_type')
  vatTypes.value = await ApiCommon.getCodeList('vat_type')
  statusTypes.value = await ApiCommon.getCodeList('status_Type')

  const res = await ApiOrder.getContractInfo(contractId)

  Object.assign(form, res.contractInfo)

  if (res.attachFileInfo !== null) {
    attachFile.value = res.attachFileInfo;
  } else {
    attachFile.value = [];  // 없을 경우 초기화도 필요할 수 있음
  }

  itemList.value = res.itemList
})

const goEdit = () => {
  router.push({name:'ContractEdit', params: { id:contractId } })
}

const goList = () => {
  router.push({name:'ContractList'})
}
</script>

<style scoped>
@import '@/assets/css/main.css';

.custom-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 1px;
}
.custom-line {
  border: 0.5px solid;
  background: #f1f3f4;
  padding: 2px;
}
.summary-row {
  background-color: #f4f4f4;
  height: 30px;
}
.custom-cell-input {
  padding: 0 !important;
  margin: 0 !important;
}

.custom-cell-input .v-field {
  padding: 0 !important;
  min-height: 25px; /* 원하는 높이 (테이블 row 높이에 맞춤) */
}
</style>
