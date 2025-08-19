<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs
    :items="['MES', '수주관리', '주문신규']"
    class="custom-breadcrumbs"
    ></v-breadcrumbs>
<v-card>
  <v-card-item
      title="주문서입력"
      />
  <v-form ref="vform" @submit.prevent="saveInfo" >
  <v-card-text>
    <v-row dense>
       <v-col class="d-flex flex-row" style="gap: 0">
          <DateSinglePicker
            v-model="form.contractDate"
            title="주문일자"
            density="compact"
            style="width: 100px;"
          />
          <v-text-field
            v-model="form.seq"
            density="compact"
            style="width: 40px; max-width: 60px; min-width: 0;"
            readonly
          />
        </v-col>
        <v-col>
        </v-col>
        <v-col>
          <DateSinglePicker
            v-model="form.expiryDate"
            title="유효기간"
            density="compact"
            />
        </v-col>
        <v-col>
          <DateSinglePicker
            v-model="form.dueDate"
            title="납기일자"
            density="compact"
            />
        </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
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
    <v-row dense>
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
        <v-col>
          <div class="d-flex ga-4 justify-end">
          <v-btn
            text="추가 +"
            density="compact"
            @click="itemPop"
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table-virtual
            :headers = "headers"
            :items="itemList"
            item-value="id"
            >
          <template v-slot:headers="{ columns }">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="custom-header"
                style="height: 30px;"
                :style="{
                  width: column.width + 'px',
                  minWidth: column.width + 'px',
                  maxWidth: column.width + 'px',
                  } "
                >
                {{ column.title }}
              </th>
            </tr>
          </template>

          <template #item.itemCd="{ item, index }">
            <input
              v-model="itemList[index].itemCd"
              style="text-align: center; width: 100px; min-width: 100px; max-width: 100px;"
              class="custom-input"
              @dblclick="openPop(index)"
            />
          </template>
          <template #item.itemName="{ item, index }">
            <input
              v-model="itemList[index].itemName"
              style="text-align: left; width: 250px; min-width: 250px; max-width: 250px;"
              class="custom-input"
              readonly
            />
          </template>
          <template #item.unit="{ item, index }">
            <input
              v-model="itemList[index].unit"
              style="text-align: center; width: 80px; min-width: 80px; max-width: 80px;"
              class="custom-line"
            />
          </template>
          <template #item.qty="{ item, index }">
            <input
              v-model="itemList[index].qty"
              type="number"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
              class="custom-line"
              @blur="onBlur(index)"
            />
          </template>
          <template #item.unitPrice="{ item, index }">
            <input
              v-model="itemList[index].unitPrice"
              type="number"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
              class="custom-line"
              @blur="onBlur(index)"
            />
          </template>
          <template #item.supplyPrice="{ item, index }">
            <input
              v-model="itemList[index].supplyPrice"
              type="number"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
              class="custom-line"
            />
          </template>
          <template #item.vatPrice="{ item, index }">
            <input
              v-model.number="itemList[index].vatPrice"
              type="number"
              style="text-align: right; width: 100px; min-width: 100px; max-width: 100px;"
              class="custom-line"
            />
          </template>
          <template #item.etc="{ item, index }">
            <input
              v-model="itemList[index].etc"
              type="text"
              style="text-align: left; width: 150px; min-width: 150px; max-width: 150px;"
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
              <td style="width: 100px; height: 40px;" />
              <!-- itemName -->
              <td style="width: 250px; height: 40px" />
              <!-- unit -->
              <td style="width: 80px; height: 40px" />
              <!-- qty 합계 -->
              <td style="width: 110px; text-align: right; font-weight: bold;  height: 40px">
                {{ totalQty.toLocaleString() }}
              </td>
              <!-- unitPrice (비움) -->
              <td style="width: 110px;  height: 40px" />
              <!-- supplyPrice 합계 -->
              <td style="width: 110px; text-align: right; font-weight: bold;  height: 40px">
                {{ totalSupplyPrice.toLocaleString() }}
              </td>
              <!-- vatPrice 합계 -->
              <td style="width: 100px; text-align: right; font-weight: bold; height: 40px">
                {{ totalVatPrice.toLocaleString() }}
              </td>
              <!-- etc = supplyPrice + vatPrice -->
              <td style="width: 150px; text-align: right; font-weight: bold; height: 40px">
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
      <v-col>
        <div class="d-flex ga-4 justify-end">
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
        </div>
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
import { isEmpty } from '@/util/common';
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

let dialogWidth = ref('')
let dialogHeight = ref('')

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

const headers = ref([
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : '100px' },
  { title: '품목명',      key: 'itemName',   align: 'center', width : '250px'},
  { title: '규격',        key: 'unit',       align: 'center' ,width : '80px' },
  { title: '수량',        key: 'qty',        align: 'center' ,width : '110px'},
  { title: '단가',        key: 'unitPrice',  align: 'center' ,width : '110px'},
  { title: '공급가액',    key: 'supplyPrice',  align: 'center',width : '110px'},
  { title: '부가세',      key: 'vatPrice',    align: 'center',width : '100px'},
  { title: '적용',        key: 'etc',         align: 'center' ,width : '150px'},
  { title: '-',          key: 'actions',        align: 'center' ,width : 10},
])

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
    //case 'I':
    //  if (selectedRowIndex.value !== null) {
    //    const target = itemList.value[selectedRowIndex.value]
    //     target.itemCd = cd
    //     target.itemName = nm
    //   }
    //  break
  }
  popType.value = ''
  dialog.value = false
}

const saveInfo = async () => {
  const formData = new FormData();

  try{
      const params = {
        ...form
      }

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
  if ( !isEmpty(oldVal)) {
    if ( oldVal !==  newVal ){
    form.seq = await ApiOrder.getNextSeq(newVal)
    }
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


const itemPop = () =>{
  itemDialog.value = true
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

  console.log('selectItem', selectItem)
  if (itemList.value.length > 0) {
    itemList.value.push(...selectItem);
  } else {
    itemList.value = [...selectItem];
  }
}
// // 행 추가
// const addRow = () =>{
//   itemList.value.push({
//     id: nextId++,
//     itemCd: '',
//     itemName:'',
//     unit: '',
//     qty: 0,
//     unitPrice : 0,
//     supplyPrice : 0,
//     vatPrice : 0,
//     etc:'',
//   })
// }

// 행 삭제
const removeRow = (index) => {
  itemList.value.splice(index, 1)
}

onMounted( async () => {
  currencyTypes.value= await ApiCommon.getCodeList('currency_type')
  transactionTypes.value= await ApiCommon.getCodeList('vat_rate')

  form.seq = await ApiCommon.getNextSeq('tb_contract_mst', 'contract_date',  form.contractDate)
})

const openPop = (type) => {
  popType.value = type

  switch (type) {
    case 'C':
      currentComponent.value = CustomerListPop
      dialogWidth.value = '800px'
      dialogWidth.value = '900px'
      break
    case 'U':
      currentComponent.value = UserListPop
      dialogWidth.value = '800px'
      dialogWidth.value = '900px'
      break
    case 'S':
      currentComponent.value = StorageListPop
      dialogWidth.value = '800px'
      dialogWidth.value = '900px'
      break
    // default:
    //   popType.value = 'I'
    //   selectedRowIndex.value = type
    //   currentComponent.value = ItemListMultiPop
    //   dialogWidth.value = '1100px'
    //   dialogWidth.value = '800px'
    //   break
  }
  dialog.value = true
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
  padding: 2px;
}

.custom-line {
  border: 0.5px solid;
  background: #f1f3f4;
  padding: 2px;
}
.summary-row {
  background-color: #f4f4f4;
  height: 40px;
}
</style>
