<template>
<Card style="width: 90rem; height: 7rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.tranDate"/>
                    <label>일자</label>
                </FloatLabel>
                <span class="center-dash">-</span>
                <FloatLabel variant="on">
                    <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" /> <!-- 크기 축소 -->
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
                    <IconField iconPosition="left">
                        <InputText v-model="form.fromStorageName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('S')"/>
                    </IconField>
                    <label>보낸창고</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.toStorageName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('S')"/>
                    </IconField>
                    <label>받은창고</label>
                </FloatLabel>
            </div>
        </div>
         <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" class="w-full" :rows="1" style="resize: none;"/>
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<!-- <div class="w-full flex gap-2 ml-2 mt-4">
    <div>
        <Button label="바코드" @click="itemPop('B')"/>
    </div>
    <div>
        <Button label="품목+" @click="itemPop('I')"/>
    </div>
</div> -->
<div class="w-full mt-3">
    <DataTable
        :value="itemTranList"
        class="my-table"
        show-gridlines
        scrollable
        scroll-height="500px"
        >
        <Column selectionMode="multiple" headerStyle="width: 2rem" style="text-align: center;"></Column>
        <Column field="itemCd"    header="품목코드"  :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="itemName"  header="품목명"    :style="{ width: '300px'}" bodyClass="break-words"></Column>
        <Column field="lotNo"      header="로트(제조)번호"      :style="{ width: '120px'}"/>
        <Column field="testNo"      header="시험번호"      :style="{ width: '120px', textAlign: 'center' }"/>
        <Column field="qty"        header="수량"    :style="{ width: '80px', textAlign: 'right'}"  >
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="etc"        header="비고"    :style="{ width: '150px'}">
        </Column>
<!--
        <Column field="actions"        header="-"    :style="{ width: '20px'}" style="text-align: center;" >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
         -->
    </DataTable>
</div>
<div class="w-full flex gap-2 justify-end mt-2">
    <!-- <Button label="저장" class="p-button-secondary" @click="saveInfo"/> -->
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
</div>
</template>

<script setup>
import { ApiTran } from '@/api/apiTran';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef')
const itemTranList = ref([])
const form = reactive({
    tranDate: null,
    seq: null,
    managerName: '',
    managerId: '',
    fromStorageName: '',
    fromStorageCd: '',
    toStorageName: '',
    toStorageCd: '',
    etc: '',

    tranId:'',
})

onMounted(async()=>{
    form.tranId = dialogRef.value.options.data?.tranId || ''
    if (form.tranId) {
       const res = await ApiTran.getTranInfo(form.tranId)

       Object.assign(form, res.tranInfo)
       itemTranList.value = res.tranItemList
    }else{
        // form.tranDate = todayKST()
        // form.seq = await ApiCommon.getNextSeq('tb_purm_order_mst', 'pur_order_date',  form.purOrderDate)
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
  padding: 8px;
}
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  /* text-decoration: underline;
  cursor: pointer; */
}
</style>
