<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 150px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 250px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.managerName" style="width: 250px" />
                <label for="on_label1">담당자</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select id="on_label1"
                    v-model="form.statusType"
                    :options="statusTypes"
                    optionLabel="codeNm"
                    optionValue="code"
                    />
                <label for="on_label1">진행상태</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success"  @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        paginator :rows="20"
        :value="saleList"
        dataKey="saleId"
        :rowsPerPageOptions="[20,30,40]"
        scrollable
        scrollHeight="650px"
        showGridlines
        class="my-table"
        >
        <Column field="saleDateSeq"     header="제품명"    :style="{ width: '140px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="itemName"        header="품목명"    :style="{ width: '400px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div
                    style="cursor: pointer; text-decoration: underline;"
                    @click="selectRowClick(slotProps.data.saleId)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="managerName"         header="담당자"    :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="clientName"          header="거래처명"    :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="totPrice"            header="금액합계"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="transactionTypeName" header="거래유형"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="descStorageName"     header="창고명"  :style="{ width: '110px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="contractId"          header="주문서"  :style="{ width: '40px'}" :pt="{ columnHeaderContent: 'justify-center' }">

        </Column>
        <Column field="printYn"         header="인쇄"  :style="{ width: '50px'}" :pt="{ columnHeaderContent: 'justify-center' }">

        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const dialog = useDialog()
const recipeList = ref([])
const statusTypes = ref([])
const dt = ref(null)
const form = reactive({
    itemName:'',
    managerName: '',
    clientName: '',
    statusType : '',
})

const srhList = async () =>{
    const params = {
    ...form
  }

  recipeList.value = await ApiOrder.getSaleList(params)
}

const selectRowClick = (id) => {
    let title = '판매 등록'

    if ( !isEmpty(id) ) {
        title = '판매 상세'
    }

    dialog.open(RecipeDetailPop, {
        props: {
        header: title,
        modal: true,
        maximizable: false,
        draggable: true,
        style: {
            overflow: 'hidden'
            },
        pt: {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } }
        }
        // 반응형 너비 설정 (선택 사항)
        //   breakpoints:{
        //     '960px':'75vw',
        //     '640px':'90vw'
        //   }
        },
        // 팝업 A로 전달할 데이터 (선택 사항)
        data: id,
        onClose: async (data) => {
        // 팝업이 닫힐 때 실행할 작업 (선택 사항)
            await srhList()
        }

    })
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '판매관리' },
    { label: '판매목록' },
]);

onMounted( async () => {
  statusTypes.value = await ApiCommon.getCodeList('status_type')
})


const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(recipeList.value, "판매 리스트", cols);
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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8.5px 7px 0.3rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

</style>
