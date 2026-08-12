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
                <label for="on_label1">생산처(공장)</label>
             </FloatLabel>

            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemName" style="width: 200px" />
                <label for="on_label1">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 180px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-between mb-2">
    <!-- 왼쪽: 총 건수 -->
    <div class="font-semibold ml-2">
        총 {{ totalCount }} 건
    </div>
    <!-- 오른쪽: 버튼 -->
    <div class="flex items-center gap-2">
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        :value="workOrderList"
        dataKey="workBatchId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="table-layout: fixed;"
        class="my-table"
        >
        <Column field="poNo"                header="PO NO"      :style="{ width: '130px', textAlign:'center'}" />
        <Column field="workOrderDateSeq"    header="일자-No"    :style="{ width: '120px', textAlign:'center'}" />
        <Column field="areaName"            header="구역"       :style="{ width: '80px', textAlign:'center'}" />
        <Column field="itemName"            header="품목명"     :style="{ width: '380px'}" bodyClass="break-words"  >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workOrderId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="orderDist"           header="배치번호"   :style="{ width: '80px', textAlign:'center'}" />
        <Column field="makeNo"              header="제조번호"   :style="{ width: '100px', textAlign:'center'}" />
        <Column field="lotNo"               header="로트번호"   :style="{ width: '100px', textAlign:'center'}" bodyClass="break-words"/>
        <Column field="batchStatusName"     header="배치상태"   :style="{ width: '90px', textAlign:'center'}" />
        <Column field="weighOrderDate"      header="칭량일자"   :style="{ width: '100px', textAlign:'center'}" />
        <Column field="matOrderDate"        header="제조일자"   :style="{ width: '100px', textAlign:'center'}" />
        <Column field="coatingOrderDate"    header="코팅일자"   :style="{ width: '100px', textAlign:'center'}" />
        <Column field="chargeOrderDate"     header="충전일자"   :style="{ width: '100px', textAlign:'center'}" />
        <Column field="packingOrderDate"    header="포장일자"   :style="{ width: '100px', textAlign:'center'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiWorkOrder } from '@/api/apiWorkOrder';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import WorkOrderDetail from './WorkOrderDetail.vue';

const selectItems = ref([])
const totalCount = computed(() => workOrderList.value.length)
const dialog = useDialog()
const areaCds = ref([])
const workOrderList = ref([])
const dt = ref(null)
const form  =reactive({
    strDate: minMonth( todayKST(), 7),
    endDate: addMonth( todayKST(), 2),
    areaCd: '',
    itemName: '',
    itemCd: '',
})

const handleDateChange = () =>{
}

const srhList = async () =>{
    selectItems.value = []
    const params = {
        ...form
    }
    workOrderList.value = await ApiWorkOrder.getWorkOrderProgressList(params)
}

const selectRowClick = (id) =>{
    dialog.open( WorkOrderDetail, {
        props:{
            header: '작업지시 상세',
            width: '700px',
            modal: true,
            closeOnEscape: false,
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
            closable: true,
            resizable: false,
        },
        // 팝업 B에 전달할 데이터
        data: id,
        onClose:(event) => {
            // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.
            srhList()
        },
    })
}

onMounted( async () =>{
    areaCds.value = (await ApiCommon.getCodeList('area'))
      .filter(i => !['A003'].includes(i.code))
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '작업지시' },
    { label: '작업지시현황' },
    { label: '작업지시현황 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(workOrderList.value, "작업지시현황 리스트", cols);
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

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}

</style>
