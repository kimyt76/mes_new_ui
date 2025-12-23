<template>
<Card style="width: 90rem; height: 10rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.itemCd" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('I')" />
                    </IconField>
                    <label>품목코드</label>
                </FloatLabel>
                </div>
                <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-full" />
                    <label>품목명</label>
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
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                <IconField iconPosition="left">
                <InputText v-model="form.clientName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('C')" />
                </IconField>
                <label>고객사</label>
            </FloatLabel>
            </div>
            <div class="col-3">
            <FloatLabel variant="on">
                <InputText v-model="form.bomVer" class="w-full"  readonly/>
                <label>BOM 버전</label>
            </FloatLabel>
            </div>
            <div class="col-3">
            <FloatLabel variant="on">
                <InputNumber v-model="form.qty" class="w-full"  readonly/>
                <label>기본수량</label>
            </FloatLabel>
            </div>
            <div class="col-3">
            <FloatLabel variant="on">
                <Textarea v-model="form.etc" rows="1" class="w-full" style="resize: none"/>
                <label>비고</label>
            </FloatLabel>
            </div>
        </div>
    </template>
</Card>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 원료구성정보</h5>
    <div class="flex justify-end gap-2">
    <Button
        label="추가+"
        @click="addRow"
        class="p-button-xm"
    />
    </div>
</div>
<div class="w-full" ref="tableWrapper">
    <DataTable
        :value="recipeList"
        dataKey="orderDist"
        scrollHeight="300px"
        show-gridlines
        scrollable
        class="my-table fixed-datatable"
    >
        <Column field="orderDist"       header="No."       :style="{ width: '40px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="realItemCd"      header="품목코드"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="realItemName"    header="품목명"    :style="{ width: '500px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }"></Column>
        <Column field="qty"     header="수량"    :style="{ width: '100px'}"  style="text-align: right;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.qty"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '100px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="etc" header="적요"    :style="{ width: '240px'}" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.etc"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="actions" header="-"    :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" severity="secondary" @click="saveInfo"></Button>
    <Button label="닫기" @click="closeDialog"></Button>
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
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import ClientListPop from '@/views/order/client/ClientListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, shallowRef } from 'vue';

const  { userId } = useAuthStore()
const {   vSuccess, vInfo} = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const currentComponet = shallowRef(null)
const approvalStates = ref([])
const recipeList = ref([])
const itemDialog = ref(false)
const form = reactive({
    itemCd:'',
    itemName: '',
    clientName:'',
    clientId: '',
    managerName: '',
    managerId: '',
    etc: '',
    bomVer: '',
    qty: '',
    approvalState: 'Y',
    bomId : '',
    userId: userId,
})

const saveInfo = async () =>{
    try{
        const params = {
            bomInfo : form,
            bomRecipeList : recipeList.value,
        }

        const msg = await ApiLab.saveBomInfo(params)
        vSuccess(msg.data.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const handleSelected = (obj) =>{
    addRow(obj)
}

const openPop = (type) =>{
    let title = ''

    if ( type === 'C' ) {
        title = '고객사 목록'
        currentComponet.value = ClientListPop
    }else if (type === 'U') {
        title = '담당자 목록'
        currentComponet.value = UserListPop
    }else if (type === 'I') {
        title = '품목 목록'
        currentComponet.value = ItemListSinglePop
    }

    dialog.open( currentComponet.value, {
        props: {
            header: title,
            modal: true,
            draggable: true,
            maximizable: false,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
         onClose:(event) => {
            if (!event || !event.data) return;

            if ( type === 'C' ) {
                form.clientId = event.data.clientId
                form.clientName = event.data.clientName
            }else if (type === 'U') {
                form.managerId = event.data.userId
                form.managerName = event.data.memberNm
            }else if (type === 'I') {
                form.itemCd = event.data.itemCd
                form.itemName = event.data.itemName
            }
        },
    })
}

const recipeSort = () =>{
     // 5) orderDist 재정렬 (1부터)
  recipeList.value.forEach((row, idx) => {
    row.orderDist = idx + 1
  })
}

const addRow = ()=>{

}

const removeRow = (index) =>{
    recipeList.value.splice(index,1)
}

onMounted( async () =>{
    approvalStates.value = await ApiCommon.getCodeList('approval_state')
    form.bomId = dialogRef.value.data

    if ( !isEmpty(form.bomId)){
        const res = await ApiLab.getBomInfo(form.bomId)

        Object.assign(form, res.bomInfo)
        recipeList.value = res.bomRecipeList
        recipeSort()
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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8px 6px 0.2rem 0.1rem;
  font-size: 16px;
  text-align: center;
  font-family: monaco, Consolas;
}
.fixed-datatable {
  height: 300px;
}

.fixed-datatable .p-datatable-wrapper {
  height: calc(300px - 42px) !important; /* 헤더 높이 42px 정도 */
}

.footer-cell {
  color: black;                 /* 글자색 */
  height: 15px;                /* ★ 높이 조절 */
  line-height: 15px;           /* 가운데 정렬 */
  font-weight: bold;
  font-size: medium;
  text-align: right;
  padding-right: 1px;
}
.p-datatable-tfoot > tr > td {
  background-color: gray !important;
  color: white !important;
  font-weight: bold;
  height: 35px;
}

</style>
