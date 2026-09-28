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

    <Button label="시험일지(PDF)" severity="info" @click="printPdf"></Button>

    <Button label="재검사요청" class="p-button-warn" @click="reqTestPop"></Button>

    <Button label="검사요청" class="p-button-contrast" @click="selectBtnClick('I',selectItem)"></Button>

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

        scrollable

        scrollHeight="700px"

        showGridlines

        class="my-table excel-copy-table"

        @mousedown="handleCellMouseDown"

        @mouseover="handleCellMouseOver"

        @click.capture="handleTableClickCapture"

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
        <Column field="testStateName"   header="시험상태"  :style="{ width: '90px', textAlign: 'center'}" >
            <template #body="slotProps">
                <span :class="slotProps.data.testState === 'REQ' ? 'action-register' : 'action-edit'" >
                    {{ slotProps.data.testStateName}}
                </span>
            </template>
        </Column>
        <Column field="passStateName"   header="판정상태"  :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="passState"       header="검사"      :style="{ width: '70px', textAlign: 'center'}" >
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
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { addMonth, minMonth, todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
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
    strDate: minMonth(todayKST(), 3),
    endDate: addMonth(todayKST(), 1),
    areaCd: '',
    retestYn: '',
    itemTypeCd: '',
    itemName: '',
    itemCd: '',
    testNo: '',
    passState: '',

    menuType: 'R'
})

const dragStart = ref(null)
const dragEnd = ref(null)
const isDragging = ref(false)
const didDrag = ref(false)
const excelSelectionActive = ref(false)

const handleDateChange = () =>{ }

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

    const rows = Array.from(table.querySelectorAll('.p-datatable-tbody > tr'))

    const rowIndex = rows.indexOf(tr)

    if (rowIndex < 0) return null

    const cells = Array.from(tr.children)
    const colIndex = cells.indexOf(td)

    // 첫 번째 체크박스 컬럼 제외
    if (colIndex <= 0) return null
    // 마지막 검사 [등록]/[수정] 컬럼 제외
    //if (colIndex >= cells.length - 1) return null
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



const printPdf = async () =>{

    try {

        if (!selectItem.value || selectItem.value.length === 0) {

            vInfo('출력할 항목을 선택하세요.')

            return

        }



        const hasReq = selectItem.value.some(item => item.testState === 'REQ');

        if (hasReq) {

            vInfo('시험중 이상만 출력이 가능합니다.')

            return

        }



        // 체크된 row에서 qcTestId만 추출

        const qcTestIds = selectItem.value.map(item => item.qcTestId)



        // 서버에 PDF 생성 요청

        const res = await ApiQc.getPrintTest(qcTestIds)



        // blob 생성

        const blob = new Blob([res.data], { type: 'application/pdf' })

        const url = window.URL.createObjectURL(blob)

        window.open(url, '_blank')



        // 다운로드 방식

        // const link = document.createElement('a')

        // link.href = url

        // link.download = `qc-test_${new Date().getTime()}.pdf`

        // document.body.appendChild(link)

        // link.click()

        // document.body.removeChild(link)



        // window.URL.revokeObjectURL(url)

    } catch (err) {

        handleApiError(err)

    }

}





const srhList = async () =>{

    const params = {

        ...form

    }



    qcTestList.value = await ApiQc.getQcTestList(params)

    selectItem.value = null;

}



const reqTestPop = () =>{

     dialog.open(RetestPop, {

        props: {

            header: '재검사요청등록',

            modal: true,

            draggable: false,

        },

        onClose: () => {

            srhList()

        }

    })

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
            height: '680px',
            maxHeight: '79vh',
            overflow: 'hidden'
        }

        baseProps.pt = {
            root: { style: { overflow: 'hidden' } },
            content: {
                style: {
                    overflow: 'hidden'
                }
            }
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
    //console.warn("No Columns Found");
    return;
  }

  const excelData = qcTestList.value.map(row => ({
    ...row,
    testState: row.testStateName,
  }))

  exportToExcel(excelData, "품질검사요청 리스트", cols);
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



::v-deep(.excel-copy-table .p-datatable-tbody > tr > td) {

  user-select: none;

}



::v-deep(.excel-copy-table .p-datatable-tbody > tr > td.excel-selected) {

  background-color: #dbeafe !important;

  outline: 1px solid #60a5fa;

  outline-offset: -1px;

}

</style>
