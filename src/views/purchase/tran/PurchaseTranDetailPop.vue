<template>
<Card style="width: 90rem; height: 10rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.purDate"/>
                    <label>발주일</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.storageName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('S')"/>
                    </IconField>
                    <label>입고창고</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.managerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('U')"/>
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.orderType" class="w-full"/>
                    <label>발주구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.customerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('C')"/>
                    </IconField>
                    <label>거래처</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.vatType"
                            :options="vatTypes"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>부가세율적용</label>
                </FloatLabel>
            </div>
        </div>
         <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.remark" class="w-full" :rows="1" style="resize: none;"/>
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="w-full flex gap-2 ml-2 mt-4">
    <div>
        <Button label="발주서" @click="itemPop('O')"/>
    </div>
    <div>
        <Button label="품목+" @click="itemPop('I')"/>
    </div>
    <div>
        <Button label="복사하기" class="p-button-secondary" @click="copyPurInfo"/>
    </div>
</div>
<div class="w-full mt-2">
    <DataTable
        v-model:selection="selectedItem"
        :value="purchaseItemList"
        class="my-table"
        show-gridlines
        >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="itemCd"    header="품목코드"  :style="{ width: '100px'}" />
        <Column field="itemName"  header="품목명"    :style="{ width: '300px'}" bodyClass="break-words"></Column>
        <Column field="spec"      header="규격"      :style="{ width: '120px'}">
            <template #body="slotProps"><InputText v-model="slotProps.data.spec" class="w-full"/></template>
        </Column>
        <Column field="qty"        header="수량"    :style="{ width: '80px'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.qty"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '90px', 'text-align': 'right' }"
                         @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
        </Column>
        <Column field="inPrice"        header="단가"    :style="{ width: '80px'}"  >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.inPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '90px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
        </Column>
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '100px'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.supplyPrice"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '120px', 'text-align': 'right' }"
                    />
                </template>
        </Column>
        <Column field="vatPrice"        header="부가세"    :style="{ width: '80px'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.vatPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '90px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="lotNo"        header="로트번호"    :style="{ width: '140px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.lotNo" class="w-full"/>
            </template>
        </Column>
        <Column field="expiryDate"        header="사용기한"    :style="{ width: '100px'}" >
            <template #body="slotProps">
                <DatePicker v-model="slotProps.data.expiryDate" :inputStyle="{ width: '100px', textAlign: 'center' }" />
          </template>
        </Column>
        <Column field="testNo"        header="시험번호"    :style="{ width: '170px'}" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.testNo" class="w-full"/>
            </template>
        </Column>
        <Column field="etc"        header="비고"    :style="{ width: '150px'}" style="text-align: right;" >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.etc" class="w-full" />
            </template>
        </Column>
        <Column field="actions"        header="-"    :style="{ width: '20px'}" style="text-align: center;" >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>

    </DataTable>
</div>
<div class="w-full flex gap-2 justify-end mt-2">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"/>
    <Button label="바코드" icon="pi pi-barcode"  outlined @click="barcodePrint"></Button>
    <Button label="삭제"  @click="deletePur"></Button>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
    <Dialog
        v-model:visible="itemDialog"
        header="품목 조회"
        modal
        :draggable="false"
        :resizable="false"
        >
        <ItemListMultiPop
            @selected = "handleSelected"
            @close="itemDialog = false"
            />
    </Dialog>

    <Dialog
        v-model:visible="orderDialog"
        header="발주서 조회"
        modal
        :draggable="true"
        :resizable="false"
        >
        <PurchaseOrderListPop
            @selected = "handleOrderSelected"
            @close="orderDialog = false"
            />
    </Dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiPurchase } from '@/api/apiPurchase';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { calculateVAT, isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import QrCodePop from '@/views/common/QrCodePop.vue';
import StorageListPop from '@/views/system/storage/StorageListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { InputNumber, InputText, useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import PurchaseOrderListPop from '../order/PurchaseOrderListPop.vue';

const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialog = useDialog()
const orderDialog = ref(false)
const itemDialog = ref(false)
const isCopy = ref(false)
const dialogRef = inject('dialogRef')
const { userId, memberNm } = useAuthStore()
const itemTypeCds = ref([])
const selectedItem = ref([])
const deletedItemIds = ref([])
const vatTypes = ref([])
const purchaseItemList = ref([])
const isAllSelected = computed(() => {
  return (
    purchaseItemList.value.length > 0 &&
    selectedItem.value.length === purchaseItemList.value.length
  )
})
const emit = defineEmits(['selected', 'close'])
const form = reactive({
    purDate:'',
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

    purId:'',
    areaCd: '',
    userId: userId,
})

const saveInfo = async () =>{
    if ( purchaseItemList.value.length === 0 ) {
        vWarning('저장할 품목을 추가해주세요.')
        return
    }
    if(isEmpty(form.storageCd))  return vWarning('입고창고를 선택해주세요.')
    if(isEmpty(form.customerCd))  return vWarning('거래처를 선택해주세요.')
    if(isEmpty(form.managerId))  return vWarning('담당자를 선택해주세요.')

    try{
        const params = {
            purchaseInfo : form,
            purchaseItemList : purchaseItemList.value,
            deletePurchaseItems: deletedItemIds.value,
        }

        let res = ''
        console.log('params purchaseItemList',  params.purchaseItemList)

        if ( isCopy.value ) {
            res = await ApiPurchase.savePurchaseInfo(params)
        }else{
            res = await ApiPurchase.updatePurchaseInfo(params)
        }
        vSuccess(res.message)
        deletedItemIds.value = []
        closeDialog()
        isCopy.value = false
    }catch(err){
        handleApiError(err)
    }
}

const copyPurInfo = async () =>{
    isCopy.value = true

    const newDate = todayKST()
    // 날짜가 같으면 watch가 안 돌기 때문에 seq 직접 조회
    if (form.purDate === newDate) {
        form.seq = await ApiCommon.getNextSeq('tb_pur_mst', 'pur_date', newDate)
    }

    form.purDate = newDate

    purchaseItemList.value = purchaseItemList.value.map(o => {
        return {
            ...o,
            purItemId: '',
            lotNo: '',
            expiryDate: null,
            testNo: '',
            etc: '',
        }
    })
}

const deletePur = async () =>{
    const hasInYn = purchaseItemList.value.some(v => v.inYn === 'Y')
    if (hasInYn) return vWarning('이미 입고 처리된 항목이 있습니다.')

    if( !confirm('현재 구매항목 삭제합니다. \n 정말 삭제하시겠습니까?') ) return

    const res = await ApiPurchase.deletePurchase(form.purId)
    vSuccess(res.message)
    closeDialog()
}

const handleOrderSelected = (rows) =>{
    if (!Array.isArray(rows)) return
    addRow(rows)
}

const handleSelected = (rows) =>{
    if (!Array.isArray(rows)) return
    addRow(rows)
}

const addRow = (rows) =>{
    const rowItem = rows.map((o) => {
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
        inYn: o.inYn ?? o.inYn ?? 'N',
        etc: o.etc,
        itemTypeCd: o.itemTypeCd ?? o.item_type_cd ?? '',
        purOrderItemId: o.purOrderItemId ?? o.purOrderItemId ?? '',
        purItemId: o.purItemId ?? o.purItemId ?? '',
        purId: o.purId ?? o.purId ?? '',
        tran_item_id: o.tran_item_id ?? o.tran_item_id ?? '',
        tran_id: o.tran_id ?? o.tran_id ?? '',
    };

     onChangeRow(row);

    return row;
    });

    if (purchaseItemList.value.length > 0) {
        purchaseItemList.value.push(...rowItem);
    } else {
        purchaseItemList.value = [...rowItem];
    }
}

const itemPop = (type) =>{
    if ( type === 'O' ) {
        orderDialog.value = true
    }else{
        itemDialog.value = true
    }
}

const openPop = (type) =>{
    let title = ''
    let currentComponent = ''

    if ( type === 'C' ) {
        currentComponent = CustomerListPop
        title = '거래처 목록'
    }else if ( type === 'U') {
        currentComponent = UserListPop
        title = '사용자 목록'
    }else if ( type === 'S') {
        title = '창고 목록'
        currentComponent = StorageListPop
    }

    dialog.open( currentComponent, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
            overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'auto' } }
            }
        },
        onClose: (event) => {
            if ( event.data ) {
                if ( type === 'C' ){
                    form.customerCd = event.data.customerCd
                    form.customerName = event.data.customerName
                }else if ( type === 'U' ){
                    form.managerId = event.data.userId
                    form.managerName = event.data.memberNm
                }else if ( type === 'S' ){
                    form.storageCd = event.data.storageCd
                    form.storageName = event.data.storageName
                    form.areaCd = event.data.areaCd
                }else if ( type === 'O'){
                    addRow(event.data)
                }
            }
        }
    } )
}

watch(() => form.purDate, async (newVal, oldVal) => {
  if ( !isEmpty(oldVal)) {
    if ( oldVal !==  newVal ){
        form.seq = await ApiCommon.getNextSeq('tb_pur_mst', 'pur_date',  newVal)
    }
  }
})

watch(() => form.vatType, async (newVal) => {
  if ( form.vatType === 'VRN' ){
        purchaseItemList.value.map(o => {
            o.vatPrice = 0
        })
  }else{
        purchaseItemList.value.map(o => {
            o.vatPrice = calculateVAT(o.supplyPrice)
        })
  }
})

const barcodePrint = () =>{
    if( selectedItem.value.length === 0 ) return vWarning('바코드를 출력할 품목을 선택해주세요.')

    dialog.open(QrCodePop, {
        props:{
            header: 'QR코드 라벨 출력',
            modal: true,
            draggable: true,
            resizable: false,
            style: { width: '80rem', maxWidth: '80rem' },
            contentStyle: { height: '30rem', overflow: 'hidden' },
        },
        data:{
            menuType:'PUR',
            itemList : selectedItem.value,
        }
    })
}

const onChangeRow = (row) => {
  const qty = Number(row.qty) || 0
  const inPrice  = Number(row.inPrice)  || 0

  row.supplyPrice = qty * inPrice

  if ( !isEmpty(form.vatType) &&  form.vatType === 'VRY' ){
    row.vatPrice = calculateVAT(row.supplyPrice)
  }else{
    row.vatPrice = 0
  }
};

const removeRow = (idx) =>{
    if (isAllSelected.value) {
        purchaseItemList.value.forEach(row => {
            if (row.purItemId) {
                deletedItemIds.value.push(row.purItemId)
            }
        })

        purchaseItemList.value = []
        return
    }

    const row = purchaseItemList.value[idx]

    if (row.purItemId) {
        deletedItemIds.value.push(row.purItemId)
    }
    purchaseItemList.value.splice(idx, 1)
}

onMounted( async () => {
    //itemTypeCds.value =await ApiCommon.getCodeList('item_type_cd')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')

    form.purId = dialogRef.value?.data.id

    const res = await ApiPurchase.getPurchaseInfo(form.purId)

    Object.assign(form, res.purchaseInfo)
    purchaseItemList.value = res.purchaseItemList
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

.center-dash {
  display: flex;
  align-items: center;
  font-size: 18px;
  height: 100%;
}

</style>
