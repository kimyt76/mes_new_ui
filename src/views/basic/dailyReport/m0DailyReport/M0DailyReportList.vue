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
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary"  @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:first="first"
        :value="m2DailyReportList"
        dataKey="dailyId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        class="my-table"
        scrollHeight="650px"
        scrollable
        showGridlines
        >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="dailyDate"    header="생산일자"  :style="{ width: '120px', textAlign:'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data)" class="clickable-cell">
                    {{ slotProps.data.dailyDate }}
                </div>
            </template>
        </Column>
        <Column field="inQty"         header="입고량"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.inQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="outQty"         header="외주생산내역"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.outQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="outExpense"         header="외주생산비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.outExpense ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="returnQty"         header="반품량"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.returnQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="discardQty"         header="불량량"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.discardQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="shipmentQty"         header="출하"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.shipmentQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="regId" header="등록자"  :style="{ width: '100px', textAlign:'center'}"  />
        <Column field="endYn" header="마감여부" :style="{ width: '80px', textAlign: 'center' }" >
            <template #body="slotProps">
                <span v-if="slotProps.data.endYn === 'Y'" > 마감 </span>
                <span v-else class="end-progress" @click="updateEndYn(slotProps.data)" > 진행중 </span>
            </template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { useAlertStore } from '@/stores/alert.js';
import { isEmpty, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { reactive, ref } from 'vue';
import M0DailyReportPop from './M0DailyReportPop.vue';

const dt = ref(null);
const first = ref(null);
const {vSuccess} = useAlertStore()
const dialog = useDialog()
const m2DailyReportList = ref([])
const form = reactive({
    strDate: todayKST(),
    endDate: todayKST(),
})
const handleDateChange = () =>{
}
const selectRowClick = (row) => {
    // Handle row selection logic here
    let title =''

    if (isEmpty(row)) {
        title = '완제품생산일보 등록'
    } else {
        title = '완제품생산일보 상세'
    }

    dialog.open(M0DailyReportPop, {
       props: {
            title: title,
            modal: true,
            draggable: true,
            style: {
                width: '92vw',
                maxWidth: '1850px',
                overflow: 'hidden'
            },
            pt: {
                headerActions: {
                    style: {
                        marginLeft: 'auto'
                    }
                },
                content: {
                    style: {
                        padding: '4px 8px',
                        maxHeight: 'calc(90vh - 4rem)',
                        overflow: 'auto'
                    }
                }
            }
        },
        data: {
            dailyId : row.dailyId || null,
            endYn : row.endYn || 'N',
        },onClose: () => {
            // srhList()
       }
    })
}

const updateEndYn = async (row) =>{
    try{
        const params = {
            dailyId: row.dailyId,
            endYn: 'Y',
        }

        const res = await ApiBase.updateDailyReportEndYn(params)
        vSuccess('마감되었습니다.')
        srhList()
    }catch(err){
        handleApiError(err)
    }
}

const srhList = async () => {
    const params = {
        strDate: form.strDate,
        endDate: form.endDate,
    }
    m2DailyReportList.value = await ApiBase.getM0DailyReportList(params)
}

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(m2DailyReportList.value, "완제품생산일보 리스트", cols);
}


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '생산일보' },
    { label: '완제품생산일보' },
    { label: '완제품생산일보 목록' },
]);
</script>

<style  scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: center;
}
.end-progress {
    cursor: pointer;
    color: #2563eb;
    text-decoration: underline;
    font-weight: 600;
}

.end-progress:hover {
    opacity: 0.7;
}
</style>
