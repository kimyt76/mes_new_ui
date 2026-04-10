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
            <td class="cellBorder" colspan="3"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder">{{ form.makeDate }}</td>
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
                        <InputText id="on_label1" v-model="form.weighNo" />
                        <label for="on_label1">QR코드(칭량번호)</label>
                    </FloatLabel>
                    <div class="count">
                        {{ totalCount }}  중 {{ checkedCount }} 개 완료
                    </div>
                    <div>
                        <span class="hint">** 저장시 완료 체크된 행만 저장됩니다.</span>
                    </div>
                    <div>
                        <Button label="새로고침" @click="loadMakeInfo"/>
                    </div>
                </div>
                <div>
                    <TabView v-model:activeIndex="phaseActiveIndex" class="phase-tabs">
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
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                </p>
            </TabPanel>
        </TabPanels>
    </Tabs>
</div>

<div class="w-full mt-3">
    <div class="flex items-center justify-end gap-3">
        <Button v-if="isStarted"  label="제조시작" @click="openLookupPopup('S')" />
        <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
        <Button label="바코드출력" icon="pi pi-barcode" @click="barcodePrint" />
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
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const hotTable = ref(null)
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const isStarted = ref(false)
const isComplate = ref(false)
const matUseDataList = ref([])
const totalCount = computed(() => {
  return Array.isArray(matUseDataList.value) ? matUseDataList.value.length : 0
})
const checkedCount = computed(() => {
  return matUseDataList.value.filter((row) => row.makeYn === 'Y').length
})
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
const colWidths = ref([50, 50, 130, 450, 120, 120, 200, 55, 120, 50, 120, 50])
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
  { data: 'make_confirmer', className: 'htCenter' },
  { data: LOOKUP_PROP.MAKE_CONFIRM, readOnly: true, renderer: magnifierRenderer },
])

const handleCellClickFromHot = (event, coords, td) => {
    // coords: { row, col }
    if (!coords || coords.row == null || coords.col == null) return
    if (coords.row < 0) return // 헤더 클릭 제외

    // 현재 탭에서 보이는 row(필터 적용 후)
    const rowData = currentTabList.value[coords.row]
    if (!rowData) return
    if (!coords || coords.row < 0 || coords.col < 0) return

    const now = Date.now()

    const  makeerLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.MAKER)
    const  makeconfirmLookupColIndex = hotColumns.value.findIndex(col => col.data === LOOKUP_PROP.MAKE_CONFIRM)

        // 2. 칭량자 돋보기 클릭
    if (coords.col === makeerLookupColIndex) {
        openLookupPopup('MAKE_USER', rowData)
        return
    }

    // 3. 확인자 돋보기 클릭
    if (coords.col === makeconfirmLookupColIndex) {
        openLookupPopup('CONFIRM_USER', rowData)
        return
    }
}

const handleAfterChange = (changes, source) =>{
    console.log('changes',  changes)
    console.log('source',  source)
}

const normalizePhase = (phase) => {
  const value = String(phase ?? '').trim()
  return value === '' ? '미분류' : value
}

const activePhase = computed(() => phaseTabs.value[phaseActiveIndex.value] || 'ALL')

const phaseTabs = computed(() => {
  const phases = [...new Set(
    (matUseDataList.value || []).map(row => normalizePhase(row.phase))
  )]

  return ['ALL', ...phases]
})

const currentTabList = computed(() => {
  if (activePhase.value === 'ALL') return matUseDataList.value || []

  return (matUseDataList.value || []).filter(
    row => normalizePhase(row.phase) === activePhase.value
  )
})

const saveInfo = () =>{

}


const openLookupPopup = (type) =>{

}

const complateMake = () =>{

}

const barcodePrint = () =>{

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
    workProcId: dialogRef.value.data.workProcId,
    itemCd: dialogRef.value.data.itemCd,
})
const bindMakeInfo = (data) => {
    console.log('data', data)
    Object.assign(form, data.procMake || {})
    matUseDataList.value = data.bomList || []
    isStarted.value = data.procWeigh?.procStatus === '00'
}

const closeDialog = () => {
    dialogRef.close();
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
