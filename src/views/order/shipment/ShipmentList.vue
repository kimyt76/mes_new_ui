<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" />
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.managerName" />
                <label for="on_label1">담당자</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-between mb-2">
        <!-- 왼쪽: 총 건수 -->
        <div class="font-semibold">
            총 {{ totalCount }} 건
        </div>

        <!-- 오른쪽: 버튼 -->
        <div class="flex items-center gap-2">
            <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick" />
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
        </div>
    </div>
<div>
    <DataTable
        :value="shipmentList"
        paginator :rows="20"
        dataKey="shipmentId"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="shipmentDateSeq" header="일자-No."  :style="{ width: '100px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"        header="품목명"    :style="{ width: '430px', textAlign: 'left'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="clientName"  header="고객사명"  :style="{ width: '200px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="managerName" header="담당자명"  :style="{ width: '90px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="totQty"      header="수량합계"  :style="{ width: '80px', textAlign: 'right'}" :pt="{ columnHeaderContent: 'justify-center' }" >
            <template #body="slotProps">
                {{ Number(slotProps.data.totQty).toLocaleString() }}
            </template>
        </Column>
        <Column field="dueDate"         header="출하예정일" :style="{ width: '90px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="releaseTiem"     header="출고시간"   :style="{ width: '120px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="descStorageName" header="창고명"     :style="{ width: '150px', textAlign:'left'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="printYn"         header="인쇄"       :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }">
             <template #body="slotProps">
                <p style="padding: 4px;
                    text-align: center;
                    cursor: pointer;"
                    :style="{backgroundColor: slotProps.data.printYn === 'Y' ? '#FFAB91' : 'transparent'}"
                    @click="onPrint"
                    >인쇄
                </p>
            </template>
        </Column>
        <Column field="shipmentId"      header="판매"       :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div
                    style="cursor: pointer; text-decoration: underline; width: 95%;"
                    @click="goShipmentItem"
                >
                판매
                </div>
            </template>
        </Column>
    </DataTable>
</div>



</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, reactive, ref } from 'vue';
import ShipmentDetailPop from './ShipmentDetailPop.vue';

const dialog = useDialog()
const totalCount = computed(() => shipmentList.value.length)
const dt = ref(null);
const shipmentList = ref([])

const form = reactive({
    itemName: '',
    managerName: '',
    clientName: '',
})

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    shipmentList.value = await ApiOrder.getShipmentList(params);
}

const selectRowClick = (id) =>{
    let title = ''

    if ( isEmpty(id)) {
        title = '출하 신규'
    }else {
        title = '출하 상세'
    }

    dialog.open( ShipmentDetailPop, {
        props: {
        header: title,
        modal: true,
        maximizable: false,
        draggable: true,
        style: { overflow: 'hidden' },
        pt: {
          root: { style: { overflow: 'hidden' } },
          content: { style: { overflow: 'hidden' } }
        }
      },
      data: id,
      onclose : (event) =>{
        //여기다가 후속 로직
      }
    })
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '출하관리' },
    { label: '출하목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(shipmentList.value, "출하 리스트", cols);
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
