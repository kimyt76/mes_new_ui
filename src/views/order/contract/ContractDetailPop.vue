<template>
<Card style="width: 100rem; height: 8rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.contractDate"   readonly />
                    <label>주문일자</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" readonly/> <!-- 크기 축소 -->
                    <label>연번</label>
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
             <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.vatType" :options="vatTypes"
                            optionLabel="codeNm" optionValue="code" class="w-full" />
                    <label>거래유형</label>
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
                    <IconField iconPosition="left">
                        <InputText v-model="form.clientNo" class="w-full"/>
                    </IconField>
                    <label>고객사 코드</label>
                </FloatLabel>
            </div>
            <div class="col-3 flex align-items-center">
                <div class="flex align-items-center gap-2">
                    <Checkbox
                        v-model="form.setYn"
                        inputId="setYn"
                        trueValue="Y"
                        falseValue="N"
                        binary
                    />
                    <label for="setYn" class="cursor-pointer">세트 여부</label>
                </div>
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
<div class="w-full mt-2">
    <DataTable
        :value="itemList"
        class="my-table"
        scroll-height="400px"
        show-gridlines
        >
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', 'text-align': 'center' }" />
        <Column field="itemName"    header="품목명"     :style="{ width: '350px'}" bodyClass="break-words"></Column>
        <Column field="spec"        header="규격"       :style="{ width: '80px', 'text-align': 'center' }" ></Column>
        <Column field="prodType"    header="제품유형"   :style="{ width: '150px', 'text-align': 'center' }" />
        <Column field="orderType"   header="수주유형"   :style="{ width: '100px', 'text-align': 'center' }" :bodyStyle="{ padding: '0'}" >
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.orderType"
                    :options="orderTypes"
                    optionValue="code"
                    optionLabel="codeNm"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="qty"         header="수량"       :style="{ width: '140px'}" :bodyStyle="{ padding: '0'}" >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.qty"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '120px', 'text-align': 'right' }"
                         @update:modelValue="() => onChangeRow(slotProps.data)"
                    />
                </template>
        </Column>
        <Column field="unitPrice" header="단가"    :style="{ width: '120px'}"  :bodyStyle="{ padding: '0'}">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.unitPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
        </Column>
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '140px'}"  :bodyStyle="{ padding: '0'}">
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
        <Column field="vatPrice"        header="부가세"    :style="{ width: '120px'}" :bodyStyle="{ padding: '0'}">
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
        <Column field="totPrice"        header="합계"    :style="{ width: '170px'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.totPrice"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '150px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="degree"          header="차수"       :style="{ width: '70px', 'text-align': 'center'}"></Column>
        <Column field="deliveryReqDate" header="납기요청일"  :style="{ width: '140px'}" :bodyStyle="{ padding: '0'}" >
            <template #body="slotProps">
                <DatePicker v-model="slotProps.data.deliveryReqDate" show-icon :inputStyle="{ width: '100px', 'text-align': 'center' }"/>
            </template>
        </Column>
        <Column field="statusType"  header="진행상태"   :style="{ width: '120px', textAlign:'center'}" :bodyStyle="{ padding: '0'}">
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.statusType"
                    class="w-full"
                    :options="statusTypes"
                    option-label="codeNm"
                    option-value="code"
                />
            </template>
        </Column>
        <Column field="etc"         header="비고"       :style="{ width: '130px'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.etc" class="w-full" />
            </template>
        </Column>
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

</template>


<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import CommFileUpload from '@/components/CommFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { calculateVAT, formatDate } from '@/util/common';
import ClientListPop from '@/views/order/client/ClientListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, shallowRef } from 'vue';


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

const form = reactive({
    contractDate: '',
    seq:'',
    clientName:'',
    clientId:'',
    clientNo:'',
    managerName:'',
    managerId:'',
    vatType:'',
    attachFileId: '',
    setYn: '',

    etc: '',

    contractId: '',
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

const saveInfo = async () => {
    if (itemList.value.length <= 0) {
        vInfo('품목을 등록하세요')
        return
    }

    try {
        const formData = new FormData()

        const deleteFiles = []
        const keptFiles = []

        attachFile.value.forEach(f => {
            if (f.flag === 'N' && f.file instanceof File) {
                formData.append('newFiles', f.file, f.file.name)
            } else if (f.flag === 'D') {
                deleteFiles.push({
                    attachFileId: f.attachFileId,
                    seq: f.seq
                })
            } else if (f.flag === 'S') {
                keptFiles.push({
                    attachFileId: f.attachFileId,
                    seq: f.seq
                })
            }
        })

        const request = {
            contractInfo: {
                ...form
            },
            itemList: itemList.value.map(row => ({
                ...row,
                deliveryReqDate: formatDate(row.deliveryReqDate)
            })),
            deleteFiles,
            keptFiles
        }

        formData.append(
            'request',
            new Blob(
                [JSON.stringify(request)],
                { type: 'application/json' }
            )
        )

        const res = await ApiOrder.updateContractInfo(formData)

        vSuccess(res.message)
        closeDialog()
    } catch (err) {
        vError(err.message)
    }
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

    const res = await ApiOrder.getContractInfo(dialogRef.value.data)
    Object.assign(form, res.contractInfo)
    itemList.value = res.itemList

    if (res.attachFileInfo !== null) {
        attachFile.value = initServerFiles(res.attachFileInfo)
    } else {
        attachFile.value = [];  // 없을 경우 초기화도 필요할 수 있음
    }
})

const initServerFiles = (list) =>
  (list || []).map(f => ({ ...f, flag: 'S' }))

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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 5px 5px 0.1rem 0.1rem;
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
