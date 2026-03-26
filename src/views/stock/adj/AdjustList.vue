<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <DatePicker v-model="form.strDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">시작</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="form.toDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.tranCd" :options="tranCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 150px"
                />
                <label for="on_label">처리구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.storageCd" :options="allStorages"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 180px"
                />
                <label for="on_label">창고</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 200px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="adjustList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        selectionMode="single"
        class="my-table"
        >
        <Column header="No." :style="{ width: '30px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + (dt?.first ?? 0) }}
            </template>
        </Column>
        <Column selectionMode="multiple"    headerStyle="width: 2rem" style="text-align: center;"></Column>
        <Column field="orderDateSeq"        header="일자"    :style="{ width: '110px', textAlign:'center'}" />
        <Column field="orderDate"           header="처리구분"  :style="{ width: '80px', textAlign:'center'}" />
        <Column field="storageName"         header="창고"     :style="{ width: '80px', textAlign:'center'}" />
        <Column field="itemName"            header="품목"    :style="{ width: '350px'}" bodyClass="break-words">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="managerName"     header="담당자"  :style="{ width: '90px', textAlign:'center'}" />
        <Column field="orderQty"        header="발주수량"   :style="{ width: '80px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.orderQty).toLocaleString() }}</template>
        </Column>
        <Column field="etc"  header="비고"  :style="{ width: '150px', textAlign:'center'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystems } from '@/api/apiSystem';
import { addMonth, isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import AdjustPop from './AdjustPop.vue';

const dialog = useDialog()
const selectedItem = ref([])
const adjustList = ref([])
const tranCds = ref([])
const allStorages = ref([]); // 전체 창고(18건)

const totalCount = computed(() => {
  return Array.isArray(adjustList.value) ? adjustList.value.length : 0
})

const form = reactive({
    strDate: '',
    toDate: '',
    storageCd: '',
    itemName: '',
    itemCd:'',
})

const selectRowClick = (id) =>{
    let title = ''

    if ( isEmpty(id) ){
        title = '자재조정 등록'
    } else{
        title = '자재조정 상세'
    }

    dialog.open(AdjustPop, {
        props: {
            header:title,
            modal:true,
            draggable: true,
        },
        data: id,
        onClose: (event) =>{
            srhList()
        }
    })
}

const srhList = async () =>{
    const params = {
        ...form
    }

    adjustList.value = await ApiStock.getAdjustList(params)
}

onMounted( async () =>{
    form.strDate = minMonth(todayKST(), 2)
    form.toDate = addMonth(todayKST(), 1)

    allStorages.value = await ApiSystems.getStorageCodeList()
    tranCds.value = (await ApiCommon.getCodeList('tran_cd')).filter(i => ['P','Q', 'R','S','T','U','V','W', 'X'].includes(i.code)  )
})


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '자재조정' },
    { label: '자재조정 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(adjustList.value, "자재조정 리스트", cols);
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
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}

</style>
