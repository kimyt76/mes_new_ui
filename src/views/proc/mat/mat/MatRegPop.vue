<template>
<div class="w-full mt-3">
    <table cellspacing="0" width="100%">
        <colgroup>
            <col style="width:10%"> <!-- th -->
            <col style="width:15%"> <!-- td -->
            <col style="width:10%">
            <col style="width:15%">
            <col style="width:10%">
            <col style="width:15%">
            <col style="width:15%">
            <col style="width:10%">
        </colgroup>
      <tbody>
        <tr>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder">{{ form.makeNo }}</td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder">{{ form.itemCd }}</td>
            <th class="cellBorder cellHeader">품목명</th>
            <td class="cellBorder" colspan="3">{{ form.itemName }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">지시일자</th>
            <td class="cellBorder">{{ form.procOrderDate }}</td>
            <th class="cellBorder cellHeader">지시량</th>
            <td class="cellBorder">{{ form.orderQty }} kg</td>
            <th class="cellBorder cellHeader">제조설비</th>
            <td class="cellBorder" colspan="3">{{ form.workEquipmentCd }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder">{{ form.prodDate }}</td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder">{{ form.prodQty || 0}} kg</td>
            <th class="cellBorder cellHeader">생산수율</th>
            <td class="cellBorder">{{ form.prodYield }} %</td>
            <th class="cellBorder cellHeader">생산처</th>
            <td class="cellBorder">{{ form.storageName }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">작업자</th>
            <td class="cellBorder">
                <InputText
                    v-model="makeEtcInfo.maker"
                    class="w-full"
                />
            </td>
            <th class="cellBorder cellHeader">확인자</th>
            <td class="cellBorder">
                <InputText
                    v-model="makeEtcInfo.confirmer"
                    class="w-full"
                />
            </td>
            <th class="cellBorder cellHeader">고객사</th>
            <td class="cellBorder" colspan="3">{{ form.clientName }}</td>
        </tr>
      </tbody>
    </table>
</div>

<!-- 원료투입 영역 -->
<div class="material-section">
    <div class="section-header">
        <div class="section-title">원료투입</div>
    </div>
    <div class="section-line"></div>

    <div class="material-toolbar">
        <FloatLabel variant="on">
            <InputText
                id="on_label1"
                v-model="weighId"
                :disabled="form.procStatus === '00'"
                @keyup.enter="applyQrToList"
            />
            <label for="on_label1">QR코드(칭량번호)</label>
        </FloatLabel>

        <div class="count">
            {{ totalCount }} 중 {{ checkedCount }} 개 완료
        </div>

        <div class="ml-auto mr-2">
            <div class="flex items-center justify-end gap-2">
                <Button v-if="isStarted" label="제조시작" @click="openLookupPopup('S')" />
                <Button v-if="!isStarted" label="저장" class="p-button-secondary" @click="saveInfo" />
                <Button label="바코드출력" icon="pi pi-barcode" @click="openLookupPopup('P')" />
                <Button label="제조공정기록서" @click="downloadMatProc" />
                <Button v-if="isComplate" label="제조완료" @click="complateMake" />
                <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
            </div>
        </div>
    </div>

    <!-- phase 탭 -->
    <div class="phase-tab-wrap">
        <button
            v-for="(tab, index) in phaseTabs"
            :key="tab"
            type="button"
            class="phase-tab"
            :class="{ active: phaseActiveIndex === index }"
            @click="handlePhaseTabChange(index)"
        >
            {{ tab }}
        </button>
    </div>

    <div class="make-body-wrap">
        <!-- 왼쪽 원료투입 테이블 -->
        <div class="make-left">
            <div class="table-scroll">
                <BaseHotTable
                    ref="hotTable"
                    :data="currentTabList"
                    :colHeaders="hotHeaders"
                    :colWidths="colWidths"
                    :columns="hotColumns"
                    :afterChange="handleAfterChange"
                    :afterOnCellMouseDown="handleCellClickFromHot"
                    :stretchH="'all'"
                    :height="520"
                />
            </div>
        </div>

        <!-- 제조 공정 -->
        <div class="process-box process-flow">
            <div class="process-title">제조 공정</div>
            <Textarea v-model="makeEtcInfo.matProc" class="process-textarea" />
        </div>

        <!-- 조작조건 -->
        <div class="process-box process-condition">
            <div class="process-title">조작조건</div>
            <Textarea v-model="makeEtcInfo.manipulate" class="process-textarea" />
        </div>

        <!-- 공정시간 -->
        <div class="process-box process-time">
            <div class="process-title">공정시간</div>
            <Textarea v-model="makeEtcInfo.processTime" class="process-textarea" />
        </div>

        <!-- 생산 관리 -->
        <div class="make-right">
            <div class="right-box prod-box">
                <div class="right-title">생산 관리</div>
                <div class="right-content prod-content">
                    <FloatLabel variant="on" class="w-full">
                        <InputNumber
                            v-model="form.prodQty"
                            class="w-full"
                            suffix=" kg"
                        />
                        <label>제조량</label>
                    </FloatLabel>

                    <div class="mixer-guide">
                        <span>H : Homo mixer</span>
                        <span>P : Paddle</span>
                        <span>D1 : Homo Disper Mixer</span>
                        <span>D2 : Agi Disper Mixer</span>
                        <span>T : 온도조건</span>
                        <span>M : 시간</span>
                        <span>P2 : Hand Mixer</span>
                        <span>RT : 상온</span>
                    </div>
                </div>
            </div>

            <div class="right-box special-box">
                <div class="right-title">특이사항</div>
                <Textarea v-model="makeEtcInfo.significant" class="right-textarea" />
            </div>

            <div class="right-box modify-box">
                <div class="right-title">수정사항</div>
                <Textarea v-model="makeEtcInfo.modifyNote" class="right-textarea" />
            </div>
            <div class="right-box filter-box">
                <div class="right-title">여과포 정보</div>
                <div class="filter-content">
                    <div class="filter-field">
                        <FloatLabel variant="on" class="filter-input">
                            <InputText
                                v-model="makeEtcInfo.filterCnt"
                                class="w-full"
                            />
                            <label>여과포숫자</label>
                        </FloatLabel>
                        <span class="unit-text">mesh</span>
                    </div>
                    <div class="filter-radio-row">
                        <FloatLabel variant="on" class="filter-input">
                            <InputText
                                v-model="makeEtcInfo.filterType"
                                class="w-full"
                            />
                            <label>여과포종류</label>
                        </FloatLabel>
                    </div>

                    <div class="filter-field damage-field">
                        <FloatLabel variant="on" class="filter-input">
                            <InputText
                                v-model="makeEtcInfo.filterDamage"
                                class="w-full"
                            />
                            <label>여과포손상</label>
                        </FloatLabel>
                    </div>

                    <div class="filter-field">
                        <FloatLabel variant="on" class="filter-input full">
                            <InputText
                                v-model="makeEtcInfo.substanceCheck"
                                class="w-full"
                            />
                            <label>이물질확인</label>
                        </FloatLabel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import BaseHotTable from '@/components/BaseHotTable.vue';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useConfirm, useDialog } from 'primevue';
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import MakeQtyPopup from './MakeQtyPopup.vue';
import ProcMakeStartPop from './ProcMakeStartPop.vue';

const { vSuccess, vInfo, vError } = useAlertStore()
const weighId = ref('')
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const isStarted = ref(false)
const isComplate = ref(false)
const matUseDataList = ref([])
const phaseActiveIndex = ref(0)
const hotTable = ref(null)
const totalMakeQty = computed(() => {
    return matUseDataList.value.reduce((sum, row) => {
        return sum + (Number(row.makeQty) || 0);
    }, 0);
});
const phaseTabs = computed(() => {
    const phases = [...new Set(
        (matUseDataList.value || [])
            .map(row => row.phase)
            .filter(phase => phase)
    )]

    return ['ALL', ...phases]
})

const activePhase = computed(() => phaseTabs.value[phaseActiveIndex.value] || 'ALL')

const totalCount = computed(() => {
    return Array.isArray(matUseDataList.value) ? matUseDataList.value.length : 0
})

const checkedCount = computed(() => {
    return (matUseDataList.value || []).filter((row) => row.makeQty > 0).length
})

const form = reactive({
    makeNo: '',
    itemCd: '',
    itemName: '',
    procOrderDate: '',
    orderQty: 0,
    prodDate: '',
    storageName: '',
    storageCd: '',
    workEquipmentCd: '',
    prodQty: '',
    prodYield: '',
    poNo: '',
    etc: '',

    isBtn: 'W',
    areaCd: '',
    barcode: '',
    workProcId: '',
    workBatchId: '',
    testNo: '',
    procCd: 'PRC002',
})

const makeEtcInfo = reactive({
    makeEtcId: '',
    workProcId: '',
    itemCd: '',
    bomVer: '',
    matProc: '',
    manipulate: '',
    processTime: '',
    note: '',
    significant: '',
    maker: '',
    confirmer: '',
    filterCnt: '',
    filterType: '',
    filterDamage: '',
    substanceCheck: '',
})

const hotHeaders = ref(['No', '구분', '품목코드', '품목명', '소요량', '투입량', '투입자확인'])
const colWidths = ref([50, 50, 120, 320, 110, 110, 110])
const hotColumns = ref([
    { data: 'orderDist', readOnly: true, className: 'htCenter' },
    { data: 'phase', readOnly: true, className: 'htCenter' },
    { data: 'itemCd', readOnly: true, className: 'htCenter' },
    { data: 'itemName', readOnly: true },
    { data: 'orderQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight', readOnly: true },
    { data: 'makeQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
    { data: 'maker', className: 'htCenter', type: 'text', editor: 'text', readOnly: false},
])

watch(totalMakeQty, (val) => {
    form.prodQty = val;
}, { immediate: true });

const currentTabList = computed(() => {
    if (activePhase.value === 'ALL') return matUseDataList.value || []

    return (matUseDataList.value || []).filter(
        row => row.phase === activePhase.value
    )
})

const handlePhaseTabChange = async (nextIndex) => {
    if (phaseActiveIndex.value === nextIndex) return

    if (!canMoveToPhase(nextIndex)) return

    phaseActiveIndex.value = nextIndex
    await nextTick()

    const hotInstance = hotTable.value?.hotInstance || hotTable.value?.getHotInstance?.()
    hotInstance?.render()
}

const canMoveToPhase = (nextIndex) => {
    const tabs = phaseTabs.value || []
    const currentIndex = phaseActiveIndex.value

    if (nextIndex <= currentIndex) return true
    if (tabs[nextIndex] === 'ALL') return true

    if (tabs[currentIndex] === 'ALL') {
        if (nextIndex === 1) return true
        return checkPrevPhaseCompleted(1, nextIndex)
    }

    return checkPrevPhaseCompleted(currentIndex, nextIndex)
}

const checkPrevPhaseCompleted = (startIndex, nextIndex) => {
    const tabs = phaseTabs.value || []
    const nextPhase = tabs[nextIndex]

    for (let i = startIndex; i < nextIndex; i++) {
        const phase = tabs[i]
        if (!phase || phase === 'ALL') continue

        const rows = (matUseDataList.value || []).filter(row => row.phase === phase)
        if (rows.length === 0) continue

        const hasIncomplete = rows.some(row => row.makeYn !== 'Y')

        if (hasIncomplete) {
            vInfo(`${phase} 단계가 완료되지 않아 ${nextPhase} 단계로 이동할 수 없습니다.`)
            return false
        }
    }

    return true
}

const handleAfterChange = () => {

}

const handleCellClickFromHot = (event, coords, td) => {
    if (!coords || coords.row == null || coords.col == null) return
    if (coords.row < 0) return

    const rowData = currentTabList.value[coords.row]
    if (!rowData) return
    if (!coords || coords.row < 0 || coords.col < 0) return

    const makeQtyColIndex = hotColumns.value.findIndex(col => col.data === 'makeQty')

    if (coords.col === makeQtyColIndex) {
        const isMakeQtyPopupTarget = rowData.itemCd === 'JRW00215' || rowData.itemCd === 'JRMSC00011'

        if (!isMakeQtyPopupTarget) return
        openLookupPopup('makeQty', rowData)
    }
}

const applyQrToList = async () => {
    const inputValue = String(weighId.value ?? '').trim()
    if (!inputValue) return

    const id = Number(inputValue)

    const targetRow = matUseDataList.value.find(
        row => Number(row.weighId) === id
    )

    if (!targetRow) {
        vInfo(`해당 QR(${id})와 일치하는 원료가 없습니다.`)
        return
    }

    const makeQty = await ApiProc.getWeighQty(weighId.value)
    targetRow.makeQty = makeQty ?? 0

    const hotInstance = hotTable.value?.hotInstance || hotTable.value?.getHotInstance?.()
    hotInstance?.render()
}

const checkVavlid = () =>{
    if (totalCount.value !== checkedCount.value) {
        vInfo('작업자를 등록하세요!!')
        return false
    }
    if (totalCount.value !== checkedCount.value) {
        vInfo('확인자를 입력하세요!!.')
        return false
    }
}

const saveInfo = async () => {
    if (!checkVavlid()) return

    try {
        const params = {
            procMake: form,
            makeBomList: matUseDataList.value,
            makeEtcInfo: makeEtcInfo,
        }
        const res = await ApiProc.saveMakeInfo(params)
        vSuccess(res.message)
        checkComplete()
    } catch (err) {
        handleApiError(err)
    }
}

const openLookupPopup = (type, row) => {
    let title = ''
    let componentPop = ''
    let itemList = []

    const rowTargetTypes = ['makeQty']
    const shouldPassRow = rowTargetTypes.includes(type)

    if (type === 'makeQty') {
        title = '투입량 입력'
        componentPop = MakeQtyPopup
    } else if (type === 'S') {
        title = '제조 시작'
        componentPop = ProcMakeStartPop
    } else if (type === 'P') {
        if (isStarted.value) return vInfo('제조시작을 먼저 진행해주세요.')
        title = '바코드 출력'
        componentPop = QrCodePop

        itemList.push({
            itemCd: form.itemCd,
            itemName: form.itemName,
            lotNo: form.lotNo,
            testNo: form.testNo,
            qty: 0,
            printCnt: 1,
        })
    }

    dialog.open(componentPop, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: false,
        },
        data: {
            form,
            ...(shouldPassRow ? { row } : {}),
            type,
            itemList,
        },
        onClose: (event) => {
            if (!event?.data) {
                if (!shouldPassRow) {
                    loadMakeInfo()
                }
                return
            }

            if (shouldPassRow && row) {
                applyPopupResultToRow(type, row, event.data)
                return
            }

            loadMakeInfo()
        },
    })
}

const applyPopupResultToRow = (type, row, data) => {
    if (type === 'makeQty') {
        row.makeQty = data ?? row.orderQty
    } else if (type === 'MAKE_USER') {
        row.maker = data.workerName ?? row.workerName
    } else if (type === 'CONFIRM_USER') {
        row.makeConfirmer = data.workerName ?? row.workerName
    }
}
const confirm = useConfirm()
const complateMake = () => {
    if (!checkVavlid()) return

    if (totalCount.value !== checkedCount.value) {
        vInfo('투입되지 않은 품목이 있습니다.')
        return false
    }

    confirm.require({
        header: '제조완료 확인',
        message: '제조을 완료하고, 제조출고를 진행하시겠습니까?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try{
                const params = {
                    procStatus: '22',
                    batchStatus: '22',
                    workProcId: form.workProcId,
                    workBatchId: form.workBatchId,
                    procCd: form.procCd,
                    testNo: form.testNo,
                }
                const res = await ApiProc.completeMake(params)
                vSuccess('정상적으로 제조완료 처리하였습니다!')
                closeDialog()
            }catch(err){
                handleApiError(err)
            }
        }
    });
}

onMounted(async () => {
    await loadMakeInfo()
})

const loadMakeInfo = async () => {
    const data = await fetchMakeInfo()
    bindMakeInfo(data)
}

const fetchMakeInfo = async () => {
    const params = createMakeInfoParams()
    return await ApiProc.getMakeInfo(params)
}

const createMakeInfoParams = () => ({
    workBatchId: dialogRef.value.data.workBatchId,
    workProcId: dialogRef.value.data.workProcId,
    itemCd: dialogRef.value.data.itemCd,
})

const bindMakeInfo = (data) => {
    Object.assign(form, data.procMake || {})
    matUseDataList.value = data.makeBomList || []

    Object.assign(makeEtcInfo, data.makeEtcInfo )
    makeEtcInfo.workProcId = form.workProcId



    if (phaseActiveIndex.value >= phaseTabs.value.length) {
        phaseActiveIndex.value = 0
    }
console.log('data.procMake?.batchStatus ',  data.procMake?.batchStatus )
    if ( data.procMake?.batchStatus < '21') {
        isStarted.value = true
    }
    checkComplete()
}

const checkComplete = () => {
    if (form.procStatus === '21' && totalCount.value === checkedCount.value) {
        isComplate.value = true
    }
}

const downloadMatProc = async () =>{
    const params = {
        itemCd : form.itemCd,
        itemName : form.itemName,
        procCd : 'PRC002',
        workProcId : form.workProcId,
    }

    try {
        const blob = await ApiProc.downloadMatProc(params)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download =`${form?.makeNo || ''}_[벌크제품]_${form?.itemName || ''}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
    } catch {
        vError('엑셀 다운로드 실패')
    }
}

const closeDialog = () => {
    dialogRef.value.close()
}
</script>

<style scoped>
.cellBorder {
  border: 0.5px solid #ccc;
  text-align: center;
  vertical-align: middle;
}

.cellHeader {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 150px;
  height: 30px;
}

.top-etc-textarea {
  height: 30px !important;
  min-height: 30px !important;
  resize: none;
}

.material-section {
  margin-top: 5px;
}

.section-header {
  display: flex;
  align-items: center;
}

.section-title {
  color: #10b981;
  font-weight: 700;
  padding: 8px 16px;
  border-bottom: 2px solid #10b981;
}

.section-line {
  height: 1px;
  background: #d7dee8;
  margin-bottom: 12px;
}

.material-toolbar {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 8px;
}

.count {
  font-weight: 500;
  font-size: 15px;
}

.phase-tab-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  padding-left: 4px;
}

.phase-tab {
  min-width: 80px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-bottom: 0;
  background: #eef2f7;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s ease;
}

.phase-tab.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.phase-tab:hover {
  background: #dbeafe;
}

.hint {
  margin-left: 30px;
  font-weight: 500;
  color: #2b63c6;
  font-size: 13px;
}

.make-body-wrap {
  display: flex;
  width: 100%;
  height: 545px;
  gap: 0;
  align-items: stretch;
}

.make-left {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  display: flex;
  border: 1px solid #999;
  border-right: 1px solid #999;
  background: #fff;
}

.table-scroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;

}

:deep(.handsontable),
:deep(.ht_master),
:deep(.wtHolder),
:deep(.wtHider),
:deep(.wtSpreader) {
  /* height: 100% !important; */
}

.process-box {
  flex: 0 0 180px;
  height: 100%;
  border: 1px solid #999;
  border-left: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.process-flow {
  flex-basis: 300px; /* 제조 공정 */
}

.process-condition {
  flex-basis: 160px; /* 조작조건 */
}

.process-time {
  flex-basis: 80px; /* 공정시간 */
  text-align: center;
}

.process-flow {
  border-left: 0;
}

.process-title,
.right-title {
  min-height: 34px;
  height: 34px;
  padding: 6px 8px;
  background: #c4b3ad;
  color: #000;
  font-weight: 600;
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}

.process-textarea {
  flex: 1;
  width: 100%;
  height: 100% !important;
  min-height: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  resize: none;
  box-sizing: border-box;
  text-align: center;
}

.make-right {
  flex: 0 0 200px;
  height: 100%;
  display: grid;

  /* 여기 숫자만 바꾸면 각 영역 높이 조정 가능 */
  grid-template-rows:
    var(--prod-box-height, 190px)
    var(--special-box-height, 110px)
    var(--modify-box-height, 100px)
    var(--filter-box-height, 145px);

  border: 1px solid #999;
  border-left: 0;
  background: #fff;
}

.right-box {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #999;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.right-box:last-child {
  border-bottom: 0;
}

.right-content {
  min-height: 0;
  padding: 8px;
  box-sizing: border-box;
}

.prod-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.mixer-guide {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  font-size: 12px;
  line-height: 1.35;
  color: #334155;
}

.right-textarea {
  flex: 1;
  width: 100%;
  height: 100% !important;
  min-height: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  resize: none;
  box-sizing: border-box;
}

.filter-content {
  min-height: 0;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  overflow: auto;
}

.filter-field {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.filter-input {
  flex: 1;
  min-width: 0;
}

.filter-input.full {
  width: 100%;
}

.unit-text {
  min-width: 34px;
  font-size: 12px;
  color: #475569;
}

.filter-radio-row {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-left: 2px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.damage-field {
  align-items: center;
}

:deep(.handsontable thead th) {
  background: #c4b3ad !important;
  color: #000 !important;
  font-weight: 600 !important;
  border-color: #999 !important;
  height: 34px !important;
  vertical-align: middle !important;
}

:deep(.handsontable td) {
  border-color: #ddd !important;
}

td .custom-cell {
  background-color: rgb(245 245 245);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
