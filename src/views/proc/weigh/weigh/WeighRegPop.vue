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

      <TabPanel :value="activeSangGubun">
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
      <Button label="공정기록서" @click="downloadProc" />
      <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
      <Button v-if="isComplate" label="칭량완료" @click="completeWeight" />
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

import { ApiQc } from '@/api/apiQc.js'
import BagWeightInfoPop from '../../common/BagWeightInfoPop.vue'
import BagWeightPop from '../../common/BagWeightPop.vue'
import ProcStartPop from '../../common/ProcStartPop.vue'
import WorkerPop from '../../common/WorkerPop.vue'
import WeighBarcodeRegPop from './WeighBarcodeRegPop.vue'

const isBarcodePopupOpen = ref(false)
const isBarcodeScanning = ref(false)
const { vSuccess, vWarning } = useAlertStore()
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
const FIELD = { DIST_ORDER: 'orderDist', SUNGSANG: 'appearance', SANGGUBUN: 'phase', WEIGH_YN: 'weighYn', SELECTED: 'selected' }
const LOOKUP_PROP = { CONTAINER: '__lookup_container', WEIGHER: '__lookup_weighUser', CONFIRM: '__lookup_confirmUser' }
const POPUPS = {
  ITEM_CODE: { title: '바코드 칭량 입력', comp: WeighBarcodeRegPop },
  CONTAINER_WEIGHT: { title: '용기무게 선택', comp: BagWeightPop },
  CONTAINER_WEIGHT1: { title: '용기무게 입력', comp: BagWeightInfoPop },
  WEIGH_USER: { title: '칭량자 선택', comp: WorkerPop },
  CONFIRM_USER: { title: '확인자 선택', comp: WorkerPop },
  S: { title: '칭량 시작', comp: ProcStartPop }
}
const ROW_POPUPS = new Set(['ITEM_CODE', 'CONTAINER_WEIGHT', 'CONTAINER_WEIGHT1', 'WEIGH_USER', 'CONFIRM_USER'])

// 스캐너 이벤트 등록/해제
onMounted(() => {
    window.addEventListener('keydown', handleScannerKeydown)
    loadWeighInfo()
})
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleScannerKeydown)
})

const handleScannerKeydown = (event) => {
  if (isBarcodePopupOpen.value || isBarcodeScanning.value) return
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

const handleScannedCode = async (barcode) => {
  if (isStarted.value) return vWarning('칭량시작 버튼을 먼저 눌러주세요.')
  if (isBarcodeScanning.value || isBarcodePopupOpen.value) return
  isBarcodeScanning.value = true
  try {
    const testNo = String(barcode ?? '').trim()
    if (!testNo) return
    form.barcode = testNo
    const res = await ApiQc.getItemTestNoInfo(testNo)
    const itemCd = String((res?.data ?? res)?.itemCd ?? '').trim()
    if (!itemCd) return vWarning(`시험번호[${testNo}]에 해당하는 품목정보가 없습니다.`)
    const targetRows = matUseDataList.value.filter(r => String(r.itemCd ?? '').trim() === itemCd)
    if (!targetRows.length) return vWarning(`스캔된 품목코드[${itemCd}]가 처방 리스트에 없습니다.`)
    // 기존과 동일하게 testNo가 비어 있는 행 우선 선택
    const targetRow = targetRows.find(r => !String(r.testNo ?? '').trim())
    if (!targetRow) return vWarning('해당 품목의 모든 처방이 이미 칭량 완료 상태입니다.')
    if (targetRow.phase && sangGubunOptions.value.includes(targetRow.phase)) activeSangGubun.value = targetRow.phase
    openLookupPopup('ITEM_CODE', targetRow)
  } catch (err) {
    handleApiError(err)
  } finally {
    isBarcodeScanning.value = false
  }
}

// Computed 옵션 및 필터링 리스트
const SUNGSANG_EMPTY = '공백'

const sungsangOptions = computed(() => [...new Set(matUseDataList.value.map(r => String(r.appearance ?? '').trim() || SUNGSANG_EMPTY))])
const sungsangCheckedMap = reactive({})
watch(sungsangOptions, opts => {
  opts.forEach(ss => { if (sungsangCheckedMap[ss] === undefined) sungsangCheckedMap[ss] = true })
  Object.keys(sungsangCheckedMap).forEach(k => { if (!opts.includes(k)) delete sungsangCheckedMap[k] })
}, { immediate: true })

const sangGubunOptions = computed(() => [ALL_TAB, ...[...new Set(matUseDataList.value.map(r => r.phase).filter(Boolean))].sort()])
const activeSangGubun = ref(ALL_TAB)
watch(sangGubunOptions, opts => {
  if (!opts.includes(activeSangGubun.value)) activeSangGubun.value = ALL_TAB
}, { immediate: true })

const currentTabList = computed(() => matUseDataList.value.filter(row => {
  const tabMatches = activeSangGubun.value === ALL_TAB || String(row.phase ?? '') === activeSangGubun.value
  const selected = Object.entries(sungsangCheckedMap).filter(([, enabled]) => enabled).map(([name]) => name)
  const appearance = String(row.appearance ?? '').trim() || SUNGSANG_EMPTY
  return tabMatches && (!selected.length || selected.includes(appearance))
}))
const totalMatCount = computed(() => currentTabList.value.length)
const finishedCount = computed(() => currentTabList.value.filter(r => r.weighYn === 'Y').length)
const allChecked = computed({
  get: () => currentTabList.value.length > 0 && currentTabList.value.every(r => r.selected),
  set: checked => currentTabList.value.forEach(r => { r.selected = checked })
})

// Handsontable 설정
const hotHeaders = ref(['', '선택', '품목코드', '품목명', '성상', '상구분', '지시량', '칭량', '용기무게', '-', '총량', '사용시험번호', '완료', '칭량자', '-', '확인자', '-'])
const orderDistRenderer = (instance, td, row, col, prop, value) => {
  td.textContent = activeSangGubun.value === ALL_TAB ? row + 1 : value
  td.className = 'htCenter'
}
const magnifierRenderer = (instance, td) => {
  td.innerHTML = `<span style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:100%;"><i class="pi pi-search"></i></span>`
  td.style.textAlign = 'center'
}

const sungsangRenderer = (instance, td, row, col, prop, value) => {
  td.textContent = value ?? ''
  td.className = 'htCenter'

  const v = String(value ?? '').trim()

  td.style.backgroundColor = ''
  td.style.color = ''
  td.style.fontWeight = ''

  if (v === '분말') {
    td.style.backgroundColor = '#FFF3CD'
    td.style.color = '#664D03'
    td.style.fontWeight = 'bold'
  } else if (v === '액상') {
    td.style.backgroundColor = '#D1ECF1'
    td.style.color = '#055160'
    td.style.fontWeight = 'bold'
  } else if (v === '색소') {
    td.style.backgroundColor = '#F8D7DA'
    td.style.color = '#842029'
    td.style.fontWeight = 'bold'
  } else if (v === '향료') {
    td.style.backgroundColor = '#E2D9F3'
    td.style.color = '#432874'
    td.style.fontWeight = 'bold'
  } else if (!v) {
    td.style.backgroundColor = '#E9ECEF'
    td.style.color = '#495057'
  }
}

const testNoRenderer = (instance, td, row, col, prop, value) => {
  const testNos = String(value ?? '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)

  td.innerHTML = testNos.join('<br>')
  td.className = 'htCenter'
  td.style.whiteSpace = 'normal'
  td.style.lineHeight = '22px'
}

const hotColumns = ref([
  { data: FIELD.DIST_ORDER, readOnly: true, className: 'htCenter', renderer: orderDistRenderer },
  { data: FIELD.SELECTED, type: 'checkbox', className: 'htCenter' },
  { data: 'itemCd', readOnly: true, className: 'htCenter' },
  { data: 'itemName', readOnly: true },
  { data: FIELD.SUNGSANG, readOnly: true, className: 'htCenter', renderer: sungsangRenderer },
  { data: FIELD.SANGGUBUN, readOnly: true, className: 'htCenter' },
  { data: 'orderQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight', readOnly: true },
  { data: 'weighQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: 'bagWeight', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: LOOKUP_PROP.CONTAINER, readOnly: true, renderer: magnifierRenderer },
  { data: 'totalQty', readOnly: true, type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },
  { data: 'testNoJoin', readOnly: true, className: 'htCenter', renderer: testNoRenderer },
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
                    procStatus: '12',
                    batchStatus: '12',
                    workProcId: form.workProcId,
                    workBatchId: form.workBatchId,
                    procCd: form.procCd
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
    // 전체 목록에서 칭량완료(Y)인 행만 추출
    const saveList = matUseDataList.value.filter(
        row => row.weighYn === 'Y'
    )
    if (saveList.length === 0) {
        vWarning('칭량완료된 품목이 없습니다.')
        return
    }

    try {
        const res = await ApiProc.saveWeighInfo({ workOrderInfo: form, weightBomList: saveList  })
        vSuccess(res.message)
        await loadWeighInfo()
        //checkComplete()
    } catch(err) {
        handleApiError(err)
    }
}

const checkComplete = () => {
    if (form.procStatus === '11' && totalMatCount.value === finishedCount.value) {
        isComplate.value = true
    }else{
        isComplate.value = false
    }
}

const handleAfterChange = (changes, source) => {
  if (!changes || source === 'loadData') return
  for (const [rowIndex, prop] of changes) {
    const row = currentTabList.value[rowIndex]
    if (!row) continue
    if (['weighQty', 'bagWeight'].includes(prop)) {
      row.totalQty = calcTotalQty(row)
      // 변경된 행 객체를 직접 수정하므로 필터링된 탭에서도 올바른 행에 반영
      const hot = hotTable.value?.hotInstance || hotTable.value
      hot?.render?.()
    }
  }
}

const handleCellClickFromHot = (event, coords) => {
  if (isStarted.value || !coords || coords.row < 0 || coords.col < 0) return
  const row = currentTabList.value[coords.row]
  if (!row) return
  const prop = hotColumns.value[coords.col]?.data
  const lookup = {
    itemCd: 'ITEM_CODE', itemName: 'ITEM_CODE',
    [LOOKUP_PROP.CONTAINER]: 'CONTAINER_WEIGHT',
    [LOOKUP_PROP.WEIGHER]: 'WEIGH_USER',
    [LOOKUP_PROP.CONFIRM]: 'CONFIRM_USER'
  }
  if (lookup[prop]) openLookupPopup(lookup[prop], row)
  if (prop === 'bagWeight') {
    const last = lastMouseDown.value
    if (last.row === coords.row && last.col === coords.col && Date.now() - last.time < 300) {
      openLookupPopup('CONTAINER_WEIGHT1', row)
      lastMouseDown.value = { row: -1, col: -1, time: 0 }
      return
    }
  }
  lastMouseDown.value = { row: coords.row, col: coords.col, time: Date.now() }
}

// 칭량량 + 용기무게
const calcTotalQty = (row) => {
  const weighQty = toNumber(row.weighQty) ?? 0
  const bagWeight = toNumber(row.bagWeight) ?? 0
  return weighQty + bagWeight
}

const openLookupPopup = (type, row = null) => {
  if (type === 'ITEM_CODE') {
    if (isBarcodePopupOpen.value || row?.itemCd === 'JRMSC00011') return
    isBarcodePopupOpen.value = true
  }
  const popup = POPUPS[type] ?? POPUPS.S
  const hasRow = ROW_POPUPS.has(type)
  try {
    dialog.open(popup.comp, {
      props: {
        header: popup.title, modal: true, draggable: false,
        style: { overflow: 'hidden' },
        pt: { root: { style: { overflow: 'hidden' } }, content: { style: { overflow: 'hidden' } } }
      },
      data: { form, ...(hasRow ? { row } : {}), type },
      onClose: async event => {
        if (type === 'ITEM_CODE') {
          isBarcodePopupOpen.value = false
          scanBuffer.value = ''
        }
        if (event?.data && hasRow && row) {
          applyPopupResultToRow(type, row, event.data)
          row.totalQty = calcTotalQty(row)
          const hot = hotTable.value?.hotInstance || hotTable.value
          hot?.render?.()
        } else {
          await loadWeighInfo()
        }
        // 바코드 입력은 팝업 자체 저장 후 최신 데이터 조회
        if (type === 'ITEM_CODE' && event?.data) await loadWeighInfo()
      }
    })
  } catch (err) {
    if (type === 'ITEM_CODE') isBarcodePopupOpen.value = false
    handleApiError(err)
  }
}

const applyPopupResultToRow = (type, row, data) => {
  switch (type) {
    case 'ITEM_CODE':
      row.weighQty = data.weighQty ?? row.weighQty
      row.testNoJoin = data.testNo ?? row.testNo
      row.weighYn = Number(row.weighQty) === Number(row.orderQty) ? 'Y' : 'N'
      break
    case 'CONTAINER_WEIGHT':
      row.bagWeight = data.weight ?? row.weight
      break
    case 'CONTAINER_WEIGHT1':
      row.bagWeight = data ?? row.weight
      break
    case 'WEIGH_USER':
      row.weigher = data.workerName ?? row.workerName
      break
    case 'CONFIRM_USER':
      row.confirmer = data.workerName ?? row.workerName
      break
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
        workProcId: form.workProcId || dialogRef.value.data.workProcId,
        itemCd: form.itemCd || dialogRef.value.data.itemCd,
        procCd: form.procCd || dialogRef.value.data.procCd,
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

const downloadExcel =  async () => {
    const ws = XLSX.utils.json_to_sheet(currentTabList.value.map(row => ({
        품목코드: row.itemCd ?? ''
        , 품목명: row.itemName ?? ''
        , 성상: row.appearance ?? ''
        , 상구분: row.phase ?? ''
        , 지시량: row.orderQty ?? 0
        , 칭량: row.weighQty ?? 0
        , 용기무게: row.bagWeight ?? 0
        , 총량: row.totalQty ?? 0
        , 사용시험번호: row.testNo ?? ''
        , 완료: row.weighYn ?? ''
        , 칭량자: row.weigher ?? ''
        , 확인자: row.confirmer ?? '',
    })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '칭량처방리스트')
  XLSX.writeFile(wb, '칭량_처방_리스트.xlsx')
}

const downloadProc = async () => {
  const params = {
        itemCd : form.itemCd,
        itemName : form.itemName,
        procCd : 'PRC001',
        workProcId : form.workProcId,
    }

    try {
        const blob = await ApiProc.downloadWeighProc(params)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download =`${form?.makeNo || ''}_칭량기록.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
    } catch (err) {
        handleApiError(err)
    }
}

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
:deep(.handsontable td) {
  vertical-align: middle;
}
td .custom-cell {
  background-color: rgb(245 245 245);
}
.cellHeader,
.cellBorder {
    width: 12.5%;
}
</style>
