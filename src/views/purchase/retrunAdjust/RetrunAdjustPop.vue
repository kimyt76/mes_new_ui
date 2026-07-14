<template>
<Card style="width: 75rem; height: 8rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mt-1 mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on" class="date-field">
                    <DatePicker
                        v-model="form.tranDate"
                        inputId="tranDate"
                        showIcon
                        iconDisplay="input"
                        class="date-picker"
                    />
                    <label for="tranDate">일자</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on" class="seq-field">
                    <InputNumber
                        v-model="form.seq"
                        inputId="seq"
                        :inputStyle="{ width: '50px', textAlign: 'center' }"
                    />
                    <label for="seq">연번</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.managerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('U')" />
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.tranTypeCd" :options="tranTypeCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                <label for="on_label">처리구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.srcStorageName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('S')" />
                    </IconField>
                    <label>창고</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" rows="1" class="w-full" autoResize />
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="flex justify-end mt-3 gap-2">
    <Button label="바코드" severity="secondary" @click="qrCodeSimplePop"></Button>
    <Button label="품목추가" severity="secondary" @click="itemOpenPop"></Button>
</div>

<div class="mt-3">
    <DataTable
        :value="adjustItemList"
        class="my-table"
        scrollHeight="500px"
        showGridlines
        >
        <Column field="itemCd"    header="품목코드" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemName"  header="품목명"   style="width: 380px" />
        <Column field="testNo"    header="시험번호" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="qty"       header="수량" :style="{ width: '110px', textAlign: 'right'}" :bodyStyle="{ padding: '0', textAlign: 'right' }" :headerStyle="{ padding: '0' }">
            <template #body="slotProps">
                <InputNumber v-model="slotProps.data.qty" :inputStyle="{ width: '110px', textAlign: 'right' }" class="w-full"/>
            </template>
       </Column>
        <Column field="actions"     header="-"    :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex justify-end gap-2 mt-2">
    <Button label="저장" severity="success" @click="saveInfo"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>

    <Dialog
        v-model:visible="itemDialog"
        header="품목 조회"
        modal
        :draggable="true"
        :resizable="false"
        >
        <ItemListMultiPop
            @selected = "handleSelected"
            @close="itemDialog = false"
            />
    </Dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiStock } from '@/api/apiStock'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { isEmpty, todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue'
import QrCodeSimplePop from '@/views/common/QrCodeSimplePop.vue'
import StorageListPop from '@/views/system/storage/StorageListPop.vue'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { useDialog } from 'primevue'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning, vInfo } = useAlertStore()
const { userId, memberNm } = useAuthStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const tranTypeCds = ref([])
const adjustItemList = ref([])
const itemDialog = ref(false)
const form = reactive({
    tranDate: '',
    seq:  0,
    tranTypeCd: 'P',
    managerName: memberNm,
    managerId: userId,
    srcStorageCd: '',
    srcStorageName: '',
    etc: '',

    tranId: '',
})

const itemOpenPop = () =>{
    itemDialog.value = true
}

const handleSelected = (row) =>{
    addRow(row)
}

const addRow = (row) =>{
    const rows = Array.isArray(row) ? row : [row];

     const rowItem = rows.map((o, index) => ({
        itemCd: o.itemCd,
        itemName: o.itemName,
        testNo: o.testNo ||'',
        qty: 0,
        etc: '',
        itemTypeCd: o.itemTypeCd ||''
  }));

  if (adjustItemList.value.length > 0) {
    adjustItemList.value.push(...rowItem);
  } else {
    adjustItemList.value = [...rowItem];
  }
}

const removeRow = (index) =>{
    if ( !isEmpty(form.tranId)  ) return vWarning('저장된 품목은 삭제할수 없습니다. 관리자에게 문의하세요')
    adjustItemList.value.splice(index, 1)
}


const openPop = (type) =>{
    let title = ''
    let componetPop = ''

    if ( type === 'U') {
        title = '담당자 조회'
        componetPop = UserListPop
    }else{
        title = '창고 조회'
        componetPop = StorageListPop
    }

    dialog.open(componetPop, {
        props:{
            header: title,
            modal: true,
            draggable: false
        },
        onClose: (event) =>{
            if(event.data){
                if ( type === 'U') {
                    form.managerId = event.data.userId
                    form.managerName = event.data.memberNm
                }else{
                    form.srcStorageCd = event.data.storageCd
                    form.srcStorageName = event.data.storageName
                }
            }
        }
    })
}

const qrCodeSimplePop = () =>{
    dialog.open(QrCodeSimplePop, {
        props:{
            header: '바코드(시험번호) 품목선택 ',
            modal: true,
            draggable: false,
        },
        onClose : (event) =>{
            if ( event) {
                addRow(event.data)
            }
        }
    })
}

const saveInfo = async () =>{

    if ( isEmpty(form.managerId)  ) return vWarning("담당자를 등록하세요!!")
    if ( isEmpty(form.srcStorageCd)  ) return vWarning("창고를 선택하세요!!")

    try{
        const params = {
            adjustInfo : form,
            adjustItemList : adjustItemList.value,
        }

        const res = await ApiStock.saveAdjust(params)
        vSuccess(res.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}


onMounted( async ()=>{
    tranTypeCds.value = (await ApiCommon.getCodeList('tran_cd')).filter(i => ['P'].includes(i.code)  )

    form.tranId =  dialogRef.value.data

    if ( isEmpty(form.tranId)) {
        form.tranDate = todayKST()
        form.seq = await ApiCommon.getNextSeq('tb_inv_tran_mst','tran_date', form.tranDate)
    }else{
        const res = await ApiStock.getAdjustInfo(form.tranId)
        Object.assign(form, res.adjustInfo)
        adjustItemList.value = res.adjustItemList
    }
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
.date-field {
    width: 170px;
    flex: 0 0 170px;
}

.date-field :deep(.p-datepicker) {
    width: 170px;
}

.date-field :deep(.p-inputtext) {
    width: 170px;
}

</style>
