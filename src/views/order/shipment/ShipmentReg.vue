<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs
    :items="['MES', '수주관리', '출하지시서 신규']"
    class="custom-breadcrumbs"
    ></v-breadcrumbs>
  <v-card>
    <v-card-item title="출하지시서 입력"/>
    <v-form ref="vform" @submit.prevent="saveInfo" >
      <v-card-text>
        <v-row>
          <v-col class="d-flex flex-row align-center" style="gap: 0px">
            <DateSinglePicker
              v-model="form.shipmentDate"
              title="주문일자"
              density="compact"
              style="width: 100px;"
            />
            <v-text-field
              v-model="form.seq"
              label="순번"
              density="compact"
              style="width: 50px; max-width: 70px; min-width: 0;"
              readonly
            />
          </v-col>
          <v-col></v-col>
          <v-col>
            <div class="d-flex ga-4 justify-end">
              <DateSinglePicker
              v-model="form.dueDate"
              title="출하예정일"
              density="compact"
            />
            </div>
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
              v-model="form.releaseUserName"
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
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.deliveryTelno"
              label="납품지연락처"
              density="compact"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.deliveryManagerName"
              label="납품지담당자"
              density="compact"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.releaseType"
              label="출고구분"
              density="compact"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.accountStatement"
              label="거래명세서"
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
        <v-col>
          <div class="d-flex ga-4 justify-end">
          <v-btn
            text="판매"
            density="compact"
            @click="salePop"
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
          <template #item.qty="{ item, index }">
            <input
              v-model="itemList[index].qty"
              type="number"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
              class="custom-line"
              @blur="onBlur(index)"
            />
          </template>
          <template #item.lotNo="{ item, index }">
            <input
              v-model="itemList[index].lotNo"
              style="text-align: right; width: 110px; min-width: 110px; max-width: 110px;"
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
              <td style="width: 100px; height: 30px;" ></td>
              <!-- itemName -->
              <td style="width: 250px; height: 30px;"></td>
              <!-- qty 합계 -->
              <td style="width: 110px; height: 30px; text-align: right; font-weight: bold;">
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
    :height="dialogHeight" persistent
    >
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleSeleted"
      @close-dialog="dialog = false"
    />
</v-dialog>

<v-dialog v-model="saleDialog" width="1200px" height="800px" persistent>
    <SaleListPop
      @selected="selectSaleInfo"
      @close-saleDialog="saleDialog = false"
    />
</v-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, computed, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/auth';

import DateSinglePicker from '@/components/DateSinglePicker.vue';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import StorageListPop from '@/views/basic/storage/StorageListPop.vue';
import { ApiOrder } from '@/api/apiOrders';
import SaleListPop from '../sale/SaleListPop.vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { ApiCommon } from '@/api/apiCommon';


const { vError, vSuccess } = useAlertStore()
const router = useRouter()
let dialogWidth = ref('')
let dialogHeight = ref('')
const { userId} = useAuthStore()
const saleDialog = ref(false)
const dialog = ref(false)
let popType = ref('')

const currentComponent = shallowRef(null)
const selectedRowIndex = ref(null)
const selectRow = ref([])
const attachFile = ref([])
const itemList = ref([])
const form = reactive({
  shipmentDate: '',
  seq:'',
  customerName:'',
  customerCd:'',
  releaseUserId: '',
  releaseUserName: '',
  descStorageCd:'',
  descStorageName:'',

  deliveryTelno: '',
  deliveryManagerName : '',

  dueDate: '',
  releaseTime:'',
  releaseType: '',
  accountStatement: '',
  address: '',

  attachFileId: '',

  saleIds: '',
  userId: userId,
})

// 1. 수량 합계
const totalQty = computed(() => {
  // .value로 실제 배열에 접근합니다.
  return itemList.value.reduce((sum, item) => sum + Number(item.qty || 0), 0);
});

const headers = [
  { title: '품목코드 ',   key: 'itemCd',     align: 'center'  ,width : '100px' },
  { title: '품목명',      key: 'itemName',   align: 'center',width : '250px'},
  { title: '수량',        key: 'qty',        align: 'center' ,width : '110px'},
  { title: 'lot No.',    key: 'lotNo',       align: 'center' ,width : '150px'},
  { title: '-',          key: 'actions',        align: 'center' ,width : 10},
]

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
    default:
      popType.value = 'I'
      selectedRowIndex.value = type
      currentComponent.value = ItemListSinglePop
      dialogWidth.value = '1100px'
      dialogWidth.value = '800px'
      break
  }
  dialog.value = true
}

const handleSeleted = ( obj ) => {
  switch (popType.value){
    case 'C':
      form.customerName = obj.customerName
      form.customerCd = obj.customerCd
      form.releaseUserId = obj.memberCd
      form.releaseUserName = obj.memberCd
      form.tradingMethod = obj.tradingMethod
      break
    case 'U':
      form.releaseUserName = obj.memberNm
      form.releaseUserId = obj.userId
      break
    case 'S':
      form.descStorageName = obj.storageName
      form.descStorageCd = obj.storageCd
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
const selectSaleInfo = async (obj) =>{
  selectRow.value = obj
//console.log('selectRow.value ', selectRow.value )
  form.customerCd = obj[0].customerCd
  form.customerName = obj[0].customerName
  form.releaseUserId = obj[0].managerId
  form.releaseUserName = obj[0].managerName
  form.descStorageCd = obj[0].descStorageCd
  form.descStorageName = obj[0].descStorageName
  form.tradingMethod = obj[0].tradingMethod  //거래유형
  form.saleIds = selectRow.value.map(item => item.saleId).join(',')  // 'CT001,CT002,CT003' 형식

  itemList.value = await ApiOrder.getSalesItemList(form.saleIds)
  console.log('itemList', itemList.value)
}

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


// 행 삭제
const removeRow = (index) => {
  itemList.value.splice(index, 1)
}

const salePop = () => {
  saleDialog.value = true
}


onMounted( async () => {
  form.seq = await ApiCommon.getNextSeq('tb_shipment_mst', 'shipment_date',  form.shipmentDate)
})

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
