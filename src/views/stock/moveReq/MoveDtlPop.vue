<template>
<Card style="width: 80rem; height: 12rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mt-1 mb-1">
            <div class="col-4 flex align-items-center gap-2">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.moveReqDate" inputId="on_label" showIcon iconDisplay="input" />
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
                    <InputText v-model="form.managerName" class="w-full" />
                    <label>담당자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid">
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.areaCd"
                    :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>구역(공장)</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.srcStorageCd"
                        :options="storages"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>보내는 창고</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.tarStorageCd"
                        :options="storages"
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
<div class="mt-3">
    <DataTable
        :value="itemList"
        class="my-table"
        showGridlines=""
        >
        <Column field="itemCd"      header="품목코드" style="width: 120px"/>
        <Column field="itemName"    header="품목명" style="width: 400px"/>
        <Column field="qty"         header="수량" style="width: 100px">
            <template #body="slotProps">
                {{ slotProps.data.qty }}
            </template>
        </Column>
        <Column field="etc" header="적요" style="width: 150px">
            <template #body="slotProps">
                {{ slotProps.data.etc }}
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex justify-end gap-2 mt-2">
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef');
const itemList = ref([])
const areaCds = ref([])
const allStorages = ref([]); // 전체 창고(18건)
const filteredStorages = computed(() => {
  if (!form.areaCd) return [];
  return allStorages.value.filter(s => s.areaCd === form.areaCd);
});

const storages = computed(() => filteredStorages.value);

const form = reactive({
    moveReqDate: '',
    seq: '',
    areaCd: '',
    srcStorageCd: '',
    tarStorageCd: '',
    managerId: '',
    managerName: '',
    memo: '',
    etc: '',

    managerName: '',
    moveReqId: '',
})

onMounted( async ()=>{
   areaCds.value = await ApiCommon.getCodeList('area')
   allStorages.value = await ApiSystem.getStorageCodeList()

   const selectedItems = dialogRef.value?.data?.selectedItems || [];
   const moveReqIds = selectedItems
        .map(item => item.moveReqId)
        .filter(id => id !== undefined && id !== null && id !== '');
const res = await ApiStock.getMoveReqInfo(moveReqIds)
console.log("res.value", res)

   Object.assign(form, res.moveReqInfo)
   itemList.value = res.procItemList
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
