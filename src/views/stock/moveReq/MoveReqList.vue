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
                   optionLabel="codeNm"
                   optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">구역(공장)</label>
            </FloatLabel>
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
        <Button label="이동등록"  icon="pi pi-plus"  severity="secondary" @click="moveInsert"></Button>
        <Button label="이동확인"  @click="moveConfirm"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>

<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        dataKey="moveReqId"
        :value="moveReqList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        class="my-table"
        showGridlines
     >
        <Column selectionMode="multiple" headerStyle="width: 1rem" style="text-align: center;"/>
         <Column field="moveReqDateSeq" header="일자-No"    :style="{ width: '100px', textAlign: 'center' }" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data)" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.moveReqDateSeq }}
                </div>
            </template>
        </Column>
         <Column field="srcStorageName" header="보내는창고" :style="{ width: '100px', textAlign: 'center'}" />
         <Column field="tarStorageName" header="받는창고"   :style="{ width: '100px', textAlign: 'center'}" />
         <Column field="itemName"       header="품목명"     :style="{ width: '300px'}" />
         <Column field="memo"           header="요청내용"   :style="{ width: '320px'}" />
         <Column field="qty"            header="수량"       :style="{ width: '80px', textAlign: 'right'}" />
         <Column field="managerName"    header="담당자명"   :style="{ width: '70px', textAlign: 'center'}" />
         <Column field="moveStatusName" header="진행상태"   :style="{ width: '60px', textAlign: 'center'}" >
            <template #body="slotProps">
                 <!-- 등록 -->
                <span v-if="slotProps.data.moveStatus === 'Q'" @click="openMovePop(slotProps.data.moveReqId)"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[요청]
                </span>
                 <!-- 진행 -->
                <span v-if="slotProps.data.moveStatus === 'I'" @click="openMovePop(slotProps.data.moveReqId)"
                    style="
                        color: #1976d2;
                        font-weight: bold;
                        cursor: pointer;
                        text-decoration: underline;
                        "
                    >[진행]
                </span>
                 <!-- 완료 -->
                <span v-if="slotProps.data.moveStatus === 'C'" @click="openMovePop(slotProps.data.moveReqId)"
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
                <span v-if="slotProps.data.moveStatus === 'Q' || slotProps.data.moveStatus === 'I'" @click="openMoveConfirmPop(slotProps.data.moveReqId)"
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
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import MoveConfirmPop from './MoveConfirmPop.vue';
import MoveDtlPop from './MoveDtlPop.vue';
import MoveRegPop from './MoveRegPop.vue';

const { vSuccess, vInfo, vWarning} = useAlertStore()
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
const moveStatuss = ref([])
const form = reactive({
    strDate: minMonth(todayKST(), 2),
    endDate: addMonth(todayKST(), 1),
    areaCd: null,
    moveStatus: null,
    srcStorageCd: null,
    descStorageCd: null,
    itemName: null,
    itemCd: null,
})

const handleDateChange = () =>{

}

/**
 * 자재이동상세 팝업 오픈
 */
const selectRowClick = (row) =>{
    dialog.open(MoveDtlPop, {
        props:{
            header: '자재이동요청 상세',
            modal: true,
            draggable: true,
        },
        data: {
            selectedItems: [row]
        },
        onClose: (evnet) =>{
            //srhList();
        }

    })
}




/**
 * 자재이동 등록
 */
const openMovePop = (id) =>{
    dialog.open( MoveRegPop,{
        props:{
            header: '이동요청 등록',
            modal: true,
            draggable: true,
            style: {
                width: '1800px',
                height: '650px'
            },
            maximizable: true
        },
        data: {
            moveReqId: id
        },
        onClose: (evnet) =>{
            srhList();
        }
    })
}
const moveInsert = () =>{
    if( selectedItem.value.length <=0 ) return vWarning('이동 등록할 자재를 선택해주세요.')
    if( selectedItem.value.length > 1 ) return vWarning('이동 등록은 한 건씩만 가능합니다.')

    dialog.open( MoveRegPop,{
        props:{
            header: '이동요청 등록',
            modal: true,
            draggable: true,
            style: {
                width: '1800px',
                height: '650px'
            },
            maximizable: true
        },
        data: {
            moveReqId: selectedItem.value[0]?.moveReqId
        },
        onClose: (evnet) =>{
            srhList();
        }
    })
}

/**
 *  자재이동확인
 */
const openMoveConfirmPop =() =>{
    dialog.open( MoveConfirmPop,{
        props:{
            header: '자재 이동 확인',
            modal: true,
            draggable: true,

        },
        onClose: (evnet) =>{
            srhList();
        }
    })
}

const srhList = async () =>{
    const params = {
        ...form
    }

    moveReqList.value = await ApiStock.getMoveReqList(params)
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    moveStatuss.value = await ApiCommon.getCodeList('MOVE_STATUS')
    allStorages.value = await ApiSystem.getStorageCodeList()

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
