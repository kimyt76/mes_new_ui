<template>
<Card style="width: 70rem; height: 11rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mt-1 mb-1">
            <div class="col-4 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.moveStockDate" inputId="on_label" showIcon iconDisplay="input" />
                    <label>이동등록일</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
                    <label>연번</label>
                </FloatLabel>
            </div>
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
                    <InputText v-model="form.managerName" class="w-full" />
                    <label>이동등록자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid">
            <div class="col-4">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.comfirmerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('U')" />
                    </IconField>
                    <label>확인자</label>
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
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.comfirmYn"
                        :options="comfirmYns"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>승인상태</label>
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
<div class="mt-3">
    <DataTable
        :value="moveStockList"
        class="my-table"
        scrollHeight="500px"
        showGridlines
        >
        <Column field="testNo"    header="시험번호" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemCd"    header="품목코드" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemName"  header="품목명"   style="width: 440px" />
        <Column field="qty"       header="수량" :style="{ width: '110px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.qty).toLocaleString() }}
            </template>
       </Column>
    </DataTable>
</div>
<div class="flex justify-end gap-2 mt-2">
    <Button label="저장" severity="success" @click="saveInfo"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>
</template>

<script setup>
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const { vSuccess, vWarning} = useAlertStore()
const { memberNm, userId} = useAuthStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const moveStockList = ref([])
const allStorages = ref([])
const comfirmYns = ref([])

const form = reactive({
    moveStockDate: '',
    seq:'',
    managerId:userId,
    managerName:memberNm,
    srcStorageCd: '',
    tarStorageCd: '',
    etc: '',
    comfirmYn: '',

    typeCd: 'T',
    moveStockId: '',
})

const saveInfo = async () =>{
    if( isEmpty(form.comfirmYn)) return vWarning('승인상태를 선택하세요.')
    if( isEmpty(form.comfirmId)) return vWarning('승인자를 등록하세요.')

    try{
        const param = {
            ...form
        }
        const res = await ApiStock.saveMoveStockComfirm(param)
        vSuccess('승인되었습니다.')
        closeDialog()

    }catch(err){
        handleApiError(err)
    }
}

const openPop = () =>{
    dialog.open(UserListPop, {
        props:{
            header: '승인자 검색',
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

onMounted(async () =>{
    allStorages.value = await ApiSystem.getStorageCodeList()

    form.moveStockId = dialogRef.value.data.moveStockId
    const res = await ApiStock.getMoveStockInfo(form.moveStockId)

    Object.assign(form, res.moveStockInfo)
    moveStockList.value = res.moveItemList
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
