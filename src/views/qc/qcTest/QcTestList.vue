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
    <Button label="성적서(PDF)" class="p-button-secondary" @click="printPdf"></Button>
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
        @row-click="selectRowClick"
        >
        <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="testNo"          header="시험번호"  :style="{ width: '110px', textAlign: 'center' }" sortable />
        <Column field="testDate"        header="시험일자"  :style="{ width: '110px', textAlign: 'center'}"  sortable />
        <Column field="reqDate"         header="요청일자"  :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="reqTesterId"     header="요청자"    :style="{ width: '70px', textAlign: 'center'}" />
        <Column field="itemTypeCd"      header="품목구분"  :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="itemCd"          header="품목코드"  :style="{ width: '140px', textAlign: 'center'}" />
        <Column field="itemName"        header="품목명"    :style="{ width: '350px'}"/>
        <Column field="lotNo"           header="제조번호"  :style="{ width: '150px'}" />
        <Column field="lotNo"           header="로트번호"  :style="{ width: '150px'}" />
        <Column field="reqQty"          header="수량"      :style="{ width: '90px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.reqQty).toLocaleString() }}</template>
        </Column>
        <Column field="storageCd"       header="창고명"    :style="{ width: '130px', textAlign: 'center'}" />
        <Column field="retestYn"       header="검사유형"  :style="{ width: '90px', textAlign: 'center'}" >
                <template #body="slotProps">{{ slotProps.data.retestYn === 'Y' ? '재검사' : '입고검사' }}</template>
        </Column>
        <Column field="testState"   header="시험상태"  :style="{ width: '90px', textAlign: 'center'}" >
            <template #body="slotProps">
                    {{ slotProps.data.testStateName}}
            </template>
        </Column>
        <Column field="confirmDate"     header="판정일자"  :style="{ width: '110px', textAlign: 'center'}" />
    </DataTable>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { minMonth, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import ReqQcTestPop from '../reqQcTest/ReqQcTestPop.vue';

const { vInfo, vWarning} = useAlertStore()
const dt = ref(null);
const dialog = useDialog()
const selectItem = ref(null);
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

    menuType: 'O'
})

const srhList = async () =>{
    const params = {
        ...form
    }

    qcTestList.value = await ApiQc.getQcTestList(params)
    selectItem.value = null;
}

const selectRowClick = (obj) =>{
    dialog.open(ReqQcTestPop, {
        props:{
            header: '검사등록/수정',
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                width: '95vw',
                maxWidth: '1900px',
                height: '650px',
                overflow: 'hidden'
            },
        },
        data: {
                qcTestId: obj.data.qcTestId,
                type: 'R',
            },
            onClose: evnet=>{

            }
        }
    )
}

const printPdf = async () =>{
    try {
        if (!selectItem.value || selectItem.value.length === 0) {
            vInfo('출력할 항목을 선택하세요.')
            return
        }

        const hasReq = selectItem.value.some(item => item.testState !== 'END');
        if (hasReq) {
            vInfo('시험완료 건만 출력이 가능합니다.')
            return
        }
        // 체크된 row에서 qcTestId만 추출
        const qcTestIds = selectItem.value.map(item => item.qcTestId)

        // 서버에 PDF 생성 요청
        const res = await ApiQc.getPrintCertificate(qcTestIds)

        // blob 생성
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
    } catch (err) {
        handleApiError(err)
    }
}

onMounted(async () => {
    areaCds.value = await ApiCommon.getCodeList('area')
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    passStates.value = await ApiCommon.getCodeList('pass_state')

    form.strDate = minMonth(todayKST(), 3)
    form.endDate = todayKST()
})

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(qcTestList.value, "품질검사 리스트", cols);
}


const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '품질관리' },
    { label: '품질검사' },
    { label: '품질검사목록' },
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
