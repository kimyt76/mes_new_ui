<template>
  <div class="w-full mt-3">
    <table cellspacing="0" width="100%">
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
          <th class="cellBorder cellHeader">칭량일자</th>
          <td class="cellBorder">{{ form.prodDate }}</td>
          <th class="cellBorder cellHeader">칭량처</th>
          <td class="cellBorder">{{ form.storageName }}</td>
        </tr>
        <tr>
          <th class="cellBorder cellHeader">PO NO</th>
          <td class="cellBorder">{{ form.poNo }}</td>
          <th class="cellBorder cellHeader">특이사항</th>
          <td class="cellBorder" colspan="5">
            <Textarea v-model="form.etc" rows="1" class="w-full mt-1" style="resize: none;" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="w-full mt-3">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <Checkbox v-model="allChecked" binary />
        <span>전체</span>
      </div>

      <div>
        <InputText id="barcode" v-model="form.barcode" placeholder="바코드(시험번호)" style="width: 180px" readonly/>
      </div>

      <div>
        <span>{{ totalMatCount }} 중 {{ finishedCount }} 개 완료</span>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div v-for="ss in sungsangOptions" :key="ss" class="flex items-center gap-2">
          <Checkbox v-model="sungsangCheckedMap[ss]" binary />
          <span>{{ ss }}</span>
        </div>
      </div>

      <div class="ml-auto">
        <Button label="새로고침" @click="refresh" />
      </div>
    </div>
  </div>

  <div class="w-full mt-3">
    <Tabs v-model:value="activeSangGubun">
      <TabList>
        <Tab v-for="sg in sangGubunOptions" :key="sg" :value="sg">{{ sg }}</Tab>
      </TabList>

      <TabPanel v-for="sg in sangGubunOptions" :key="sg" :value="sg">
        <BaseHotTable
          ref="hotTable"
          :data="currentTabList"
          :colHeaders="hotHeaders"
          :columns="hotColumns"
          :colWidths="[50, 50, 150, 400, 60, 60, 100, 100, 90, 45, 100, 130, 50, 100, 45, 100, 45]"
          :rowHeaders="false"
          :height="470"
          :afterChange="handleAfterChange"
          :afterOnCellMouseDown="handleCellClickFromHot"
          :stretchH="'none'"
        />
      </TabPanel>
    </Tabs>
  </div>

  <div class="w-full mt-5">
    <div class="flex items-center justify-end gap-3">
      <Button v-if="isStarted" label="칭량시작" @click="openLookupPopup('S')" />
      <Button v-if="!isStarted" label="저장" class="p-button-secondary" @click="saveInfo" />
      <Button label="바코드출력" icon="pi pi-barcode" @click="printWeighLabel"/>
      <Button label="공정기획서" @click="downloadProc" />
      <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
      <Button v-if="isComplate" label="창량완료" @click="completeWeight" />
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
  </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc'
import BaseHotTable from '@/components/BaseHotTable.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { toNumber } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import { useConfirm, useDialog } from 'primevue'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as XLSX from 'xlsx'

import BagWeightInfoPop from '../../common/BagWeightInfoPop.vue'
import BagWeightPop from '../../common/BagWeightPop.vue'
import ProcStartPop from '../../common/ProcStartPop.vue'
import WorkerPop from '../../common/WorkerPop.vue'
import WeighBarcodeRegPop from './WeighBarcodeRegPop.vue'

const { vSuccess, vWarning, vInfo } = useAlertStore()
const { userId } = useAuthStore()
const dialogRef = inject('dialogRef')
const dialog = useDialog()
const confirm = useConfirm()

const hotTable = ref(null)
const isStarted = ref(true)
const isComplate = ref(false)
const matUseDataList = ref([])

const form = reactive({
    makeNo: '', itemCd:'', itemName: '', procOrderDate: '', orderQty: 0, prodDate: '',
    storageName:'', storageCd:'', poNo:'', etc: '', batchStatus: '', procStatus: '',
    isBtn: 'W', areaCd: '', barcode: '', workProcId: '', workBatchId: '', workOrderId: '',
    procCd: 'PRC001', userId
})

// 스캐너 변수
const scanBuffer = ref('')
const lastScanTime = ref(0)
const SCAN_INTERVAL = 100
const lastMouseDown = ref({ row: -1, col: -1, time: 0 })

const ALL_TAB = 'ALL'
const FIELD = {
  DIST_ORDER: 'orderDist',
  SUNGSANG: 'appearance',
  SANGGUBUN: 'phase',
  WEIGH_YN: 'weighYn',
  SELECTED: 'selected',
}

const LOOKUP_PROP = {
  CONTAINER: '__lookup_container',
  WEIGHER: '__lookup_weighUser',
  CONFIRM: '__lookup_confirmUser',
}

// 스캐너 이벤트 등록/해제
onMounted(() => {
    window.addEventListener('keydown', handleScannerKeydown)
    loadWeighInfo()
})
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleScannerKeydown)
})

const handleScannerKeydown = (event) => {
    const isEditable = ['input', 'textarea'].includes(event.target?.tagName?.toLowerCase()) || event.target?.isContentEditable
    if (isEditable) return

    const now = Date.now()
    if (now - lastScanTime.value > SCAN_INTERVAL) scanBuffer.value = ''
    lastScanTime.value = now

    if (event.key === 'Enter') {
        const barcode = scanBuffer.value.trim()
        scanBuffer.value = ''
        if (barcode) {
            form.barcode = barcode
            handleScannedCode(barcode)
        }
    } else if (event.key.length === 1) {
        scanBuffer.value += event.key
    }
}

// 스캔 데이터 파싱 및 매칭 (itemCd 추출 기능 포함)
const handleScannedCode = (barcode) => {
    if (isStarted.value) return vWarning('칭량시작 상태가 아닙니다. 칭량시작 버튼을 먼저 눌러주세요.')

    const extractedItemCd = barcode.split('|')[0].trim()
    form.barcode = extractedItemCd

    const targetRows = matUseDataList.value.filter(r => String(r.itemCd ?? '').trim() === extractedItemCd)
    if (targetRows.length === 0) return vWarning(`스캔된 품목코드[${extractedItemCd}]가 처방 리스트에 없습니다.`)

    const targetRow = targetRows.find(r => !String(r.testNo ?? '').trim())
    if (!targetRow) return vWarning('해당 품목의 모든 처방이 이미 칭량 완료 상태입니다.')

    if (targetRow.phase && sangGubunOptions.value.includes(targetRow.phase)) {
        activeSangGubun.value = targetRow.phase
    }

    openLookupPopup('ITEM_CODE', targetRow)
}

// Computed 옵션 및 필터링 리스트
const sungsangOptions = computed(() => [...new Set(matUseDataList.value.map(r => r?.[FIELD.SUNGSANG]).filter(Boolean))])
const sungsangCheckedMap = reactive({})
watch(sungsangOptions, (opts) => {
  opts.forEach(ss => { if (sungsangCheckedMap[ss] === undefined) sungsangCheckedMap[ss] = true })
  Object.keys(sungsangCheckedMap).forEach(k => { if (!opts.includes(k)) delete sungsangCheckedMap[k] })
}, { immediate: true })

const sangGubunOptions = computed(() => {
  const list = matUseDataList.value.map(r => r?.[FIELD.SANGGUBUN]).filter(Boolean)
  return [ALL_TAB, ...[...new Set(list)].sort()]
})

const activeSangGubun = ref(ALL_TAB)
watch(sangGubunOptions, (opts) => {
  if (!opts.includes(activeSangGubun.value)) activeSangGubun.value = ALL_TAB
}, { immediate: true })

const currentTabList = computed(() => {
  const tab = activeSangGubun.value
  const allowedSs = new Set(Object.entries(sungsangCheckedMap).filter(([, v]) => v).map(([k]) => k))

  return matUseDataList.value.filter(r => {
    const sg = String(r?.[FIELD.SANGGUBUN] ?? '')
    const ss = String(r?.[FIELD.SUNGSANG] ?? '')
    const tabOk = (tab === ALL_TAB) || (sg === tab)
    const ssOk = ss === '' || (allowedSs.size ? allowedSs.has(ss) : true)
    return tabOk && ssOk
  })
})

const totalMatCount = computed(() => currentTabList.value.length)
const finishedCount = computed(() => currentTabList.value.filter(r => r?.[FIELD.WEIGH_YN] === 'Y').length)
const allChecked = computed({
  get: () => currentTabList.value.length > 0 && currentTabList.value.every(r => r?.[FIELD.SELECTED]),
  set: (v) => currentTabList.value.forEach(r => { r[FIELD.SELECTED] = v })
})

// Handsontable 설정
const hotHeaders = ref(['', '선택', '품목코드', '품목명', '성상', '상구분', '지시량', '칭량', '용기무게', '-', '총량', '사용시험번호', '완료', '칭량자', '-', '확인자', '-'])

const magnifierRenderer = (instance, td) => {
  td.innerHTML = `<span style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:100%;"><i class="pi pi-search"></i></span>`
  td.style.textAlign = 'center'
}

const hotColumns = ref([
  { data: FIELD.DIST_ORDER, readOnly: true, className: 'htCenter' },
  { data: FIELD.SELECTED, type: 'checkbox', className: 'htCenter' },
  { data: 'itemCd', readOnly: true, className: 'htCenter' },
  { data: 'itemName', readOnly: true },
  { data: FIELD.SUNGSANG, readOnly: true, className: 'htCenter' },
  { data: FIELD.SANGGUBUN, readOnly: true, className: 'htCenter' },
  { data: 'orderQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight', readOnly: true },
  { data: 'weighQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: 'bagWeight', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: LOOKUP_PROP.CONTAINER, readOnly: true, renderer: magnifierRenderer },
  { data: 'totalQty', readOnly: true, type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: 'testNo', readOnly: true, className: 'htCenter' },
  { data: FIELD.WEIGH_YN, type: 'checkbox', checkedTemplate: 'Y', uncheckedTemplate: 'N', className: 'htCenter' },
  { data: 'weigher', className: 'htCenter' },
  { data: LOOKUP_PROP.WEIGHER, readOnly: true, renderer: magnifierRenderer },
  { data: 'confirmer', className: 'htCenter' },
  { data: LOOKUP_PROP.CONFIRM, readOnly: true, renderer: magnifierRenderer },
])

// 비즈니스 로직 및 API 호출
const completeWeight = async () => {
    if (totalMatCount.value !== finishedCount.value) return vWarning('모든 품목의 칭량이 완료되어야 합니다.')

    confirm.require({
        header: '칭량완료 확인',
        message: '칭량을 완료하고, 제조출고를 진행하시겠습니까?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                const params = {
                    procStatus: '12', batchStatus: '12',
                    workProcId: form.workProcId, workBatchId: form.workBatchId, procCd: form.procCd
                }
                await ApiProc.completeWeight(params)
                vSuccess('정상적으로 칭량완료 처리하였습니다!')
                closeDialog()
            } catch(err) {
                handleApiError(err)
            }
        }
    })
}

const saveInfo = async () => {
    try {
        const res = await ApiProc.saveWeighInfo({ workOrderInfo: form, weightBomList: matUseDataList.value })
        vSuccess(res.message)
        checkComplete()
    } catch(err) {
        handleApiError(err)
    }
}

const checkComplete = () => {
    if (form.procStatus === '11' && totalMatCount.value === finishedCount.value) {
        isComplate.value = true
    }
}

const handleAfterChange = (changes, source) => {
  if (!changes || source === 'loadData') return

  for (const [rowIndex, prop, , newVal] of changes) {
    const row = matUseDataList.value[rowIndex]
    if (!row) continue

    if (prop === FIELD.WEIGH_YN) {
      currentTabList.value[rowIndex][FIELD.WEIGH_YN] = newVal === true ? 'Y' : 'N'
    }

    // 칭량이나 용기무게가 변경되면 실시간으로 총량을 다시 계산하여 그리드에 반영
    if (['weighQty', 'bagWeight'].includes(prop)) {
        const total = calcTotalQty(row)
        row.totalQty = total
        const hot = hotTable.value?.hotInstance || hotTable.value
        if (hot?.setDataAtRowProp) {
            hot.setDataAtRowProp(rowIndex, 'totalQty', total, 'calcTotalQty')
        }
    }
  }
}

const handleCellClickFromHot = (event, coords) => {
  if (isStarted.value || !coords || coords.row < 0 || coords.col < 0) return

  const rowData = currentTabList.value[coords.row]
  if (!rowData) return

  const now = Date.now()
  const cols = hotColumns.value.map(col => col.data)

  const clickActions = {
    itemCd: () => openLookupPopup('ITEM_CODE', rowData),
    itemName: () => openLookupPopup('ITEM_CODE', rowData),
    [LOOKUP_PROP.CONTAINER]: () => openLookupPopup('CONTAINER_WEIGHT', rowData),
    [LOOKUP_PROP.WEIGHER]: () => openLookupPopup('WEIGH_USER', rowData),
    [LOOKUP_PROP.CONFIRM]: () => openLookupPopup('CONFIRM_USER', rowData),
    bagWeight: () => {
      const isSameCell = lastMouseDown.value.row === coords.row && lastMouseDown.value.col === coords.col
      if (isSameCell && (now - lastMouseDown.value.time < 300)) {
        openLookupPopup('CONTAINER_WEIGHT1', rowData)
        lastMouseDown.value = { row: -1, col: -1, time: 0 }
      }
    }
  }

  const clickedProp = cols[coords.col]
  if (clickActions[clickedProp]) clickActions[clickedProp]()

  lastMouseDown.value = { row: coords.row, col: coords.col, time: now }
}

// 💡 안전한 수치 계산식으로 복원 (용기무게 누락 문제 완전 해결)
const calcTotalQty = (row) => {
  const weighQty = toNumber(row.weighQty) ?? 0
  const bagWeight = toNumber(row.bagWeight) ?? 0
  return weighQty + bagWeight
}

const openLookupPopup = (type, row = null) => {
    const popupMap = {
        ITEM_CODE: { title: '바코드 칭량 입력', comp: WeighBarcodeRegPop },
        CONTAINER_WEIGHT: { title: '용기무게 선택', comp: BagWeightPop },
        CONTAINER_WEIGHT1: { title: '용기무게 입력', comp: BagWeightInfoPop },
        WEIGH_USER: { title: '칭량자 선택', comp: WorkerPop },
        CONFIRM_USER: { title: '확인자 선택', comp: WorkerPop },
        DEFAULT: { title: '칭량 시작', comp: ProcStartPop }
    }

    if (type === 'ITEM_CODE' && row?.itemCd === 'JRMSC00011') return

    const selected = popupMap[type] || popupMap.DEFAULT
    const shouldPassRow = ['ITEM_CODE', 'CONTAINER_WEIGHT', 'WEIGH_USER', 'CONFIRM_USER', 'CONTAINER_WEIGHT1'].includes(type)

    dialog.open(selected.comp, {
        props: {
            header: selected.title, modal: true, draggable: false,
            style: { overflow: 'hidden' },
            pt: { root: { style: { overflow: 'hidden' } }, content: { style: { overflow: 'hidden' } } }
        },
        data: { form, ...(shouldPassRow ? { row } : {}), type },
        onClose: (event) => {
            if (event?.data && shouldPassRow && row) {
                applyPopupResultToRow(type, row, event.data)

                // 💡 팝업창에서 데이터를 수령하여 row에 매핑한 직후 총량을 재계산하여 그리드 동기화
                row.totalQty = calcTotalQty(row)
                const hot = hotTable.value?.hotInstance || hotTable.value
                if (hot?.setDataAtRowProp) {
                    const viewRowIndex = currentTabList.value.findIndex(r => r === row)
                    if (viewRowIndex !== -1) {
                        hot.setDataAtRowProp(viewRowIndex, 'totalQty', row.totalQty, 'calcTotalQty')
                    }
                }
            } else {
                loadWeighInfo()
            }
        }
    })
}

const applyPopupResultToRow = (type, row, data) => {
    if (type === 'ITEM_CODE') {
        row.weighQty = data.weighQty ?? row.weighQty
        row.testNo = data.testNo ?? row.testNo
        row.weighYn = 'Y'
    } else if (type === 'CONTAINER_WEIGHT') {
        row.bagWeight = data.weight ?? row.weight
    } else if (type === 'WEIGH_USER') {
        row.weigher = data.workerName ?? row.workerName
    } else if (type === 'CONFIRM_USER') {
        row.confirmer = data.workerName ?? row.workerName
    } else if (type === 'CONTAINER_WEIGHT1') {
        row.bagWeight = data ?? row.weight
    }
}

const normalizeRows = (rows) => (rows ?? []).map((r, idx) => {
    const row = {
      ...r,
      orderDist: Number(r?.orderDist ?? r?.dist_order ?? idx + 1),
      [FIELD.SELECTED]: r?.[FIELD.SELECTED] ?? false,
      [FIELD.WEIGH_YN]: r?.[FIELD.WEIGH_YN] ?? 'N',
      bagWeight: r?.bagWeight ?? 0,
      testNo: r?.testNo ?? '',
      weighUser: r?.weighUser ?? '',
      weighConfirmUser: r?.weighConfirmUser ?? '',
    }
    row.totalQty = calcTotalQty(row)
    return row
})

const loadWeighInfo = async () => {
    const params = {
        workProcId: dialogRef.value.data.workProcId,
        itemCd: dialogRef.value.data.itemCd,
        procCd: form.procCd,
    }
    const data = await ApiProc.getWeighInfo(params)
    Object.assign(form, data.workOrderInfo || {})
    matUseDataList.value = normalizeRows(data.weightBomList || [])
    isStarted.value = data.workOrderInfo?.procStatus === '00'
    checkComplete()
}

const refresh = () => loadWeighInfo()

const printWeighLabel = async () => {
    const filtered = currentTabList.value.filter(item =>
        item[FIELD.SELECTED] === true && !['JRW00215', 'JRMSC00011'].includes(item.itemCd)
    )
    if (filtered.length === 0) return vWarning('바코드를 출력할 품목을 선택해주세요.')

    const selectedList = filtered.map(item => ({
        ...item,
        orderDist: Number(item?.[FIELD.DIST_ORDER] ?? 0),
        workProcId: form.workProcId,
        procCd: form.procCd
    }))

    const win = window.open('', '_blank')
    if (!win) return vWarning('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')

    try {
        const pdfBlob = await ApiProc.printWeighLabel(selectedList)
        const url = URL.createObjectURL(pdfBlob)
        win.location.href = url
        setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch (err) {
        if (win && !win.closed) win.close()
        handleApiError(err)
    }
}

const downloadExcel = () => {
  const ws = XLSX.utils.json_to_sheet(currentTabList.value.map(row => ({
    품목코드: row.itemCd ?? '', 품목명: row.itemName ?? '', 성상: row.appearance ?? '', 상구분: row.phase ?? '',
    지시량: row.orderQty ?? 0, 칭량: row.weighQty ?? 0, 용기무게: row.bagWeight ?? 0, 총량: row.totalQty ?? 0,
    사용시험번호: row.testNo ?? '', 완료: row.weighYn ?? '', 칭량자: row.weigher ?? '', 확인자: row.confirmer ?? '',
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '칭량처방리스트')
  XLSX.writeFile(wb, '칭량_처방_리스트.xlsx')
}

const downloadProc = () => {}
const closeDialog = () => dialogRef.value?.close()
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
.handsontable THEAD TH {
  background: #d9d9d9;
  border-color: #000000;
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
.tab-active {
  background: #2f6fff;
  color: white;
}
.cellHeader,
.cellBorder {
    width: 12.5%;
}
</style>
