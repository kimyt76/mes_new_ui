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
                    <Select v-model="form.retestYn" :options="retestYns"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">검사유형</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">품목구분</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                    <label for="on_label">품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.itemCd" style="width: 150px"/>
                    <label for="on_label1">품목코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.testNo" style="width: 150px" />
                    <label for="on_label1">시험번호</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.passState" :options="passStates"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    />
                    <label for="on_label">판정상태</label>
                </FloatLabel>

                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="재검사요청" class="p-button-secondary" @click="selectBtnClick('R',selectItem)"></Button>
    <Button label="검사요청" class="p-button-secondary" @click="selectBtnClick('I',selectItem)"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectItem"
        :value="qcTestList"
        dataKey="qcTestId"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="flex"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="testNo"          header="시험번호"  :style="{ width: '120px', textAlign: 'center' }" sortable >
            <template #body="slotProps">
                <div @click="selectRowClick('D', slotProps.data.qcTestId,  slotProps.data.passState)" class="clickable-cell">
                    {{ slotProps.data.testNo }}
                </div>
            </template>
        </Column>
        <Column field="reqDate"         header="요청일자"  :style="{ width: '110px', textAlign: 'center'}"  sortable />
        <Column field="reqTesterId"     header="요청자"    :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="itemTypeCd"      header="품목구분"  :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="itemCd"          header="품목코드"  :style="{ width: '140px', textAlign: 'center'}" />
        <Column field="itemName"        header="품목명"    :style="{ width: '350px'}"/>
        <Column field="lotNo"           header="로트번호"  :style="{ width: '190px'}" />
        <Column field="reqQty"          header="수량"      :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.reqQty).toLocaleString() }}</template>
        </Column>
        <Column field="storageCd"       header="창고명"    :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="testState"       header="시험상태"  :style="{ width: '90px', textAlign: 'center'}" >
            <template #body="slotProps">
                <span
                    class="action-link"
                    :class="slotProps.data.passState === 'REQ' ? 'action-register' : 'action-edit'"
                >
                    {{ slotProps.data.testState}}
                </span>
            </template>
        </Column>
        <Column field="passStateName"   header="판정상태"  :style="{ width: '90px', textAlign: 'center'}" />
        <Column header="검사"      :style="{ width: '70px', textAlign: 'center'}" >
            <template #body="slotProps">
                <span
                    class="action-link"
                    :class="slotProps.data.passState === 'REQ' ? 'action-register' : 'action-edit'"
                    @click="selectRowClick('I',slotProps.data.qcTestId,  slotProps.data.passState)"
                >
                    {{ slotProps.data.passState === 'REQ' ? '[등록]' : '[수정]' }}
                </span>
            </template>
        </Column>
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
import ReqQcTestDetailPop from './ReqQcTestDetailPop.vue';
import ReqQcTestPop from './ReqQcTestPop.vue';
import RetestPop from './RetestPop.vue';

const dt = ref(null);
const {vInfo, vWarning} = useAlertStore()
const dialog = useDialog()
const selectItem = ref([]);
const qcTestList = ref([]);
const areaCds = ref([]);
const itemTypeCds = ref([]);
const passStates = ref([]);
const retestYns = ref([
    { code: 'Y', codeNm: '재검사' },
    { code: 'N', codeNm: '입고검사' },
])
const form = reactive({
    strDate: '',
    endDate: '',
    areaCd: '',
    retestYn: '',
    itemTypeCd: '',
    itemName: '',
    itemCd: '',
    testNo: '',
    passState: '',

    menuType: 'R'
})

const srhList = async () =>{
    const params = {
        ...form
    }

    qcTestList.value = await ApiQc.getQcTestList(params)
    selectItem.value = null;
}

const selectBtnClick = (type, data) =>{
    if (!data || data.length === 0) {
        vWarning('검사할 항목을 선택해주세요.')
        return
    }

    if (data.length > 1) {
        vWarning('검사할 품목을 1개만 선택해주세요.')
        return
    }

    const selected = data[0]

    selectRowClick(type, selected.qcTestId, selected.passState)
}

const selectRowClick = (type, id, passState) =>{
    let title = ''
    let componentPop = null

    if(type === 'I'){
        title = '검사등록/수정'
        componentPop= ReqQcTestPop
    }else if (type === 'R'){
        title = '재검사요청등록'
        componentPop= RetestPop
    }else if(type === 'D'){
        title = '검사요청내역'
        componentPop= ReqQcTestDetailPop
    }

    // 기본 props
    const baseProps = {
        header: title,
        modal: true,
        maximizable: false,
        draggable: false,
    }
     // type === 'I'일 때만 추가
    if (type === 'I') {
        baseProps.style = {
            width: '95vw',
            maxWidth: '1900px',
            height: '650px',
            overflow: 'hidden'
        }
        baseProps.pt = {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } }
        }
    }

    dialog.open(componentPop, {
        props: baseProps,
        data: {
            qcTestId: id,
            type: type,
            passState: passState,
        },
        onClose: () => {
            srhList()
        }
    })
}

onMounted(async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    passStates.value = await ApiCommon.getCodeList('pass_state')

    form.strDate = minMonth(todayKST(), 3)
    form.endDate = addMonth(todayKST(), 1)
})

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(qcTestList.value, "품질검사요청 리스트", cols);
}

const stateClassMap = {
    REQ: 'tw-text-black',
    ING: 'tw-text-yellow-500',
    ING2: 'tw-text-blue-500',
    ING3: 'tw-text-blue-500',
    FAIL: 'tw-text-red-600',
    PASS: 'tw-text-green-500'
}

const getPassStateClass = (state) => stateClassMap[state] || ''


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '품질관리' },
    { label: '품질검사요청' },
    { label: '품질검사요청목록' },
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

.action-link {
  cursor: pointer;
  font-weight: 700;
  text-decoration: underline;
}

.action-register {
  color: red;
}

.action-edit {
  color: blue;
}
</style>
