<template>
<Card style="width: 70rem; height: 11rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mt-1 mb-1">
            <div class="col-4 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.tranDate" inputId="on_label" showIcon iconDisplay="input" />
                    <label>요청일</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.managerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('U')" />
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid">
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.srcStorageCd"
                        :options="allStorages"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>보내는 창고</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.tarStorageCd"
                        :options="allStorages"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>받는 창고</label>
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
        :value="itemList"
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
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import QrCodeSimplePop from '@/views/common/QrCodeSimplePop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const { vSuccess, vWarning} = useAlertStore()
const { memberNm, userId} = useAuthStore()
const itemDialog = ref(false)
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const itemList = ref([])
const allStorages = ref([])

const form = reactive({
    tranDate: '',
    seq:'',
    managerId:userId,
    managerName:memberNm,
    srcStorageCd: '',
    tarStorageCd: '',
    etc: '',

    tranTypeCd: 'L',
    tranId: '',
})

const saveInfo = async () =>{
    if( form.srcStorageCd === '' || form.tarStorageCd === '' ) return vWarning('보내는 창고와 받는 창고를 선택해주세요.')
    if( form.srcStorageCd === form.tarStorageCd ) return vWarning('보내는 창고와 받는 창고가 동일합니다.')
    if( itemList.value.length <= 0 ) return vWarning('이동 요청할 품목을 추가해주세요.')

    try{
        const param = {
            tranInfo: form,
            tranItemList: itemList.value
        }
        const res = await ApiStock.saveItemOutInfo(param)
        vSuccess('자재불출이 완료되었습니다.')
        closeDialog()

    }catch(err){
        handleApiError(err)
    }
}

const handleSelected = (row) =>{
    addRow(row)
}

const itemOpenPop = () =>{
    itemDialog.value = true
}

const openPop = () =>{
    dialog.open(UserListPop, {
        props:{
            header: '담당자 검색',
            modal,
            draggable: false
        },
        onClose: (event) =>{
            if (event.data){
                form.managerId = event.data.userId
                form.managerName = event.data.memberNm
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

const addRow = (row) =>{
     const rowItem = row.map((o, index) => ({
        itemCd: o.itemCd,
        itemName: o.itemName,
        testNo: o.testNo ||'',
        qty: 0,
        etc: '',
        itemTypeCd: o.itemTypeCd ||''
  }));

  if (itemList.value.length > 0) {
    itemList.value.push(...rowItem);
  } else {
    itemList.value = [...rowItem];
  }
}

const removeRow = (index) =>{
    if (!isEmpty(form.tranId)) return vWarning('저장된 품목은 삭제할 수 없습니다. 자재조정에서 조정해주세요')

    itemList.value.splice(index, 1);
}

onMounted(async () =>{
    allStorages.value = await ApiSystem.getStorageCodeList()

    form.tranId = dialogRef.value.data.tranId

     if( isEmpty(form.tranId)) {
         form.tranDate = todayKST()
         form.seq = await ApiCommon.getNextSeq('tb_inv_tran_mst', 'tran_date', form.tranDate )
     }else{
        const res = await ApiStock.getItemOutInfo(form.tranId)

        Object.assign(form, res.tranInfo)
        itemList.value = res.tranItemList
    }
})

const closeDialog = () => {
  dialogRef.value.close();
};


</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}
</style>
