<template>
<Breadcrumb :home="home" :model="items"/>
    <div>
        <DataTable
            :value="matMonitoringList"
            scrollHeight="820px"
            scrollable
            showGridlines
            :rowClass="getRowClass"
            class="my-table"
        >
            <Column field="areaName"    header="구역"  :style="{ width: '80px', textAlign:'center'}" />
            <Column field="equipmentCd" header="설비코드"  :style="{ width: '100px', textAlign:'center'}" />
            <Column field="equipmentName" header="설비명"  :style="{ width: '180px', textAlign:'center'}"/>
            <Column field="itemCd"      header="품목코드"  :style="{ width: '120px', textAlign:'center'}" >
                <template #body="slotProps">
                        {{ slotProps.data.itemCd && Number(slotProps.data.itemCd) !== ''
                            ? slotProps.data.itemCd
                            : '-'
                        }}
                    </template>
            </Column>
            <Column field="itemName"    header="품목명"  :style="{ width: '400px'}" bodyClass="break-words">
                <template #body="slotProps">
                        {{ slotProps.data.itemName && Number(slotProps.data.itemName) !== ''
                            ? slotProps.data.itemName
                            : '-'
                        }}
                    </template>
            </Column>
            <Column field="prodQty"     header="제조량"  :style="{ width: '120px', textAlign:'center'}" >
                <template #body="slotProps">
                    {{ slotProps.data.prodQty && Number(slotProps.data.prodQty) !== 0
                        ? `${formatNumber(slotProps.data.prodQty)} kg`
                        : '-'
                    }}
                </template>
            </Column>
            <Column field="workProcId" header="가동상태"  :style="{ width: '100px', textAlign:'center'}">
                <template #body="slotProps">
                    {{ slotProps.data.workProcId ? '가동' : '비가동' }}
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<script setup>
import { ApiMonitoring } from '@/api/apiMonitoring';
import { onMounted, ref } from 'vue';

const matMonitoringList = ref([])

onMounted( async () =>{
    const res = await ApiMonitoring.getMatMonitoring();
console.log('res', res)
    matMonitoringList.value = res
})

const getRowClass = (row) => {
    return row.workProcId
        ? 'row-running'
        : 'row-stop'
}

const home = ref({
  icon: 'pi pi-home',
});

const items = ref([
  { label: '모니터링' },
  { label: '모니터링' },
  { label: '제조모니터링' },
]);
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

/* 비가동 Row */
:deep(.p-datatable-tbody > tr.row-stop > td) {
    background-color: #eeeeee !important;
    color: #616161 !important;
}

/* 가동 Row */
:deep(.p-datatable-tbody > tr.row-running > td) {
    background-color: #e8f5e9 !important;
    color: #1b5e20 !important;
    font-weight: 600;
}

/* 가동 상태 */
.status-running {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;

    background-color: #2e7d32;
    color: white;

    font-weight: 700;
}

/* 비가동 상태 */
.status-stop {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;

    background-color: #757575;
    color: white;

    font-weight: 600;
}
</style>
