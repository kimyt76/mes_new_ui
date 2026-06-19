<template>
<Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
    <template #start>
        <div class="flex gap-2">
            <FloatLabel variant="on">
            <InputText
                id="on_label"
                v-model="testNo"
                style="width: 180px"
                @keyup.enter="addRow"
                />
            <label for="on_label">바코드(시험번호)</label>
            </FloatLabel>
            <Button label="초기화" class="bg-blue-500 text-white hover:bg-blue-600"  @click="init"/>
        </div>
    </template>
</Toolbar>
<div>
    <DataTable
        :value="itemList"
        scrollHeight="500px"
        class="my-table"
        showGridlines
        >
        <Column field="testNo"      header="시험번호"   :style="{ width: '120px', textAlign: 'center'}" />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"     :style="{ width: '300px'}" />
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

</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { inject, ref } from 'vue';

const dialogRef = inject('dialogRef')
const itemList = ref([])
const testNo = ref('')
const init = () =>{
    testNo.value = ''
}

const addRow = async () =>{
    const barcode = testNo.value?.trim();

    if (!barcode) {
        return vWarning('바코드 또는 시험번호를 입력해주세요.');
    }

    try {
        // API 이름은 실제 프로젝트에 맞게 변경하세요
        const res = await ApiQc.getItemTestNoInfo(barcode);

        if (!res) {
            testNo.value = '';
            return vWarning('조회된 품목이 없습니다.');
        }

        const item = {
            testNo: res.testNo,
            itemCd: res.itemCd,
            itemName: res.itemName,
            itemTypeCd: res.itemTypeCd || ''
        };

    const exists = itemList.value.some(o => o.testNo === item.testNo);

    if (exists) {
      testNo.value = '';
      return vWarning('이미 추가된 시험번호입니다.');
    }

    itemList.value.push(item);
    testNo.value = '';
  } catch (err) {
    handleApiError(err);
  }
}

const saveInfo = () =>{
    dialogRef.value.close(itemList.value);
}

const removeRow = (index) =>{
    itemList.value.splice(index, 1);
}

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
}
</style>
