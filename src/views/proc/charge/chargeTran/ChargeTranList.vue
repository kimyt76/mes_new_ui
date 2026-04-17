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
                <InputText id="on_label" v-model="form.itemName" />
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <!-- <Button label="신규" icon="pi pi-file-excel"  @click="openPop('')"></Button> -->
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        :value="procTranList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column field="poNo"       header="PO No"       :style="{ width: '110px', textAlign: 'center'}" ></Column>
        <Column field="tranDate"   header="일자"        :style="{ width: '100px', textAlign: 'center'}" >
            <template #body="slotProps">
                <div @click="openPop(slotProps.data.tranId)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.tranDate }}
                </div>
            </template>
        </Column>
        <Column field="areaCd"      header="구역"           :style="{ width: '80px', textAlign: 'center'}" ></Column>
        <Column field="storageCd"   header="작업처"         :style="{ width: '110px', textAlign: 'center'}" ></Column>
        <Column field="lotNo"       header="1차포장(LOT)"   :style="{ width: '150px', textAlign: 'center'}" ></Column>
        <Column field="lotNo2"      header="2차포장(LOT)"   :style="{ width: '150px', textAlign: 'center'}" ></Column>
        <Column field="itemCd"      header="품목코드"       :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"         :style="{ width: '350px'}" bodyClass="break-words"  ></Column>
        <Column field="tranOutItems"    header="출고품목"       :style="{ width: '180px'}" />
        <Column field="qty"         header="수량"           :style="{ width: '70px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import TranPop from '../../common/TranPop.vue';

const dialog = useDialog()
const dt = ref(null);
const procTranList = ref([])
const form = reactive({
    strDate: minMonth(todayKST()),
    endDate: todayKST(),
    itemCd: '',
    itemName: '',
    procCd: 'PRC004'
})

const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    procTranList.value = await ApiProc.getProcTranList(params);
}

const handleDateChange = () =>{

}

const openPop = (id) =>{
    dialog.open( TranPop,{
        props:{
            header: '제조출고',
            modal: true,
            draggable: false,
            width: '800px',
            height: '600px',
        },
        data: {
            tranId: id,
            procCd: form.procCd
        },
        onClose: () =>{
            //srhList()
        }
    })
}

onMounted(() => {
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '충전공정' },
    { label: '제조출고' },
    { label: '제조출고목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(procTranList.value, "제조출고 리스트(칭량)", cols);
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
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  /* text-decoration: underline;
  cursor: pointer; */
}
</style>
