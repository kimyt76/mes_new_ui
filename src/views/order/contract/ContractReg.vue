<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '영업관리', '주문신규']" class="custom-breadcrumbs"/>
  <v-card>
    <v-card-item title="주문서입력"/>
      <v-form ref="vform" @submit.prevent="saveInfo" >
        <v-card-text>
          <v-row>
            <v-col class="d-flex ga-2 pa-1">
              <v-date-input
                v-model="form.contractDate"
                label="주문일자"
                density="compact"
                :display-format="formatDate"
                variant="underlined"
                style="width: 200px;"
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
                style="width: 200px;"
                hide-details
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
              />
            </v-col>
              <v-col>
                <v-text-field
                  v-model="form.managerName"
                  label="담당자명"
                  variant="underlined"
                  density="compact"
                  append-inner-icon="mdi-magnify"
                  @click:append-inner="openPop('U')"
                  style="width: 200px;"
                />
              </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" >
              <v-text-field
                v-model="form.clientName"
                label="고객사"
                variant="underlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                @click:append-inner="openPop('C')"
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
            <v-col class="d-flex ga-4 justify-end">
              <v-btn
                text="추가 +"
                density="compact"
                @click="openPop('I')"
                />
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
                  />
                </template>
                <template #item.qty="{ item, index }">
                  <input
                    v-model="itemList[index].qty"
                    style="text-align: right; width: 90%;"
                    class="custom-line"
                    @blur="onBlur(index)"
                  />
                </template>
                <template #item.unitPrice="{ item, index }">
                  <input
                    v-model="itemList[index].unitPrice"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                    class="custom-line"
                    @blur="onBlur(index)"
                  />
                </template>
                <template #item.supplyPrice="{ item, index }">
                  <input
                    v-model="itemList[index].supplyPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                    class="custom-line"
                  />
                </template>
                <template #item.vatPrice="{ item, index }">
                  <input
                    v-model.number="itemList[index].vatPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                    class="custom-line"
                  />
                </template>
                <template #item.totPrice="{ item, index }">
                  <input
                    v-model.number="itemList[index].totPrice"
                    type="number"
                    style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                    class="custom-line"
                  />
                </template>
                <template #item.etc="{ item, index }">
                  <input
                    v-model="itemList[index].etc"
                    type="text"
                    style="text-align: left; width: 90%; min-width: 90%; max-width: 90%;"
                    class="custom-line"
                  />
                </template>
                <template #item.actions="{ item }">
                  <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item.itemCd)"></v-icon>                </template>
              </v-data-table-virtual>
            </v-col>
          </v-row>
          <v-row class="mt-2 mb-2" >
            <v-col class="d-flex ga-4 justify-end">
                <v-btn
                  text="저장"
                  class="gt-2"
                  color = "brown-lighten-4"
                  type="submit"
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


  <v-dialog v-model="dialog" :width="dialogWidth" :height="dialogHeight" persistent>
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleSaved"
      @close-dialog="dialog = false"
    />
</v-dialog>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { onMounted, reactive, ref, shallowRef, watch, computed} from 'vue';
import { isEmpty, formatComma, todayKST, formatDate, calculateVAT } from '@/util/common';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiOrder } from '@/api/apiOrders';
import { useAuthStore } from '@/stores/auth';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import ClientListPop from '@/views/basic/client/ClientListPop.vue';



const {userId} = useAuthStore()

const { vError, vSuccess} = useAlertStore()
const router = useRouter()
const dialog = ref(false)
const currentComponent = shallowRef(null)
let popType = ref('')

const itemList = ref([])
const orderTypes = ref([])
const vatTypes = ref([])
const statusTypes = ref([])
const attachFile = ref([])

const dialogWidth = ref('')
const dialogHeight = ref('')

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


const saveInfo = async () =>{
  const formData = new FormData();
  try{
      const params = {
        ...form
      }

      params.contractDate = formatDate(params.contractDate)
      params.expectedDueDate = formatDate(params.expectedDueDate)
      // console.log('contractDate', params.contractDate)
      // console.log('dueDate', params.dueDate)
      // console.log('expiryDate',params.expiryDate )
      formData.append('contractInfo', JSON.stringify(params))
      formData.append('itemList', JSON.stringify(itemList.value))

      attachFile.value.forEach(file => {
        //console.log('파일 객체 여부:',  file.file instanceof File)
        if (file.file instanceof File) {
          formData.append('attachFile', file.file)
        }
      })

      const msg = await ApiOrder.saveContractInfo(formData)
      vSuccess(msg)
      router.push({name:'ContractList'})
  }catch(err){
     vError(err.message)
  }
}

watch(() => form.contractDate, async (newVal, oldVal) => {
  if ( !isEmpty(formatDate(oldVal))) {
    if ( oldVal !==  formatDate(newVal) ){
    form.seq = await ApiCommon.getNextSeq('tb_contract_mst','contract_Date', formatDate(newVal))
    }
  }
})

watch(() => form.vatType, async (newVal) => {

  if ( form.vatType === 'VRN' ){
    itemList.value.map(o => {
      o.vatPrice = 0
    })
  }else{
    itemList.value.map(o => {
      o.vatPrice = calculateVAT(o.supplyPrice)
    })
  }
})

const onBlur = (index) => {
  const qty = Number(itemList.value[index].qty);
  const unitPrice = Number(itemList.value[index].unitPrice);

  if (!isNaN(qty) && !isNaN(unitPrice)) {
    itemList.value[index].supplyPrice = qty * unitPrice;
  } else {
    itemList.value[index].supplyPrice = 0;
  }

  if (!isNaN(itemList.value[index].supplyPrice) ) {
    itemList.value[index].vatPrice = calculateVAT(itemList.value[index].supplyPrice)
  } else {
    itemList.value[index].vatPrice = 0;
  }
  if (!isNaN(itemList.value[index].supplyPrice) ) {
    itemList.value[index].totPrice = itemList.value[index].supplyPrice+itemList.value[index].vatPrice
  } else {
    itemList.value[index].totPrice = 0;
  }
};


const handleSaved = (obj) =>{
  switch (popType.value){
    case 'C':
      form.clientName = obj.clientName
      form.clientId = obj.clientId
      break
    case 'U':
      form.managerName = obj.memberNm
      form.managerId = obj.userId
      break
    case 'I':
      addRow(obj);
      break
  }
  popType.value = ''
}

const addRow = (obj) =>{
  if (!Array.isArray(obj)) return;

  let baseSeq = itemList.value.length;

    const selectItem = obj.map((o, index) => ({
      itemCd: o.itemCd,
      itemName: o.itemName,
      unit: o.unit,
      prodType: o.prodType,
      qty: o.qty,
      unitPrice: o.unitPrice,
      supplyPrice: o.supplyPrice,
      vatPrice: 0,
      totPrice: 0,
      orderCnt: '',
      statusType: '',
      etc: o.etc,
      orderDist: baseSeq + index + 1,
  }));

  //console.log('selectItem', selectItem)
  if (itemList.value.length > 0) {
    itemList.value.push(...selectItem);
  } else {
    itemList.value = [...selectItem];
  }
}

const openPop = (type) =>{
  popType.value = type

  switch (type) {
    case 'C':
      currentComponent.value = ClientListPop
      dialogWidth.value = '800px'
      dialogHeight.value = '800px'
      break
    case 'U':
      currentComponent.value = UserListPop
      dialogWidth.value = '800px'
      dialogHeight.value = '800px'
      break
    case 'I':
      currentComponent.value = ItemListMultiPop
      dialogWidth.value = '800px'
      dialogHeight.value = '850px'
      break
  }
  dialog.value = true
}

const removeRow = (id) => {
  const index = itemList.value.findIndex(item => item.itemCd === id)
  itemList.value.splice(index, 1)
}

onMounted( async () => {
  orderTypes.value = await ApiCommon.getCodeList('order_type')
  vatTypes.value = await ApiCommon.getCodeList('vat_type')
  statusTypes.value = await ApiCommon.getCodeList('status_Type')

  form.contractDate = todayKST()
  form.seq = await ApiCommon.getNextSeq('tb_contract_mst', 'contract_date',  form.contractDate)
})



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
