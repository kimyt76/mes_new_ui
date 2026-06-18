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
                <Select v-model="form.moveStatus"
                    :options="moveStatuss"
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
        <Button label="신규"  icon="pi pi-plus"  severity="secondary" @click="openMovePop('N')"></Button>
        <Button label="이동확인"  @click="openMoveConfirmPop('B')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        dataKey="moveStockId"
        :value="moveStockList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        class="my-table"
        showGridlines
     >
        <Column selectionMode="multiple" headerStyle="width: 1rem" style="text-align: center;"/>
         <Column field="moveReqDateSeq" header="일자-No"    :style="{ width: '100px', textAlign: 'center' }" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.moveStockId)" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.moveReqDateSeq }}
                </div>
            </template>
        </Column>
         <Column field="srcStorageName" header="보내는창고" :style="{ width: '100px', textAlign: 'center'}" />
         <Column field="tarStorageName" header="받는창고"   :style="{ width: '100px', textAlign: 'center'}" />
         <Column field="itemName"       header="품목명"     :style="{ width: '300px'}" />
         <Column field="qty"            header="수량"       :style="{ width: '80px', textAlign: 'right'}" />
         <Column field="managerName"    header="담당자명"   :style="{ width: '70px', textAlign: 'center'}" />
         <Column field="etc"            header="비고"       :style="{ width: '320px'}" />
         <Column field="moveStatusName" header="진행상태"   :style="{ width: '60px', textAlign: 'center'}" >
            <template #body="slotProps">
                 <!-- 등록 -->
                <span v-if="slotProps.data.moveStatus === 'Q'"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[요청]
                </span>
                 <!-- 진행 -->
                <span v-if="slotProps.data.moveStatus === 'I'"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[진행]
                </span>
                 <!-- 완료 -->
                <span v-if="slotProps.data.moveStatus === 'C'"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[완료]
                </span>
            </template>
        </Column>
         <Column field="confirm"        header="확인"       :style="{ width: '50px', textAlign: 'center'}" >
            <template #body="slotProps">
                 <!-- 등록 -->
                <span v-if="slotProps.data.moveStatus === 'Q' || slotProps.data.moveStatus === 'I'" @click="openMoveConfirmPop(slotProps.data.moveStockId)"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[등록]
                </span>
                <!-- 완료 -->
                <span v-else-if="slotProps.data.moveStatus === 'C'"
                    style="
                        color: #999;
                        font-weight: bold;
                        cursor: default;
                        "
                    >[완료]
                </span>
            </template>
        </Column>
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiSystem } from '@/api/apiSystem';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import MoveStockCompfirmPop from '@/views/stock/material/moveStock/MoveStockCompfirmPop.vue';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import MoveStockPop from './MoveStockPop.vue';


const { vSuccess, vInfo, vWarning} = useAlertStore()
const moveStockList = ref([])
const moveStatuss = ref([])
const selectedItem = ref([])
const allStorages = ref([]); // 전체 창고(18건)
const dt = ref(null)
const dialog = useDialog()
const totalCount = computed(() => {
  return Array.isArray(moveStockList.value) ? moveStockList.value.length : 0
})

const form = reactive({
    strDate: minMonth(todayKST(), 2),
    endDate: addMonth(todayKST(), 1 ),
    moveStatus: null,
    srcStorageCd: null,
    descStorageCd: null,
    itemName: null,
    itemCd: null
})

const selectRowClick = (id) =>{
    openMovePop(id)
}

const openMovePop = (id) =>{
    dialog.open(MoveStockPop, {
        props: {
            header: id === 'N' ? '자재이동 등록' : '자재이동 수정',
            modal: true,
            draggable: true,
            resizable: false,
            width: '800px',
        },
        data:{
            moveStockId: id === 'N' ? null : id
        }
        ,onClose: () => {
            srhList()
        }
    })
}

const openMoveConfirmPop = (id) =>{
    if (id === 'B' &&  selectedItem.value.length === 0 ) {
        return vWarning('확인할 자재이동을 선택해주세요.')
    }else{
        id = selectedItem.value[0].moveStockId
    }

    dialog.open(MoveStockCompfirmPop, {
        props:{
            header: '자재이동 확인',
            modal: true,
            draggable: true,
            resizable: false,
        }
        ,data:{
            moveStockId: id
        }
        ,onClose: () => {
            srhList()
        }
    })
}

const srhList = async () => {
    const params = {
        ...form
    }

    //moveStockList.value = await ApiStock.getMoveStockList(params)
}

const handleDateChange = () =>{

}

onMounted(async () => {
    moveStatuss.value = await ApiCommon.getCodeList('MOVE_STATUS')
    allStorages.value = await ApiSystem.getStorageCodeList()
    await srhList()
})

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '재고관리' },
    { label: '자재이동' },
    { label: '자재이동 목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(moveStockList.value, "자재이동 리스트", cols);
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
</style>e
