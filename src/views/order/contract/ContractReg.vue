<template>
<Card style="width: 100rem; height: 8rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.contractDate" show-icon />
                    <label>주문일자</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.expectedDueDate" fluid  show-icon/>
                    <label>납기예정일자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.paymentCondition" class="w-full"  readonly/>
                    <label>결제조건</label>
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
        <!-- Row 2 -->
        <div class="grid mb-2">
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
                    <Select v-model="form.vatType" :options="vatTypes"
                            optionLabel="codeNm" optionValue="code" class="w-full" />
                    <label>거래유형</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.orderType" :options="orderTypes"
                            optionLabel="codeNm" optionValue="code" class="w-full" />
                    <label>수주유형</label>
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
    <h5 class="m-0">- 수주품목</h5>
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
        <Column field="itemCd"      header="품목코드"   :style="{ width: '80px', 'text-align': 'center' }" />
        <Column field="itemName"    header="품목명"     :style="{ width: '350px'}" bodyClass="break-words"></Column>
        <Column field="spec"        header="규격"       :style="{ width: '70px', 'text-align': 'center' }" ></Column>
        <Column field="prodType"    header="제품유형"   :style="{ width: '80px', 'text-align': 'center' }" bodyClass="break-words" >
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.prodType"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="qty"         header="수량"       :style="{ width: '50px'}"  >
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
        </Column>
        <Column field="unitPrice" header="단가"    :style="{ width: '50px'}"  >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.unitPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
        </Column>
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '60px'}"  >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.supplyPrice"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '50px', 'text-align': 'right' }"
                    />
                </template>
        </Column>
        <Column field="vatPrice"        header="부가세"    :style="{ width: '50px'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.vatPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="totPrice"        header="합계"    :style="{ width: '50px'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.totPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="degree"      header="차수"       :style="{ width: '50px', textAlign:'center'}" bodyClass="break-words" ></Column>
        <Column field="statusType"  header="진행상태"   :style="{ width: '50px'}" bodyClass="break-words">
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.statusType"
                    class="w-full"
                    :options="statusTypes"
                    option-label="codeNm"
                    option-value="code"
                    :inputStyle="{ width: '40px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="etc"         header="비고"       :style="{ width: '130px'}"  >
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.etc"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="actions"     header="-"    :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>

    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
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
import { calculateVAT, isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import ClientListPop from '@/views/order/client/ClientListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { Dialog, useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, shallowRef, watch } from 'vue';

const dialog = useDialog()
const { userId } = useAuthStore()
const { vError, vSuccess, vWarning, vInfo } = useAlertStore()
const currentComponent = shallowRef(null)
const attachFile = ref([])
const dialogRef = inject('dialogRef')
const itemList = ref([])
const orderTypes = ref([])
const vatTypes = ref([])
const statusTypes = ref([])
const itemDialog = ref(false)

const form = reactive({
    contractDate: '',
    seq:'',
    expectedDueDate: '',
    clientName:'',
    clientId:'',
    managerName:'',
    managerId:'',
    paymentCondition:'',
    vatType:'',
    orderType:'',

    userId: userId,
})

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

const onChangeRow = (data) =>{
  const qty = data.qty
  const unitPrice = data.unitPrice

  const supplyPrice =
    !isNaN(qty) && !isNaN(unitPrice) ? qty * unitPrice : 0;

  data.supplyPrice = supplyPrice;
  data.vatPrice = supplyPrice ? calculateVAT(supplyPrice) : 0;
  data.totPrice = supplyPrice + data.vatPrice;
}

watch(() => form.contractDate, async (newVal, oldVal) => {
  if ( !isEmpty(newVal)) {
    if ( oldVal !==  newVal ){
    form.seq = await ApiCommon.getNextSeq('tb_contract_mst','contract_Date', newVal)
    }
  }
})

watch(() => form.vatType, async (newVal) => {
  if ( newVal === 'VRN' ){
    itemList.value.map(o => {
      o.vatPrice = 0
      o.totPrice = o.supplyPrice
    })
  }else{
    itemList.value.map(o => {
      o.vatPrice = calculateVAT(o.supplyPrice)
      o.totPrice = o.supplyPrice+o.vatPrice
    })
  }
})

const saveInfo = async () =>{
    const formData = new FormData();

    if ( itemList.value <= 0 ){
        vInfo("품목을 등록하세요")
        return
    }
    // if(attachFile.value <= 0 ){
    //     vInfo("산출물을 등록하세요")
    //     return
    // }

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

        const res = await ApiOrder.saveContractInfo(formData)

        console.log('res', res)
        console.log('message', res.message)

        vSuccess(res.message)
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
      etc: o.etc,
      orderDist: baseSeq + index + 1,
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
    orderTypes.value = await ApiCommon.getCodeList('order_type')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')
    statusTypes.value = await ApiCommon.getCodeList('status_Type')

    form.contractDate = todayKST()
    form.seq = await ApiCommon.getNextSeq('tb_contract_mst', 'contract_date',  form.contractDate)
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
