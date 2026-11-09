
<template>
    <!-- 로딩 -->
    <div
        v-if="loading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30"
    >
        <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="4"
        />
    </div>

    <div class="flex justify-start mt-3 gap-2">
        <Button
            label="품목추가"
            severity="secondary"
            :disabled="loading || !isBtn"
            @click="openPop"
        />
        <Button
            label="엑셀"
            icon="pi pi-file-excel"
            severity="success"
            :disabled="loading"
            @click="downloadExcel"
        />
    </div>

    <!-- Handsontable -->
    <div class="w-full mt-2">
        <BaseHotTable
            ref="hotTable"
            :data="stockList"
            :colHeaders="colHeaders"
            :columns="columns"
            :rowHeaders="true"
            :height="430"
            width="100%"
            :afterChange="onAfterChange"
            :afterSelection="onAfterSelection"
        />
    </div>

    <div class="flex justify-end gap-2 mt-2">
        <Button
            v-if="isBtn"
            label="저장"
            severity="success"
            :disabled="loading || !writeYn"
            @click="saveInfo"
        />

        <Button
            v-if="isBtn"
            label="재고초기화"
            severity="danger"
            :disabled="loading || !writeYn"
            @click="stockInit"
        />

        <Button
            v-if="isBtn"
            label="실사재고삭제"
            severity="danger"
            :disabled="loading || !writeYn"
            @click="deleteRealStock"
        />

        <Button
            label="닫기"
            outlined
            class="ml-2"
            :disabled="loading"
            @click="closeDialog"
        />
    </div>
</template>
``
<script setup>
import { ApiStock } from '@/api/apiStock'
import BaseHotTable from '@/components/BaseHotTable.vue'
import { useAlertStore } from '@/stores/alert'
import { handleApiError } from '@/util/errorHandler.js'
import { useDialog } from 'primevue'
import ProgressSpinner from 'primevue/progressspinner'
import { useConfirm } from 'primevue/useconfirm'
import { inject, nextTick, onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'
import ItemListPop from './ItemListPop.vue'

const confirm = useConfirm()
const dialog = useDialog()
const dialogRef = inject('dialogRef')

const { vSuccess, vWarning } = useAlertStore()

const stockList = ref([])
const isBtn = ref(false)
const loading = ref(false)
const realStockMstId = ref(null)
const hotTable = ref(null)

// 재고초기화 여부
const isStockInitialized = ref(false)

const colHeaders = [
    '품목코드',
    '품목명',
    '시험번호',
    '장부수량',
    '실사수량',
    '차이',
    '비고'
]

// Handsontable 컬럼 정의
const columns = [
    {
        data: 'itemCd',
        type: 'text',
        className: 'htCenter',
        width: 130
    },
    {
        data: 'itemName',
        type: 'text',
        width: 300
    },
    {
        data: 'testNo',
        type: 'text',
        className: 'htCenter',
        width: 120
    },
    {
        data: 'docStockQty',
        type: 'numeric',
        className: 'htRight',
        width: 110,
        numericFormat: {
            pattern: '0,0.[000000]'
        }
    },
    {
        data: 'reqlStockQty',
        type: 'numeric',
        className: 'htRight',
        width: 110,
        numericFormat: {
            pattern: '0,0.[000000]'
        }
    },
    {
        data: 'diffStockQty',
        type: 'numeric',
        className: 'htRight',
        width: 110,
        readOnly: true,
        numericFormat: {
            pattern: '0,0.[000000]'
        }
    },
    {
        data: 'etc',
        type: 'text',
        width: 150
    }
]

// 빈 행 생성
const createEmptyRow = () => ({
    realStockItemId: null,
    itemCd: '',
    itemName: '',
    testNo: '',
    docStockQty: null,
    reqlStockQty: null,
    diffStockQty: null,
    etc: ''
})

// 숫자 변환
const toNumber = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return null
    }

    const num = Number(
        String(value).replace(/,/g, '').trim()
    )

    return Number.isFinite(num) ? num : null
}

// 차이 계산
const calcDiff = (docValue, reqlValue) => {
    if (
        reqlValue === null ||
        reqlValue === undefined ||
        reqlValue === ''
    ) {
        return null
    }

    const docQty = toNumber(docValue)
    const reqlQty = toNumber(reqlValue)

    if (docQty === null || reqlQty === null) {
        return null
    }

    return Math.round(
        (reqlQty - docQty) * 1000000
    ) / 1000000
}

// Handsontable 변경 처리
const onAfterChange = (changes, source) => {
    if (!changes) return

    if (
        source === 'loadData' ||
        source === 'calc'
    ) {
        return
    }

    const hot = hotTable.value?.hotInstance
    if (!hot) return

    const changedRows = new Set()

    changes.forEach(([row, prop]) => {
        if (
            prop === 'docStockQty' ||
            prop === 'reqlStockQty'
        ) {
            changedRows.add(row)
        }
    })

    if (changedRows.size === 0) return

    const updates = []

    changedRows.forEach(row => {
        const docValue = hot.getDataAtRowProp(
            row,
            'docStockQty'
        )

        const reqlValue = hot.getDataAtRowProp(
            row,
            'reqlStockQty'
        )

        updates.push([
            row,
            'diffStockQty',
            calcDiff(docValue, reqlValue)
        ])
    })

    if (updates.length > 0) {
        hot.setDataAtRowProp(updates, 'calc')
    }
}

const onAfterSelection = () => {
}

// 재고 초기화
const stockInit = () => {
    confirm.require({
        header: '품목 초기화',
        message: '현재 장부재고 내용을 초기화 합니다..',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '예',
        rejectLabel: '아니오',
        acceptClass: 'p-button-danger',

        accept: async () => {
            if (loading.value) return

            stockList.value = [createEmptyRow()]
            isStockInitialized.value = true

            await nextTick()

            const hot = hotTable.value?.hotInstance

            if (hot) {
                hot.deselectCell()
                hot.render()
            }
        }
    })
}

// 저장
const saveInfo = async () => {
    if (loading.value) return

    const hot = hotTable.value?.hotInstance

    // 편집 중인 셀 확정
    hot?.getActiveEditor()?.finishEditing()

    // Handsontable에서 현재 데이터를 가져옴
    const currentData = hot
        ? hot.getSourceData()
        : stockList.value

    // 빈 행 제외
    const saveList = currentData
        .filter(row =>
            row &&
            row.itemCd != null &&
            String(row.itemCd).trim() !== ''
        )
        .map(row => ({
            ...row,
            itemCd: String(row.itemCd).trim(),
            itemName: row.itemName ?? '',
            testNo: row.testNo ?? '',
            docStockQty: toNumber(row.docStockQty),
            reqlStockQty: toNumber(row.reqlStockQty),
            diffStockQty: calcDiff(
                row.docStockQty,
                row.reqlStockQty
            ),
            etc: row.etc ?? ''
        }))

    if (saveList.length === 0) {
        vWarning('저장할 실사재고 품목이 없습니다.')
        return
    }

    // 수량 검증
    const invalidIndex = saveList.findIndex(row =>
        row.docStockQty === null ||
        row.reqlStockQty === null
    )

    if (invalidIndex !== -1) {
        vWarning(
            `${invalidIndex + 1}번째 품목의 장부수량 또는 실사수량을 확인하세요.`
        )
        return
    }

    loading.value = true

    try {
        const params = {
            realStock: {
                realStockMstId: realStockMstId.value
            },
            realStockItemList: saveList
        }

        await ApiStock.saveRealStockItemList(params)

        vSuccess(
            `${saveList.length}건의 실사재고 품목이 등록되었습니다.`
        )

        closeDialog()

    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}

// 실사재고 전체 삭제
const deleteRealStock = () => {
    if (loading.value) return

    confirm.require({
        header: '실사재고 삭제 확인',
        message: '실사재고 삭제하시겠습니까? 삭제 후 복구가 불가능합니다.',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '예',
        rejectLabel: '아니오',
        acceptClass: 'p-button-danger',

        accept: async () => {
            if (loading.value) return

            loading.value = true

            try {
                await ApiStock.deleteRealStock(
                    realStockMstId.value
                )

                vSuccess('실사재고가 삭제되었습니다.')
                closeDialog()

            } catch (err) {
                handleApiError(err)
            } finally {
                loading.value = false
            }
        }
    })
}

// 엑셀 다운로드
const downloadExcel = () => {
    const hot = hotTable.value?.hotInstance

    const currentData = hot
        ? hot.getSourceData()
        : stockList.value

    const rows = currentData.filter(row =>
        row &&
        row.itemCd != null &&
        String(row.itemCd).trim() !== ''
    )

    if (rows.length === 0) {
        vWarning('다운로드할 데이터가 없습니다.')
        return
    }

    // Handsontable 컬럼 순서와 동일하게 구성
    const excelData = rows.map(item => ({
        '품목코드': item.itemCd ?? '',
        '품목명': item.itemName ?? '',
        '시험번호': item.testNo ?? '',
        '장부수량': toNumber(item.docStockQty) ?? 0,
        '실사수량': toNumber(item.reqlStockQty),
        '차이': calcDiff(
            item.docStockQty,
            item.reqlStockQty
        ),
        '비고': item.etc ?? ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(
        excelData
    )

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        '장부재고'
    )

    XLSX.writeFile(
        workbook,
        '장부재고.xlsx'
    )
}

// 품목 추가 팝업
const openPop = () => {
    if (loading.value) return

    dialog.open(ItemListPop, {
        props: {
            header: '재고품목 조회',
            modal: true,
            draggable: false
        },
        onClose: (event) => {
            if (event?.data) {
                addRow(event.data)
            }
        }
    })
}

// 품목 추가
const addRow = (obj) => {
    if (!obj || !Array.isArray(obj)) return

    const newItems = obj.map(item => ({
        realStockItemId: null,
        itemCd: item.itemCd,
        itemName: item.itemName,
        testNo: item.testNo,
        docStockQty: item.currentStockQty ?? 0,
        reqlStockQty: null,
        diffStockQty: null,
        etc: ''
    }))

    // 초기 빈 행만 있는 경우 제거
    const currentRows = stockList.value.filter(row =>
        row.itemCd != null &&
        String(row.itemCd).trim() !== ''
    )

    stockList.value = [
        ...currentRows,
        ...newItems
    ]
}

// 최초 조회
onMounted(async () => {
    const data = dialogRef.value?.data

    isBtn.value = data?.endYn === 'N'
    realStockMstId.value = data?.realStockMstId

    loading.value = true

    try {
        const result = await ApiStock.getRealStockItemList(
            realStockMstId.value
        )

        stockList.value = Array.isArray(result)
            ? result
            : []

    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
})

// 팝업 닫기
const closeDialog = () => {
    dialogRef.value.close()
}
</script>

<style scoped>
.hot-wrapper {
    width: 100%;
    padding-right: 15px;
    box-sizing: border-box;
}

:deep(.handsontable thead th) {
    background-color: #bca9a2 !important;
}
</style>
