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


</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { isEmpty, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { reactive, ref } from 'vue';
import M2DailyReportPop from './M2DailyReportPop.vue';

const dt = ref(null);
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
        title = '부자재생산일보 등록'
    } else {
        title = '부자재생산일보 상세'
    }

    dialog.open(M2DailyReportPop, {
       props:{
            title: title,
            modal: true,
            draggable: true,
             style: {
                overflow: 'hidden'
                },
            pt: {
                content: {
                    style: {
                        maxHeight: 'calc(90vh - 4rem)', // 헤더/푸터 높이 제외 영역
                        overflow: 'auto',               // 🔥 스크롤 활성화
                    }
                },
            },
       },
       data: {
        dailyId : row.dailyId,
       },onClose: () => {
            //
            // srhList()
       }
    })

}

const srhList = async () => {
    const params = {
        strDate: form.strDate,
        endDate: form.endDate,
    }
    m2DailyReportList.value = await ApiBase.getM1DailyReportList(params)
}

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(m2DailyReportList.value, "부자재생산일보 리스트", cols);
}


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '생산일보' },
    { label: '부자재생산일보' },
    { label: '부자재생산일보 목록' },
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
