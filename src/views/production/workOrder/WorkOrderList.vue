<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <DatePicker v-model="form.strDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">시작일자</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="form.toDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료일자</label>
            </FloatLabel>
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
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                <label for="on_label1">거래처명</label>
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
        <Button label="신규" icon="pi pi-plus" severity="secondary"  @click="selectRowClick('')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        :value="workOrderList"
        dataKey="workOrderId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width: 100rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="workOrderDateSeq"    header="일자-No"   :style="{ width: '120px', textAlign:'center'}" />
        <Column field="areaName"            header="구역"     :style="{ width: '70px', textAlign:'center'}" />
        <Column field="poNo"                header="PO NO"     :style="{ width: '110px', textAlign:'center'}" />
        <Column field="itemName"            header="품목명"    :style="{ width: '280px'}" bodyClass="break-words"  >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workOrderId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="matOrderDate"        header="제조일자"    :style="{ width: '80px', textAlign:'center'}" />
        <Column field="deliveryQty"         header="주문량"     :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ (slotProps.data.deliveryQty ?? 0).toLocaleString() }}
            </template>
        </Column>
        <Column field="batchCnt"            header="등록배치수"  :style="{ width: '80px', textAlign:'right'}" />
        <Column field="clientName"          header="거래처명"    :style="{ width: '200px'}" />
        <Column field="managerName"         header="담당자명"   :style="{ width: '90px', textAlign:'center'}" />
        <Column field="etc"                 header="비고"       :style="{ width: '150px'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiWorkOrder } from '@/api/apiWorkOrder';
import { addMonth, isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import WorkOrderDetail from './WorkOrderDetail.vue';

const totalCount = computed(() => workOrderList.value.length)
const dialog = useDialog()
const areaCds = ref([])
const workOrderList = ref([])
const dt = ref(null)
const form  =reactive({
    strDate: '',
    toDate: '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    clientName: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }
    workOrderList.value = await ApiWorkOrder.getWorkOrderList(params)
}

const selectRowClick = (id) =>{
    let title = '작업지시 등록'

    if (!isEmpty(id)) {
        title = '작업지시 상세'
    }
    dialog.open( WorkOrderDetail, {
        props:{
            header: title,
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

    form.strDate = minMonth( todayKST(), -3)
    form.toDate = addMonth( todayKST(), 1)
    srhList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '작업지시' },
    { label: '작업지시' },
    { label: '작업지시목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(workOrderList.value, "작업지시 리스트", cols);
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
