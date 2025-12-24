<template>
<Card style="width: 90rem; height: 8rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.orderDate" />
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
                        <InputText v-model="form.srcStorageName" class="w-full"/>
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
                    <InputText v-model="form.customerManager" class="w-full"/>
                    <label>거래처담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.vatYn"
                            :options="vatType"
                            optionLabel="codeNm"
                            optionValue="code" class="w-full" />
                    <label>부가세율적용</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="w-full flex gap-2 ml-2 mt-4">
    <div class="flex items-center gap-2">
        <Checkbox v-model="allChecked"  name="전체" value="A" />
        <label for="ingredient1">전체 </label>
    </div>
    <div>
        <Button
        label="주문서"
        @click="openPop('O')"
        />
    </div>
    <div>
        <Button
            label="품목+"
            @click="itemPop"
            />
    </div>
</div>
<div class="w-full mt-2">
    <DataTable
        :value="matItemList"
        selectionMode="single"
        class="my-table"
        show-gridlines
        >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="itemCd"    header="품목코드"  :style="{ width: '90px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"  header="품목명"    :style="{ width: '350px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.itemName"
                    class="w-full"
                    :readonly="!updateItem.includes(slotProps.data.itemCd)"
                />
            </template>
        </Column>
        <Column field="spec"      header="규격"      :style="{ width: '110px'}"  style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.spec"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="qty"        header="수량"    :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
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
        <Column field="inPrice"        header="단가"    :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
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
        <Column field="supplyPrice"        header="공급가액"   :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
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
        <Column field="vatPrice"        header="부가세"    :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }">
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
        <Column field="etc"        header="비고"    :style="{ width: '200px'}" style="text-align: right;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.etc"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                />
            </template>
        </Column>
        <Column field="actions"        header="-"    :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>

    </DataTable>
</div>
<div class="w-full">
    <DataTable
        :value= "calItemList"
        class="my-table"
        show-gridlines
        >
        <Column field="itemCd"    header="품목코드"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"  header="품목명"    :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="unit"  header="규격"    :style="{ width: '60px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="spec"      header="재고량"      :style="{ width: '100px'}"  style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
        <Column field="orderQty"  header="소요량"    :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
        <Column field="orderQty"  header="차이"    :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
        <Column field="inPrice"   header="단가"    :style="{ width: '80px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
        <Column field="itemName"  header="구매처"    :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="etc"       header="자급/사급"    :style="{ width: '100px'}" style="text-align: right;" :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
    </DataTable>

</div>

<div class="w-full flex gap-2 justify-end mt-2">
    <Button label="계산하기" severity="secondary" @click="saveInfo"/>
    <Button label="저장" class="p-button-secondary" @click="saveInfo"/>
    <Button label="닫기"   outlined class="ml-2"  @click="closeDialog"/>
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
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { calculateVAT, isEmpty, todayKST } from '@/util/common';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import StorageListPop from '@/views/basic/storage/StorageListPop.vue';
import ContractListPop from '@/views/order/contract/ContractListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { Checkbox, InputNumber, InputText, useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, shallowRef, watch } from 'vue';

const { vError, vSuccess, vWarning} = useAlertStore()
const dialog = useDialog()
const itemDialog = ref(false)
const isRead = ref(false)
const dialogRef = inject('dialogRef')
const { userId, memberNm } = useAuthStore()

const emit = defineEmits(['selected', 'close'])

const itemTypeCds = ref([])
const vatType = ref([])
const matItemList = ref([])
const calItemList = ref([])
const allChecked = ref(false)
const currentComponent = shallowRef(null)
const updateItem = ['D000004','M60038','M60040','M60041','M60043']
const form = reactive({
    orderDate:'',
    seq: 1,
    itemTypeCd: '',
    srcStorageName: '',
    srcStorageCd: '',
    managerName: memberNm,
    managerId: userId,
    deliveryDate: '',
    customerName: '',
    customerCd: '',
    customerManager: '',

    userId: userId,
})

const saveInfo = async () =>{
    const params = {
        purcharInfo : form,
        purcharList : matItemList.value,
    }

    //저장로직
}

const handleSelected = (rows) =>{
    if (!Array.isArray(rows)) return
    addRow(rows)
}

const addRow = (rows) =>{
    const rowItem = rows.map((o, index) => ({
        itemCd: o.itemCd,
        itemName : o.itemName,
        spec: o.spec,
        inPrice: o.inPrice,
        supplyPrice: o.supplyPrice,
        vatPrice: o.vatPrice,
        etc: o.etc,
    }))

    matItemList.value

    if (matItemList.value.length > 0) {
    matItemList.value.push(...rowItem);
  } else {
    matItemList.value = [...rowItem];
  }
}

const itemPop = () =>{
     itemDialog.value = true
}

const openPop = (type) =>{
    let title = '창고 목록'
    if ( type === 'C' ) {
        currentComponent.value = CustomerListPop
        title = '거래처 목록'
    }else if ( type === 'U') {
        currentComponent.value = UserListPop
        title = '사용자 목록'
    }else if ( type === 'S') {
        currentComponent.value = StorageListPop
    }else if( type === 'O') {
        title = '주문서 목록'
        currentComponent.value = ContractListPop
    }

    dialog.open( currentComponent.value, {
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
                content: { style: { overflow: 'hidden' } }
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
                    form.srcStorageCd = event.data.storageCd
                    form.srcStorageName = event.data.storageName
                }else if ( type === 'O' ){
                    addRow(event.data)
                }
            }
        }
    } )
}

watch(() => form.orderDate, async (newVal, oldVal) => {
  if ( !isEmpty(oldVal)) {
    if ( oldVal !==  newVal ){
        form.seq = await ApiCommon.getNextSeq('tb_mat_order','order_date', newVal)
    }
  }
})

const onChangeRow = (row) => {
  const orderQty = Number(row.orderQty) || 0
  const inPrice  = Number(row.inPrice)  || 0

  row.supplyPrice = orderQty * inPrice

  if ( !isEmpty(form.vatYn) &&  form.vatYn === 'VRY' ){
    row.vatPrice = calculateVAT(row.supplyPrice)
  }else{
    row.vatPrice = 0
  }

};

watch(() => form.vatYn, async (newVal) => {
  if ( form.vatType === 'VRN' ){
    matItemList.value.map(o => {
      o.vatPrice = 0
    })
  }else{
    matItemList.value.map(o => {
      o.vatPrice = calculateVAT(o.supplyPrice)
    })
  }
})

const removeRow = (idx) =>{
  matItemList.value.splice(idx, 1)
}

onMounted( async () => {
    itemTypeCds.value =await ApiCommon.getCodeList('item_type_cd')
    vatType.value = await ApiCommon.getCodeList('vat_type')

    form.orderDate = todayKST()
    form.deliveryDate = todayKST()
    //form.seq = await ApiCommon.getNextSeq('tb_mat_order', 'order_date',  form.orderDate)
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
