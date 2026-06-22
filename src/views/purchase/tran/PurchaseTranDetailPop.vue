<template>
  <div class="purchase-detail">
    <Card class="purchase-card">
      <template #content>
        <div class="grid mb-1">
          <div class="col-3 flex align-items-center gap-2">
            <FloatLabel variant="on">
              <DatePicker v-model="form.purDate" />
              <label>발주일</label>
            </FloatLabel>

            <span class="center-dash">-</span>

            <FloatLabel variant="on">
              <InputNumber
                v-model="form.seq"
                :inputStyle="{ width: '50px', textAlign: 'center' }"
              />
              <label>연번</label>
            </FloatLabel>
          </div>

          <div class="col-3">
            <FloatLabel variant="on">
              <IconField>
                <InputText v-model="form.storageName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('S')" />
              </IconField>
              <label>입고창고</label>
            </FloatLabel>
          </div>

          <div class="col-3">
            <FloatLabel variant="on">
              <IconField>
                <InputText v-model="form.managerName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('U')" />
              </IconField>
              <label>담당자</label>
            </FloatLabel>
          </div>
        </div>

        <div class="grid mb-1">
          <div class="col-3">
            <FloatLabel variant="on">
              <InputText v-model="form.orderType" class="w-full" />
              <label>발주구분</label>
            </FloatLabel>
          </div>

          <div class="col-3">
            <FloatLabel variant="on">
              <IconField>
                <InputText v-model="form.customerName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('C')" />
              </IconField>
              <label>거래처</label>
            </FloatLabel>
          </div>

          <div class="col-3">
            <FloatLabel variant="on">
              <Select
                v-model="form.vatType"
                :options="vatTypes"
                optionLabel="codeNm"
                optionValue="code"
                class="w-full"
              />
              <label>부가세율적용</label>
            </FloatLabel>
          </div>
        </div>

        <div class="grid mb-1">
          <div class="col-9">
            <FloatLabel variant="on">
              <Textarea
                v-model="form.remark"
                class="w-full"
                :rows="1"
                style="resize: none"
              />
              <label>비고</label>
            </FloatLabel>
          </div>
        </div>
      </template>
    </Card>

    <div class="top-buttons">
      <Button label="발주서" @click="itemPop('O')" />
      <Button label="품목+" @click="itemPop('I')" />
      <Button label="복사하기" class="p-button-secondary" @click="copyPurInfo" />
    </div>

    <div class="table-wrap">
      <DataTable
        v-model:selection="selectedItem"
        :value="purchaseItemList"
        class="my-table compact-table"
        show-gridlines
        scrollable
        scrollHeight="300px"
      >
        <Column selectionMode="multiple" headerStyle="width:36px" bodyStyle="text-align:center" />

        <Column field="itemCd" header="품목코드" :style="{ width: '110px' }" />

        <Column field="itemName" header="품목명" :style="{ width: '250px' }">
          <template #body="slotProps">
            <span class="ellipsis-text">{{ slotProps.data.itemName }}</span>
          </template>
        </Column>

        <Column field="spec" header="규격" :style="{ width: '90px' }">
          <template #body="slotProps">
            <InputText v-model="slotProps.data.spec" class="cell-input" />
          </template>
        </Column>

        <Column field="qty" header="수량" :style="{ width: '90px' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.qty"
              class="cell-number"
              :min="0"
              :maxFractionDigits="0"
              :useGrouping="true"
              :inputStyle="{ textAlign: 'right' }"
              @update:modelValue="() => onChangeRow(slotProps.data)"
            />
          </template>
        </Column>

        <Column field="inPrice" header="단가" :style="{ width: '100px' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.inPrice"
              class="cell-number"
              :min="0"
              :maxFractionDigits="0"
              :useGrouping="true"
              :inputStyle="{ textAlign: 'right' }"
              @update:modelValue="() => onChangeRow(slotProps.data)"
            />
          </template>
        </Column>

        <Column field="supplyPrice" header="공급가액" :style="{ width: '120px' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.supplyPrice"
              class="cell-number"
              :min="0"
              :maxFractionDigits="0"
              :useGrouping="true"
              :inputStyle="{ textAlign: 'right' }"
            />
          </template>
        </Column>

        <Column field="vatPrice" header="부가세" :style="{ width: '105px' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.vatPrice"
              class="cell-number"
              :min="0"
              :maxFractionDigits="0"
              :useGrouping="true"
              :inputStyle="{ textAlign: 'right' }"
            />
          </template>
        </Column>

        <Column field="lotNo" header="로트번호" :style="{ width: '120px' }">
          <template #body="slotProps">
            <InputText v-model="slotProps.data.lotNo" class="cell-input" />
          </template>
        </Column>

        <Column field="expiryDate" header="사용기한" :style="{ width: '120px' }">
          <template #body="slotProps">
            <DatePicker
              v-model="slotProps.data.expiryDate"
              class="cell-date"
              :inputStyle="{ textAlign: 'center' }"
            />
          </template>
        </Column>

        <Column field="testNo" header="시험번호" :style="{ width: '150px' }">
          <template #body="slotProps">
            <InputText v-model="slotProps.data.testNo" class="cell-input" />
          </template>
        </Column>

        <Column field="etc" header="비고" :style="{ width: '120px' }">
          <template #body="slotProps">
            <InputText v-model="slotProps.data.etc" class="cell-input" />
          </template>
        </Column>

        <Column header="-" :style="{ width: '40px' }" bodyStyle="text-align:center">
          <template #body="slotProps">
            <i class="pi pi-trash delete-icon" @click="removeRow(slotProps.index)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="bottom-buttons">
      <Button label="저장" class="p-button-secondary" @click="saveInfo" />
      <Button label="바코드" icon="pi pi-barcode" outlined @click="barcodePrint" />
      <Button label="삭제" severity="danger" @click="deletePur" />
      <Button label="닫기" outlined @click="closeDialog" />
    </div>

    <Dialog v-model:visible="itemDialog" header="품목 조회" modal :draggable="false" :resizable="false">
      <ItemListMultiPop @selected="handleSelected" @close="itemDialog = false" />
    </Dialog>

    <Dialog v-model:visible="orderDialog" header="발주서 조회" modal :draggable="true" :resizable="false">
      <PurchaseOrderListPop @selected="handleOrderSelected" @close="orderDialog = false" />
    </Dialog>
  </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiPurchase } from '@/api/apiPurchase'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { calculateVAT, isEmpty, todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue'
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue'
import QrCodePop from '@/views/common/QrCodePop.vue'
import StorageListPop from '@/views/system/storage/StorageListPop.vue'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { useDialog } from 'primevue'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import PurchaseOrderListPop from '../order/PurchaseOrderListPop.vue'

const { vSuccess, vWarning } = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const { userId } = useAuthStore()

const orderDialog = ref(false)
const itemDialog = ref(false)
const isCopy = ref(false)
const selectedItem = ref([])
const deletedItemIds = ref([])
const vatTypes = ref([])
const purchaseItemList = ref([])

const isAllSelected = computed(() => {
  return purchaseItemList.value.length > 0 &&
    selectedItem.value.length === purchaseItemList.value.length
})

const form = reactive({
  purDate: '',
  seq: 0,
  storageCd: '',
  storageName: '',
  managerName: '',
  managerId: '',
  orderType: '',
  customerName: '',
  customerCd: '',
  remark: '',
  vatType: '',
  endYn: '',
  purId: '',
  areaCd: '',
  userId
})

const saveInfo = async () => {
  if (purchaseItemList.value.length === 0) return vWarning('저장할 품목을 추가해주세요.')
  if (isEmpty(form.storageCd)) return vWarning('입고창고를 선택해주세요.')
  if (isEmpty(form.customerCd)) return vWarning('거래처를 선택해주세요.')
  if (isEmpty(form.managerId)) return vWarning('담당자를 선택해주세요.')

  try {
    const params = {
      purchaseInfo: form,
      purchaseItemList: purchaseItemList.value,
      deletePurchaseItems: deletedItemIds.value
    }

    const res = isCopy.value
      ? await ApiPurchase.savePurchaseInfo(params)
      : await ApiPurchase.updatePurchaseInfo(params)

    vSuccess(res.message)
    deletedItemIds.value = []
    isCopy.value = false
    closeDialog()
  } catch (err) {
    handleApiError(err)
  }
}

const copyPurInfo = async () => {
  isCopy.value = true
  const newDate = todayKST()

  if (form.purDate === newDate) {
    form.seq = await ApiCommon.getNextSeq('tb_pur_mst', 'pur_date', newDate)
  }

  form.purDate = newDate

  purchaseItemList.value = purchaseItemList.value.map(o => ({
    ...o,
    purItemId: '',
    lotNo: '',
    expiryDate: null,
    testNo: '',
    etc: ''
  }))
}

const deletePur = async () => {
  const hasInYn = purchaseItemList.value.some(v => v.inYn === 'Y')
  if (hasInYn) return vWarning('이미 입고 처리된 항목이 있습니다.')

  if (!confirm('현재 구매항목 삭제합니다. \n 정말 삭제하시겠습니까?')) return

  const res = await ApiPurchase.deletePurchase(form.purId)
  vSuccess(res.message)
  closeDialog()
}

const handleOrderSelected = rows => {
  if (Array.isArray(rows)) addRow(rows)
}

const handleSelected = rows => {
  if (Array.isArray(rows)) addRow(rows)
}

const addRow = rows => {
  const rowItem = rows.map(o => {
    const row = {
      itemCd: o.itemCd,
      itemName: o.itemName,
      spec: o.spec,
      qty: o.qty,
      inPrice: o.inPrice,
      supplyPrice: o.supplyPrice,
      vatPrice: o.vatPrice,
      lotNo: o.lotNo,
      expiryDate: o.expiryDate,
      testNo: o.testNo,
      inYn: o.inYn ?? 'N',
      etc: o.etc,
      itemTypeCd: o.itemTypeCd ?? o.item_type_cd ?? '',
      purOrderItemId: o.purOrderItemId ?? '',
      purItemId: o.purItemId ?? '',
      purId: o.purId ?? '',
      tran_item_id: o.tran_item_id ?? '',
      tran_id: o.tran_id ?? ''
    }

    onChangeRow(row)
    return row
  })

  purchaseItemList.value.push(...rowItem)
}

const itemPop = type => {
  if (type === 'O') orderDialog.value = true
  else itemDialog.value = true
}

const openPop = type => {
  let title = ''
  let currentComponent = null

  if (type === 'C') {
    currentComponent = CustomerListPop
    title = '거래처 목록'
  } else if (type === 'U') {
    currentComponent = UserListPop
    title = '사용자 목록'
  } else if (type === 'S') {
    currentComponent = StorageListPop
    title = '창고 목록'
  }

  dialog.open(currentComponent, {
    props: {
      header: title,
      modal: true,
      maximizable: false,
      draggable: true,
      style: { overflow: 'hidden' },
      pt: {
        root: { style: { overflow: 'hidden' } },
        content: { style: { overflow: 'auto' } }
      }
    },
    onClose: event => {
      if (!event.data) return

      if (type === 'C') {
        form.customerCd = event.data.customerCd
        form.customerName = event.data.customerName
      } else if (type === 'U') {
        form.managerId = event.data.userId
        form.managerName = event.data.memberNm
      } else if (type === 'S') {
        form.storageCd = event.data.storageCd
        form.storageName = event.data.storageName
        form.areaCd = event.data.areaCd
      }
    }
  })
}

watch(() => form.purDate, async (newVal, oldVal) => {
  if (!isEmpty(oldVal) && oldVal !== newVal) {
    form.seq = await ApiCommon.getNextSeq('tb_pur_mst', 'pur_date', newVal)
  }
})

watch(() => form.vatType, () => {
  purchaseItemList.value.forEach(o => {
    o.vatPrice = form.vatType === 'VRY' ? calculateVAT(o.supplyPrice) : 0
  })
})

const barcodePrint = () => {
  if (selectedItem.value.length === 0) {
    return vWarning('바코드를 출력할 품목을 선택해주세요.')
  }

  dialog.open(QrCodePop, {
    props: {
      header: 'QR코드 라벨 출력',
      modal: true,
      draggable: true,
      resizable: false,
      style: { width: '80rem', maxWidth: '80rem' },
      contentStyle: { height: '30rem', overflow: 'hidden' }
    },
    data: {
      menuType: 'PUR',
      itemList: selectedItem.value
    }
  })
}

const onChangeRow = row => {
  const qty = Number(row.qty) || 0
  const inPrice = Number(row.inPrice) || 0

  row.supplyPrice = qty * inPrice
  row.vatPrice = form.vatType === 'VRY' ? calculateVAT(row.supplyPrice) : 0
}

const removeRow = idx => {
  if (isAllSelected.value) {
    purchaseItemList.value.forEach(row => {
      if (row.purItemId) deletedItemIds.value.push(row.purItemId)
    })

    purchaseItemList.value = []
    return
  }

  const row = purchaseItemList.value[idx]
  if (row?.purItemId) deletedItemIds.value.push(row.purItemId)

  purchaseItemList.value.splice(idx, 1)
}

onMounted(async () => {
  vatTypes.value = await ApiCommon.getCodeList('vat_type')

  form.purId = dialogRef.value?.data.id

  const res = await ApiPurchase.getPurchaseInfo(form.purId)

  Object.assign(form, res.purchaseInfo)
  purchaseItemList.value = res.purchaseItemList
})

const closeDialog = () => {
  dialogRef.value.close()
}
</script>

<style scoped>
.purchase-detail {
  height: calc(100vh - 120px);
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.purchase-card {
  width: 100%;
  height: 10rem;
  flex: 0 0 auto;
}

.top-buttons {
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  margin: 10px 0 8px 6px;
}

.table-wrap {
  flex: 0 0 auto;
  height: 300px;
  overflow: hidden;
}

.bottom-buttons {
  flex: 0 0 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 0 0;
  background: #fff;
}

.center-dash {
  display: flex;
  align-items: center;
  font-size: 18px;
  height: 100%;
}

.ellipsis-text {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* PrimeVue v4 */
:deep(.compact-table .p-datatable-table-container) {
  height: 300px !important;
  max-height: 300px !important;
  overflow: auto !important;
}

/* PrimeVue v3 대응 */
:deep(.compact-table .p-datatable-wrapper) {
  height: 300px !important;
  max-height: 300px !important;
  overflow: auto !important;
}

:deep(.compact-table table) {
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
}

:deep(.compact-table .p-datatable-thead > tr > th) {
  background-color: #bcaaa4;
  color: #fff;
  font-size: 13px;
  text-align: center;
  vertical-align: middle;
  padding: 5px 4px !important;
  height: 30px;
  white-space: nowrap;
}

:deep(.compact-table .p-datatable-tbody > tr > td) {
  font-size: 13px;
  padding: 3px 4px !important;
  height: 38px;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
}

:deep(.compact-table .p-datatable-thead > tr > th:first-child),
:deep(.compact-table .p-datatable-tbody > tr > td:first-child) {
  text-align: center !important;
}

:deep(.compact-table .p-checkbox) {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

:deep(.compact-table .p-datatable-thead > tr > th:last-child),
:deep(.compact-table .p-datatable-tbody > tr > td:last-child) {
  text-align: center !important;
}

.delete-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

:deep(.cell-input),
:deep(.cell-number),
:deep(.cell-date) {
  width: 100%;
}

:deep(.cell-input),
:deep(.cell-input .p-inputtext),
:deep(.cell-number .p-inputnumber-input),
:deep(.cell-date .p-inputtext) {
  width: 100%;
  height: 30px !important;
  min-height: 30px !important;
  padding: 3px 6px !important;
  font-size: 13px;
  box-sizing: border-box;
}

:deep(.p-inputtext),
:deep(.p-inputnumber-input),
:deep(.p-datepicker-input) {
  box-sizing: border-box;
}
</style>
