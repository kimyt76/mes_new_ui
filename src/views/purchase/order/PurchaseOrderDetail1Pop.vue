<template>
<Card style="width: 90rem; height: 10rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.purOrderDate" readonly/>
                    <label>발주일</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }"  readonly/> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd"
                            :options="itemTypeCds"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" readonly/>
                    <label>품목구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.storageName" class="w-full"/>
                    </IconField>
                    <label>입고창고</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.managerName" class="w-full"/>
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
                            optionValue="code" class="w-full" readonly/>
                    <label>부가세율적용</label>
                </FloatLabel>
            </div>
        </div>
         <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.remark" class="w-full" :rows="1" style="resize: none;" readonly/>
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>

<div class="w-full mt-2">
    <DataTable
        :value="purchaseOrderItemList"
        selectionMode="single"
        class="my-table"
        show-gridlines
        >
        <Column field="itemCd"    header="품목코드"  :style="{ width: '90px'}" />
        <Column field="itemName"  header="품목명"    :style="{ width: '350px'}" bodyClass="break-words"/>
        <Column field="spec"      header="규격"      :style="{ width: '110px'}"/>
        <Column field="qty"        header="수량"    :style="{ width: '80px'}"  >
            <template #body="slotProps">{{ Number(slotProps.data.totQty).toLocaleString() }}</template>
        </Column>
        <Column field="inPrice"        header="단가"    :style="{ width: '80px'}" >
            <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
        </Column>
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '80px'}" >
        <template #body="slotProps">{{ Number(slotProps.data.supplyPrice).toLocaleString() }}</template>
        </Column>
        <Column field="vatPrice"        header="부가세"    :style="{ width: '80px'}" >
            <template #body="slotProps">{{ Number(slotProps.data.vatPrice).toLocaleString() }}</template>
        </Column>
        <Column field="etc"        header="비고"    :style="{ width: '200px'}" style="text-align: right;" />
    </DataTable>
</div>
<div class="w-full flex gap-2 justify-end mt-2">
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiPurchaseOrder } from '@/api/apiPurchaseOrder';
import { InputNumber, InputText } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef');
const itemTypeCds = ref([])
const vatTypes = ref([])
const purchaseOrderItemList = ref([])
const form = reactive({
    purOrderDate:'',
    seq: 0,
    itemTypeCd: '',
    storageCd: '',
    storageName: '',
    managerName: '',
    managerId: '',
    deliveryDate: '',
    customerName: '',
    customerCd: '',
    customerManagerName: '',
    remark: '',
    vatType: '',

    mailYn : '',
    printYn : '',
    inYn: '',
    endYn: '',
    areaCd: '',
    purOrderId: '',
})

onMounted( async () => {
    itemTypeCds.value =await ApiCommon.getCodeList('item_type_cd')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')

    const params = {
        itemTypeCd: dialogRef.value.data.itemTypeCd,
        purOrderId: dialogRef.value.data.id
    }

    const res = await ApiPurchaseOrder.getPurchaseOrderInfo(params)

    Object.assign(form, res.purchaseOrderInfo)
    purchaseOrderItemList.value =res.purchaseOrderItemList
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
