<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DateRangePicker
                v-model:startDate="form.strDate"
                v-model:endDate="form.endDate"
                start-label="실사재고시작일"
                end-label="실사재고종료일"
                @change="handleDateChange"
            />
            <FloatLabel variant="on">
                <Select
                    v-model="form.areaCd"
                    :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                />
                <label>구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select
                    v-model="form.storageName"
                    :options="filteredStorages"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                />
                <label>창고</label>
            </FloatLabel>



            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="newPop"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="realStockList"
        dataKey="stockId"
        scrollHeight="700px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="realStockDate"       header="일자"    :style="{ width: '110px', textAlign:'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data)">
                    {{ slotProps.data.realStockDate }}
                </div>
            </template>
        </Column>
        <Column field="itemTypeName"    header="구분"    :style="{ width: '110px', textAlign:'center'}" />
        <Column field="itemName"        header="품명"    :style="{ width: '300px'}"/>
        <Column field="storageName"     header="창고"    :style="{ width: '120px', textAlign:'center'}" />
        <Column field="managerName"     header="담당자"  :style="{ width: '110px', textAlign:'center'}" />
        <Column field="areaName"        header="공장"    :style="{ width: '100px', textAlign:'center'}" />
        <Column field="docStockQty"     header="장부수량"   :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.docStockQty).toLocaleString() }}</template>
        </Column>
        <Column field="reqlStockQty"    header="실사수량"   :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.reqlStockQty).toLocaleString() }}</template>
        </Column>
        <Column field="diffStockQty"   header="차이"   :style="{ width: '80px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.diffStockQty).toLocaleString() }}</template>
        </Column>
        <Column field="endYn"     header="마감상태"   :style="{ width: '100px', textAlign:'center'}">
            <template #body="slotProps">
                <span
                    :class="{ 'status-editable': slotProps.data.endYn === 'N' }"
                    :style="{
                        cursor: slotProps.data.endYn === 'N' ? 'pointer' : 'default'
                    }"
                    @click="slotProps.data.endYn === 'N' && updateComplete(slotProps.data)"
                >
                    {{ slotProps.data.endYn === 'Y' ? '완료' : '미완료' }}
                </span>
            </template>
        </Column>
    </DataTable>
</div>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import { minMonth, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler.js';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import RealStockItemPop from './RealStockItemPop.vue';
import RealStockPop from './RealStockPop.vue';

const dialog = useDialog();
const areaCds = ref([]);
const realStockList = ref([]);
const allStorages = ref([]);
const filteredStorages = computed(() => {
    if (!form.areaCd) return [];
    return allStorages.value.filter(s => s.areaCd === form.areaCd);
});
const form = reactive({
    strDate: minMonth(todayKST(), 1),
    endDate: todayKST(),
    itemCd: '',
    itemName: '',
    areaCd: '',
    storageName: '',
});
const handleDateChange = () =>{
}

const selectRowClick = (row) =>{
    stockItemPop(row.realStockMstId, row.endYn)
}

const updateComplete = async (row) =>{
    try{
        const res = await ApiStock.saveRealStockComplete(row.realStockMstId)
        srhList()
    }catch(err){
        handleApiError(err)
    }
}

const newPop = () =>{
    dialog.open(RealStockPop, {
        props:{
            header:'실사재고등록',
            modal: true,
            draggable: false,
        },
        onClose:(event)=>{
            const realStockMstId = event?.data?.realStockMstId
            //console.log('realStockMstId', realStockMstId)
            if (realStockMstId) {
                stockItemPop(realStockMstId, 'N')
            }
        }
    } )
}

const stockItemPop = (id, endYn) =>{
    dialog.open(RealStockItemPop, {
        props:{
            header:'실사재고등록',
            modal: true,
            draggable: false,
            style: {
                width: '1200px',
            }
        },
        data:{
            realStockMstId: id,
            endYn: endYn,
        },
        onClose:(event)=>{
            srhList()
        }
    } )
}

const srhList = async () =>{
    const params = {
        ...form
    }

    realStockList.value = await ApiStock.getRealStockList(params)
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    allStorages.value = await ApiSystem.getStorageCodeList()
    srhList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '재고관리' },
    { label: '재고조사' },
    { label: '재고조사 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(realStockList.value, "재고조사 리스트", cols);
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
.status-editable {
    color: #2563eb;
    cursor: pointer;
    font-weight: 600;
}
</style>
