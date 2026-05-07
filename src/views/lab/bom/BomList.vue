<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchList" class="space-y-4">
        <Toolbar class="flex flex-wrap mt-2 mb-2 gap-2 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" />
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.managerName" />
                <label for="on_label1">담당자</label>
            </FloatLabel>
             <FloatLabel variant="on">
                <Select v-model="form.approvalState"
                 :options="approvalStates"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
                />
                <label for="on_label1">결재상태</label>
             </FloatLabel>
            <Button label="검색" icon="pi pi-search" class="bg-blue-500 text-white hover:bg-blue-600" type="submit"></Button>
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
        <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('N')"></Button>
        <Button label="BOM버전" icon="pi pi-plus" severity="secondary" @click="selectRowClick('B')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>
    <div class="flex flex-col mt-2 h-full min-h-0">
        <DataTable
            ref="dt"
            v-model:selection="selectedItem"
            :value="bomList"
            selectionMode="single"
            dataKey="bomId"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="750px"
            showGridlines
            >
            <Column selectionMode="single"    headerStyle="width: 3rem" style="text-align: center;"></Column>
            <Column header="No."  :style="{ width: '40px'}" >
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="itemCd"    header="품목코드"  :style="{ width: '90px'}"  />
            <Column field="itemName"  header="품목명"    :style="{ width: '520px'}" bodyClass="break-words" >
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.bomId)" class="clickable-cell">
                        {{ slotProps.data.itemName }}
                    </div>
                </template>
            </Column>
            <Column field="bomVer"      header="BOM버전"   :style="{ width: '90px', textAlign:'center'}" />
            <Column field="managerName" header="담당자"     :style="{ width: '70px', textAlign:'center'}" />
            <Column field="itemCnt"     header="원료갯수"  :style="{ width: '70px', textAlign:'right'}"  />
            <Column field="approvalState"    header="결재상태"     :style="{ width: '70px', textAlign:'center'}" />
            <Column field="etc"         header="비고"   :style="{ width: '320px'}"  />
        </DataTable>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref, shallowRef } from 'vue';
import BomDetailPop from './BomDetailPop.vue';
import BomVerPop from './BomVerPop.vue';

const {vInfo} = useAlertStore()
const dialog = useDialog()
const dt = ref(null);
const currentComponet = shallowRef(null)
const approvalStates = ref([])
const bomList = ref([])
const totalCount = computed(() => {
  return Array.isArray(bomList.value) ? bomList.value.length : 0
})
const selectedItem = ref(null);

const form = reactive({
    itemName: '',
    itemCd: '',
    managerName: '',
    approvalState: '',
    itemTypeCd: 'M3',

    defaultYn: 'Y'
})

const srchList = async () => {
  const params = {
    ...form
  }
  bomList.value = await ApiLab.getBomList(params);
};


/**
 * 상세화면
 * @param item
 * @param index
 */
const selectRowClick = (id) => {
    let title = ''

    if ( id === 'N' ) {
        title = 'BOM신규'
        currentComponet.value = BomDetailPop
    }else if ( id === 'B' ){
        title = 'BOM추가'
        currentComponet.value = BomVerPop
        if ( isEmpty(selectedItem.value)) {
            vInfo('변경할 BOM을 선택하세요!!')
            return
        }

        id = selectedItem.value.bomId
    }else{
        title = 'BOM상세'
        currentComponet.value = BomDetailPop
    }

    dialog.open(currentComponet, {
        props:{
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                width: '81vw',          // 🔹 팝업 가로 폭
                maxWidth: '1400px',
                height: '900px',
                maxHeight: '90vh',
            },
            pt: {
            content: {
                style: {
                    maxHeight: 'calc(90vh - 4rem)', // 헤더/푸터 높이 제외 영역
                    overflow: 'auto',               // 🔥 스크롤 활성화
                }
            }
        }
        },
        data: id,
        onClose:(event) => {
            srchList()
        },
    })
}

onMounted( async () => {
    approvalStates.value = await ApiCommon.getCodeList('approval_state')
});

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '연구관리' },
    { label: '반제품BOM관리' },
    { label: '반제품BOM목록' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(bomList.value, "BOM리스트", cols);
}
</script>

<style scoped>
.search-section {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}

/* 🔥 검색 form을 한 줄로 강제 정렬 */
.search-form {
  display: flex;
  flex-wrap: nowrap;        /* 줄바꿈 금지 */
  gap: 0.75rem;             /* 요소 간 간격 */
  align-items: flex-end;    /* 모든 입력 필드를 동일 baseline에 정렬 */
  width: 100%;
}

/* 리스트 영역 */
.list-section {
  flex: 1;
  min-height: 0;
}

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 6px 6px 0.1rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
.layout-main {
  min-height: 0;
}
</style>
