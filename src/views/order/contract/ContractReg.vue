<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs
    :items="['MES', '수주관리', '주문신규']"
    class="custom-breadcrumbs"
    />
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
            style="width: 20px;"
            readonly
          />
        </v-col>
        <v-col></v-col>
        <v-col>
          <v-date-input
            v-model="form.expiryDate"
            label="유효기간"
            density="compact"
            :display-format="formatDate"
            variant="underlined"
            style="width: 200px;"
          />
        </v-col>
        <v-col>
         <v-date-input
            v-model="form.dueDate"
            label="납기일자"
            density="compact"
            :display-format="formatDate"
            variant="underlined"
            style="width: 200px;"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" >
          <v-text-field
            v-model="form.customerName"
            label="거래처"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openPop('C')"
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
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.descStorageName"
            label="출하창고"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openPop('S')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
              v-model="form.transactionType"
              label="거래유형"
              :items="transactionTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
        </v-col>
        <v-col>
          <v-select
              v-model="form.currencyType"
              label="통화"
              :items="currencyTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.paymentCondition"
            label="결재조건"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.tradingMethod"
            label="거래방법"
            variant="underlined"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <MultiFileUpload
            v-model="attachFile"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col class="d-flex ga-4 justify-end">
          <v-btn
            text="추가 +"
            density="compact"
            @click="itemPop"
            />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <v-data-table-virtual
            :headers = "headers"
            :items="itemList"
            density="compact"
            item-value="id"
            class="custom-table no-padding-table"
            >
            <template v-slot:headers="{ columns }">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  class="custom-header"
                  :style="{
                    width: column.width + 'px',
                    } "
                  >
                  {{ column.title }}
                </th>
              </tr>
            </template>

            <template #item.itemCd="{ item, index }">
              <input
                v-model="itemList[index].itemCd"
                style="text-align: center; width: 100%; min-width: 100%; max-width: 100%;"
                class="custom-input"
                readonly
              />
            </template>
            <template #item.itemName="{ item, index }">
              <input
                v-model="itemList[index].itemName"
                style="text-align: left; width: 100%; min-width: 100%; max-width: 100%;"
                class="custom-input"
              />
            </template>
            <template #item.unit="{ item, index }">
              <input
                v-model="itemList[index].unit"
                style="text-align: center; width: 90%; min-width: 90%; max-width: 90%;"
                class="custom-line"
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
            <template #item.etc="{ item, index }">
              <input
                v-model="itemList[index].etc"
                type="text"
                style="text-align: left; width: 90%; min-width: 90%; max-width: 90%;"
                class="custom-line"
              />
            </template>
            <template #item.actions="{ item }">
              <!-- <v-btn size="small" text="삭제-" @click="removeRow(item)"/> -->
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item)"></v-icon>
            </template>

            <!-- 총합 -->
            <template v-slot:body.append>
              <tr class="summary-row">
                <!-- itemCd -->
                <td style="width: 100px; height: 30px;" />
                <!-- itemName -->
                <td style="width: 300px; height: 30px" />
                <!-- unit -->
                <td style="width: 80px; height: 30px" />
                <!-- qty 합계 -->
                <td style="width: 80px; text-align: right; font-weight: bold;  height: 30px">
                  {{ totalQty.toLocaleString() }}
                </td>
                <!-- unitPrice (비움) -->
                <td style="width: 110px;  height: 30px" />
                <!-- supplyPrice 합계 -->
                <td style="width: 110px; text-align: right; font-weight: bold;  height: 30px">
                  {{ totalSupplyPrice.toLocaleString() }}
                </td>
                <!-- vatPrice 합계 -->
                <td style="width: 80px; text-align: right; font-weight: bold; height: 30px">
                  {{ totalVatPrice.toLocaleString() }}
                </td>
                <!-- etc = supplyPrice + vatPrice -->
                <td style="width: 150px; text-align: right; font-weight: bold; height: 30px">
                  {{ totalAmount.toLocaleString() }}
                </td>
                <td></td>
              </tr>
            </template>
          </v-data-table-virtual>
        </v-col>
      </v-row>
    </v-card-text>
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
  </v-form>
 </v-card>

<v-dialog
    v-model="dialog"
    :width="dialogWidth"
    :height="dialogHeight"
    persistent
    >
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleSaved"
      @close-dialog="dialog = false"
    />
</v-dialog>

<v-dialog v-model="itemDialog" width="800" height="800" persistent>
    <ItemListMultiPop
      @selected="handleRow"
      @close-dialog="itemDialog = false"
    />
</v-dialog>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { onMounted, reactive, ref, shallowRef, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiCommon } from '@/api/apiCommon';
import { useAuthStore } from '@/stores/auth';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import StorageListPop from '@/views/basic/storage/StorageListPop.vue';
import DateSinglePicker from '@/components/DateSinglePicker.vue';
import { calculateVAT } from '@/util/common';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';

import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';

let dialogWidth = ref('')
let dialogHeight = ref('')

const { userId} = useAuthStore()
const { vError, vSuccess } = useAlertStore()
const router = useRouter()
const currentComponent = shallowRef(null)

const dialog = ref(false)
const itemDialog = ref(false)
let nextId = 1
const selectedRowIndex = ref(null)
let popType = ref('')
const attachFile = ref([])
const itemList = ref([])
const transactionTypes = ref([])
const currencyTypes = ref([])
const form = reactive({
  contractDate: '',
  seq: '',
  customerCd : '',
  customerName : '',
  managerName : '',
  managerId : '',
  descStorageName: '',
  descStorageCd: '',
  paymentCondition: '',
  transactionType: '',
  expiryDate: '',
  tradingMethod: '',
  currencyType : '',
  dueDate: '',

  userId: userId,
})

const headers = [
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : '100px' },
  { title: '품목명',      key: 'itemName',   align: 'center', width : '450px'},
  { title: '규격',        key: 'unit',       align: 'center' ,width : '80px' },
  { title: '수량',        key: 'qty',        align: 'center' ,width : '80px'},
  { title: '단가',        key: 'unitPrice',  align: 'center' ,width : '80px'},
  { title: '공급가액',    key: 'supplyPrice',  align: 'center',width : '110px'},
  { title: '부가세',      key: 'vatPrice',    align: 'center',width : '100px'},
  { title: '적용',        key: 'etc',         align: 'center' ,width : '120px'},
  { title: '-',          key: 'actions',        align: 'center' ,width : 10},
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
      params.dueDate = formatDate(params.dueDate)
      params.expiryDate = formatDate(params.expiryDate)
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

const handleSaved = ( obj ) => {
  switch (popType.value){
    case 'C':
      form.customerName = obj.customerName
      form.customerCd = obj.customerCd
      form.managerName = obj.memberCd
      form.managerId = obj.memberCd
      form.tradingMethod = obj.tradingMethod
      break
    case 'U':
      form.managerName = obj.memberNm
      form.managerId = obj.userId
      break
    case 'S':
      form.descStorageName = obj.storageName
      form.descStorageCd = obj.storageCd
      break
  }
  popType.value = ''
  dialog.value = false
}

const handleRow = (obj) =>{
  if (!Array.isArray(obj)) return;

  const baseSeq = itemList.value.length;

  const selectItem = obj.map((o, index) => ({
      itemCd: o.itemCd,
      itemName: o.itemName,
      unit: o.unit,
      qty: o.qty,
      unitPrice: o.unitPrice,
      supplyPrice: o.supplyPrice,
      vatPrice: o.vatPrice,
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

watch(() => form.contractDate, async (newVal, oldVal) => {
  if ( !isEmpty(oldVal)) {
    if ( oldVal !==  newVal ){
    form.seq = await ApiOrder.getNextSeq(newVal)
    }
  }
})

watch(() => form.transactionType, async (newVal) => {
  if ( form.transactionType === 'VRN' ){
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
};

const openPop = (type) => {
  popType.value = type

  switch (type) {
    case 'C':
      currentComponent.value = CustomerListPop
      dialogWidth.value = '800px'
      dialogHeight.value = '800px'
      break
    case 'U':
      currentComponent.value = UserListPop
      dialogWidth.value = '800px'
      dialogHeight.value = '800px'
      break
    case 'S':
      currentComponent.value = StorageListPop
      dialogWidth.value = '800px'
      dialogHeight.value = '850px'
      break
  }
  dialog.value = true
}

// 행 삭제
const removeRow = (index) => {
  itemList.value.splice(index, 1)
}

const itemPop = () =>{
  itemDialog.value = true
}

onMounted( async () => {
  currencyTypes.value= await ApiCommon.getCodeList('currency_type')
  transactionTypes.value= await ApiCommon.getCodeList('vat_rate')

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
