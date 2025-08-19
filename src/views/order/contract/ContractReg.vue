<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
<v-card>
  <v-card-item
      title="주문서입력"
      />
  <v-form ref="vform" @submit.prevent="saveInfo" >
  <v-card-text>
    <v-row>
        <v-col class="d-flex flex-row align-center">
          <DateSinglePicker
            v-model="form.contractDate"
            title="주문일자"
            density="compact"
            width="120"
            />
            <v-text-field
            v-model="form.seq"
            density="compact"
            width="20"
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
            width="120"
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
    <v-row>
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
          v-model="form.transactionType"
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
    <v-row>
      <v-col cols="12">
        <MultiFileUpload
          v-model="attachFile"
        />
      </v-col>
    </v-row>
  </v-card-text>
  <v-card-item
      title="품목목록"
      style="height: 40px;"
      />
    <v-card-text>
      <v-row>
        <v-col>
          <div class="d-flex ga-4 justify-end">
          <v-btn
            text="추가 +"
            density="compact"
            @click="addRow"
            />
          <v-btn
            text="제거 -"
            density="compact"
            @click="removeRow"
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
            />
          </template>
          <template #item.unitPrice="{ item, index }">
            <input
              v-model="itemList[index].unitPrice"
              type="number"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
              class="custom-line"
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

<v-dialog  v-model="dialog" width="800px" height="800px" persistent>
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleSaved"
      @close-dialog="dialog = false"
    />
</v-dialog>

</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { isEmpty } from '@/util/common';
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiCommon } from '@/api/apiCommon';
import { useAuthStore } from '@/stores/auth';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import StorageListPop from '@/views/basic/storage/StorageListPop.vue';
import DateSinglePicker from '@/components/DateSinglePicker.vue';

const { userId} = useAuthStore()
const { vError, vSuccess } = useAlertStore()

const router = useRouter()
const currentComponent = shallowRef(null)
const dialog = ref(false)
// const breadcrumbs = computed(() => {
//   return contractId
//     ? ['MES', '수주관리', '주문상세']
//     : ['MES', '수주관리', '주문신규'];
// });

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
  transactionType: '',
  expiryDate: '',
  tradingMethod: '',
  currencyType : '',
  dueDate: '',

  userId: userId,
})

const headers = ref([
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : 100 },
  { title: '품목명',      key: 'itemName',   align: 'center',width : 250},
  { title: '규격',        key: 'unit',       align: 'center' ,width : 80 },
  { title: '수량',        key: 'qty',        align: 'center' ,width : 110},
  { title: '단가',        key: 'unitPrice',  align: 'center' ,width : 110},
  { title: '공급가액',    key: 'supplyPrice',  align: 'center',width : 110},
  { title: '부가세',      key: 'vatPrice',    align: 'center',width : 100},
  { title: '적용',        key: 'etc',         align: 'center' ,width : 150},
])

const handleSaved = ( cd, nm) => {
  switch (popType.value){
    case 'C':
      form.customerName = nm
      form.customerCd = cd
      break
    case 'U':
      form.managerName = nm
      form.managerId = cd
      break
    case 'S':
      form.descStorageName = nm
      form.descStorageCd = cd
      break
    case 'I':
     if (selectedRowIndex.value !== null) {
       const target = itemList.value[selectedRowIndex.value]
        target.itemCd = cd
        target.itemName = nm
      }
      break
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
        formData.append('attachFile', file)
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

// 행 추가
const addRow = () =>{
  itemList.value.push({
    id: nextId++,
    itemCd: '',
    itemName:'',
    unit: '',
    qty: 0,
    unitPrice : 0,
    supplyPrice : 0,
    vatPrice : 0,
    etc:'',
  })
}

// 행 삭제
const removeRow = (index) => {
  itemList.value.splice(index, 1)
}

onMounted( async () => {
  currencyTypes.value= await ApiCommon.getCodeList('currency_type')
  transactionTypes.value= await ApiCommon.getCodeList('vat_rate')

  form.seq = await ApiOrder.getNextSeq(form.contractDate)
})

const openPop = (type) => {
  popType.value = type

  switch (type) {
    case 'C':
      currentComponent.value = CustomerListPop
      break
    case 'U':
      currentComponent.value = UserListPop
      break
    case 'S':
      currentComponent.value = StorageListPop
      break
    default:
      popType.value = 'I'
      selectedRowIndex.value = type
      currentComponent.value = ItemListSinglePop
      break
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
</style>
