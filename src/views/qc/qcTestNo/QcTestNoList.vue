
<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DateRangePicker
                    v-model:startDate="form.strDate"
                    v-model:endDate="form.endDate"
                    @change="handleDateChange"
                />
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
                    <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                    <label for="on_label1">거래처명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.testNo" style="width: 150px" />
                    <label for="on_label1">시험번호</label>
                </FloatLabel>
                <DatePicker v-model="form.shelfDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>

<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="바코드" icon="pi pi-barcode" outlined @click="barcodePrint"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>

<div>
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="itemTestNoList"
        :loading="loading"
        dataKey="testNo"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table excel-copy-table"
        @mousedown="handleCellMouseDown"
        @mouseover="handleCellMouseOver"
        @click.capture="handleTableClickCapture"
    >
        <Column selectionMode="multiple" headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="testNo" header="시험번호" :style="{ width: '120px', textAlign: 'center' }" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.testNo)" class="clickable-cell">
                    {{ slotProps.data.testNo }}
                </div>
            </template>
        </Column>
        <Column field="createDate" header="입고일" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="itemTypeCd" header="품목구분" :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="itemCd" header="품목코드" :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="itemName" header="품목명" :style="{ width: '350px'}"/>
        <Column field="qty" header="입고량" :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="lotNo" header="로트번호" :style="{ width: '190px'}" />
        <Column field="expiryDate" header="사용기한" :style="{ width: '110px', textAlign: 'center'}" />
        <Column field="customerName" header="거래처명" :style="{ width: '250px'}" />
        <Column field="passState" header="판정상태" :style="{ width: '90px'}" />
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useDialog } from 'primevue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import QcTestNoPop from './QcTestNoPop.vue';

const loading = ref(false)
const dt = ref(null);
const { vWarning, vInfo} = useAlertStore()
const dialog = useDialog()
const selectedItem = ref([])
const itemTypeCds = ref([])
const itemTestNoList = ref([])

const form = reactive({
    strDate: minMonth(todayKST(), 36),
    endDate: todayKST(),
    itemTypeCd: '',
    itemName: '',
    itemCd: '',
    customerName: '',
    testNo: '',
    shelfDate: '',
})

/* =====================================================
   엑셀 방식 드래그 선택 및 Ctrl+C 복사 기능
   ===================================================== */

const dragStart = ref(null)
const dragEnd = ref(null)
const isDragging = ref(false)
const didDrag = ref(false)
const excelSelectionActive = ref(false)

const getTableElement = () => {
    return dt.value?.$el ?? document.querySelector('.excel-copy-table')
}

const getCellPosition = (target) => {
    const table = getTableElement()
    if (!table || !(target instanceof Element)) return null

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

    // 체크박스 컬럼 제외
    if (colIndex <= 0) return null

    return {
        row: rowIndex,
        col: colIndex
    }
}

const clearExcelSelection = () => {
    const table = getTableElement()
    if (!table) return

    table.querySelectorAll('td.excel-selected').forEach(td => {
        td.classList.remove('excel-selected')
    })

    dragStart.value = null
    dragEnd.value = null
    excelSelectionActive.value = false
}

const updateSelectedCells = () => {
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

const handleCellMouseDown = (event) => {
    if (event.button !== 0) return

    const pos = getCellPosition(event.target)
    if (!pos) return

    dragStart.value = pos
    dragEnd.value = pos
    isDragging.value = true
    didDrag.value = false
    excelSelectionActive.value = true

    // 기존 품목명 클릭 동작은 유지
    // 텍스트가 브라우저 기본 방식으로 선택되는 것만 방지
    event.preventDefault()

    updateSelectedCells()

    document.addEventListener('mouseup', handleMouseUp, {
        once: true
    })
}

const handleCellMouseOver = (event) => {
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

const handleMouseUp = () => {
    isDragging.value = false
}

const handleTableClickCapture = (event) => {
    if (!didDrag.value) return

    event.preventDefault()
    event.stopPropagation()

    didDrag.value = false
}

const handleDocumentMouseDown = (event) => {
    const table = getTableElement()
    if (!table) return

    if (!table.contains(event.target)) {
        clearExcelSelection()
    }
}

const handleCopy = (event) => {
    if (!excelSelectionActive.value) return
    if (!dragStart.value || !dragEnd.value) return

    // 검색 입력창 등에서 복사할 때는 기존 동작 유지
    const active = document.activeElement

    if (
        active?.matches(
            'input, textarea, [contenteditable="true"]'
        )
    ) {
        return
    }

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

    if (!event.clipboardData) return

    event.preventDefault()

    event.clipboardData.setData(
        'text/plain',
        copyRows.join('\n')
    )
}

/* =====================================================
   기존 기능 - 변경 없음
   ===================================================== */

const handleDateChange = () =>{

}

const srhList = async () =>{
    loading.value = true
    try {
        const params = {
            ...form
        }

        itemTestNoList.value = await ApiQc.getItemTestNoList(params)
    } catch (err) {
        console.error(err)
        vWarning('시험번호별 리스트 조회 중 오류가 발생했습니다.')
    } finally {
        loading.value = false
    }
}

const selectRowClick = (id) =>{
    dialog.open(QcTestNoPop,{
        props:{
            header:'시험번호 상세',
            modal: true,
            maximizable: false,
            draggable: false,
        },
        data:{
            testNo: id,
        },
        onClose:(event) => {
            srhList();
        },
    })
}

const barcodePrint = () =>{
    if( selectedItem.value.length === 0 ) return vWarning('바코드를 출력할 품목을 선택해주세요.')

    dialog.open(QrCodePop, {
        props:{
            header: 'QR코드 라벨 출력',
            modal: true,
            draggable: true,
            resizable: false,
            style: { width: '80rem', maxWidth: '80rem' },
            contentStyle: { height: '30rem', overflow: 'hidden' },
        },
        data:{
            menuType:'QC',
            itemList : selectedItem.value,
        }
    })
}

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

    if (!cols.length) {
        console.warn("No Columns Found");
        return;
    }

    exportToExcel(itemTestNoList.value, "시험번호별 리스트", cols);
}

onMounted( async () =>{
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')

    // 드래그 복사 이벤트 등록
    document.addEventListener('copy', handleCopy)
    document.addEventListener('mousedown', handleDocumentMouseDown)

    srhList()
})

onUnmounted(() => {
    // 드래그 복사 이벤트 해제
    document.removeEventListener('copy', handleCopy)
    document.removeEventListener('mousedown', handleDocumentMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
})

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '시험번호' },
    { label: '시험번호별내역' },
    { label: '시험번호별내역목록' },
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

/* =====================================================
   엑셀 방식 드래그 복사 CSS 추가
   ===================================================== */

::v-deep(.excel-copy-table .p-datatable-tbody > tr > td) {
    user-select: none;
    -webkit-user-select: none;
}

::v-deep(.excel-copy-table .p-datatable-tbody > tr > td.excel-selected) {
    background-color: #dbeafe !important;
    outline: 1px solid #60a5fa;
    outline-offset: -1px;
}
</style>
