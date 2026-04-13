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
            <td class="cellBorder">{{ form.orderQty }}</td>
            <th class="cellBorder cellHeader">제조설비</th>
            <td class="cellBorder" colspan="3">{{ form.workEquipmentCd }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder">{{ form.prodDate }}</td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder">0 kg</td>
            <th class="cellBorder cellHeader">생산수율</th>
            <td class="cellBorder">0%</td>
            <th class="cellBorder cellHeader">생산처</th>
            <td class="cellBorder">{{ form.storageName }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder">{{ form.poNo }}</td>
            <th class="cellBorder cellHeader">비고</th>
            <td class="cellBorder" colspan="5">
                <Textarea v-model="form.etc" rows="1" class="w-full mt-1" style="resize: none;"/>
            </td>
        </tr>
      </tbody>
    </table>
</div>
<!-- 탭 -->
<div>
    <Tabs value="0">
        <TabList>
            <Tab value="0">원료투입</Tab>
            <Tab value="1">공정기록</Tab>
        </TabList>
        <TabPanels>
            <TabPanel value="0">
                <div class="flex items-center gap-3 mb-2">
                    <FloatLabel variant="on">
                        <InputText id="on_label1"
                          v-model="weighId"
                          :disabled="form.procStatus === '00'"
                          @keyup.enter="applyQrToList"
                        />
                        <label for="on_label1">QR코드(칭량번호)</label>
                    </FloatLabel>
                    <div class="count">
                        {{ totalCount }}  중 {{ checkedCount }} 개 완료
                    </div>
                    <div>
                        <span class="hint">** 저장 후 새로고침을 하셔야 데이터가 업데이트됩니다.</span>
                    </div>
                    <div>
                        <Button label="새로고침" @click="loadMakeInfo"/>
                    </div>
                </div>
                <div>
                    <TabView
                       :key="phaseTabRenderKey"
                       :activeIndex="phaseActiveIndex"
                        @update:activeIndex="handlePhaseTabChange"
                        class="phase-tabs">
                        <TabPanel
                            v-for="tab in phaseTabs"
                            :key="tab"
                            :header="tab"
                        >
                        <div>
                            <BaseHotTable
                                ref="hotTable"
                                :data="currentTabList"
                                :colHeaders="hotHeaders"
                                :colWidths="colWidths"
                                :columns="hotColumns"
                                :afterChange="handleAfterChange"
                                :afterOnCellMouseDown="handleCellClickFromHot"
                                :stretchH="'none'"
                            />
                        </div>
                        </TabPanel>
                    </TabView>
                </div>
            </TabPanel>
            <TabPanel value="1">
                <p class="m-0">

                </p>
            </TabPanel>
        </TabPanels>
    </Tabs>
</div>

<div class="w-full mt-3">
    <div class="flex items-center justify-end gap-3">
        <Button v-if="isStarted"  label="제조시작" @click="openLookupPopup('S')" />
        <Button v-if="!isStarted" label="저장" class="p-button-secondary" @click="saveInfo"></Button>
        <Button label="바코드출력" icon="pi pi-barcode" @click="openLookupPopup('P')" />
        <Button label="공정기록서(제조투입)" @click="downloadProcTest('P')"/>
        <Button label="공정기록서(공정기록)" @click="downloadProcTest('R')"/>
        <Button v-if="isComplate" label="제조완료" @click="complateMake" />
        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
</div>

</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import BaseHotTable from '@/components/BaseHotTable.vue';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import WorkerPop from '../../common/WorkerPop.vue';
import MakeQtyPopup from './MakeQtyPopup.vue';
import ProcMakeStartPop from './ProcMakeStartPop.vue';

const { vSuccess, vInfo, vWarning} = useAlertStore()
const weighId = ref('')
const hotTable = ref(null)
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const isStarted = ref(false)
const isComplate = ref(false)
const matUseDataList = ref([])
const activePhase = computed(() => phaseTabs.value[phaseActiveIndex.value] || 'ALL')
const phaseTabs = computed(() => {
  const phases = [...new Set(
    (matUseDataList.value || []).map(row => row.phase)
  )]

  return ['ALL', ...phases]
})

const totalCount = computed(() => {
  return Array.isArray(matUseDataList.value) ? matUseDataList.value.length : 0
})
const checkedCount = computed(() => {
  return matUseDataList.value.filter((row) => row.makeYn === 'Y').length
})
const phaseTabRenderKey = ref(0)
const phaseActiveIndex = ref(0)
const form = reactive({
    makeNo: '',
    itemCd:'',
    itemName: '',
    procOrderDate: '',
    orderQty: 0,
    prodDate: '',
    storageName:'',
    storageCd:'',
    workEquipmentCd: '',
    poNo:'',
    etc: '',

    isBtn: 'W',
    areaCd: '',
    barcode: '',
    workProcId: '',
    workBatchId: '',
    procCd: 'PRC002',
})
const LOOKUP_PROP = {
  MAKER: '__lookup_weighUser',     // 칭량자 돋보기
  MAKE_CONFIRM: '__lookup_confirmUser',   // 확인자 돋보기
}
const magnifierRenderer = (instance, td) => {
    td.innerHTML = `<span style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:100%;">
    <i class="pi pi-search"></i>
    </span>`
    td.style.textAlign = 'center'
}

const hotHeaders = ref(['No', '구분',  '품목코드',  '품목명',  '소요량',  '투입량',  '투입일시',  '완료',  '투입자',  '-',  '확인자', '-' ])
const colWidths = ref([50, 50, 140, 470, 120, 120, 170, 55, 120, 50, 120, 50])
const hotColumns = ref([
  { data: 'orderDist', readOnly: true, className: 'htCenter' },
  { data: 'phase', readOnly: true, className: 'htCenter' },
  { data: 'itemCd', readOnly: true, className: 'htCenter' },
  { data: 'itemName', readOnly: true },
  { data: 'orderQty', type: 'numeric', numericFormat: { pattern: '0,0.000' }, className: 'htRight', readOnly: true },
  { data: 'makeQty', type: 'numeric', numericFormat: { pattern: '0,0.000' }, className: 'htRight' },
  { data: 'makeTime', className: 'htCenter' },
  { data: 'makeYn', type: 'checkbox', checkedTemplate: 'Y', uncheckedTemplate: 'N', className: 'htCenter' },
  { data: 'maker', className: 'htCenter' },
  { data: LOOKUP_PROP.MAKER, readOnly: true, renderer: magnifierRenderer },
  { data: 'makeConfirmer', className: 'htCenter' },
  { data: LOOKUP_PROP.MAKE_CONFIRM, readOnly: true, renderer: magnifierRenderer },
])

const handlePhaseTabChange = (nextIndex) => {
    if (canMoveToPhase(nextIndex)) {
        phaseActiveIndex.value = nextIndex
    } else {
        // 탭 헤더 표시 원복용 강제 재렌더
        phaseTabRenderKey.value++
    }
}

const canMoveToPhase = (nextIndex) => {
  const tabs = phaseTabs.value || []
  const currentIndex = phaseActiveIndex.value

  // 같은 탭 또는 뒤로 이동은 허용
  if (nextIndex <= currentIndex) return true

  // ALL로 가는 건 허용
  const nextPhase = tabs[nextIndex]
  if (nextPhase === 'ALL') return true

  // 현재 위치부터 목표 직전까지 전부 완료 체크
  for (let i = currentIndex; i < nextIndex; i++) {
    const phase = tabs[i]

    // ALL은 스킵
    if (phase === 'ALL') continue

    const rows = (matUseDataList.value || []).filter(
      row => row.phase === phase
    )

    // 데이터 없으면 다음 phase 검사
    if (rows.length === 0) continue

    const hasIncomplete = rows.some(row => row.makeYn !== 'Y')

    if (hasIncomplete) {
      alert(`${phase} 단계가 완료되지 않아 ${nextPhase} 단계로 이동할 수 없습니다.`)
      return false
    }
  }

  return true
}

const handleAfterChange = () =>{

}

const handleCellClickFromHot = (event, coords, td) => {
    // coords: { row, col }
    if (!coords || coords.row == null || coords.col == null) return
    if (coords.row < 0) return // 헤더 클릭 제외

    // 현재 탭에서 보이는 row(필터 적용 후)
    const rowData = currentTabList.value[coords.row]
    if (!rowData) return
    if (!coords || coords.row < 0 || coords.col < 0) return

    const now = Date.now()

    const  makeQtyColIndex = hotColumns.value.findIndex(col => col.data === 'makeQty')
    const  makerLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.MAKER)
    const  makeconfirmLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.MAKE_CONFIRM)

    if (coords.col === makeQtyColIndex) {
        const isMakeQtyPopupTarget = rowData.itemCd === 'JRW00215' || rowData.itemCd === 'JRMSC00011'

        if (!isMakeQtyPopupTarget) return
        openLookupPopup('makeQty', rowData)
        return
    }
        // 2. 칭량자 돋보기 클릭
    if (coords.col === makerLookupColIndex) {
        openLookupPopup('MAKE_USER', rowData)
        return
    }
    // 3. 확인자 돋보기 클릭
    if (coords.col === makeconfirmLookupColIndex) {
        openLookupPopup('CONFIRM_USER', rowData)
        return
    }
}

/** yyyy-MM-dd HH:mm:ss */
const getNowDateTime = async () => {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

const applyQrToList = async () => {
    const inputValue = String(weighId.value ?? '').trim()
    if (!inputValue) return

    const id = Number(inputValue)

    // row.id 와 비교
    const targetRow = matUseDataList.value.find(
        row => Number(row.weighId) === id
    )

    if (!targetRow) {
        vInfo(`해당 QR(${id})와 일치하는 원료가 없습니다.`)
        return
    }

    // 자동 등록
    const res = await ApiProc.getWeighQty(weighId.value)

    targetRow.makeQty = res?? 0
    targetRow.makeTime = await getNowDateTime()
    targetRow.makeYn = 'Y'
    //await nextTick()
    // Handsontable 강제 렌더링
    const hotInstance = hotTable.value?.hotInstance || hotTable.value?.getHotInstance?.()
    hotInstance?.render()
    // 입력값 초기화
    //weighId.value = ''
}

const currentTabList = computed(() => {
  if (activePhase.value === 'ALL') return matUseDataList.value || []

  return (matUseDataList.value || []).filter(
    row => row.phase === activePhase.value
  )
})

const saveInfo = async () =>{
    //예외체크
    try{
        const params = {
            procMake : form,
            makeBomList : matUseDataList.value
        }
        const res = await ApiProc.saveMakeInfo(params)
        vSuccess(res.message)
        checkComplete()
    }catch(err){
        handleApiError(err)
    }
}

const openLookupPopup = (type, row) =>{
    let title = ''
    let componentPop = ''
    let itemList = []

    const rowTargetTypes = ['makeQty','MAKE_USER', 'CONFIRM_USER']
    const shouldPassRow = rowTargetTypes.includes(type)

    if(type === 'MAKE_USER'){
        title = '투입자 선택'
        componentPop = WorkerPop
    } else if(type === 'CONFIRM_USER'){
        title = '확인자 선택'
        componentPop = WorkerPop
    } else if(type === 'makeQty'){
        title = '투입량 입력'
        componentPop = MakeQtyPopup
    } else if(type === 'S'){
        title = '제조 시작'
        componentPop = ProcMakeStartPop
    }else if(type === 'P'){
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

    dialog.open(componentPop,{
        props:{
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
        onClose:(event) => {
            if (!event?.data) {
                if (!shouldPassRow) {
                    loadMakeInfo()
                }
                return
            }
            // row를 넘긴 팝업이면 선택된 row에 값 반영
            if (shouldPassRow && row) {
                applyPopupResultToRow(type, row, event.data)
                return
            }
            // 그 외 팝업은 기존 처리
            loadMakeInfo()
        },
    })
}

const applyPopupResultToRow = (type, row, data) => {
    if (type === 'makeQty') {
        // 예시: 용기무게 선택 팝업 반환값
        console.log('data', data)
        console.log('data.makeQt', data.makeQty)
        row.makeQty = data ?? row.orderQty
    } else if (type === 'MAKE_USER') {
        // 예시: 작업자 선택 팝업 반환값
        row.maker = data.workerName ?? row.workerName
    } else if (type === 'CONFIRM_USER') {
        // 예시: 확인자 선택 팝업 반환값
        row.makeConfirmer = data.workerName ?? row.workerName
    }
}

const complateMake = () =>{
    if ( totalCount.value !== checkedCount.value){
        vInfo('투입되지 않은 품목이 있습니다.')
        return
    }


}

onMounted( async () =>{
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
    itemCd: dialogRef.value.data.itemCd,
})
const bindMakeInfo = (data) => {
    Object.assign(form, data.procMake || {})
    matUseDataList.value = data.makeBomList || []

    if (data.procMake?.procStatus === '00' && data.procMake?.batchStatus ==='12'){
        isStarted.value = true
    }
    checkComplete()
}

const checkComplete = () =>{
    if ( form.procStatus === '21' && totalCount.value === checkedCount.value ){
        isComplate.value =true
    }
}

const closeDialog = () => {
    dialogRef.value.close();
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
.count {
  margin-left: 30px;
  font-weight: 500;
  font-size: 15px;
}
.hint {
  margin-left: 30px;
  font-weight: 500;
  color: #2b63c6;
  font-size: 13px;
}


:deep(.phase-tabs .p-tabview-nav li .p-tabview-nav-link) {
  background: #f1f5f9;
  color: #64748b;
  border-radius: 6px 6px 0 0;
  margin-right: 6px;
  padding: 8px 16px;
  font-weight: 500;
}

/* 선택된 탭 */
:deep(.phase-tabs .p-tabview-nav li.p-tabview-selected .p-tabview-nav-link) {
  background: #10b981;   /* 초록 */
  color: #ffffff;
  font-weight: 700;
}

/* hover 효과 */
:deep(.phase-tabs .p-tabview-nav li .p-tabview-nav-link:hover) {
  background: #0163e2;
}

</style>
