<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs
    :items="['MES', '영업관리', '출하지시서 상세']"
    class="custom-breadcrumbs"
    />
  <v-card>
    <v-card-item title="출하지시서 상세"/>
    <v-form ref="vform" @submit.prevent="saveInfo" >
    <v-card-text>
      <v-row>
        <v-col class="d-flex">
          <v-date-input
            v-model="form.shipmentDate"
            label="주문일자"
            density="compact"
            :display-format="formatDate"
            variant="underlined"
            style="width: 200px;"
            class="mb-2"
          />
          <v-text-field
            v-model="form.seq"
            density="compact"
            style="width: 20px;"
            class="mb-2"
            readonly
          />
        </v-col>
        <v-col>
          <v-date-input
            v-model="form.dueDate"
            label="출하예정일"
            density="compact"
            :display-format="formatDate"
            variant="underlined"
            style="width: 200px;"
          />
        </v-col>
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
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.managerName"
            label="출고요청자"
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
        <v-col>
          <v-text-field
            v-model="form.deliveryTelno"
            label="납품지연락처"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.deliveryManagerName"
            label="납품지담당자"
            variant="underlined"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.releaseTime"
            label="출하시간"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.releaseType"
            label="출고구분"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.accountStatement"
            label="거래명세서"
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
        <v-col cols="6">
          <v-textarea
            v-model="form.address"
            label="납품지 주소"
            density="compact"
            rows="2"
          />
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="form.etc"
            label="특이사항"
            density="compact"
            rows="2"
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
            text="판매"
            density="compact"
            @click="salePop"
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
                  >
                  {{ column.title }}
                </th>
              </tr>
            </template>

            <template #item.itemCd="{ item, index }">
              <input
                v-model="itemList[index].itemCd"
                style="text-align: center; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-input"
                readonly
              />
            </template>
            <template #item.itemName="{ item, index }">
              <input
                v-model="itemList[index].itemName"
                style="text-align: left; width: 95%; min-width: 95%; max-width: 95%;"
                class="custom-input"
                readonly
              />
            </template>
            <template #item.qty="{ item, index }">
              <input
                v-model="itemList[index].qty"
                style="text-align: right; width: 95%;"
                class="custom-line"
              />
            </template>
            <template #item.lotNo="{ item, index }">
              <input
                v-model="itemList[index].lotNo"
                type="text"
                style="text-align: left; width: 90%; min-width: 90%; max-width: 90%;"
                class="custom-line"
              />
            </template>
            <template #item.actions="{ item }">
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item)"></v-icon>
            </template>

            <!-- 총합 -->
            <template v-slot:body.append>
              <tr class="summary-row">
                <!-- itemCd -->
                <td style="width: 200px; height: 30px;" />
                <!-- itemName -->
                <td style="width: 650px; height: 30px" />
                <!-- qty 합계 -->
                <td style="width: 250px; text-align: right; font-weight: bold;  height: 30px">
                  {{ totalQty.toLocaleString() }}
                </td>
                <td></td>
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

<v-dialog v-model="saleDialog" width="800" height="800" persistent>
    <SaleListPop
      @selected="selectSaleInfo"
      @close-saleDialog="saleDialog = false"
    />
</v-dialog>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { onMounted, reactive, ref, shallowRef, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiCommon } from '@/api/apiCommon';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import StorageListPop from '@/views/basic/storage/StorageListPop.vue';
import SaleListPop from '../sale/SaleListPop.vue';

const { vError, vSuccess } = useAlertStore()
const router = useRouter()
const route = useRoute()
const { userId} = useAuthStore()

const shipmentId = route.params.id
const currentComponent = shallowRef(null)
const saleDialog = ref(false)
const dialog = ref(false)

let dialogWidth = ref('')
let dialogHeight = ref('')
let popType = ref('')

const selectedRowIndex = ref(null)

const selectRow = ref([])
const attachFile = ref([])
const itemList = ref([])
const form = reactive({
  shipmentDate: '',
  seq:'',
  customerName:'',
  customerCd:'',
  managerId: '',
  managerName: '',
  descStorageCd:'',
  descStorageName:'',

  deliveryTelno: '',
  deliveryManagerName : '',

  tradingMethod: '',
  dueDate: '',
  releaseTime:'',
  releaseType: '',
  accountStatement: '',
  address: '',

  attachFileId: '',

  saleIds: '',
  userId: userId,
})

const headers = [
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : '150px' },
  { title: '품목명',      key: 'itemName',   align: 'center',width : '400px'},
  { title: '수량',        key: 'qty',        align: 'center' ,width : '130px'},
  { title: 'lot No.',    key: 'lotNo',       align: 'center' ,width : '200px'},
  { title: '-',          key: 'actions',        align: 'center' ,width : 10},
]

// 1. 수량 합계
const totalQty = computed(() => {
  // .value로 실제 배열에 접근합니다.
  return itemList.value.reduce((sum, item) => sum + Number(item.qty || 0), 0);
});

const saveInfo = async () => {
  const formData = new FormData();

  try{
    const params = {
        ...form
    }

    formData.append('shipmentInfo', JSON.stringify(params))
    formData.append('itemList', JSON.stringify(itemList.value))

    attachFile.value.forEach(file => {
      //console.log('파일 객체 여부:',  file.file instanceof File)
      if (file.file instanceof File) {
        formData.append('attachFile', file.file)
      }
    })

    const msg = await ApiOrder.saveShipmentInfo(formData)
    vSuccess(msg)
    router.push({name:'ShipmentList'})
  }catch(err){
    vError(err.message)
  }
}

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

const selectSaleInfo = async (obj) =>{
  selectRow.value = obj
//console.log('selectRow.value ', selectRow.value )
  form.customerCd = obj[0].customerCd
  form.customerName = obj[0].customerName
  form.managerId = obj[0].managerId
  form.managerName = obj[0].managerName
  form.descStorageCd = obj[0].descStorageCd
  form.descStorageName = obj[0].descStorageName
  form.tradingMethod = obj[0].tradingMethod  //거래유형
  form.saleIds = selectRow.value.map(item => item.saleId).join(',')  // 'CT001,CT002,CT003' 형식

  itemList.value = await ApiOrder.getSalesItemList(form.saleIds)
  //console.log('itemList', itemList.value)
}

watch(() => form.shipmentDate, async (newVal, oldVal) => {

  if ( !isEmpty(formatDate(oldVal))) {
    if ( oldVal !==  formatDate(newVal) ){
    form.seq = await ApiCommon.getNextSeq('tb_shipment_mst','shipment_Date', formatDate(newVal))
    }
  }
})

// 행 삭제
const removeRow = (index) => {
  itemList.value.splice(index, 1)
}

const salePop = () => {
  saleDialog.value = true
}

onMounted( async () => {
  init()
})

const init = async () =>{
  const res = await ApiOrder.getShipmentInfo(shipmentId)
  Object.assign(form, res.shipmentInfo)

  itemList.value = res.itemList;

  if (res.attachFileInfo !== null) {
    attachFile.value = res.attachFileInfo;
  } else {
    attachFile.value = [];  // 없을 경우 초기화도 필요할 수 있음
  }
}


const goList = () =>{
  router.push({name:'ShipmentList'})
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
}
</style>
