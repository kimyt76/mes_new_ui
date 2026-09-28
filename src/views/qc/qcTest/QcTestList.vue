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
                    <Select v-model="form.areaCd" :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    @change="srhList"
                    />
                    <label for="on_label">구역(공장)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.retestYn" :options="retestYns"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    @change="srhList"
                    />
                    <label for="on_label">검사유형</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    style="width: 120px"
                    @change="srhList"
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

                    @change="srhList"

                    />

                    <label for="on_label">판정상태</label>

                </FloatLabel>



                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />

                <Button label="초기화" icon="pi pi-refresh" severity="secondary" type="button" @click="resetSearch" />

            </div>

        </template>

    </Toolbar>

</form>

<div class="flex items-center justify-end gap-2 mb-2">

    <Button label="성적서(PDF)" severity="info" @click="printPdf"></Button>

    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>

</div>

<div>
    <DataTable
        ref="dt"
        v-model:selection="selectItem"
        :value="qcTestList"
        dataKey="qcTestId"
        paginator :rows="30"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="800px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table excel-copy-table"
        @row-click="selectRowClick"
        @mousedown="handleCellMouseDown"
        @mouseover="handleCellMouseOver"
        @click.capture="handleTableClickCapture"
        >
        <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="testNo"          header="시험번호"  :style="{ width: '110px', textAlign: 'center' }" sortable />
        <Column field="testDate"        header="시험일자"  :style="{ width: '110px', textAlign: 'center'}"  sortable />
        <Column field="reqDate"         header="요청일자"  :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="reqTesterId"     header="요청자"    :style="{ width: '70px', textAlign: 'center'}" />
        <Column field="itemTypeCd"      header="품목구분"  :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="itemCd"          header="품목코드"  :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="itemName"        header="품목명"    :style="{ width: '250px'}"/>
        <Column field="makeNo"           header="제조번호"  :style="{ width: '120px'}" />
        <Column field="lotNo"           header="로트번호"  :style="{ width: '120px'}" />
        <Column field="reqQty"          header="수량"      :style="{ width: '90px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.reqQty).toLocaleString() }}</template>
        </Column>
        <Column field="storageCd"       header="창고명"    :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="retestYn"         header="검사유형"  :style="{ width: '70px', textAlign: 'center'}" >
                <template #body="slotProps">{{ slotProps.data.retestYn === 'Y' ? '재검사' : '입고검사' }}</template>
        </Column>
        <Column field="testState"   header="시험상태"  :style="{ width: '80px', textAlign: 'center'}" >
            <template #body="slotProps">
                    {{ slotProps.data.testStateName}}
            </template>
        </Column>
        <Column field="confirmDate"     header="판정일자"  :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="passState"   header="판정상태" :style="{ width: '80px', textAlign: 'center'}">
            <template #body="slotProps">
                <span :class="getPassStateClass(slotProps.data.passState)">
                    {{ getPassStateName(slotProps.data.passState) }}
                </span>
            </template>
        </Column>
    </DataTable>
</div>

</template>



<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { minMonth, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
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

    strDate: minMonth(todayKST(), 3),

    endDate: todayKST(),

    areaCd: '',

    retestYn: '',

    itemTypeCd: '',

    itemName: '',

    itemCd: '',

    testNo: '',

    passState: '',



    menuType: 'O'

})



const dragStart = ref(null)

const dragEnd = ref(null)

const isDragging = ref(false)

const didDrag = ref(false)

const excelSelectionActive = ref(false)



const handleDateChange = () =>{



}



const getTableElement = () =>{

    return dt.value?.$el ?? document.querySelector('.excel-copy-table')

}



const getCellPosition = (target) =>{

    const table = getTableElement()

    if (!table) return null



    const td = target.closest('td')

    if (!td || !table.contains(td)) return null



    const tr = td.closest('tr')

    if (!tr) return null



    const rows = Array.from(

        table.querySelectorAll('.p-datatable-tbody > tr')

    )



    const rowIndex = rows.indexOf(tr)

    if (rowIndex < 0) return null



    const cells = Array.from(tr.children)

    const colIndex = cells.indexOf(td)



    // 첫 번째 체크박스 컬럼만 제외

    if (colIndex <= 0) return null



    return {

        row: rowIndex,

        col: colIndex

    }

}



const clearExcelSelection = () =>{

    const table = getTableElement()

    if (!table) return



    table.querySelectorAll('td.excel-selected').forEach(td => {

        td.classList.remove('excel-selected')

    })



    dragStart.value = null

    dragEnd.value = null

    excelSelectionActive.value = false

}



const updateSelectedCells = () =>{

    const table = getTableElement()

    if (!table) return



    table.querySelectorAll('td.excel-selected').forEach(td => {

        td.classList.remove('excel-selected')

    })



    if (!dragStart.value || !dragEnd.value) return



    const startRow = Math.min(

        dragStart.value.row,

        dragEnd.value.row

    )



    const endRow = Math.max(

        dragStart.value.row,

        dragEnd.value.row

    )



    const startCol = Math.min(

        dragStart.value.col,

        dragEnd.value.col

    )



    const endCol = Math.max(

        dragStart.value.col,

        dragEnd.value.col

    )



    const rows = Array.from(

        table.querySelectorAll('.p-datatable-tbody > tr')

    )



    for (let r = startRow; r <= endRow; r++) {

        const row = rows[r]

        if (!row) continue



        const cells = Array.from(row.children)



        for (let c = startCol; c <= endCol; c++) {

            const cell = cells[c]



            if (cell) {

                cell.classList.add('excel-selected')

            }

        }

    }

}



const handleCellMouseDown = (event) =>{

    if (event.button !== 0) return



    const pos = getCellPosition(event.target)

    if (!pos) return



    dragStart.value = pos

    dragEnd.value = pos

    isDragging.value = true

    didDrag.value = false

    excelSelectionActive.value = true



    updateSelectedCells()



    document.addEventListener('mouseup', handleMouseUp, {

        once: true

    })

}



const handleCellMouseOver = (event) =>{

    if (!isDragging.value) return



    const pos = getCellPosition(event.target)

    if (!pos) return



    if (

        dragEnd.value?.row !== pos.row ||

        dragEnd.value?.col !== pos.col

    ) {

        didDrag.value = true

    }



    dragEnd.value = pos



    updateSelectedCells()

}



const handleMouseUp = () =>{

    isDragging.value = false

}



const handleTableClickCapture = (event) =>{

    if (!didDrag.value) return



    event.preventDefault()

    event.stopPropagation()



    didDrag.value = false

}



const handleDocumentMouseDown = (event) =>{

    const table = getTableElement()

    if (!table) return



    if (!table.contains(event.target)) {

        clearExcelSelection()

    }

}



const handleCopy = (event) =>{

    if (!excelSelectionActive.value) return

    if (!dragStart.value || !dragEnd.value) return



    const table = getTableElement()

    if (!table) return



    const startRow = Math.min(

        dragStart.value.row,

        dragEnd.value.row

    )



    const endRow = Math.max(

        dragStart.value.row,

        dragEnd.value.row

    )



    const startCol = Math.min(

        dragStart.value.col,

        dragEnd.value.col

    )



    const endCol = Math.max(

        dragStart.value.col,

        dragEnd.value.col

    )



    const rows = Array.from(

        table.querySelectorAll('.p-datatable-tbody > tr')

    )



    const copyRows = []



    for (let r = startRow; r <= endRow; r++) {

        const row = rows[r]

        if (!row) continue



        const cells = Array.from(row.children)

        const copyCells = []



        for (let c = startCol; c <= endCol; c++) {

            const cell = cells[c]



            if (!cell) {

                copyCells.push('')

                continue

            }



            const value = (cell.innerText ?? '')

                .replace(/\t/g, ' ')

                .replace(/\r?\n/g, ' ')

                .trim()



            copyCells.push(value)

        }



        copyRows.push(copyCells.join('\t'))

    }



    if (copyRows.length === 0) return



    event.preventDefault()



    const text = copyRows.join('\n')



    if (event.clipboardData) {

        event.clipboardData.setData('text/plain', text)

        return

    }



    navigator.clipboard.writeText(text).catch(err => {

        console.error('clipboard copy error', err)

    })

}



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



    document.addEventListener('copy', handleCopy)

    document.addEventListener('mousedown', handleDocumentMouseDown)



    srhList()

})



onUnmounted(() => {

    document.removeEventListener('copy', handleCopy)

    document.removeEventListener('mousedown', handleDocumentMouseDown)

})



const downloadExcel = () =>{

  const cols = dt.value?.columns ?? [];



  if (!cols.length) {

    console.warn("No Columns Found");

    return;

  }

  exportToExcel(qcTestList.value, "품질검사 리스트", cols);

}



const getPassStateName = (state) => {

    const stateMap = {

        REQ: '시험대기',

        ING: '시험중',

        ING2: '검토대기',

        ING3: '승인대기',

        PASS: '적합',

        FAIL: '부적합'

    }



    return stateMap[state] ?? state

}

const stateClassMap = {

    REQ: 'state-req',

    ING: 'state-ing',

    ING2: 'state-review',

    ING3: 'state-approval',

    PASS: 'state-pass',

    FAIL: 'state-fail'

}



const getPassStateClass = (state) => stateClassMap[state] || ''



const resetSearch = () => {

    form.areaCd = ''

    form.retestYn = ''

    form.itemTypeCd = ''

    form.itemName = ''

    form.itemCd = ''

    form.testNo = ''

    form.passState = ''



    srhList()

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
  text-align: center;
  font-family: monaco, Consolas;
  padding: 4px 1px !important;
  font-size: 14px;
}
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 3px 3px !important;
  font-size: 14px;
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

.state-req {

    color: #000000;

    font-weight: 600;

}



.state-ing {

    color: #2563eb;

    font-weight: 600;

}



.state-review {

    color: #f59e0b;

    font-weight: 600;

}



.state-approval {

    color: #8b5cf6;

    font-weight: 600;

}



.state-pass {

    color: #16a34a;

    font-weight: 700;

}



.state-fail {

    color: #dc2626;

    font-weight: 700;

}


::v-deep(.excel-copy-table .p-datatable-tbody > tr > td) {

  user-select: none;

}



::v-deep(.excel-copy-table .p-datatable-tbody > tr > td.excel-selected) {

  background-color: #dbeafe !important;

  outline: 1px solid #60a5fa;

  outline-offset: -1px;

}

</style>
