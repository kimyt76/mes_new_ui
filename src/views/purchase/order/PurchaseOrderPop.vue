<template>
<Card style="width: 90rem; height: 10rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.purOrderDate"/>
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
                    <Select v-model="form.itemTypeCd"
                            :options="itemTypeCds"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>품목구분</label>
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
                    <DatePicker v-model="form.deliveryDate"  show-icon fluid/>
                    <label>납기일</label>
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
                    <InputText v-model="form.customerManagerName" class="w-full"/>
                    <label>거래처담당자</label>
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
        <Button label="주문서" @click="openPop('O')"/>
    </div>
    <div>
        <Button label="품목+" @click="itemPop"/>
    </div>
</div>
<div class="w-full mt-2">
    <DataTable
        :value="purchaseOrderItemList"
        selectionMode="single"
        class="my-table"
        show-gridlines
        >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="itemCd"    header="품목코드"  :style="{ width: '90px'}" />
        <Column field="itemName"  header="품목명"    :style="{ width: '350px'}" bodyClass="break-words">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.itemName"
                    class="w-full"
                    :readonly="!updateItem.includes(slotProps.data.itemCd)"
                />
            </template>
        </Column>
        <Column field="spec"      header="규격"      :style="{ width: '110px'}">
            <template #body="slotProps">
                <InputText v-model="slotProps.data.spec" class="w-full"/>
            </template>
        </Column>
        <Column field="qty"        header="수량"    :style="{ width: '80px'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.qty"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '100px', 'text-align': 'right' }"
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
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
        </Column>
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '80px'}"  >
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
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="etc"        header="비고"    :style="{ width: '200px'}" style="text-align: right;" >
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
    <!-- <Button label="메일발송" class="p-button-secondary" @click="sendMail"/> -->
    <Button label="저장" class="p-button-secondary" @click="saveInfo"/>
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
import ContractListPop from '@/views/order/contract/ContractListPop.vue';
import StorageListPop from '@/views/system/storage/StorageListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { InputNumber, InputText, useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';

const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialog = useDialog()
const itemDialog = ref(false)
const dialogRef = inject('dialogRef')
const { userId, memberNm } = useAuthStore()
const itemTypeCds = ref([])
const vatTypes = ref([])
const purchaseOrderItemList = ref([])
const updateItem = ['D000004','M60038','M60040','M60041','M60043']
const isAllSelected = computed(() => {
  return (
    purchaseOrderItemList.value.length > 0 &&
    selectedRows.value.length === purchaseOrderItemList.value.length
  )
})
const emit = defineEmits(['selected', 'close'])
const form = reactive({
    purOrderDate:'',
    seq: 0,
    itemTypeCd: '',
    storageCd: '',
    storageName: '',
    managerName: memberNm,
    managerId: userId,
    deliveryDate: '',
    customerName: '',
    customerCd: '',
    customerManagerName: '',
    remark: '',
    vatType: '',

    areaCd: '',
    purOrderId: '',
    purOrderItemId: '',
    userId: userId,
})

const saveInfo = async () =>{
    if ( purchaseOrderItemList.value.length === 0 ) {
        vWarning('저장할 품목을 추가해주세요.')
        return
    }

    try{
        const params = {
            purchaseOrderInfo : form,
            purchaseOrderItemList : purchaseOrderItemList.value,
        }
        console.log('params', params.purchaseOrderInfo)
        //저장로직
        const res = await ApiPurchase.savePurchaseOrder(params)
        vSuccess(res.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
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
        etc: o.etc,
        itemTypeCd: o.itemTypeCd ?? o.item_type_cd ?? '',
    };

     onChangeRow(row);

    return row;
    });

    if (purchaseOrderItemList.value.length > 0) {
        purchaseOrderItemList.value.push(...rowItem);
    } else {
        purchaseOrderItemList.value = [...rowItem];
    }
}

const itemPop = () =>{
     itemDialog.value = true
}

const openPop = (type) =>{
    let title = '창고 목록'
    let currentComponent = ''

    if ( type === 'C' ) {
        currentComponent = CustomerListPop
        title = '거래처 목록'
    }else if ( type === 'U') {
        currentComponent = UserListPop
        title = '사용자 목록'
    }else if ( type === 'S') {
        currentComponent = StorageListPop
    }else if ( type === 'O') {
        currentComponent = ContractListPop
        title = '주문서 목록'
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

watch(() => form.purOrderDate, async (newVal, oldVal) => {
  if ( !isEmpty(oldVal)) {
    if ( oldVal !==  newVal ){
        if ( form.itemTypeCd === 'M1') {
            form.seq = await ApiCommon.getNextSeq('tb_purm_order_mst', 'pur_order_date',  newVal)
        }else{
            form.seq = await ApiCommon.getNextSeq('tb_purp_order_mst', 'pur_order_date',  newVal)
        }
    }
  }
})

watch(() => form.vatType, async (newVal) => {
  if ( form.vatType === 'VRN' ){
        purchaseOrderItemList.value.map(o => {
            o.vatPrice = 0
        })
  }else{
        purchaseOrderItemList.value.map(o => {
            o.vatPrice = calculateVAT(o.supplyPrice)
        })
  }
})

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
    if ( isAllSelected.value ) {
        purchaseOrderItemList.value = []
        return
    }else{
        purchaseOrderItemList.value.splice(idx, 1)
    }
}

// const sendMail = () =>{
//     dialog.open( MailSendPop, {
//         props: {
//             header: '메일발송',
//             modal: true,
//             maximizable: false,
//             draggable: true,
//             style: {
//             overflow: 'hidden'
//             },
//             pt: {
//                 root: { style: { overflow: 'hidden' } },
//                 content: { style: { overflow: 'hidden' } }
//             }
//         },
//         data:{
//             itemTypeCd : form.itemTypeCd,
//             purOrderId : form.purOrderId,
//             customerCd : form.customerCd,
//         },
//         onClose: (event) => {
//         }
//     } )
// }

onMounted( async () => {
    itemTypeCds.value =await ApiCommon.getCodeList('item_type_cd')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')

    form.itemTypeCd = dialogRef.value?.data?.itemTypeCd ?? ''
    form.customerCd = dialogRef.value?.data?.customerCd ?? ''
    form.customerName = dialogRef.value?.data?.customerName ?? ''

    form.purOrderDate = todayKST()
    form.deliveryDate = todayKST()

    if ( form.itemTypeCd === 'M1') {
        form.seq = await ApiCommon.getNextSeq('tb_purm_order_mst', 'pur_order_date',  form.purOrderDate)
    }else{
        form.seq = await ApiCommon.getNextSeq('tb_purp_order_mst', 'pur_order_date',  form.purOrderDate)
    }

    const itemList = dialogRef.value?.data?.itemList
    itemList && addRow(itemList)
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
