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
                <DatePicker v-model="form.endDate" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">종료</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                   :options="areaCds"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">구역(공장)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.progressStatus"
                   :options="progressStatuss"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">진행상태</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.srcStorageCd"
                   :options="allStorages"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">보낸창고</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.descStorageCd"
                   :options="allStorages"
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">받는창고</label>
            </FloatLabel>


            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-between gap-2 mb-2">
     <!-- 왼쪽: 총 건수 -->
    <div class="font-semibold ml-2">
        총 {{ totalCount }} 건
    </div>
    <!-- 오른쪽: 버튼 -->
    <div class="flex items-center gap-2">
        <Button label="이동요청"  icon="pi pi-plus"  severity="secondary" @click="moveReq"></Button>
        <Button label="이동등록"   @click="moveInsert"></Button>
        <Button label="이동확인"  @click="moveConfirm"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>

<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="moveReqList"

        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        class="my-table"
        showGridlines
     >
        <Column selectionMode="multiple" headerStyle="width: 2.5rem" style="text-align: center;"/>
         <Column field="moveReqDateSeq" header="일자-No"    :style="{ width: '80px'}" />
         <Column field="srcStorage"     header="보내는창고" :style="{ width: '80px'}" />
         <Column field="descStorage"    header="받는창고"   :style="{ width: '80px'}" />
         <Column field="itemName"       header="품목명"     :style="{ width: '80px'}" />
         <Column field="reqdetail"      header="요청내용"   :style="{ width: '80px'}" />
         <Column field="qty"            header="수량"       :style="{ width: '80px'}" />
         <Column field="managerName"    header="담당자명"  :style="{ width: '80px'}" />
         <Column field="progressStatus" header="진행상태"  :style="{ width: '80px'}" />
         <Column field="move"           header="이동"       :style="{ width: '80px'}" />
         <Column field="confirm"        header="확인"       :style="{ width: '80px'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystems } from '@/api/apiSystem';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';

const dialog = useDialog()
const totalCount = computed(() => {
  return Array.isArray(moveReqList.value) ? moveReqList.value.length : 0
})
const areaCds  = ref([])
const moveReqList = ref([])
const selectedItem = ref([])
const allStorages = ref([]); // 전체 창고(18건)
// const filteredStorages = computed(() => {
//   if (!form.areaCd) return [];
//   return allStorages.value.filter(s => s.areaCd === form.areaCd);
// });
// const storages = computed(() => filteredStorages.value);
const progressStatuss = ref([
    { code: 'R', codeNm: '요청' },
    { code: 'I', codeNm: '진행' },
    { code: 'E', codeNm: '종료' },
])

const form = reactive({
    strDate: null,
    endDate: null,
    areaCd: null,
    progressStatus: null,
    srcStorageCd: null,
    descStorageCd: null,
    itemName: null,
    itemCd: null,
})


const moveReq = () =>{
    dialog.open( '',{
        props:{
            header: '이동요청 등록',
            modal: true,
            draggable: true,

        },
        onClose: (evnet) =>{
            srhList();
        }
    })
}

const moveInsert = () =>{

}

const moveConfirm =() =>{


}
const srhList = async () =>{
    const params = {
        ...form
    }

    moveReqList.value = await ApiStock.getMoveReqList(params)
}

onMounted( async () =>{
    form.strDate = minMonth(todayKST(), 3)
    form.endDate =  addMonth(todayKST(), 1)

    areaCds.value = await ApiCommon.getCodeList('area')
    allStorages.value = await ApiSystems.getStorageCodeList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '재고관리' },
    { label: '자재이동요청' },
    { label: '자재이동요청 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(moveReqList.value, "자재이동요청 리스트", cols);
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
