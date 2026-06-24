<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.areaCd"
                 :options="areaCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
                />
                <label for="on_label1">생산처(공장)</label>
             </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.procCd"
                 :options="procCds"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
                />
                <label for="on_label1">공정</label>
             </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.workerName" style="width: 180px" />
                <label for="on_label1">작업자명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.useYn"
                 :options="useYns"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
                />
                <label for="on_label1">사용유무</label>
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
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        :value="workerList"
        dataKey="workerId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width: 100rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="areaName"    header="구역"   :style="{ width: '100px', textAlign:'center'}">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workerId)" >
                    {{ slotProps.data.areaName }}
                </div>
            </template>
        </Column>
        <Column field="processName" header="작업유형"   :style="{ width: '100px', textAlign:'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workerId)" >
                    {{ slotProps.data.processName }}
                </div>
            </template>
        </Column>
        <Column field="workerName"  header="작업자"     :style="{ width: '200px', textAlign:'center'}" />
        <Column field="useYn"       header="사용여부"   :style="{ width: '80px', textAlign:'center'}" >
            <template #body="slotProps">
                {{  slotProps.data.useYn === 'Y' ? '사용' : '미사용'}}
            </template>

        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiWorkOrder } from '@/api/apiWorkOrder';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import WorkerDtlPop from './WorkerDtlPop.vue';

const { vInfo, vWarning, vSuccess} = useAlertStore()
const totalCount = computed(() => workerList.value.length)
const dialog = useDialog()
const areaCds = ref([])
const procCds = ref([])
const useYns = ref([])
const workerList = ref([])
const form  =reactive({
    areaCd: '',
    procCd: '',
    workerName: '',
    useYn: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }
    workerList.value = await ApiWorkOrder.getWorkerAllList(params)
}

const selectRowClick = (id) =>{
    let title = '작업자 등록'

    if (!isEmpty(id)) {
        title = '작업자 상세'
    }
    dialog.open( WorkerDtlPop, {
        props:{
            header: title,
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
    areaCds.value = await ApiCommon.getCodeList('area')
    useYns.value = await ApiCommon.getCodeList('use_yn')
    procCds.value = (await ApiCommon.getCodeList('PROCESS_CD')).filter(i => !['PRC009'].includes(i.code))

    srhList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '작업지시' },
    { label: '작업자관리' },
    { label: '작업자목록' },
]);


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
  padding: 0.1rem 0;
  text-decoration: underline;
  text-align: center;
}

</style>
