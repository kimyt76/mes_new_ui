<template>
<Card style="width: 90rem; height: 15rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.shipmentDate" show-icon />
                    <label>등록번호</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" readonly/> <!-- 크기 축소 -->
                    <label>연번</label>
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
                    <Select v-model="form.managedItem"
                           :options="managedItems"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>관리품</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.shipmentReqDate" show-icon  class="w-full"/>
                    <label>납품요청일</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                 <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.shipmentTime" class="w-full" />
                    <label for="on_label1">시간</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.deliveryManagerName" class="w-full"/>
                    <label>납품담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.deliveryTelno" class="w-full"/>
                    <label>납품연락처</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                 <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.deliveryLocation" class="w-full"/>
                    <label for="on_label1">납품주소(소재지)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                 <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.deliveryAddress" class="w-full" />
                    <label for="on_label1">납품주소(주소)</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.shipmentYn"
                           :options="shipmentYns"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>출고확정상태</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.shipmentType"
                           :options="shipmentTypes"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>출고조건</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid mb-2">
            <div class="col-6">
                <FloatLabel variant="on">
                    <Textarea id="on_label1" v-model="form.etc" class="w-full" rows="1"  style="resize: none;" />
                    <label for="on_label1">특이사항</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.shipmentStatus"
                           :options="shipmentStatus"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>출고유형</label>
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
    <h5 class="m-0">- 출고품목</h5>

    <div class="flex gap-2">
        <Button
            label="품목추가+"
            @click="itemOpenPop"
        />
        <Button
            label="PONO 품목추가+"
            @click="workItemOpenPop"
        />
    </div>
</div>
<div class="table-wrapper mt-2" :style="{ height: `${TABLE_BODY_HEIGHT + 40}px` }">
    <DataTable
        :value="shipmentItemList"
        class="my-table fixed-table shipment-arrow-table"
        scrollable
        :scrollHeight="`${TABLE_BODY_HEIGHT}px`"
        show-gridlines
        >
        <Column field="poNo"        header="PONO"       :style="{ width: '120px', 'text-align': 'center' }" />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', 'text-align': 'center' }" />
        <Column field="itemName"    header="품목명"     :style="{ width: '350px'}" bodyClass="break-words"></Column>
        <Column
            field="lotNo"
            header="LOT번호"
            :style="{ width: '170px', textAlign: 'center' }"
            bodyStyle="white-space:pre-line; overflow-wrap:anywhere; word-break:break-word; text-align:center"
        >
            <template #body="{ data }">
                {{ data.lotNo?.replace(/!!/g, '\n').replace(/\^/g, ' ') ?? '' }}
            </template>
        </Column>
        <Column field="makeNo"      header="제조번호"   :style="{ width: '170px', 'text-align': 'center' }" ></Column>
        <Column field="qcStatus"    header="품질상태"       :style="{ width: '80px', 'text-align': 'center' }" >
            <template #body="slotProps">
                    {{ slotProps.data.qcStatus === 'REQ' ? '시험대기'
                        : slotProps.data.qcStatus === 'ING' ? '시험중'
                        : slotProps.data.qcStatus === 'ING2' ? '검토대기'
                        : slotProps.data.qcStatus === 'ING3' ? '승인대기'
                        : slotProps.data.qcStatus === 'PASS' ? '적합'
                        : slotProps.data.qcStatus === 'FAIL' ? '부적합'
                        : '' }}
                </template>
            </Column>
        <Column field="testNo"      header="시험번호"   :style="{ width: '110px', 'text-align': 'center' }" ></Column>
        <Column field="stockQty"    header="재고수량"   :style="{ width: '100px', textAlign:'right'}" :bodyStyle="{ padding: '1'}" >
            <template #body="slotProps">{{ Number(slotProps.data.stockQty).toLocaleString() }}</template>
        </Column>
        <Column field="qty" header="출고수량"   :style="{ width: '100px'}"  :bodyStyle="{ padding: '0'}">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.qty"
                    class="w-full"
                    :data-arrow-col="'qty'"
                    :data-arrow-row="slotProps.index"
                    @keydown.capture="(event) => handleArrowKey(event, slotProps.index, 'qty')"
                    :min="0"
                    :maxFractionDigits="5"
                    :useGrouping="true"
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
                />
            </template>
        </Column>
        <Column field="pallet"          header="파렛트"       :style="{ width: '90px', textAlign:'right'}" :bodyStyle="{ padding: '0'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.pallet"
                    class="w-full"
                    :data-arrow-col="'pallet'"
                    :data-arrow-row="slotProps.index"
                    @keydown.capture="(event) => handleArrowKey(event, slotProps.index, 'pallet')"
                    :min="0"
                    :maxFractionDigits="5"
                    :useGrouping="true"
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                    @update:modelValue="() => onChangeRow(slotProps.data)"
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
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary"  :disabled="writeYn !== 'Y'" @click="saveGuard(saveInfo)" />
    <Button label="닫기"  outlined class="ml-2" @click="closeDialog" />
</div>

<Dialog
    v-model:visible="workItemDialog"
    header="품목 목록"
    :style="{ width: '100rem', height: '45rem' }"
    :contentStyle="{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '0',
        overflow: 'hidden',
        padding: '0.5rem 1rem'
    }"
  >
    <ShipmentItemListPop
        class="w-full"
        style="flex: 1 1 0; min-height: 0; min-width: 0; height: 100%; overflow: hidden;"
        :customerCd="form.customerCd"
        :clientName="form.clientName"
        @selected = "selectedRow1"
        @close = "workItemDialog = false"
        />
</Dialog>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders.js';
import CommFileUpload from '@/components/CommFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { formatDate, isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListPop from '@/views/stock/realStock/ItemListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import ClientListPop from '../client/ClientListPop.vue';
import ShipmentItemListPop from './ShipmentItemListPop.vue';

const dialog = useDialog()
const { userId } = useAuthStore()
const { vError, vSuccess, vWarning, vInfo } = useAlertStore()
const attachFile = ref([])
const dialogRef = inject('dialogRef')
// 테이블 내용 높이(px): 저장 버튼이 가려지면 200을 180, 160 등으로 줄여 확인하세요.
const TABLE_BODY_HEIGHT = 300
const shipmentItemList = ref([])
const shipmentStatus = ref([])
const shipmentTypes = ref([])
const workItemDialog = ref(false)

// 출고수량(qty), 파렛트(pallet) 입력칸에서만 방향키 이동
const handleArrowKey = (event, rowIndex, field) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return

    // 이동할 행/열이 없어도 InputNumber 기본 증감은 반드시 차단
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation?.()

    let nextRow = rowIndex
    let nextField = field

    if (event.key === 'ArrowUp') nextRow--
    else if (event.key === 'ArrowDown') nextRow++
    else if (event.key === 'ArrowLeft') nextField = 'qty'
    else if (event.key === 'ArrowRight') nextField = 'pallet'

    if (nextRow < 0 || nextRow >= shipmentItemList.value.length) return
    if (nextRow === rowIndex && nextField === field) return

    const table = event.target.closest('.shipment-arrow-table')
    const selector = `[data-arrow-col="${nextField}"][data-arrow-row="${nextRow}"] input`
    const target = table?.querySelector(selector)
    if (target) {
        target.focus()
        target.select()
        target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
}

const form = reactive({
    shipmentDate:todayKST(),
    seq:'',
    shipmentReqDate:todayKST(),
    shipmentTime: '',
    customerCd:'',
    clientName:'',
    deliveryLocation:'',
    deliveryAddress:'',
    deliveryManagerName:'',
    deliveryTelno:'',
    shipmentType:'',
    shipmentYn:'N',
    shipmentStatus:'',
    managedItem:'',
    etc:'',

    shipmentId: '',
})
const shipmentYns = ref([
    {codeNm: '진행중', code: 'N'},
    {codeNm: '출고확정', code: 'Y'},
])
const managedItems = ref([
    {codeNm: '여', code: 'Y'},
    {codeNm: '부', code: 'N'}
])


const saveInfo = async () =>{

    if (shipmentItemList.value.length === 0 ) return vWarning("출고품목을 등록하세요")
    if (isEmpty(form.customerCd) ) return vWarning("고객사를 입력하세요")
    if (isEmpty(form.shipmentYn) ) return vWarning("출고여부를 선택하세요")
    if (isEmpty(form.shipmentStatus) ) return vWarning("출고유형을 선택하세요")

    try{
        const formData = new FormData()
        const request = {
            shipmentInfo: {
                ...form,
                shipmentDate: formatDate(form.shipmentDate),
                shipmentReqDate: formatDate(form.shipmentReqDate),
            },
            shipmentItemList: shipmentItemList.value,
            attachFile: attachFile.value

        }
        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                { type: "application/json" }
            )
        )

        attachFile.value.forEach(file => {
            if (file.file instanceof File) {
                formData.append("newFiles", file.file)
            }
        })

        const res = await ApiOrder.saveShipmentInfo(formData)
        vSuccess("정상적으로 처리되었습니다.")
        closeDialog()
    }catch(err){
        handleApiError(err)
        return;
    }
}

const itemOpenPop = () =>{
    dialog.open(ItemListPop, {
        props: {
            header: '재고 품목 조회',
            modal: true,
            draggable: false,
        },
        onClose: (event) =>{
            if(event){
                selectedRow(event.data)
            }
        }
    })
}

const workItemOpenPop = () =>{
    workItemDialog.value = true
}

const selectedRow = (obj) =>{
    //품목
    if (!Array.isArray(obj)) return;

    let baseSeq = shipmentItemList.value.length;

    const selectItem = obj.map((o, index) => ({
        poNo: '',
        itemCd: o.itemCd,
        itemName: o.itemName,
        lotNo: '',
        makeNo: '',
        qcStatus: '',
        storageCd: o.storageCd,
        stockQty: o.qty,
        qty: o.qty,
        pallet: 0,
        shipmentStatus: '',
        testNo: o.testNo,
        itemTypeCd: o.itemTypeCd,
        workProcId: null,
        orderDist: baseSeq + index + 1,
    }));

    if (shipmentItemList.value.length > 0) {
        shipmentItemList.value.push(...selectItem);
    } else {
        shipmentItemList.value = [...selectItem];
    }

    reOrderDist()
}

const selectedRow1 = (obj) =>{
    //pono 품목
    if (!Array.isArray(obj)) return;

    let baseSeq = shipmentItemList.value.length;

    const selectItem = obj.map((o, index) => ({
        poNo: o.poNo,
        itemCd: o.itemCd,
        itemName: o.itemName,
        lotNo: o.lotNo,
        makeNo: o.makeNo,
        qcStatus: o.qcStatus,
        storageCd: o.storageCd,
        stockQty: o.stockQty,
        qty: o.stockQty,
        pallet: '',
        shipmentStatus: '',
        testNo: o.testNo,
        itemTypeCd: o.itemTypeCd,
        workProcId: o.workProcId,
        orderDist: baseSeq + index + 1,
    }));

    if (shipmentItemList.value.length > 0) {
        shipmentItemList.value.push(...selectItem);
    } else {
        shipmentItemList.value = [...selectItem];
    }

    reOrderDist()
}

const removeRow = (idx) =>{
    shipmentItemList.value.splice(idx, 1)
}

const reOrderDist = () =>{
    shipmentItemList.value.forEach((item, idx) => {
        item.orderDist = idx + 1
    })
}

const openPop = (type) =>{
    dialog.open (ClientListPop, {
        props: {
            header: '고객사 목록',
            modal: true,
            draggable: false,
            maximizable: false,
             style: {
                width: '100rem',
                maxHeight: 'none',
                overflow: 'hidden'
            },

            contentStyle: {
                overflow: 'hidden',
                maxHeight: 'none'
            },

            pt: {
                root: {
                    style: {
                        overflow: 'hidden',
                        maxHeight: 'none'
                    }
                },
                content: {
                    style: {
                        overflow: 'hidden',
                        maxHeight: 'none'
                    }
                }
            }
        },
        onClose: (event) => {
            form.clientName = event.data.clientName
            form.customerCd = event.data.customerCd
        }
    })
}

watch(() => form.shipmentDate, async (newVal, oldVal) => {
  if ( !isEmpty(newVal)) {
    if ( oldVal !==  newVal ){
    form.seq = await ApiCommon.getNextSeq('tb_shipment_mst','shipment_date', newVal)
    }
  }
})

onMounted( async () =>{
    shipmentTypes.value = await ApiCommon.getCodeList('shipment_type')
    shipmentStatus.value = await ApiCommon.getCodeList('shipment_status')

    form.shipmentId = dialogRef.value.data.shipmentId

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
::v-deep(.fixed-table table) {
    table-layout: fixed !important;
}
/* 출고품목 영역은 지정한 높이로 고정, 항목이 많아지면 DataTable 내부 스크롤 */
.table-wrapper {
    width: 100%;
    min-height: 0;
    overflow: hidden;
}

.table-wrapper :deep(.p-datatable-table-container) {
    overflow-y: auto !important;
    overflow-x: auto;
}
</style>
