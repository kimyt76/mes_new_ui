<template>
  <div class="w-full mt-3">
    <table cellspacing="0" width="100%">
      <tbody>
        <tr>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목명</th>
            <td class="cellBorder" colspan="3"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">지시일자</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">지시량</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">칭량일자</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">칭량처</th>
            <td class="cellBorder"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">특이사항</th>
            <td class="cellBorder" colspan="5">
            <InputText class="w-full" v-model="form.note" />
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
          <InputText id="barcode" v-model="form.barcodePrint" style="width: 180px" />
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
        <Tab v-for="sg in sangGubunOptions" :key="sg" :value="sg">
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
                50,   // 선택
                120,  // 품목코드
                385,  // 품목명
                50,   // 성상
                60,   // 상구분
                90,   // 지시량
                90,   // 칭량
                90,   // 용기무게
                45,   // -
                100,   // 총량
                110,  // 사용시험번호
                50,   // 완료
                90,  // 칭량자
                45,   // -
                90,  // 확인자
                45    // -
            ]"
          :rowHeaders="false"
          :height="550"
          :afterChange="handleAfterChange"
          :afterOnCellMouseDown="handleCellClickFromHot"
          :stretchH="'all'"
        />
      </TabPanel>
    </Tabs>
  </div>

  <div class="w-full mt-3">
    <div class="flex items-center justify-end gap-3">
      <Button label="칭량시작" />
      <Button label="바코드출력" icon="pi pi-barcode" />
      <Button label="공정기획서" />
      <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
    </div>
  </div>
</template>

<script setup>
import BaseHotTable from '@/components/BaseHotTable.vue'
import { toNumber } from '@/util/common'
import { useDialog } from 'primevue'
// PrimeVue
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import WeighBarcodeRegPop from './WeighBarcodeRegPop.vue'

const dialog = useDialog()
const ALL_TAB = 'ALL'
/** ✅ 필드명 매핑 */
const FIELD = {
  SUNGSANG: 'sungSang',     // 성상
  SANGGUBUN: 'sangGubun',   // 상구분
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
const form = reactive({
  barcodePrint: '',
  note: '',
})

/** ✅ 성상 옵션 */
const sungsangOptions = computed(() => {
  const set = new Set()
  for (const r of matUseDataList.value) {
    const v = r?.[FIELD.SUNGSANG]
    if (v != null && String(v).trim() !== '') set.add(String(v))
  }
  return Array.from(set)
})

/** ✅ 성상 체크 상태 */
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
    const ssOk = allowedSs.size ? allowedSs.has(ss) : true
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
 * ✅ 요청하신 헤더(16개)
 * ========================= */
const hotHeaders = ref([
  '선택',
  '품목코드',
  '품목명',
  '성상',
  '상구분',
  '지시량',
  '칭량',
  '용기무게',
  '-',
  '총량',
  '사용시험번호',
  '완료',
  '칭량자',
  '-',
  '확인자',
  '-'
])

/** =========================
 * ✅ 돋보기 아이콘 렌더러(Handsontable)
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
  { data: FIELD.SELECTED, type: 'checkbox', className: 'htCenter' },                 // 1 선택
  { data: 'itemCd', readOnly: true, className: 'htCenter'  },                       // 2 품목코드
  { data: 'itemName', readOnly: true },                       // 3 품목명
  { data: FIELD.SUNGSANG, readOnly: true , className: 'htCenter' },                   // 4 성상
  { data: FIELD.SANGGUBUN, readOnly: true, className: 'htCenter'  },                  // 5 상구분
  { data: 'orderQty' , type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight', readOnly: true },                                        // 6 지시량
  { data: 'weighQty', type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight' },                                       // 7 칭량
  { data: 'containerWeight' , type: 'numeric', numericFormat: { pattern: '0,0.00000' }, className: 'htRight'},                                // 8 용기무게
  { data: LOOKUP_PROP.CONTAINER, readOnly: true, renderer: magnifierRenderer }, // 9 '-' (용기무게 조회)
  { data: 'totalQty', readOnly: true , type: 'numeric', numericFormat: { pattern: '0,0.00000' },className: 'htRight'},                       // 10 총량
  { data: 'testNo', readOnly: true , className: 'htCenter'},                         // 11 사용시험번호
  { data: FIELD.WEIGH_YN, type: 'checkbox', checkedTemplate: 'Y', uncheckedTemplate: 'N' , className: 'htCenter'}, // 12 완료
  { data: 'weighUser', className: 'htCenter' },                      // 13 칭량자
  { data: LOOKUP_PROP.WEIGHER, readOnly: true, renderer: magnifierRenderer },  // 14 '-' (칭량자 조회)
  { data: 'weighConfirmUser', className: 'htCenter' },               // 15 확인자
  { data: LOOKUP_PROP.CONFIRM, readOnly: true, renderer: magnifierRenderer },  // 16 '-' (확인자 조회)
])

/** ✅ 변경 이벤트(weighYn boolean 방어 포함) */
const handleAfterChange = (changes, source) => {
  if (!changes || source === 'loadData') return

  for (const [rowIndex, prop, oldVal, newVal] of changes) {
    const row = currentTabList.value[rowIndex]
    if (!row) continue

    if (prop === FIELD.WEIGH_YN) {
      // 혹시 boolean으로 들어오는 환경 방어
      if (newVal === true) currentTabList.value[rowIndex][FIELD.WEIGH_YN] = 'Y'
      else if (newVal === false) currentTabList.value[rowIndex][FIELD.WEIGH_YN] = 'N'
    }

    if (prop === 'weighQty' || prop === 'containerWeight') {
      const weighQty = toNumber(row.weighQty)
      const containerWeight = toNumber(row.containerWeight)

      const total = weighQty + containerWeight
      row.totalQty = total
      // ✅ 화면 반영 보장
      //if (hot) hot.setDataAtRowProp(rowIndex, 'totalQty', total, 'calcTotalQty')
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

  // 클릭한 col의 prop 얻기(Handsontable API)
  // BaseHotTable에서 instance를 넘겨주지 않는다면, hotColumns 기준으로 매핑
  const colDef = hotColumns.value[coords.col]
  const prop = colDef?.data

  //품목코드, 품목명 클릭시
  if (prop === 'itemCd' || prop === 'itemName' ) {
    openLookupPopup('ITEM_CODE', rowData)
    return
  }
  // 돋보기 컬럼인지 체크
  if (prop === LOOKUP_PROP.CONTAINER) {
    openLookupPopup('CONTAINER_WEIGHT', rowData)
  } else if (prop === LOOKUP_PROP.WEIGHER) {
    openLookupPopup('WEIGH_USER', rowData)
  } else if (prop === LOOKUP_PROP.CONFIRM) {
    openLookupPopup('CONFIRM_USER', rowData)
  }
}

/** 팝업 호출() */
const openLookupPopup = (type, row) => {
    let title = ''
    let currentComponet = ''

     console.log('OPEN POPUP =>', type, row)

    if (type === 'ITEM_CODE') {
        if ( row.itemCd === 'JRMSC00011') return
        title = '바코드 칭량 입력'
        currentComponet = WeighBarcodeRegPop
    } else if (type === 'CONTAINER_WEIGHT') {
        title = '용기무게 선택'
        // currentComponet = ContainerWeightDialog
    } else if (type === 'WEIGH_USER') {
        title = '칭량자 선택'
        // currentComponet = UserLookupDialog
    } else if (type === 'CONFIRM_USER') {
        title = '확인자 선택'
        // currentComponet = UserLookupDialog
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
    data: row,
    onClose: (event) =>{
        if( !event.data) return

        if (type === 'ITEM_CODE') {

        } else if (type === 'CONTAINER_WEIGHT') {

        } else if (type === 'WEIGH_USER') {

        } else if (type === 'CONFIRM_USER') {

        }
    },

  } )
}

/** ✅ 데이터 정규화 */
const normalizeRows = (rows) => {
  return (rows ?? []).map(r => ({
    ...r,
    [FIELD.SELECTED]: r?.[FIELD.SELECTED] ?? false,
    [FIELD.WEIGH_YN]: r?.[FIELD.WEIGH_YN] ?? 'N',
    containerWeight: r?.containerWeight ?? 0,
    totalQty: r?.totalQty ?? 0,
    testNo: r?.testNo ?? '',
    weighUser: r?.weighUser ?? '',
    weighConfirmUser: r?.weighConfirmUser ?? '',
  }))
}

/** 버튼들 */
const refresh = async () => {
  // API 재호출 필요 시 여기
}

const downloadExcel = () => {
  // 기존 로직 사용
}

onMounted(async () => {
  // ✅ TODO: 실제 API 결과로 교체
  const rowsFromApi = [
    { itemCd: 'JRMSC00011', itemName: 'Di-Water', [FIELD.SUNGSANG]: '액상', [FIELD.SANGGUBUN]: 'A', orderQty: 3785.25, weighQty: 0, containerWeight: 0, totalQty: 0, testNo: '', weighYn: 'N', weighUser: '', weighConfirmUser: '' },
    { itemCd: 'JRMSZ00034', itemName: 'Calcium Chloride', [FIELD.SUNGSANG]: '분말', [FIELD.SANGGUBUN]: 'A', orderQty: 11, weighQty: 0, containerWeight: 0, totalQty: 0, testNo: '', weighYn: 'Y', weighUser: '', weighConfirmUser: '' },
    { itemCd: 'JRMSJ00044', itemName: 'GREEN GN-Z', [FIELD.SUNGSANG]: '색소', [FIELD.SANGGUBUN]: 'B', orderQty: 5.5, weighQty: 0, containerWeight: 0, totalQty: 0, testNo: '', weighYn: 'N', weighUser: '', weighConfirmUser: '' },
    { itemCd: 'JRMSF00010', itemName: 'Flavor X', [FIELD.SUNGSANG]: '향료', [FIELD.SANGGUBUN]: 'D', orderQty: 1, weighQty: 0, containerWeight: 0, totalQty: 0, testNo: '', weighYn: 'N', weighUser: '', weighConfirmUser: '' },
  ]
  matUseDataList.value = normalizeRows(rowsFromApi)
})
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
</style>
