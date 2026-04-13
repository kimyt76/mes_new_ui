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

  <!-- 상단 컨트롤 -->
  <div class="w-full mt-3">
    <div class="flex items-center gap-4 flex-wrap">
      <!--  현재 탭 리스트 전체 선택 -->
      <div class="flex items-center gap-2">
        <Checkbox v-model="allChecked" binary />
        <span>전체</span>
      </div>

      <div>
        <FloatLabel variant="on">
          <InputText id="barcode" v-model="form.barcode" :disabled="form.procStatus === '00'" style="width: 180px" />
          <label for="barcode">바코드(시험번호)</label>
        </FloatLabel>
      </div>

      <!--  현재 탭 기준 카운트 -->
      <div>
        <span>{{ totalMatCount }} 중 {{ finishedCount }} 개 완료</span>
      </div>

      <!-- 성상 체크박스: 데이터 기반 생성 -->
      <div class="flex items-center gap-3 flex-wrap">
        <div
          v-for="ss in sungsangOptions"
          :key="ss"
          class="flex items-center gap-2"
        >
          <Checkbox v-model="sungsangCheckedMap[ss]" binary />
          <span>{{ ss }}</span>
        </div>
      </div>

      <div class="ml-auto">
        <Button label="새로고침" @click="refresh" />
      </div>
    </div>
  </div>
  <!-- 상구분 탭 + HotTable -->
  <div class="w-full mt-3">
    <Tabs v-model:value="activeSangGubun">
      <TabList>
        <Tab v-for="sg in sangGubunOptions"
              :key="sg"
              :value="sg"
              >
          {{ sg }}
        </Tab>
      </TabList>

      <TabPanel v-for="sg in sangGubunOptions" :key="sg" :value="sg">
        <BaseHotTable
          ref="hotTable"
          :data="currentTabList"
          :colHeaders="hotHeaders"
          :columns="hotColumns"
          :colWidths="[
                50,   // 순서
                50,   // 선택
                150,  // 품목코드
                400,  // 품목명
                60,   // 성상
                60,   // 상구분
                100,   // 지시량
                100,   // 칭량
                90,   // 용기무게
                45,   // -
                100,   // 총량
                130,  // 사용시험번호
                50,   // 완료
                100,  // 칭량자
                45,   // -
                100,  // 확인자
                45    // -
            ]"
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
      <Button v-if="isStarted"  label="칭량시작" @click="openLookupPopup('S')" />
      <Button v-if="!isStarted" label="저장" class="p-button-secondary" @click="saveInfo('S')" />
      <Button label="바코드출력" icon="pi pi-barcode" @click="printWeighLabel"/>
      <Button label="공정기획서" @click="downloadProc" />
      <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
      <Button v-if="isComplate" label="창량완료" @click="completeWeight" />
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
  </div>
</template>

<script setup>
import BaseHotTable from '@/components/BaseHotTable.vue'
import { toNumber } from '@/util/common'
import { useConfirm, useDialog } from 'primevue'
// PrimeVue
import { ApiProc } from '@/api/apiProc'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { handleApiError } from '@/util/errorHandler'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import BagWeightInfoPop from '../../common/BagWeightInfoPop.vue'
import BagWeightPop from '../../common/BagWeightPop.vue'
import ProcStartPop from '../../common/ProcStartPop.vue'
import WorkerPop from '../../common/WorkerPop.vue'
import WeighBarcodeRegPop from './WeighBarcodeRegPop.vue'

const {vSuccess, vWarning, vInfo} = useAlertStore()
const hotTable = ref(null)
const dialogRef = inject('dialogRef')
const isStarted = ref(true)
const isComplate = ref(false)
const dialog = useDialog()
const { userId} = useAuthStore()
const form = reactive({
    makeNo: '',
    itemCd:'',
    itemName: '',
    procOrderDate: '',
    orderQty: 0,
    prodDate: '',
    storageName:'',
    storageCd:'',
    poNo:'',
    etc: '',

    batchStatus: '',
    procStatus: '',
    isBtn: 'W',
    areaCd: '',
    barcode: '',
    workProcId: '',
    workBatchId: '',
    workOrderId: '',
    procCd: 'PRC001',
    userId: userId,
})
const ALL_TAB = 'ALL'
/** ✅ 필드명 매핑 */
const FIELD = {
  DIST_ORDER: 'orderDist',
  SUNGSANG: 'appearance',     // 성상
  SANGGUBUN: 'phase',   // 상구분
  WEIGH_YN: 'weighYn',      // 완료(Y/N)
  SELECTED: 'selected',     // 선택(프론트용)
}

/** 돋보기 컬럼 식별 키(Handsontable에서 prop으로 클릭 감지) */
const LOOKUP_PROP = {
  CONTAINER: '__lookup_container',   // 용기무게 돋보기
  WEIGHER: '__lookup_weighUser',     // 칭량자 돋보기
  CONFIRM: '__lookup_confirmUser',   // 확인자 돋보기
}
const matUseDataList = ref([])

/**성상 옵션 */
const sungsangOptions = computed(() => {
  const set = new Set()
  for (const r of matUseDataList.value) {
    const v = r?.[FIELD.SUNGSANG]
    if (v != null && String(v).trim() !== '') set.add(String(v))
  }
  return Array.from(set)
})

/**성상 체크 상태 */
const sungsangCheckedMap = reactive({})
watch(sungsangOptions, (opts) => {
  for (const ss of opts) {
    if (sungsangCheckedMap[ss] === undefined) sungsangCheckedMap[ss] = true
  }
  Object.keys(sungsangCheckedMap).forEach((k) => {
    if (!opts.includes(k)) delete sungsangCheckedMap[k]
  })
}, { immediate: true })

/** ✅ 상구분 탭 옵션 */
const sangGubunOptions = computed(() => {
  const set = new Set()
  for (const r of matUseDataList.value) {
    const v = r?.[FIELD.SANGGUBUN]
    if (v != null && String(v).trim() !== '') set.add(String(v))
  }
  return [ALL_TAB, ...Array.from(set).sort()]
})

// ✅ 초기 탭: ALL
const activeSangGubun = ref(ALL_TAB)

// ✅ 옵션이 바뀌어도 active 탭이 유효하게 유지
watch(sangGubunOptions, (opts) => {
  if (!opts.length) {
    activeSangGubun.value = ALL_TAB
    return
  }
  if (!opts.includes(activeSangGubun.value)) {
    activeSangGubun.value = ALL_TAB
  }
}, { immediate: true })

  /** ✅ 현재 탭 + 성상 필터 적용 리스트 */
  const currentTabList = computed(() => {
    const tab = activeSangGubun.value
    const allowedSs = new Set(
        Object.entries(sungsangCheckedMap)
        .filter(([, v]) => v === true)
        .map(([k]) => k)
  )

  return matUseDataList.value.filter(r => {
    const sg = String(r?.[FIELD.SANGGUBUN] ?? '')
    const ss = String(r?.[FIELD.SUNGSANG] ?? '')
    const tabOk = (tab === ALL_TAB) ? true : (sg === tab)
    const ssOk = ss === '' ? true : (allowedSs.size ? allowedSs.has(ss) : true)
    return tabOk && ssOk
  })
})

/** ✅ 카운트(현재 탭 기준) */
const totalMatCount = computed(() => currentTabList.value.length)
const finishedCount = computed(() =>
  currentTabList.value.filter(r => r?.[FIELD.WEIGH_YN] === 'Y').length
)

/** ✅ 전체 선택: 현재 탭 visible 행만 selected 토글 */
const allChecked = computed({
  get() {
    if (currentTabList.value.length === 0) return false
    return currentTabList.value.every(r => r?.[FIELD.SELECTED] === true)
  },
  set(v) {
    currentTabList.value.forEach(r => { r[FIELD.SELECTED] = v })
  }
})

/** =========================
 * 요청하신 헤더(16개)
 * ========================= */
const hotHeaders = ref(
    [  '', '선택',  '품목코드',  '품목명',  '성상',  '상구분',  '지시량',  '칭량',  '용기무게',  '-',  '총량',  '사용시험번호',  '완료',  '칭량자',  '-',  '확인자',  '-'])

/** =========================
 * 돋보기 아이콘 렌더러(Handsontable)
 * - BaseHotTable이 renderer를 그대로 전달해준다는 전제
 * - 안 되면 BaseHotTable 내부에서 renderer 허용해줘야 함
 * ========================= */
function magnifierRenderer(instance, td) {
  td.innerHTML = `<span style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:100%;">
    <i class="pi pi-search"></i>
  </span>`
  td.style.textAlign = 'center'
}

/** =========================
 * ✅ 요청하신 컬럼을 헤더(16개)에 1:1로 맞춤
 * - '-' 컬럼은 LOOKUP_PROP로 두고 renderer로 돋보기 표시
 * - 완료는 weighYn(Y/N) checkbox
 * ========================= */
const hotColumns = ref([
  { data: FIELD.DIST_ORDER,  readOnly: true, className: 'htCenter' },                 // 0 순서
  { data: FIELD.SELECTED, type: 'checkbox', className: 'htCenter' },                 // 1 선택
  { data: 'itemCd', readOnly: true, className: 'htCenter'  },                       // 2 품목코드
  { data: 'itemName', readOnly: true },                       // 3 품목명
  { data: FIELD.SUNGSANG, readOnly: true , className: 'htCenter' },                   // 4 성상
  { data: FIELD.SANGGUBUN, readOnly: true, className: 'htCenter'  },                  // 5 상구분
  { data: 'orderQty' , type: 'numeric', numericFormat: { pattern: '0,0.000' }, className: 'htRight', readOnly: true },                                        // 6 지시량
  { data: 'weighQty', type: 'numeric', numericFormat: { pattern: '0,0.000' }, className: 'htRight' },                                       // 7 칭량
  { data: 'bagWeight' , type: 'numeric', numericFormat: { pattern: '0,0.000' }, className: 'htRight'},                                // 8 용기무게
  { data: LOOKUP_PROP.CONTAINER, readOnly: true, renderer: magnifierRenderer }, // 9 '-' (용기무게 조회)
  { data: 'totalQty', readOnly: true , type: 'numeric', numericFormat: { pattern: '0,0.000' },className: 'htRight'},                       // 10 총량
  { data: 'testNo', readOnly: true , className: 'htCenter'},                         // 11 사용시험번호
  { data: FIELD.WEIGH_YN, type: 'checkbox', checkedTemplate: 'Y', uncheckedTemplate: 'N' , className: 'htCenter'}, // 12 완료
  { data: 'weigher', className: 'htCenter' },                      // 13 칭량자
  { data: LOOKUP_PROP.WEIGHER, readOnly: true, renderer: magnifierRenderer },  // 14 '-' (칭량자 조회)
  { data: 'confirmer', className: 'htCenter' },               // 15 확인자
  { data: LOOKUP_PROP.CONFIRM, readOnly: true, renderer: magnifierRenderer },  // 16 '-' (확인자 조회)
])

const confirm = useConfirm()
const completeWeight = async () =>{
    confirm.require({
        header: '칭량완료 확인',
        message: '칭량을 완료하고, 제조출고를 진행하시겠습니까?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try{
                console.log('form.workBatchId', form.workBatchId)
                const params = {
                    procStatus: '12',
                    batchStatus: '12',
                    workProcId: form.workProcId,
                    workBatchId: form.workBatchId,
                    procCd: form.procCd,
                }
                //console.log('params', params)
                const res = await ApiProc.completeWeight(params)
                vSuccess('정상적으로 칭량완료 처리하였습니다!')
                closeDialog()
            }catch(err){
                handleApiError(err)
            }
        }
    });
}

const saveInfo = async() =>{
    //예외체크
    try{
        const params = {
            procWeigh : form,
            weightBomList : matUseDataList.value
        }
        const res = await ApiProc.saveWeighInfo(params)
        vSuccess(res.message)
        checkComplete()
    }catch(err){
        handleApiError(err)
    }
}

const checkComplete = () =>{
    if ( form.procStatus === '11' && totalMatCount.value === finishedCount.value ){
        isComplate.value =true
    }
}

/** 변경 이벤트(weighYn boolean 방어 포함) */
const handleAfterChange = (changes, source) => {
  if (!changes || source === 'loadData') return

  for (const [rowIndex, prop, oldVal, newVal] of changes) {
    const row = matUseDataList.value[rowIndex]
    if (!row) continue

    if (prop === FIELD.WEIGH_YN) {
      // 혹시 boolean으로 들어오는 환경 방어
      if (newVal === true) currentTabList.value[rowIndex][FIELD.WEIGH_YN] = 'Y'
      else if (newVal === false) currentTabList.value[rowIndex][FIELD.WEIGH_YN] = 'N'
    }

    if (prop === 'weighQty' || prop === 'bagWeight') {
        const weighQty = toNumber(row.weighQty)
        const bagWeight = toNumber(row.bagWeight)

        let total = 0

        const hasWeigh = weighQty !== null && weighQty !== undefined && weighQty !== ''
        const hasBag = bagWeight !== null && bagWeight !== undefined && bagWeight !== ''

        if (hasWeigh && hasBag) {
            total = weighQty + bagWeight
        } else if (hasWeigh) {
            total = weighQty
        } else if (hasBag) {
            total = bagWeight
        } else {
            total = 0
        }

        row.totalQty = total

        const hot = hotTable.value?.hotInstance || hotTable.value
        if (hot?.setDataAtRowProp) {
            hot.setDataAtRowProp(rowIndex, 'totalQty', total, 'calcTotalQty')
        }
    }
  }
}

/** =========================
 * 돋보기 클릭 감지 → 팝업 호출
 * BaseHotTable의 afterOnCellMouseDown이
 * Handsontable hook 인자( event, coords, td )를 넘겨준다고 가정
 * ========================= */
const handleCellClickFromHot = (event, coords, td) => {
  // coords: { row, col }
  if (!coords || coords.row == null || coords.col == null) return
  if (coords.row < 0) return // 헤더 클릭 제외

  // 현재 탭에서 보이는 row(필터 적용 후)
  const rowData = currentTabList.value[coords.row]
  if (!rowData) return
  if (!coords || coords.row < 0 || coords.col < 0) return

  const now = Date.now()

  const itemCdColIndex = hotColumns.value.findIndex((col) => col.data === 'itemCd')
  const itemNameColIndex = hotColumns.value.findIndex((col) => col.data === 'itemName')
  const bagWeightColIndex = hotColumns.value.findIndex(col => col.data === 'bagWeight')
  const containerLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.CONTAINER)
  const weigherLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.WEIGHER)
  const confirmLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.CONFIRM)

  // 같은 itemCd가 여러 건이면 testNo 없는 다음 row를 찾아 팝업에 전달
  if (coords.col === itemCdColIndex || coords.col === itemNameColIndex) {
    //const targetRow = findTargetRowForItemCd(rowData)

    // if (!targetRow) {
    //     // 같은 itemCd가 모두 사용된 상태
    //     return
    // }
    //openLookupPopup('ITEM_CODE', targetRow)
    openLookupPopup('ITEM_CODE', rowData)
    return
  }

  // 1. 용기무게 돋보기 클릭
  if (coords.col === containerLookupColIndex) {
    openLookupPopup('CONTAINER_WEIGHT', rowData)
    return
  }

  // 2. 칭량자 돋보기 클릭
  if (coords.col === weigherLookupColIndex) {
    openLookupPopup('WEIGH_USER', rowData)
    return
  }

  // 3. 확인자 돋보기 클릭
  if (coords.col === confirmLookupColIndex) {
    openLookupPopup('CONFIRM_USER', rowData)
    return
  }

  // 4. bagWeight 셀 더블클릭 시 팝업
  if (coords.col === bagWeightColIndex) {
    const isSameCell =
      lastMouseDown.value.row === coords.row &&
      lastMouseDown.value.col === coords.col

    const isDoubleClick = isSameCell && (now - lastMouseDown.value.time < 300)

    if (isDoubleClick) {
      openLookupPopup('CONTAINER_WEIGHT1', rowData)

      // 연속 오픈 방지
      lastMouseDown.value = {
        row: -1,
        col: -1,
        time: 0,
      }
      return
    }
  }

  // 마지막 클릭 정보 저장
  lastMouseDown.value = {
    row: coords.row,
    col: coords.col,
    time: now,
  }
}

/**
 * 같은 itemCd가 여러 줄일 경우
 * testNo가 비어있는 첫 번째 row를 우선 대상으로 사용
 * - 클릭한 row의 itemCd 기준으로 전체 목록(matUseDataList)에서 탐색
 * - 모두 사용된 상태면 클릭한 row 그대로 반환
 */
const findTargetRowForItemCd = (clickedRow) => {
    if (!clickedRow?.itemCd) return clickedRow

    const sameItemRows = matUseDataList.value.filter(
        (r) => String(r.itemCd ?? '') === String(clickedRow.itemCd ?? '')
    )

    if (sameItemRows.length <= 1) {
        return !String(clickedRow.testNo ?? '').trim() ? clickedRow : null
    }

    const clickedIndex = sameItemRows.findIndex((r) => r === clickedRow)
    if (clickedIndex === -1) {
        return sameItemRows.find((r) => !String(r.testNo ?? '').trim()) || null
    }

  // 현재 row 포함, 뒤쪽부터 먼저 탐색
  for (let i = clickedIndex; i < sameItemRows.length; i++) {
    if (!String(sameItemRows[i].testNo ?? '').trim()) {
      return sameItemRows[i]
    }
  }

  // 뒤에 없으면 앞쪽 순환 탐색
  for (let i = 0; i < clickedIndex; i++) {
    if (!String(sameItemRows[i].testNo ?? '').trim()) {
      return sameItemRows[i]
    }
  }

  return null
}

const lastMouseDown = ref({
  row: -1,
  col: -1,
  time: 0,
})

const calcTotalQty = (row) => {
  const weighQty = Number(row.weighQty || 0)
  const bagWeight = Number(row.bagWeight || 0)

  if (weighQty && bagWeight) return weighQty + bagWeight
  if (weighQty) return weighQty
  if (bagWeight) return bagWeight
  return 0
}

/** 팝업 호출() */
const openLookupPopup = (type, row = null) => {
    let title = ''
    let currentComponet = null

    // row를 넘겨야 하는 팝업 타입
    const rowTargetTypes = ['ITEM_CODE', 'CONTAINER_WEIGHT', 'WEIGH_USER', 'CONFIRM_USER', 'CONTAINER_WEIGHT1']
    const shouldPassRow = rowTargetTypes.includes(type)

    if (type === 'ITEM_CODE') {
        if (row?.itemCd === 'JRMSC00011') return
        title = '바코드 칭량 입력'
        currentComponet = WeighBarcodeRegPop
    } else if (type === 'CONTAINER_WEIGHT') {
        title = '용기무게 선택'
        currentComponet = BagWeightPop
    } else if (type === 'CONTAINER_WEIGHT1') {
        title = '용기무게 입력'
        currentComponet = BagWeightInfoPop
    } else if (type === 'WEIGH_USER') {
        title = '칭량자 선택'
        currentComponet = WorkerPop
    } else if (type === 'CONFIRM_USER') {
        title = '확인자 선택'
        currentComponet = WorkerPop
    } else {
        title = '칭량 시작'
        currentComponet = ProcStartPop
    }

    dialog.open(currentComponet, {
        props: {
            header: title,
            modal: true,
            draggable: false,
            style: { overflow: 'hidden' },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } },
            },
        },
        data: {
            form,
            ...(shouldPassRow ? { row } : {}),
            type,
        },
        onClose: (event) => {
            if (!event?.data) {
                if (!shouldPassRow) {
                    loadWeighInfo()
                }
                return
            }
            // row를 넘긴 팝업이면 선택된 row에 값 반영
            if (shouldPassRow && row) {
                applyPopupResultToRow(type, row, event.data)
                return
            }
            // 그 외 팝업은 기존 처리
            loadWeighInfo()
        },
    })
}

/**
 * 팝업 결과를 row에 반영
 * event.data 구조에 맞게 필드명만 맞춰주면 됨
 */
const applyPopupResultToRow = (type, row, data) => {
    if (type === 'ITEM_CODE') {
        // 예시: 바코드 팝업에서 넘겨주는 값
        row.weighQty = data.weighQty ?? row.weighQty
        row.testNo = data.testNos ?? row.testNos
        row.weighYn = 'Y'
    } else if (type === 'CONTAINER_WEIGHT') {
        // 예시: 용기무게 선택 팝업 반환값
        row.bagWeight = data.weight ?? row.weight
    } else if (type === 'WEIGH_USER') {
        // 예시: 작업자 선택 팝업 반환값
        row.weigher = data.workerName ?? row.workerName
    } else if (type === 'CONFIRM_USER') {
        // 예시: 확인자 선택 팝업 반환값
        row.confirmer = data.workerName ?? row.workerName
    } else if (type === 'CONTAINER_WEIGHT1') {
        row.bagWeight = data ?? row.weight
    }
}

/** ✅ 데이터 정규화 */
const normalizeRows = (rows) => {
  return (rows ?? []).map((r, idx) => {
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
}

/** 버튼들 */
const refresh = async () => {
    await loadWeighInfo()
}

const counterMap = {}

const printWeighLabel = async () => {
    //필터링
    const filtered = currentTabList.value.filter(item =>
        item[FIELD.SELECTED] === true &&
        item.itemCd !== 'JRW00215' &&
        item.itemCd !== 'JRMSC00011'
    )

    if (filtered.length === 0) {
        return vWarning('바코드를 출력할 품목을 선택해주세요.')
    }

    const selectedList = filtered.map(item => ({
        ...item,
        orderDist: Number(item?.[FIELD.DIST_ORDER] ?? 0),
        workProcId: form.workProcId
    }))

  // 팝업 열기
  const win = window.open('', '_blank')

  if (!win) {
    return vWarning('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
  }

  try {
    const pdfBlob = await ApiProc.printWeighLabel(selectedList)
    const url = URL.createObjectURL(pdfBlob)
    win.location.href = url
    // 메모리 해제 (조금 늦게)
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 10000)

  } catch (err) {
    if (win && !win.closed) {
      win.close()
    }
    return handleApiError(err)
  }
}

onMounted(async () => {
    await loadWeighInfo()
})
const createWeighInfoParams = () => ({
    workProcId: dialogRef.value.data.workProcId,
    itemCd: dialogRef.value.data.itemCd,
})
const fetchWeighInfo = async () => {
    const params = createWeighInfoParams()
    return await ApiProc.getWeighInfo(params)
}
const bindWeighInfo = (data) => {
    Object.assign(form, data.procWeigh || {})
    matUseDataList.value = normalizeRows(data.weightBomList || [])
    isStarted.value = data.procWeigh?.procStatus === '00'
    checkComplete()
}
const loadWeighInfo = async () => {
    const data = await fetchWeighInfo()
    bindWeighInfo(data)
}

/**
 * 엑셀 다운로드
 */
const downloadExcel = () => {
  const rows = currentTabList.value.map(row => ({
    품목코드: row.itemCd ?? '',
    품목명: row.itemName ?? '',
    성상: row.appearance ?? '',
    상구분: row.phase ?? '',
    지시량: row.orderQty ?? 0,
    칭량: row.weighQty ?? 0,
    용기무게: row.bagWeight ?? 0,
    총량: row.totalQty ?? 0,
    사용시험번호: row.testNo ?? '',
    완료: row.weighYn ?? '',
    칭량자: row.weigher ?? '',
    확인자: row.confirmer ?? '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '칭량처방리스트')

  XLSX.writeFile(wb, '칭량_처방_리스트.xlsx')
}


//공정검사서 다운로드
const downloadProc = () =>{

}

const closeDialog = () =>{
    dialogRef.value?.close()
}
</script>

<style scoped>
.cellBorder {
  border-top: 0.5px solid #ccc;
  border-bottom: 0.5px solid #ccc;
  border-left: 0.5px solid #ccc;
  border-right: 0.5px solid #ccc;
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
  background: #2f6fff; /* 원하는 색 */
  color: white;
}

</style>
