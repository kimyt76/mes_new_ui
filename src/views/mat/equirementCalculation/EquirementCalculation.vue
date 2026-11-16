
<template>
<Breadcrumb :home="home" :model="items"/>

<div>
    <div class="mt-2 mb-3 flex gap-2">
        <Button label="품목추가" @click="openPop"/>
        <Button label="초기화" icon="pi pi-refresh" severity="secondary" type="button" @click="allClear" />
        <Button label="계산하기" severity="info" @click="bomCalculation"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
    </div>
</div>

<!-- 상단 BOM 리스트 -->
<div
    ref="bomTableWrapper"
    class="table-wrapper"
    @pointerdown="onBomPointerDown"
    @pointermove="onBomPointerMove"
>
    <DataTable
        v-model:selection="selectedItem"
        :value="itemBomList"
        selection-mode="multiple"
        data-key="rowId"
        class="my-table bom-table"
        scrollable
        scrollHeight="flex"
        :tableStyle="{ width: '100%', minWidth: '0', tableLayout: 'fixed' }"
        showGridlines
    >
        <Column selectionMode="multiple" headerStyle="width: 35px" style="width: 35px; text-align: center;" />
        <Column field="itemCd" header="품목코드" :style="{ width: '105px', textAlign: 'center' }" />
        <Column field="bomVer" header="BOM버전" :style="{ width: '105px', textAlign: 'center' }" />
        <Column field="itemName" header="품목명" :style="{ width: '450px' }" />
        <Column field="unit" header="단위" :style="{ width: '55px', textAlign: 'center' }" />
        <Column field="qty" header="생산량" :style="{ width: '130px' }" :bodyStyle="{ padding: '0', textAlign: 'right' }" :headerStyle="{ padding: '0' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.qty"
                    class="w-full"
                    :min="0"
                    size="small"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '100%', textAlign: 'right' }"
                />
            </template>
        </Column>
        <Column field="etc" header="비고" :style="{ width: '350px', textAlign: 'left' }" />
        <Column field="actions" header="-" :style="{ width: '40px', textAlign: 'center' }">
            <template #body="slotProps">
                <i
                    class="pi pi-trash cursor-pointer"
                    @click="removeRow(slotProps.index)"
                ></i>
            </template>
        </Column>
    </DataTable>
</div>

<!-- 하단 재고 및 소요량 리스트 -->
<div class="stock-table-wrapper">
    <DataTable
        ref="dt"
        v-model:first="first"
        v-model:selection="selectedItem"
        :loading="loading"
        :value="itemStockList"
        data-key="itemCd"
        class="my-table"
        scrollHeight="flex"
        showGridlines
        scrollable
    >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>

        <Column field="itemCd" header="품목코드"
            :style="{ width: '120px', textAlign: 'center'}" />

        <Column field="itemTypeName" header="품목구분"
            :style="{ width: '80px', textAlign: 'center'}" />

        <Column field="itemName" header="품목명"
            :style="{ width: '300px'}" />

        <Column field="spec" header="규격"
            :style="{ width: '50px', textAlign: 'center'}" />

        <Column field="realStockQty" header="재고수량(A)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.realStockQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="reserveStockQty" header="발주(입고예정)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.reserveStockQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="reqQty" header="소요량(B)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.reqQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="differenceQty" header="차이(A-B)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.differenceQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="customerName" header="구매처"
            :style="{ width: '200px'}" />

        <Column field="orderType" header="사급/자급"
            :style="{ width: '100px', textAlign: 'center'}" />

        <Column field="inPrice" header="단가"
            :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.inPrice).toLocaleString() }}
            </template>
        </Column>
    </DataTable>
</div>

<Dialog
    v-model:visible="bomDialog"
    header="품목조회"
    modal
    :draggable="false"
    :resizable="false"
>
    <BomMultiListPop
        :typeCd="typeCd"
        @selected="handleSelect"
        @close="bomDialog=false"
    />
</Dialog>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { exportToExcel } from '@/util/exportToExcel';
import BomMultiListPop from '@/views/lab/bom/BomMultiListPop.vue';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { vInfo, vWarning } = useAlertStore()
const loading = ref(false)
let rowIdSeq = 0
const first = ref(0)
const bomDialog = ref(false)
const selectedItem = ref([])
const itemBomList = ref([])
const itemStockList = ref([])
const typeCd = ref('M3')
const dt = ref(null)

// =====================================================
// 상단 BOM 셀 드래그 선택 및 Ctrl+C 복사
// =====================================================
const bomTableWrapper = ref(null)
const bomDragStart = ref(null)
const bomDragEnd = ref(null)
const bomDragging = ref(false)
const bomCopyActive = ref(false)

// 체크박스 및 삭제 컬럼 제외
const bomCopyFields = [
    'itemCd',
    'bomVer',
    'itemName',
    'unit',
    'qty',
    'etc'
]

// 마우스 좌표에 해당하는 셀 위치 반환
const getBomCellPosition = (event) => {
    const wrapper = bomTableWrapper.value
    if (!wrapper) return null

    const target = document.elementFromPoint(
        event.clientX,
        event.clientY
    )

    const cell = target?.closest(
        '.bom-table .p-datatable-tbody > tr > td'
    )

    if (!cell || !wrapper.contains(cell)) return null

    const row = cell.parentElement

    const rowIndex = Array.from(
        row.parentElement.children
    ).indexOf(row)

    const actualColIndex = Array.from(
        row.children
    ).indexOf(cell)

    // 첫 번째 체크박스 컬럼 제외
    const colIndex = actualColIndex - 1

    if (
        rowIndex < 0 ||
        colIndex < 0 ||
        colIndex >= bomCopyFields.length
    ) {
        return null
    }

    return { rowIndex, colIndex }
}

// 드래그 시작
const onBomPointerDown = (event) => {
    if (event.button !== 0) return
    if (event.pointerType === 'touch') return

    const target = event.target
    if (!(target instanceof Element)) return

    // 기존 체크박스, 숫자 입력, 삭제 기능 유지
    if (target.closest(
        'input, button, textarea, .p-checkbox, .p-inputnumber, .pi-trash, [contenteditable="true"]'
    )) {
        return
    }

    const position = getBomCellPosition(event)
    if (!position) return

    bomDragging.value = true
    bomCopyActive.value = true

    bomDragStart.value = position
    bomDragEnd.value = position

    // 브라우저 기본 텍스트 드래그 방지
    event.preventDefault()

    updateBomDragStyle()
}

// 드래그 이동
const onBomPointerMove = (event) => {
    if (!bomDragging.value) return

    if ((event.buttons & 1) !== 1) {
        bomDragging.value = false
        return
    }

    const position = getBomCellPosition(event)
    if (!position) return

    if (
        bomDragEnd.value?.rowIndex === position.rowIndex &&
        bomDragEnd.value?.colIndex === position.colIndex
    ) {
        return
    }

    bomDragEnd.value = position
    updateBomDragStyle()
}

// 선택 범위 표시
const updateBomDragStyle = () => {
    const wrapper = bomTableWrapper.value
    if (!wrapper || !bomDragStart.value || !bomDragEnd.value) return

    const minRow = Math.min(
        bomDragStart.value.rowIndex,
        bomDragEnd.value.rowIndex
    )
    const maxRow = Math.max(
        bomDragStart.value.rowIndex,
        bomDragEnd.value.rowIndex
    )
    const minCol = Math.min(
        bomDragStart.value.colIndex,
        bomDragEnd.value.colIndex
    )
    const maxCol = Math.max(
        bomDragStart.value.colIndex,
        bomDragEnd.value.colIndex
    )

    const rows = wrapper.querySelectorAll(
        '.bom-table .p-datatable-tbody > tr'
    )

    rows.forEach((row, rowIndex) => {
        Array.from(row.children).forEach((cell, actualColIndex) => {
            const colIndex = actualColIndex - 1

            const selected =
                rowIndex >= minRow &&
                rowIndex <= maxRow &&
                colIndex >= minCol &&
                colIndex <= maxCol &&
                colIndex >= 0 &&
                colIndex < bomCopyFields.length

            cell.classList.toggle('bom-cell-selected', selected)
        })
    })
}

// 드래그 종료
const onBomPointerUp = () => {
    bomDragging.value = false
}

// 선택 범위 초기화
const clearBomDragSelection = () => {
    bomDragging.value = false
    bomCopyActive.value = false
    bomDragStart.value = null
    bomDragEnd.value = null

    bomTableWrapper.value
        ?.querySelectorAll('.bom-cell-selected')
        .forEach(cell => {
            cell.classList.remove('bom-cell-selected')
        })
}

// 선택한 셀만 탭으로 구분해 복사
const getBomCopyText = () => {
    if (!bomDragStart.value || !bomDragEnd.value) return ''

    const minRow = Math.min(
        bomDragStart.value.rowIndex,
        bomDragEnd.value.rowIndex
    )
    const maxRow = Math.max(
        bomDragStart.value.rowIndex,
        bomDragEnd.value.rowIndex
    )
    const minCol = Math.min(
        bomDragStart.value.colIndex,
        bomDragEnd.value.colIndex
    )
    const maxCol = Math.max(
        bomDragStart.value.colIndex,
        bomDragEnd.value.colIndex
    )

    return itemBomList.value
        .slice(minRow, maxRow + 1)
        .map(row =>
            bomCopyFields
                .slice(minCol, maxCol + 1)
                .map(field => row[field] ?? '')
                .join('\t')
        )
        .join('\n')
}

// 클립보드 복사
const copyBomToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return
        } catch (err) {
            console.warn('Clipboard API 실패:', err)
        }
    }

    // HTTP 환경 등에서 대체 방식 사용
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    textarea.setAttribute('readonly', '')

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    const success = document.execCommand('copy')
    textarea.remove()

    if (!success) {
        console.error('BOM 클립보드 복사 실패')
    }
}

// Ctrl+C 복사
const onBomKeyDown = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return
    if (event.key.toLowerCase() !== 'c') return

    // 입력창의 기존 복사 기능 유지
    if (
        event.target instanceof Element &&
        event.target.closest(
            'input, textarea, [contenteditable="true"]'
        )
    ) {
        return
    }

    if (!bomCopyActive.value) return

    const text = getBomCopyText()
    if (!text) return

    event.preventDefault()
    copyBomToClipboard(text)
}

// 이벤트 등록
onMounted(() => {
    window.addEventListener('pointerup', onBomPointerUp)
    window.addEventListener('pointercancel', onBomPointerUp)
    window.addEventListener('keydown', onBomKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('pointerup', onBomPointerUp)
    window.removeEventListener('pointercancel', onBomPointerUp)
    window.removeEventListener('keydown', onBomKeyDown)
})

// BOM 리스트 변경 시 이전 드래그 범위 제거
watch(itemBomList, async () => {
    await nextTick()
    clearBomDragSelection()
})

// =====================================================
// 기존 기능 - 변경 없음
// =====================================================

const removeRow = (index) => {
    itemBomList.value.splice(index, 1)
}

const openPop = () => {
    bomDialog.value = true
}

const handleSelect = (rows) => {
    if (!Array.isArray(rows)) return;
    addRows(rows)
}

// 반제품에 대한 소요량 계산(원재료)
const bomCalculation = async () => {
    const zeroQtyItem = itemBomList.value.find(item => Number(item.qty) === 0);
    if (zeroQtyItem) {
        vInfo("제조량이 0인 품목이 있습니다. 제조량을 입력하세요.");
        return false;
    }

    loading.value = true;
    try {
        itemStockList.value = await ApiMat.getItemStockList(itemBomList.value);
    } finally {
        loading.value = false;
    }
}

const allClear = () => {
    rowIdSeq = 0
    selectedItem.value = []
    itemBomList.value = []
    itemStockList.value = []
}

const addRows = (rows) => {
    const rowItem = rows.map((o, index) => ({
        rowId: ++rowIdSeq,
        itemCd: o.itemCd,
        bomVer: o.bomVer,
        itemName: o.itemName,
        unit: o.unit,
        qty: 0,
        etc: o.etc,
        bomId: o.bomId,
    }));

    if (itemBomList.value.length > 0) {
        itemBomList.value.push(...rowItem);
    } else {
        itemBomList.value = [...rowItem];
    }
}

/**
 * title
 */
const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '제조관리' },
    { label: '소요량계산(원재료)' },
]);

const downloadExcel = () => {
    const cols = dt.value?.columns ?? [];

    if (!cols.length) {
        console.warn("No Columns Found");
        return;
    }
    exportToExcel(itemStockList.value, "소요량계산(원재료) 리스트", cols);
}
</script>

<style scoped>
/* 상단 BOM 테이블 영역 */
.table-wrapper {
    width: 1300px;
    max-width: 100%;
    height: 200px;
    min-height: 0;
    margin-bottom: 20px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

/* 하단 테이블 영역 */
.stock-table-wrapper {
    width: 100%;
    height: 570px;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

/* DataTable 자체 높이 */
:deep(.table-wrapper .p-datatable),
:deep(.stock-table-wrapper .p-datatable) {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* 상단 스크롤 영역 */
:deep(.table-wrapper .p-datatable-table-container) {
    width: 100%;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    scrollbar-gutter: stable;
}

/* 상단 내부 테이블 너비 강제 */
:deep(.bom-table .p-datatable-table) {
    width: 100% !important;
    min-width: 0 !important;
    table-layout: fixed !important;
}

/* 상단 컬럼의 최소 너비 제한 해제 */
:deep(.bom-table .p-datatable-thead > tr > th),
:deep(.bom-table .p-datatable-tbody > tr > td) {
    min-width: 0 !important;
    box-sizing: border-box;
    overflow-wrap: anywhere;
}

/* 상단 입력 컴포넌트 너비 제한 */
:deep(.bom-table .p-inputnumber) {
    width: 100%;
    min-width: 0;
}

:deep(.bom-table .p-inputnumber-input) {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
}

/* 하단 테이블 내부 스크롤 */
:deep(.stock-table-wrapper .p-datatable-table-container) {
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    overflow-y: auto !important;
    overflow-x: auto !important;
}

/* 기존 버튼 스타일 */
.btn-del {
    background-color: #ff6b6b !important;
    color: white !important;
}

/* 기존 헤더 스타일 */
:deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    padding: 8px 8px 0.3rem 0.3rem;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: Lobo, Consolas;
}

/* =====================================================
   추가: 상단 BOM 셀 드래그 선택 스타일
   ===================================================== */

/* 선택된 셀만 파란색 강조 */
:deep(.bom-table .p-datatable-tbody > tr > td.bom-cell-selected) {
    background-color: #bfdbfe !important;
}

/* 드래그 중 브라우저 텍스트 선택 방지 */
:deep(.bom-table .p-datatable-tbody > tr > td) {
    user-select: none;
    -webkit-user-select: none;
}

/* 생산량 입력창은 기존 텍스트 선택 유지 */
:deep(.bom-table .p-inputnumber-input) {
    user-select: text;
    -webkit-user-select: text;
    cursor: text;
}
</style>
