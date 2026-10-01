<template>
    <div class="prod-page">
        <div class="title-area">
            <div class="page-title">인 건 비 현 황 ({{ areaName }})</div>
            <div class="title-search">
                <FloatLabel variant="on">
                    <InputText
                        :modelValue="todayDate"
                        readonly
                        style="width: 120px; text-align: center"
                    />
                    <label>일자</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select
                        v-model="form.areaCd"
                        :options="areaCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 130px"
                    />
                    <label>공장</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select
                        v-model="form.workTypeCd"
                        :options="workTypeCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 130px"
                    />
                    <label>근무구분</label>
                </FloatLabel>
            </div>
        </div>
        <!-- 1. 칭량 -->
        <section class="list-section">
            <div class="section-header section-blue">
                <h5>1. 칭량(Kg)</h5>
                <Button
                    v-if="isBtn"
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('weigh')"
                />
            </div>
            <LaborCostTable
                :list="weighList"
                :proc-cd="PROC_CD.weigh"
                :readonly="!isBtn"
                empty-message="등록된 칭량 인건비 내역이 없습니다."
                @remove="removeRow('weigh', $event)"
            />
            <div class="table-summary">
                <span>합계</span>
                <span>생산수량: {{ formatNumber(weighTotalQty) }}</span>
                <span>인건비: {{ formatNumber(weighTotalAmount) }}</span>
            </div>
        </section>
        <!-- 2. 제조 -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>2. 제조(Kg)</h5>
                <Button
                    v-if="isBtn"
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('mat')"
                />
            </div>
            <LaborCostTable
                :list="matList"
                :proc-cd="PROC_CD.mat"
                :readonly="!isBtn"
                empty-message="등록된 제조 인건비 내역이 없습니다."
                @remove="removeRow('mat', $event)"
            />
            <div class="table-summary">
                <span>합계</span>
                <span>생산수량: {{ formatNumber(matTotalQty) }}</span>
                <span>인건비: {{ formatNumber(matTotalAmount) }}</span>
            </div>
        </section>
        <!-- 3. 코팅 -->
        <section class="list-section">
            <div class="section-header section-gray">
                <h5>3. 코팅(M)</h5>
                <Button
                    v-if="isBtn"
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('coating')"
                />
            </div>
            <LaborCostTable
                :list="coatingList"
                :proc-cd="PROC_CD.coating"
                :readonly="!isBtn"
                empty-message="등록된 코팅 인건비 내역이 없습니다."
                @remove="removeRow('coating', $event)"
            />
            <div class="table-summary">
                <span>합계</span>
                <span>생산수량: {{ formatNumber(coatingTotalQty) }}</span>
                <span>인건비: {{ formatNumber(coatingTotalAmount) }}</span>
            </div>
        </section>
        <!-- 4. 충전 -->
        <section class="list-section">
            <div class="section-header section-yellow">
                <h5>4. 충진(EA)</h5>
                <Button
                    v-if="isBtn"
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('charge')"
                />
            </div>
            <LaborCostTable
                :list="chargeList"
                :proc-cd="PROC_CD.charge"
                :readonly="!isBtn"
                empty-message="등록된 충진 인건비 내역이 없습니다."
                @remove="removeRow('charge', $event)"
            />
            <div class="table-summary">
                <span>합계</span>
                <span>생산수량: {{ formatNumber(chargeTotalQty) }}</span>
                <span>인건비: {{ formatNumber(chargeTotalAmount) }}</span>
            </div>
        </section>
        <!-- 5. 포장 -->
        <section class="list-section">
            <div class="section-header section-green">
                <h5>5. 포장(EA)</h5>
                <Button
                    v-if="isBtn"
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('packing')"
                />
            </div>
            <LaborCostTable
                :list="packingList"
                :proc-cd="PROC_CD.packing"
                :readonly="!isBtn"
                empty-message="등록된 포장 인건비 내역이 없습니다."
                @remove="removeRow('packing', $event)"
            />
            <div class="table-summary">
                <span>합계</span>
                <span>생산수량: {{ formatNumber(packingTotalQty) }}</span>
                <span>인건비: {{ formatNumber(packingTotalAmount) }}</span>
            </div>
        </section>
        <div class="bottom-buttons">
            <Button
                v-if="isBtn"
                label="저장"
                icon="pi pi-save"
                @click="saveInfo"
            />
            <Button
                v-if="isBtn"
                label="종결"
                icon="pi pi-check"
                @click="updateEndYn"
            />
            <Button
                label="엑셀"
                icon="pi pi-file-excel"
                severity="success"
                @click="downloadLaborCost"
            />
            <Button
                label="닫기"
                outlined
                class="ml-2"
                @click="closeDialog"
            />
        </div>
    </div>
</template>
<script setup>
import { ApiBase } from '@/api/apiBase'
import { ApiCommon } from '@/api/apiCommon'
import { todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { computed, defineComponent, h, inject, onMounted, reactive, ref, watch } from 'vue'
const dialogRef = inject('dialogRef', null)
const selectedRowIndex = ref(0)
const isBtn = ref(true)
const isInitializing = ref(true)
const areaCds = ref([])
const areaName = ref('')
const todayDate = todayKST()
const workTypeCds = ref([
    { code: 'D', codeNm: '주간' },
    { code: 'O', codeNm: '잔업' },
    { code: 'N', codeNm: '야간' },
])
const form = reactive({
    dailyDate: todayKST(),
    workTypeCd: 'D',
    areaCd: 'A001',
    typeCd: 'C',
    endYn: 'N',
    dailyId: null,
})
const PROC_CD = Object.freeze({
    weigh: 'PRC001',
    mat: 'PRC002',
    coating: 'PRC003',
    charge: 'PRC004',
    packing: 'PRC005',
})
const weighList = ref([])
const matList = ref([])
const coatingList = ref([])
const chargeList = ref([])
const packingList = ref([])
const laborCostRateList = ref([])
const savedLaborCostList = ref([])
const deleteWeighIds = ref([])
const deleteMatIds = ref([])
const deleteCoatingIds = ref([])
const deleteChargeIds = ref([])
const deletePackingIds = ref([])
const listMap = {
    weigh: weighList,
    mat: matList,
    coating: coatingList,
    charge: chargeList,
    packing: packingList,
}
const deleteIdMap = {
    weigh: deleteWeighIds,
    mat: deleteMatIds,
    coating: deleteCoatingIds,
    charge: deleteChargeIds,
    packing: deletePackingIds,
}

const resetAllLists = () => {
    Object.entries(listMap).forEach(([type, listRef]) => {
        const deleteIds = deleteIdMap[type]

        listRef.value.forEach(row => {
            if (
                row.dailyCostId != null &&
                row.dailyCostId !== '' &&
                !deleteIds.value.includes(row.dailyCostId)
            ) {
                deleteIds.value.push(row.dailyCostId)
            }
        })

        listRef.value = []
    })

    savedLaborCostList.value = []
    selectedRowIndex.value = 0
}
const createLaborCostRow = (procCd) => ({
    dailyCostId: null,
    dailyId: form.dailyId,
    procCd,
    orderDist: 0,
    lotNo: '',
    customerName: '',
    itemName: '',
    prodType: '',
    prodQty: 0,
    workTime: 0,
    manFCnt: 0,
    manDCnt: 0,
    womFCnt: 0,
    womDCnt: 0,
    manFCost: 0,
    manDCost: 0,
    womFCost: 0,
    womDCost: 0,
    etc: '',
})
const normalizeLaborCostRow = (row, procCd) => ({
    dailyCostId: row?.dailyCostId ?? null,
    dailyId: row?.dailyId ?? form.dailyId,
    procCd: row?.procCd ?? procCd,
    orderDist: Number(row?.orderDist) || 0,
    lotNo: row?.lotNo ?? '',
    customerName: row?.customerName ?? '',
    itemName: row?.itemName ?? '',
    prodType: row?.prodType ?? '',
    prodQty: Number(row?.prodQty) || 0,
    workTime: Number(row?.workTime) || 0,
    manFCnt: Number(row?.manFCnt) || 0,
    manDCnt: Number(row?.manDCnt) || 0,
    womFCnt: Number(row?.womFCnt) || 0,
    womDCnt: Number(row?.womDCnt) || 0,
    manFCost: row?.manFCost ?? null,
    manDCost: row?.manDCost ?? null,
    womFCost: row?.womFCost ?? null,
    womDCost: row?.womDCost ?? null,
    etc: row?.etc ?? '',
})
const reorderList = (list) => {
    list.forEach((row, index) => {
        row.orderDist = index + 1
    })
    return list
}
const sortAndReorderList = (list) => {
    const hasOrderDist = list.some(row => Number(row?.orderDist) > 0)
    if (hasOrderDist) {
        list.sort((a, b) => {
            const aOrder = Number(a?.orderDist) || Number.MAX_SAFE_INTEGER
            const bOrder = Number(b?.orderDist) || Number.MAX_SAFE_INTEGER
            return aOrder - bOrder
        })
    }
    return reorderList(list)
}
const sortAndReorderAllLists = () => {
    Object.values(listMap).forEach(listRef => {
        sortAndReorderList(listRef.value)
    })
}
const getLaborCostRate = () => {
    return laborCostRateList.value.find(
        item => item.workTypeCd === form.workTypeCd
    ) ?? null
}
const applyLaborCost = (row) => {
    if (!row) return row

    const rate = getLaborCostRate()

    if (!rate) return row

    // 인원수 / 작업시간과 상관없이 현재 근무구분의 기준 단가를 항상 저장
    row.manFCost = Number(rate.manFCost) || 0
    row.manDCost = Number(rate.manDCost) || 0
    row.womFCost = Number(rate.womFCost) || 0
    row.womDCost = Number(rate.womDCost) || 0

    return row
}

const setNewLaborCostLists = (res) => {
    weighList.value = (res?.weighList || []).map(row =>
        applyLaborCost(normalizeLaborCostRow(row, PROC_CD.weigh))
    )
    matList.value = (res?.matList || []).map(row =>
        applyLaborCost(normalizeLaborCostRow(row, PROC_CD.mat))
    )
    coatingList.value = (res?.coatingList || []).map(row =>
        applyLaborCost(normalizeLaborCostRow(row, PROC_CD.coating))
    )
    chargeList.value = (res?.chargeList || []).map(row =>
        applyLaborCost(normalizeLaborCostRow(row, PROC_CD.charge))
    )
    packingList.value = (res?.packingList || []).map(row =>
        applyLaborCost(normalizeLaborCostRow(row, PROC_CD.packing))
    )
}

const setSavedLaborCostLists = (res) => {

    savedLaborCostList.value = Array.isArray(res?.laborCostList)
        ? res.laborCostList
        : []

    if (savedLaborCostList.value.length > 0) {

        weighList.value = savedLaborCostList.value
            .filter(row => row.procCd === PROC_CD.weigh)
            .map(row =>
                applyLaborCost(
                    normalizeLaborCostRow(row, PROC_CD.weigh)
                )
            )

        matList.value = savedLaborCostList.value
            .filter(row => row.procCd === PROC_CD.mat)
            .map(row =>
                applyLaborCost(
                    normalizeLaborCostRow(row, PROC_CD.mat)
                )
            )

        coatingList.value = savedLaborCostList.value
            .filter(row => row.procCd === PROC_CD.coating)
            .map(row =>
                applyLaborCost(
                    normalizeLaborCostRow(row, PROC_CD.coating)
                )
            )

        chargeList.value = savedLaborCostList.value
            .filter(row => row.procCd === PROC_CD.charge)
            .map(row =>
                applyLaborCost(
                    normalizeLaborCostRow(row, PROC_CD.charge)
                )
            )

        packingList.value = savedLaborCostList.value
            .filter(row => row.procCd === PROC_CD.packing)
            .map(row =>
                applyLaborCost(
                    normalizeLaborCostRow(row, PROC_CD.packing)
                )
            )

        return
    }

    weighList.value = (res?.weighList || []).map(row =>
        applyLaborCost(
            normalizeLaborCostRow(row, PROC_CD.weigh)
        )
    )

    matList.value = (res?.matList || []).map(row =>
        applyLaborCost(
            normalizeLaborCostRow(row, PROC_CD.mat)
        )
    )

    coatingList.value = (res?.coatingList || []).map(row =>
        applyLaborCost(
            normalizeLaborCostRow(row, PROC_CD.coating)
        )
    )

    chargeList.value = (res?.chargeList || []).map(row =>
        applyLaborCost(
            normalizeLaborCostRow(row, PROC_CD.charge)
        )
    )

    packingList.value = (res?.packingList || []).map(row =>
        applyLaborCost(
            normalizeLaborCostRow(row, PROC_CD.packing)
        )
    )
}

onMounted(async () => {
    try {
        form.dailyId = dialogRef?.value?.data?.dailyId ?? null
        form.endYn = dialogRef?.value?.data?.endYn ?? 'N'

        areaCds.value = await ApiCommon.getCodeList('area')

        const laborRateRes = await ApiBase.getLaborCostList()
        laborCostRateList.value = Array.isArray(laborRateRes)
            ? laborRateRes
            : laborRateRes?.laborCostList || []

        const res = await ApiBase.getLaborCostInfo(form.dailyId)

        if (res?.dailyReportInfo) {
            Object.assign(form, res.dailyReportInfo)
        }
        isBtn.value = form.endYn !== 'Y'
        if (!form.dailyId) {
            setNewLaborCostLists(res || {})
        } else {
            setSavedLaborCostLists(res || {})
        }
        sortAndReorderAllLists()
    } catch (error) {
        handleApiError(error)
    } finally {
        isInitializing.value = false
    }
})
watch(
    [() => form.areaCd, areaCds],
    ([areaCd], [oldAreaCd]) => {
        const area = areaCds.value.find(item => item.code === areaCd)
        areaName.value = area?.codeNm ?? ''

        if (isInitializing.value) return

        if (areaCd !== oldAreaCd) {
            resetAllLists()
        }
    },
    { immediate: true }
)
watch(
    () => form.workTypeCd,
    (newWorkTypeCd, oldWorkTypeCd) => {
        if (isInitializing.value) return
        if (newWorkTypeCd === oldWorkTypeCd) return

        resetAllLists()
    }
)
const addRow = (type) => {
    const targetList = listMap[type]
    const procCd = PROC_CD[type]
    if (!targetList || !procCd) return
    const row = createLaborCostRow(procCd)
    targetList.value.push(applyLaborCost(row))
    reorderList(targetList.value)
}
const removeRow = (type, index) => {
    const targetList = listMap[type]
    const deleteIds = deleteIdMap[type]
    if (!targetList || !deleteIds || index < 0) return
    const row = targetList.value[index]
    if (!row) return
    if (
        row.dailyCostId != null &&
        row.dailyCostId !== '' &&
        !deleteIds.value.includes(row.dailyCostId)
    ) {
        deleteIds.value.push(row.dailyCostId)
    }
    targetList.value.splice(index, 1)
    reorderList(targetList.value)
}

const calculateAmount = (row) => {
    const workTime = Number(row?.workTime) || 0

    return (
          (Number(row?.manFCnt) || 0) * workTime * (Number(row?.manFCost) || 0)
        + (Number(row?.manDCnt) || 0) * workTime * (Number(row?.manDCost) || 0)
        + (Number(row?.womFCnt) || 0) * workTime * (Number(row?.womFCost) || 0)
        + (Number(row?.womDCnt) || 0) * workTime * (Number(row?.womDCost) || 0)
    )
}

const createTotalQty = (listRef) => computed(() => {
    return listRef.value.reduce(
        (sum, row) => sum + (Number(row.prodQty) || 0),
        0
    )
})
const createTotalAmount = (listRef) => computed(() => {
    return listRef.value.reduce(
        (sum, row) => sum + calculateAmount(row),
        0
    )
})
const weighTotalQty = createTotalQty(weighList)
const matTotalQty = createTotalQty(matList)
const coatingTotalQty = createTotalQty(coatingList)
const chargeTotalQty = createTotalQty(chargeList)
const packingTotalQty = createTotalQty(packingList)
const weighTotalAmount = createTotalAmount(weighList)
const matTotalAmount = createTotalAmount(matList)
const coatingTotalAmount = createTotalAmount(coatingList)
const chargeTotalAmount = createTotalAmount(chargeList)
const packingTotalAmount = createTotalAmount(packingList)
const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('ko-KR', {
        maximumFractionDigits: 3,
    })
}
const saveInfo = async () => {
    try {
        Object.values(listMap).forEach(listRef => {
            reorderList(listRef.value)
            listRef.value.forEach(row => {
                applyLaborCost(row)
            })
        })
        const params = {
            dailyReportInfo: form,
            weighList: weighList.value,
            matList: matList.value,
            coatingList: coatingList.value,
            chargeList: chargeList.value,
            packingList: packingList.value,
            deleteWeighIds: deleteWeighIds.value,
            deleteMatIds: deleteMatIds.value,
            deleteCoatingIds: deleteCoatingIds.value,
            deleteChargeIds: deleteChargeIds.value,
            deletePackingIds: deletePackingIds.value,
        }
        await ApiBase.saveLaborCostInfo(params)
        vSuccess('저장되었습니다.')
        closeDialog()
    } catch (error) {
        console.error('저장 중 오류 발생:', error)
        handleApiError(error)
    }
}
const updateEndYn = async () => {
    try {
        const params = {
            dailyId: form.dailyId,
            endYn: 'Y',
        }
        await ApiBase.updateDailyReportEndYn(params)
        form.endYn = 'Y'
        isBtn.value = false
        vSuccess('종결 처리되었습니다.')
    } catch (error) {
        handleApiError(error)
    }
}
const downloadLaborCost = async () => {
    if (!form.dailyId) {
        vInfo('저장 후 다운로드 가능합니다.')
        return
    }
    try {
        const params = {
            typeCd: form.typeCd,
            dailyId: form.dailyId,
        }
        const res = await ApiBase.downloadDailyReport(params)
        const blob = new Blob(
            [res],
            {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        )
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
            'download',
            `인건비생산일보_${form.dailyDate ?? ''}.xlsx`
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        handleApiError(error)
    }
}
const closeDialog = () => {
    dialogRef?.value?.close()
}
// 붙여넣기 매핑 컬럼 (lotNo부터 womDCnt까지 총 10개 항목)
const pasteColumns = [
    'lotNo',
    'customerName',
    'itemName',
    'prodType',
    'prodQty',
    'workTime',
    'manFCnt',
    'manDCnt',
    'womFCnt',
    'womDCnt',
]
/*
 * 클립보드 붙여넣기 이벤트 핸들러
 */
const handlePaste = (event, targetListRef, procCd) => {
    if (!isBtn.value) return
    const clipboardText = event.clipboardData?.getData('text')
    if (!clipboardText) return
    event.preventDefault()
    const rows = clipboardText
        .replace(/\r/g, '')
        .split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split('\t'))
    if (rows.length === 0) return
    let startIdx = selectedRowIndex.value
    if (startIdx < 0) startIdx = 0
    rows.forEach((excelRow, rowOffset) => {
        const targetIdx = startIdx + rowOffset
        // 행이 없으면 자동 확장
        if (!targetListRef.value[targetIdx]) {
            targetListRef.value.push(createLaborCostRow(procCd))
        }
        const currentRow = targetListRef.value[targetIdx]
        excelRow.forEach((val, colIdx) => {
            const field = pasteColumns[colIdx]
            if (field) {
                const trimmed = val.trim()
                const numFields = [
                    'prodQty',
                    'workTime',
                    'manFCnt',
                    'manDCnt',
                    'womFCnt',
                    'womDCnt',
                ]
                if (numFields.includes(field)) {
                    currentRow[field] = Number(trimmed.replace(/,/g, '')) || 0
                } else {
                    currentRow[field] = trimmed
                }
            }
        })
        // 인원/시간 데이터가 입력되면 비용 자동 재계산
        applyLaborCost(currentRow)
    })
    reorderList(targetListRef.value)
}
const LaborCostTable = defineComponent({
    name: 'LaborCostTable',
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        emptyMessage: {
            type: String,
            default: '등록된 내역이 없습니다.',
        },
        procCd: {
            type: String,
            default: '',
        }
    },
    emits: ['remove'],
    setup(props, { emit }) {
        const inputText = (row, field, extraClass = '') =>
            h(InputText, {
                modelValue: row[field],
                'onUpdate:modelValue': value => {
                    row[field] = value
                },
                readonly: props.readonly,
                class: `cell-input ${extraClass}`.trim(),
            })
        const inputNumber = (
            row,
            field,
            {
                fraction = 0,
                readonly = false,
            } = {}
        ) =>
            h(InputNumber, {
                modelValue: row[field],
                'onUpdate:modelValue': value => {
                    if (!readonly && !props.readonly) {
                        row[field] = value ?? 0
                        if (
                            field === 'workTime' ||
                            field === 'manFCnt' ||
                            field === 'manDCnt' ||
                            field === 'womFCnt' ||
                            field === 'womDCnt'
                        ) {
                            applyLaborCost(row)
                        }
                    }
                },
                readonly: readonly || props.readonly,
                mode: 'decimal',
                min: 0,
                minFractionDigits: 0,
                maxFractionDigits: fraction,
                useGrouping: true,
                class: readonly
                    ? 'cell-number readonly-input'
                    : 'cell-number',
                inputClass: 'text-right',
            })
        const column = (field, header, width, body) => h(
            Column,
            {
                field,
                header,
                style: `width: ${width}px`,
            },
            {
                body,
            }
        )

        const twoLineColumn = (field, top, bottom, width, body) => h(
            Column,
            {
                field,
                style: `width: ${width}px`,
            },
            {
                header: () => h('div', { class: 'two-line-header' }, [
                    h('div', top),
                    h('div', bottom),
                ]),
                body,
            }
        )
        return () => h(
                DataTable,
                {
                    value: props.list,
                    class: 'my-table fixed-width-table',
                    showGridlines: true,
                    scrollable: true,
                    scrollHeight: '250px',
                    tableStyle: 'min-width: 1400px; table-layout: fixed;',

                    onRowClick: (event) => {
                        selectedRowIndex.value = event.index
                    },

                    onPaste: (e) =>
                        handlePaste(
                            e,
                            ref(props.list),
                            props.procCd
                        ),
                },
                {
                    default: () => [

                        column( 'lotNo', '로트번호', 135, ({ data }) => inputText( data, 'lotNo', 'text-center' ) ),
                        column( 'customerName', '업체명', 170, ({ data }) => inputText( data, 'customerName' ) ),
                        column( 'itemName', '품목명', 480, ({ data }) => inputText( data, 'itemName' ) ),
                        column( 'prodType', '제품유형', 45, ({ data }) => inputText( data, 'prodType', 'text-center' ) ),
                        column( 'prodQty', '생산수량', 52, ({ data }) => inputNumber( data, 'prodQty', { fraction: 2 } ) ),
                        column( 'workTime', '작업시간', 48, ({ data }) => inputNumber( data, 'workTime', { fraction: 2 } ) ),
                        twoLineColumn( 'manFCnt', '정규직', '인원 (남)', 50, ({ data }) => inputNumber( data, 'manFCnt' ) ),
                        twoLineColumn( 'manDCnt', '일용직', '인원 (남)', 50, ({ data }) => inputNumber( data, 'manDCnt' ) ),
                        twoLineColumn( 'womFCnt', '정규직', '인원 (여)', 50, ({ data }) => inputNumber( data, 'womFCnt' ) ),
                        twoLineColumn( 'womDCnt', '일용직', '인원 (여)', 50, ({ data }) => inputNumber( data, 'womDCnt' ) ),
                        twoLineColumn( 'manFCost', '정규직', '단가 (남)', 65, ({ data }) => inputNumber( data, 'manFCost' ) ),
                        twoLineColumn( 'manDCost', '일용직', '단가 (남)', 65, ({ data }) => inputNumber( data, 'manDCost' ) ),
                        twoLineColumn( 'womFCost', '정규직', '단가 (여)', 65, ({ data }) => inputNumber( data, 'womFCost' ) ),
                        twoLineColumn( 'womDCost', '일용직', '단가 (여)', 65, ({ data }) => inputNumber( data, 'womDCost' ) ),
                        column( 'laborCostTotal', '인건비합계', 55, ({ data }) =>
                                h(
                                    InputNumber,
                                    {
                                        modelValue: calculateAmount(data),
                                        readonly: true,
                                        mode: 'decimal',
                                        useGrouping: true,
                                        class: 'cell-number readonly-input',
                                        inputClass: 'text-right',
                                    }
                                )
                        ),
                        column( 'etc', '비고', 100, ({ data }) => inputText( data, 'etc' ) ),
                        h(
                            Column,
                            {
                                header: '삭제',
                                style: 'width: 45px; text-align: center',
                            },
                            {
                                body: ({ index }) =>
                                    props.readonly
                                        ? null
                                        : h(
                                            Button,
                                            {
                                                icon: 'pi pi-trash',
                                                severity: 'danger',
                                                text: true,
                                                rounded: true,
                                                onClick: () => emit( 'remove', index ),
                                            }
                                        ),
                            }
                        ),
                    ],
                    empty: () =>
                        h(
                            'div',
                            {
                                class:
                                    'empty-message'
                            },
                            props.emptyMessage
                        ),
                }
            )
    },
})
</script>
<style scoped>
.prod-page {
    width: 100%;
    min-width: 1200px;
    padding: 12px;
    background: #ffffff;
}
.title-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
}
.title-search {
    display: flex;
    align-items: center;
    gap: 8px;
}
.page-title {
    flex: 1;
    padding: 6px 8px;
    margin-bottom: 0;
    border: 1px solid #cfcfcf;
    border-left: 5px solid #607d8b;
    background: #fafafa;
    font-size: 20px;
    font-weight: 700;
}
.list-section {
    margin-bottom: 18px;
}
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 38px;
    padding: 4px 8px;
    border: 1px solid #bdbdbd;
    border-bottom: 0;
}
.section-header h5 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
}
.section-blue {
    background: #dceef8;
}
.section-orange {
    background: #fbe6d5;
}
.section-gray {
    background: #eeeeee;
}
.section-yellow {
    background: #fff2cc;
}
.section-green {
    background: #e2f0d9;
}
.add-button {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
}
.cell-input,
.cell-number {
    width: 100%;
}
.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}
.empty-message {
    padding: 18px;
    text-align: center;
    color: #777777;
}
.table-summary {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 40px;
    min-height: 34px;
    padding: 7px 15px;
    border: 1px solid #777777;
    border-top: 0;
    background: #fafafa;
    font-size: 12px;
    font-weight: 700;
}
.bottom-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 0 30px;
}
:deep(.my-table) {
    font-size: 12px;
}
:deep(.my-table .p-datatable-table) {
    table-layout: fixed;
}
.two-line-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 12px;
    font-size: 11px;
    white-space: nowrap;
}

:deep(.my-table .p-datatable-thead > tr > th) {
    height: 32px;
    padding: 2px 3px;
    background: #f5f5f5;
    border-color: #777777;
    color: #222222;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
}
:deep(.my-table .p-datatable-tbody > tr > td) {
    height: 30px;
    padding: 1px 3px;
    border-color: #999999;
    vertical-align: middle;
}
:deep(.my-table .p-inputtext) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}
:deep(.my-table .p-inputnumber) {
    width: 100%;
}
:deep(.my-table .p-inputnumber-input) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}
:deep(.my-table .readonly-input input) {
    background: #f3f3f3;
    color: #333333;
    font-weight: 600;
}
:deep(.my-table .p-button.p-button-icon-only) {
    width: 25px;
    height: 25px;
}
</style>
