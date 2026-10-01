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
                <Select v-model="form.areaCd"
                 :options="areaCds"
                 optionLabel="codeNm" optionValue="code"
                 style="width: 150px"
                />
                <label for="on_label1">구역</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.workTypeCd"
                 :options="workTypeCds"
                 optionLabel="codeNm" optionValue="code"
                 style="width: 150px"
                />
                <label for="on_label1">작업유형</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary"  @click="newPop"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>

<div>
    <DataTable
        ref="dt"
        v-model:first="first"
        :value="laborCostList"
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
        <Column field="dailyDate"    header="생산일자"  :style="{ width: '120px', textAlign:'right'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data)" class="clickable-cell">
                    {{ slotProps.data.dailyDate }}
                </div>
            </template>
        </Column>
        <Column field="areaName"      header="구역"  :style="{ width: '100px', textAlign:'center'}"/>
        <Column field="workTypeCd"      header="근무형태" :style="{ width: '100px', textAlign: 'center' }">
            <template #body="slotProps">
                {{
                     slotProps.data.workTypeCd === 'D' ? '주간'
                    : slotProps.data.workTypeCd === 'O' ? '잔업'
                    : slotProps.data.workTypeCd === 'N' ? '야간'
                    : ''
                }}
            </template>
        </Column>
        <Column field="manFTotalCost"       header="정규직인원(남) 비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.manFTotalCost ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="manDTotalCost"       header="일용직인원(남) 비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.manDTotalCost ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="womFTotalCost"       header="정규직인원(여) 비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.womFTotalCost ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="womDTotalCost"       header="일용직인원(여) 비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.womDTotalCost ?? 0).toLocaleString() }}
            </template>
        </Column>
         <Column field="totalCost"         header="총비용"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.totalCost ?? 0).toLocaleString() }}
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
import { ApiCommon } from '@/api/apiCommon.js';
import { useAlertStore } from '@/stores/alert.js';
import { formatDate, minMonth, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import LaborCostPop from './LaborCostPop.vue';

const dt = ref(null);
const first = ref(null);
const {vSuccess} = useAlertStore()
const dialog = useDialog()
const laborCostList = ref([])
const areaCds = ref([])
const workTypeCds = ref([
    {code: 'D', codeNm: '주간'},
    {code: 'O', codeNm: '잔업'},
    {code: 'N', codeNm: '야간'},
])

const form = reactive({
    strDate: minMonth(todayKST(), 1),
    endDate: todayKST(),
    workTypeCd: null,
    areaCd: null,

    typeCd: 'C',
    dailyId: '',
})

const handleDateChange = () =>{}

const srhList = async () => {
    const params = {
        ...form,
        strDate: formatDate(form.strDate),
        endDate: formatDate(form.endDate),
    }
    laborCostList.value = await ApiBase.getDailyLaborCostList(params)

    console.log('srhList', laborCostList.value)
}


const updateEndYn = async (row) =>{
    try{
        const params = {
            dailyId: row.dailyId,
            endYn: 'Y',
        }

        const res = await ApiBase.updateDailyReportEndYn(params)
        vSuccess('마감 되었습니다.')
        srhList()
    }catch(err){
        handleApiError(err)
    }
}


const newPop = (area) =>{
    let title =''

     dialog.open(LaborCostPop, {
       props: {
            header: '인건비 현황',
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
            dailyId : null,
            endYn : 'N',
            areaCd: area,
        },onClose: () => {
            //
            // srhList()
       }
    })

}
const selectRowClick = (row) => {
    // Handle row selection logic here
    dialog.open(LaborCostPop, {
       props: {
            title: '인건비 생산일보 상세',
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
            dailyId : row.dailyId,
            endYn : row.endYn,
        },onClose: () => {
            //
            // srhList()
       }
    })
}

onMounted (async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
})


const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(laborCostList.value, "인건비 생산일보 리스트", cols);
}


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '생산일보' },
    { label: '인건비 생산일보' },
    { label: '인건비 생산일보 목록' },
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
  text-align: left;
}
</style>
