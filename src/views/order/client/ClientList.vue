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
                <InputText id="on_label1" v-model="form.clientName" style="width: 200px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.businessNo" style="width: 180px" />
                <label for="on_label1">사업자번호</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.saleManagerName" style="width: 180px" />
                <label for="on_label1">영업담당자</label>
            </FloatLabel>

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
        :value="clientList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width: 100rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="rowNum"          header="No."        style="text-align: center;"    :style="{ width: '30px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="businessNo"      header="고객사코드"  style="text-align: center;"        :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"    header="고객사명"  frozen  :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.clientId)" class="clickable-cell">
                    {{ slotProps.data.clientName }}
                </div>
            </template>
        </Column>
        <Column field="president"           header="대표자명"      style="text-align: center;"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="saleManagerName"     header="영업담자명"    style="text-align: center;"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="paymentCondition"    header="결제조건"      style="text-align: center;"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="firstDelaDate"       header="최초거래일자"  style="text-align: center;"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="tradeType"           header="거래구분"     style="text-align: center;"   :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { reactive, ref } from 'vue';
import ClientDetailPop from './ClientDetailPop.vue';

const dialog = useDialog()
const clientList = ref([])
const dt = ref(null)
const form  =reactive({
  strDate: '',
  toDate: '',
  clientName : '',
  saleManagerName: '',
  businessNo: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }
    clientList.value = await ApiBase.getClientList(params)
}

const selectRowClick = (id) =>{
    let title = '고객사 등록'

    if (!isEmpty(id)) {
        title = '고객사 상세'
    }
    dialog.open( ClientDetailPop, {
        props:{
            header: title,
            width: '700px',
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

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '고객사관리' },
    { label: '고객사목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(customerList.value, "고객사 리스트", cols);
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
}

</style>
