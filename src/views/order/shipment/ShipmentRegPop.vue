<template>
<Card style="width: 100rem; height: 15rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.shipmentDate" show-icon />
                    <label>출하일자</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.dueDate" fluid  show-icon/>
                    <label>출하예정일자</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.clientName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('C')"/>
                    </IconField>
                    <label>고객사</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.deliveryTelno" class="w-full"  readonly/>
                    <label>납품지연락처</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.deliveryManagerName" class="w-full"  readonly/>
                    <label>납품지담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.releaseTime" class="w-full"  readonly/>
                    <label>출하시간</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.releaseType" class="w-full"  readonly/>
                    <label>출고구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.accountStatement" class="w-full"  readonly/>
                    <label>거래명세서</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.tradingMethod" class="w-full"  readonly/>
                    <label>거래방법</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.managerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('U')"/>
                    </IconField>
                    <label>출고요청자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.descStorageName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('U')"/>
                    </IconField>
                    <label>출하창고</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.vatType" class="w-full" />
                    <label>납품지주소</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" rows="1" style="resize: none;" class="w-full" />
                    <label>특이사항</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="w-full align-items-center mt-3">
    <CommFileUpload
        v-model="attachFile"
        :download-url="`/api/lab/material/file/download`"
        :accept="'.pdf,.xlsx,.xls,.png,.jpg,.jpeg'"
        :multiple="true"
        @error="(msg) => console.error(msg)"
    />
</div>
<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 품목</h5>
    <Button
        label="추가+"
        @click="itemOpenPop"
        class="p-button-xm"
    />
</div>
<div class="w-full mt-2">
    <DataTable
        :value="itemList"
        selectionMode="single"
        class="my-table"
        scroll-height="400px"
        show-gridlines
        @row-select="selectedRow"
        >
        <Column field="itemCd"    header="품목코드"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"  header="품목명"    :style="{ width: '350px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
             <template #footer>
                <div style="text-align: center; font-weight: bold;" class="footer-cell">합계</div>
            </template>
        </Column>
        <Column field="qty"       header="수량"    :style="{ width: '50px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.qty"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                        @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
            <template #footer>
                <div style="text-align: right; width: 50px; padding-right: 4px;" class="footer-cell">
                {{ totQty.toFixed(0) }}
                </div>
            </template>
        </Column>
        <Column field="logNo"    header="Lot No."       :style="{ width: '50px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="actions"     header="-"    :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>

    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
</div>

<Dialog
    v-model:visible="itemDialog"
    header="품목 목록"
  >
    <ItemListMultiPop
        @selected = "selectedRow"
        @close = "itemDialog = false"
        />
</Dialog>

</template>


<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import CommFileUpload from '@/components/CommFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import ClientListPop from '@/views/order/client/ClientListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, shallowRef, watch } from 'vue';

const dialog = useDialog()
const { userId } = useAuthStore()
const { vError, vSuccess, vWarning } = useAlertStore()
const currentComponent = shallowRef(null)
const totQty = computed(() =>
  itemList.value.reduce(
    (sum, row) => sum + (Number(row.qty) || 0),
    0,
  ),
)
const attachFile = ref([])
const dialogRef = inject('dialogRef')
const itemList = ref([])
const itemDialog = ref(false)

const form = reactive({
  shipmentDate: '',
  seq:'',
  clientName:'',
  clientId:'',
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

  shipmentId: '',
  saleIds: '',
  userId: userId,
})

// 1. 수량 합계
const totalQty = computed(() => {
  // .value로 실제 배열에 접근합니다.
  return itemList.value.reduce((sum, item) => sum + Number(item.qty || 0), 0);
});

watch(() => form.contractDate, async (newVal, oldVal) => {
  if ( !isEmpty(newVal)) {
    if ( oldVal !==  newVal ){
    form.seq = await ApiCommon.getNextSeq('tb_shipment_mst','shipment_date', newVal)
    }
  }
})

const saveInfo = async () =>{
    const formData = new FormData();

    if ( itemList.value <= 0 ){
        vInfo("품목을 등록하세요")
        return
    }
    if(attachFile.value <= 0 ){
        vInfo("산출물을 등록하세요")
        return
    }

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
        vSuccess(msg.data.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const selectedRow = (obj) =>{
    if (!Array.isArray(obj)) return;

    let baseSeq = itemList.value.length;

    const selectItem = obj.map((o, index) => ({
      itemCd: o.itemCd,
      itemName: o.itemName,
      spec: o.spec,
      prodType: o.prodType,
      qty: o.qty,
      unitPrice: o.unitPrice,
      supplyPrice: 0,
      vatPrice: 0,
      totPrice: 0,
      degree: o.degree,
      statusType: o.statusType,
      orderDist: baseSeq + index + 1,
      poNo: o.poNo
  }));

  if (itemList.value.length > 0) {
    itemList.value.push(...selectItem);
  } else {
    itemList.value = [...selectItem];
  }
}

const removeRow = (index) =>{
    itemList.value.splice(index,1)
}

const itemOpenPop = () =>{
    itemDialog.value = true
}

const openPop = (type) =>{
    let title = ''

    if ( type === 'C') {
        title = '고객사 목록'
        currentComponent.value = ClientListPop
    }else if ( type === 'U') {
        title = '사용자 목록'
        currentComponent.value = UserListPop
    }
    dialog.open (currentComponent.value, {
        props: {
            header: title,
            modal: true,
            draggable: false,
            maximizable: false,
            style: {
            overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        onClose: (event) => {
            if ( type === 'C') {
                form.clientName = event.data.clientName
                form.clientId = event.data.clientId
            }else if ( type === 'U') {
                form.managerName = event.data.memberNm
                form.managerId = event.data.userId
            }
        }
    })
}

onMounted( async () =>{
    form.shipmentDate = todayKST()
    form.seq = await ApiCommon.getNextSeq('tb_shipment_mst', 'shipment_date',  form.shipmentDate)
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
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
