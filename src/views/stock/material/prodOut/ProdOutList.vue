<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DateRangePicker
                v-model:startDate="form.strDate"
                v-model:endDate="form.endDate"
                @change="handleDateChange"
            />
            <FloatLabel variant="on">
                <Select v-model="form.areaCd" :options="areaCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 150px"
                />
                <label for="on_label">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.storageCd" :options="filteredStorages"
                   optionLabel="codeNm"
                   optionValue="code"
                    style="width: 180px"
                />
                <label for="on_label">출고창고</label>
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
        :value="prodOutList"
        dataKey="tranId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        selectionMode="single"
        class="my-table"
        >
        <Column field="tranDateSeq"     header="일자"    :style="{ width: '110px', textAlign:'center'}" />
        <Column field="srcStorageName"  header="출고창고" :style="{ width: '100px', textAlign:'center'}" />
        <Column field="clientName"      header="출고처"  :style="{ width: '250px', textAlign:'center'}" />
        <Column field="itemName"        header="품목"    :style="{ width: '400px'}" bodyClass="break-words">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.tranId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="qty"             header="수량"   :style="{ width: '80px', textAlign:'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.qty).toLocaleString() }}
            </template>
        </Column>
        <Column field="managerName"     header="담당자"  :style="{ width: '90px', textAlign:'center'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock.js';
import { ApiSystem } from '@/api/apiSystem';
import { addMonth, isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import ProdOutPop from './ProdOutPop.vue';

const dt = ref(null)
const dialog = useDialog()
const prodOutList = ref([])
const areaCds = ref([]);
const allStorages = ref([]); // 전체 창고(18건)
const filteredStorages = computed(() => {
  if (!form.areaCd) return [];

  if (form.areaCd === 'A001') {
    return allStorages.value.filter(
      s => ['WS004', 'WS005'].includes(s.code)
    );
  }

  if (form.areaCd === 'A002') {
    return allStorages.value.filter(
      s => ['WA004', 'WA005'].includes(s.code)
    );
  }
    if (form.areaCd === 'A003') {
    return allStorages.value.filter(
      s => ['WE001', 'WE002', 'WE004'].includes(s.code)
    );
  }
  return [];
});
const form = reactive({
    strDate: minMonth(todayKST(), 2),
    endDate: addMonth(todayKST(), 1),
    areaCd: 'A001',
    storageCd: '',
    itemCd: '',
    itemName: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }

    prodOutList.value = await ApiStock.getProdOutList(params)
}
const selectRowClick = (id) =>{
    let title = ''

    if ( isEmpty(id) ){
        title = '제품출고 등록'
    } else{
        title = '제품출고 상세'
    }

    dialog.open(ProdOutPop, {
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
const handleDateChange = () =>{

}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    allStorages.value = await ApiSystem.getStorageCodeList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '자재관리' },
    { label: '제품출고' },
    { label: '제품줄고 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(prodOutList.value, "제품출고 리스트", cols);
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
</style>
