<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DatePicker v-model="form.strDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <DatePicker v-model="form.endDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <FloatLabel variant="on">
                    <Select v-model="form.areaCd" :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">구역(공장)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.procStatus" :options="procStatuss"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">배치상태</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.testState" :options="testStates"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">작성상태</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                    <label for="on_label">품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.itemCd" style="width: 150px"/>
                    <label for="on_label1">품목코드</label>
                </FloatLabel>


                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<!-- 오른쪽: 버튼 -->
<div class="flex justify-end mt-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
</div>
<div class="mt-2">
    <DataTable
        v-model:first="first"
        :value="workOrderList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
    >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="areaCd"          header="구역" :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="itemName"        header="품목명" :style="{ width: '380px'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.workBatchId, slotProps.data.testState, slotProps.data.qcProcTestType)" class="clickable-cell">
                    {{ slotProps.data.itemName}}
                </div>
            </template>
        </Column>
        <Column field="matNo"           header="제조번호" :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="lotNo"           header="1차포장LOT" :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="lotNo2"          header="2차포장LOT" :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="batchStatus"     header="배치상태" :style="{ width: '90px', textAlign: 'center'}" >
            <template #body="slotProps">
                <span class="action-link"
                    :class="getBatchStateClass(slotProps.data.batchStatus)"
                >
                    {{ getBatchStateText(slotProps.data.batchStatus) }}
                </span>
            </template>
        </Column>
        <Column field="testState"       header="작성싱테" :style="{ width: '90px', textAlign: 'center'}">
            <template #body="slotProps">
                <span class="action-link"
                    :class="getTestStateClass(slotProps.data.testState)"
                    >
                    {{ getTestStateText(slotProps.data.testState) }}
                </span>
            </template>
        </Column>
        <Column field="chargingDate"    header="중진일자" :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="packingDate"     header="포장일자" :style="{ width: '100px', textAlign: 'center'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import QcProcTestCreatePop from './QcProcTestCreatePop.vue';
import QcProcTestPop from './QcProcTestPop.vue';

const { vWarning, vInfo} = useAlertStore()
const dialog = useDialog()
const dt = ref(null)
const first = ref(0)
const areaCds = ref([])
const procStatuss = ref([])
const workOrderList = ref([])
const testStates = ref([
    { code: 'N' , codeNm: '미작성'},
    { code: 'I' , codeNm: '작성중'},
    { code: 'E' , codeNm: '작성완료'},
])

const form = reactive({
    strDate: '',
    endDate :'',
    areaCd: '',
    procStatus: '',
    testState: '',
    itemCd: '',
    itemName: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }

    workOrderList.value = await ApiQc.getQcProcTestList(params)
}

const selectRowClick = (id, state, type) =>{
    let title = ''
    let componentPop = ''

    if (state === 'N') {
        title = 'QC공정검사 생성'
        componentPop = QcProcTestCreatePop
    }else{
        title = 'QC공정검사'
        componentPop = QcProcTestPop
    }

    const dialogProps = {
        header: title,
        modal: true,
        draggable: false
    }

    if (state === 'I') {
        dialogProps.style = {
            width: '90vw',
            maxWidth: '1800px',
            height: '850px',
            overflow: 'hidden'
        }
        dialogProps.pt = {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } }
        }
    }

    dialog.open(componentPop, {
        props: dialogProps,
        data: {
            id: id,
            type: type,
        },
        onClose: event => {
            srhList()
        }
    })
}

const testStateClassMap = {
    N: {
        text: '[미작성]',
        class: 'tw-text-black'
    },
    I: {
        text: '[작성중]',
        class: 'tw-text-yellow-500'
    },
    E: {
        text: '[작성완료]',
        class: 'tw-text-green-500'
    }
}

const getTestStateClass = (state) => {
    return testStateClassMap[state]?.class || ''
}
const getTestStateText = (state) => {
    return testStateClassMap[state]?.text || ''
}


const batchStateClassMap = {
    '00': {
        text: '[작업지시]',
        class: 'tw-text-black'
    },
    '22': {
        text: '[제조완료]',
        class: 'tw-text-black'
    },
    '31': {
        text: '[코팅중]',
        class: 'tw-text-black'
    },
    '32': {
        text: '[코팅완료]',
        class: 'tw-text-black'
    },
    '41': {
        text: '[충전중]',
        class: 'tw-text-black'
    },
    '42': {
        text: '[충전완료]',
        class: 'tw-text-black'
    },
    '51': {
        text: '[충전중]',
        class: 'tw-text-black'
    },
    '52': {
        text: '[충전완료]',
        class: 'tw-text-black'
    },

}

const getBatchStateClass = (state) => {
    return batchStateClassMap[state]?.class || ''
}
const getBatchStateText = (state) => {
    return batchStateClassMap[state]?.text || ''
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    procStatuss.value = (await ApiCommon.getCodeList('PROC_STATUS')).filter(i => ['31','32','41','42','51','52'].includes(i.code))

    form.strDate =  minMonth(todayKST(), 2)
    form.endDate =  addMonth(todayKST(), 1)
})

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(workOrderList.value, "공정검사리스트", cols);
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '공정관리' },
    { label: '공정검사' },
    { label: '공정검사목록' },
]);

</script>

<style  scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
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
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}
</style>
