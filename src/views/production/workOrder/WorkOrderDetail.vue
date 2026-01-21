<template>
  <Card style="width: 125rem; height: 7rem;">
    <template #content>
      <div class="grid mb-1">
        <div class="col-3 flex align-items-center gap-2">
          <FloatLabel variant="on">
            <DatePicker
                v-model="form.workOrderDate"
                value-format="yy-mm-dd"
                />
            <label>작업지시일자</label>
          </FloatLabel>

          <span class="center-dash">-</span>

          <FloatLabel variant="on">
            <InputNumber v-model="form.seq" :inputStyle="{ width: '50px', 'text-align': 'center' }" />
            <label>연번</label>
          </FloatLabel>
        </div>
        <div class="col-6">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.itemName" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('O')" />
            </IconField>
            <label>수주 품목검색</label>
          </FloatLabel>
        </div>
        <div class="col-3">
            <div class="flex gap-2">
                <div class="w-1/2">
                <FloatLabel variant="on">
                    <InputText v-model="form.poNo" readonly/>
                    <label>PO NO</label>
                </FloatLabel>
                </div>
                <div class="w-1/2">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" readonly/>
                    <label>품목코드</label>
                </FloatLabel>
                </div>
            </div>
        </div>
      </div>
      <div class="grid mb-1">
        <div class="col-3">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.clientName" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('C')" />
            </IconField>
            <label>고객사</label>
          </FloatLabel>
        </div>

        <div class="col-3">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.managerName" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('U')" />
            </IconField>
            <label>담당자</label>
          </FloatLabel>
        </div>

        <div class="col-3">
            <div class="flex gap-2">
                <!-- 납품량 -->
                <div class="w-1/2">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.deliveryQty" class="w-full" />
                    <label>납품량</label>
                </FloatLabel>
                </div>

                <!-- 납품일 -->
                <div class="w-1/2">
                    <FloatLabel variant="on">
                        <DatePicker
                        v-model="form.deliveryDate"
                        showIcon
                        class="w-full"
                        />
                        <label>납품일</label>
                    </FloatLabel>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.areaCd"
                    :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>구역(공장)</label>
                </FloatLabel>
            </div>
      </div>
    </template>
  </Card>

  <!-- 버튼 바 -->
  <div class="w-full mt-3 mb-2">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 ml-2">
        <Checkbox v-model="allChecked" binary />
        <Button label="배치+" @click="addRow" />
        <Button label="배치복사" @click="copyRow" />
      </div>

      <div class="flex items-center gap-2">
        <Button label="칭량" :severity="selectedProcess === 'weigh' ? 'primary' : 'secondary'" @click="selectedProcess = 'weigh'" />
        <Button label="제조" :severity="selectedProcess === 'mat' ? 'primary' : 'secondary'" @click="selectedProcess = 'mat'" />
        <Button label="코팅" :severity="selectedProcess === 'coating' ? 'primary' : 'secondary'" @click="selectedProcess = 'coating'" />
        <Button label="충전" :severity="selectedProcess === 'charge' ? 'primary' : 'secondary'" @click="selectedProcess = 'charge'" />
        <Button label="포장" :severity="selectedProcess === 'packing' ? 'primary' : 'secondary'" @click="selectedProcess = 'packing'" />
      </div>
    </div>
  </div>

  <!-- Handsontable 공통 컴포넌트 사용 -->
  <div class="w-full">
    <BaseHotTable
      ref="hotTable"
      :data="workOrderList"
      :colHeaders="hotHeaders"
      :columns="hotColumns"
      :rowHeaders="false"
      :height="520"
      :afterChange="handleAfterChange"
      :afterOnCellMouseDown="handleCellClickFromHot"
    />
  </div>

  <div class="flex justify-end gap-2 mt-2">
    <Button v-if="form.workOrderId" label="작업지시" @click="updateWorkOrder" />
    <Button label="저장" class="p-button-secondary" @click="saveInfo" />
    <Button label="삭제" @click="clearList" />
    <Button label="닫기"   outlined class="ml-2" @click.stop="closeDialog" />
  </div>
</template>

<script setup>
import BaseHotTable from '@/components/BaseHotTable.vue'

import { ApiCommon } from '@/api/apiCommon'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { formatDate, isEmpty, todayKST } from '@/util/common'

import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue'
import ClientListPop from '@/views/order/client/ClientListPop.vue'
import ContractSingleListPop from '@/views/order/contract/ContractSingleListPop.vue'
import UserListPop from '@/views/system/user/UserListPop.vue'

import { ApiWorkOrder } from '@/api/apiWorkOrder'
import { DatePicker, useConfirm, useDialog } from 'primevue'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'

const { userId, memberNm } = useAuthStore()
const { vWarning, vSuccess, vInfo } = useAlertStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef')

const hotTable = ref(null)

const areaCds = ref([])
const selectedProcess = ref('weigh')
const allChecked = ref(false)

const workOrderList = ref([])
const currentRowIndexForItemPop = ref(null)

/**
 * weigh:   proc001
 * mat:     proc002
 * coating: proc003
 * charge:  proc004
 * packing: proc005
 */
const PROC_UI_TO_DB = {
  weigh: 'PRC001',
  mat: 'PRC002',
  coating: 'PRC003',
  charge: 'PRC004',
  packing: 'PRC005',
}

const PROC_DB_TO_UI = {
  PRC001: 'weigh',
  PRC002: 'mat',
  PRC003: 'coating',
  PRC004: 'charge',
  PRC005: 'packing',
}

const PROC_KEYS = ['weigh', 'mat', 'coating', 'charge', 'packing']
const form = reactive({
  workOrderDate: todayKST(),
  seq: '',
  deliveryQty: '',
  deliveryDate: '',
  managerName: memberNm,
  managerId: userId,
  clientName: '',
  clientId: '',
  itemName: '',
  itemCd: '',
  areaCd: '',
  workOrderId: '',

  poNo: '',
  userId: userId,
})

// -----------------
// row schema
// -----------------
const newProc = () => ({
  workProcId: null,       // ✅ 추가 (TB_WORK_ORDER_ITEM PK)
  itemCd: '',
  itemName: '',
  workOrderDate: null,
  orderQty: 0,
  workStatus: '',
})

const newRow = () => ({
  selected: false,
  workBatchId: null,
  poNo: form.poNo,
  matNo: '',
  lotNo: '',
  lotNo2: '',
  proc: {
    weigh: newProc(),
    mat: newProc(),
    coating: newProc(),
    charge: newProc(),
    packing: newProc(),
  },
})

// -----------------
// headers / columns
// -----------------
const hotHeaders = computed(() => [
  '',
  'PO No.',
  '제조번호',
  '1차포장 Lot',
  '2차포장 Lot',
  '선택',
  '품목코드',
  '품목명',
  '지시일자',
  '지시량',
  '작업상태',
  '-',
])

const searchIconRenderer = (instance, td) => {
  td.className = 'htCenter htMiddle'
  td.innerHTML = `<i class="pi pi-search ht-icon" title="검색"></i>`
}
const trashIconRenderer = (instance, td) => {
  td.className = 'htCenter htMiddle'
  td.innerHTML = `<i class="pi pi-trash ht-icon" title="삭제"></i>`
}

const hotColumns = computed(() => {
  const p = selectedProcess.value
  return [
    { data: 'selected', type: 'checkbox', className: 'htCenter htMiddle', width: 40 },
    { data: 'poNo', type: 'text', width: 100 },
    { data: 'matNo', type: 'text', width: 130 },
    { data: 'lotNo', type: 'text', width: 180 },
    { data: 'lotNo2', type: 'text', width: 180 },

    { data: null, readOnly: true, renderer: searchIconRenderer, width: 50 },

    { data: `proc.${p}.itemCd`, type: 'text', width: 70 ,className: 'htCenter htMiddle',},
    { data: `proc.${p}.itemName`, type: 'text', width: 390 },
    {
      data: `proc.${p}.procOrderDate`,
      type: 'date',
      dateFormat: 'YYYY-MM-DD',
      correctFormat: true,
      width: 100,
      datePickerConfig: {
        i18n: {
          previousMonth: '이전 달',
          nextMonth: '다음 달',
          months: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
          weekdays: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
          weekdaysShort: ['일','월','화','수','목','금','토'],
        },
        format: 'YYYY-MM-DD',
      },
    },
    { data: `proc.${p}.orderQty`, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 80 },
    { data: `proc.${p}.procStatusName`, type: 'text', width: 80 ,readOnly: true},
    { data: null, readOnly: true, renderer: trashIconRenderer, width: 40 },
  ]
})

// -----------------
// 전체 체크
// -----------------
watch(allChecked, (v) => {
  if (workOrderList.value.length === 0) {
    workOrderList.value = [newRow()]
 }
  workOrderList.value.forEach(r => (r.selected = !!v))
})

// -----------------
// add/copy/delete row
// -----------------
const addRow = () => {
    if ( isEmpty(form.poNo) ) return vWarning('수주품목을 조회하세요')
    workOrderList.value.push(newRow())
}

const copyRow = () => {
  if ( isEmpty(form.poNo) ) return vWarning('수주품목을 조회하세요')

  const selectedRows = workOrderList.value.filter(r => r.selected)
  if (selectedRows.length === 0) return vWarning('복사할 배치를 선택하세요.')

  const clones = selectedRows.map(r => JSON.parse(JSON.stringify(r)))
  clones.forEach(c => (c.selected = false))
  workOrderList.value.push(...clones)
}

const confirm = useConfirm()

const removeRow = (index) =>{
    if ( isEmpty ( form.workOrderId)) {
        workOrderList.value.splice(index, 1)
        return
    }

   // 저장 후: ConfirmDialog
  confirm.require({
    group: 'deleteBatch',
    header: '삭제 확인',
    message: '삭제 후에는 복구 할 수 없습니다.\n작업지시 작업을 삭제하시겠습니까?',
    acceptLabel: '예',     // 템플릿 footer 쓰면 사실상 의미 없음(그냥 남겨도 됨)
    rejectLabel: '아니오',
    accept: async () => {
      try {
        const row = workOrderList.value[index]

        await ApiWorkOrder.deleteBatch({
          workOrderId: form.workOrderId,
          workBatchId: row.workBatchId, // ✅ 실제 PK 필드로 변경
        })

        workOrderList.value.splice(index, 1)
      } catch (err) {
        console.error(err)
        vWarning('삭제 중 오류가 발생했습니다.')
      }
    },
  })

}
// -----------------
// HoT click handler (col 5 search / col 11 trash)
// -----------------
const handleCellClick = (event, coords) => {
  if (!coords) return
  const { row, col } = coords
  if (row < 0 || col < 0) return

  const SEARCH_COL = 5
  const TRASH_COL = 11

  if (col === SEARCH_COL) {
    currentRowIndexForItemPop.value = row
    openPop('I')
    return
  }

  if (col === TRASH_COL) {
    removeRow(row)
  }
}

const handleCellClickFromHot = (event, coords /*, TD */) => {
  handleCellClick(event, coords)
}

// -----------------
// popup
// -----------------
const processToItemTypeCd = (p) => {
  if (p === 'weigh' || p === 'mat') return 'M3'
  if (p === 'coating') return 'M5'
  if (p === 'charge') return 'M6'
  return 'M0'
}

function openPop(type) {
  let title = ''
  let comp = null
  let itemTypeCd = ''

  if (type === 'I') {
    title = '품목 목록'
    comp = ItemListSinglePop
    itemTypeCd = processToItemTypeCd(selectedProcess.value)
  } else if (type === 'U') {
    title = '사용자 목록'
    comp = UserListPop
  } else if (type === 'C') {
    title = '거래처 목록'
    comp = ClientListPop
  } else if (type === 'O') {
    title = '주문서 목록'
    comp = ContractSingleListPop
  } else {
    return
  }

  dialog.open(comp, {
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
    data: itemTypeCd,
    onClose: (event) => {
      if (!event?.data) return

      if (type === 'I') {
        const idx = currentRowIndexForItemPop.value
        if (idx === null || idx === undefined) return

        const p = selectedProcess.value
        const row = workOrderList.value[idx]
        if (!row) return

        row.proc[p].itemCd = event.data.itemCd ?? row.proc[p].itemCd
        row.proc[p].itemName = event.data.itemName ?? row.proc[p].itemName
      } else if (type === 'U') {
        form.managerName = event.data.memberNm
        form.managerId = event.data.userId
      } else if (type === 'C') {
        form.clientId = event.data.clientId
        form.clientName = event.data.clientName
      } else if (type === 'O') {
        form.itemCd = event.data.itemCd
        form.itemName = event.data.itemName
        form.poNo = event.data.poNo

        workOrderList.value[0].poNo = event.data.poNo
      }
    },
  })
}
// -----------------
// data init
// -----------------
onMounted(async () => {
    areaCds.value = (await ApiCommon.getCodeList('area'))
        .filter(i => !['A003'].includes(i.code))

    if ( isEmpty(dialogRef.value.data) ) {
        form.seq = await ApiCommon.getNextSeq('tb_work_order_mst', 'work_order_date',  form.workOrderDate)
        workOrderList.value = [newRow()]
    }else{
        const res = await ApiWorkOrder.getWorkOrderInfo(dialogRef.value.data)

        const { batches, ...rest } = res

        Object.keys(form).forEach(k => {
            if (rest[k] !== undefined) form[k] = rest[k]
        })
        // batches가 비어있으면 최소 1줄
        if (res.batches.length === 0) {
            workOrderList.value = [newRow()]
        }else{
            workOrderList.value = voToRows(res.batches)
        }
        form.workOrderId = dialogRef.value.data
    }
})

watch(() => form.workOrderDate, async (newVal, oldVal) => {
  if ( !isEmpty(form.workOrderId)) return

  if ( !isEmpty(newVal)) {
    if (formatDate(oldVal) !== formatDate(newVal) ) {
        let ymd = formatDate(newVal)
        form.seq = await ApiCommon.getNextSeq('tb_work_order_mst','work_order_date', ymd)
    }
  }
})

const voToRows = (batches) =>{
    return batches.map(b => {
        const row = newRow()

        row.workBatchId = b.workBatchId ?? null
        row.poNo = b.poNo ?? form.poNo ?? ''
        row.matNo = b.matNo ?? ''
        row.lotNo = b.lotNo ?? ''
        row.lotNo2 = b.lotNo2 ?? ''

        // items → row.proc[procCd]에 꽂기
        const items = b.items ?? []
        for (const it of items) {
            const uiKey = PROC_DB_TO_UI[it.procCd]
            if (!uiKey) continue

            row.proc[uiKey] = {
                workProcId: it.workProcId ?? null,
                itemCd: it.itemCd ?? '',
                itemName: it.itemName ?? '',     // 서버에서 itemName 안 주면 공백
                procOrderDate: it.procOrderDate ??  null,
                orderQty: it.orderQty ?? 0,
                procStatusName: it.procStatusName ?? '',
            }
        }
    return row
  })
}

const rowsToVoPayload = () =>{
    const payload = {
    // MST
    workOrderId: form.workOrderId || null,
    workOrderDate: form.workOrderDate,
    seq: form.seq,
    areaCd: form.areaCd,
    clientId: form.clientId,
    managerId: form.managerId,
    deliveryQty: form.deliveryQty,
    deliveryDate: form.deliveryDate,
    itemCd: form.itemCd,
    poNo: form.poNo,

    regId: userId,
    updId: userId,

    // BATCHES
    batches: (workOrderList.value ?? []).map(r => {
      const batch = {
        workBatchId: r.workBatchId || null,
        workOrderId: form.workOrderId || null, // 서버에서 최종 세팅해도 됨
        poNo: r.poNo || form.poNo,
        matNo: r.matNo,
        lotNo: r.lotNo,
        lotNo2: r.lotNo2,
        regId: userId,
        updId: userId,
        items: [],
      }

      // proc 객체 5개를 ITEM으로 펼침
      for (const p of PROC_KEYS) {
        const pr = r.proc?.[p]
        if (!pr) continue

        // “비어있는 공정”은 저장 안 하게 필터 (원하면 조건 바꿔도 됨)
        const hasMeaning =
          !isEmpty(pr.itemCd) ||
          (pr.orderQty && Number(pr.orderQty) !== 0) ||
          !isEmpty(pr.procStatus) ||
          !isEmpty(pr.procOrderDate)

        if (!hasMeaning) continue
        batch.items.push({
          workProcId: pr.workProcId || null,
          workBatchId: r.workBatchId || null,   // 신규면 서버에서 workBatchId 만든 뒤 다시 세팅
          procCd: PROC_UI_TO_DB[p],
          poNo: batch.poNo,
          itemCd: pr.itemCd,
          procOrderDate: pr.procOrderDate || null,
          orderQty: pr.orderQty ?? 0,
          procStatus: pr.procStatus ?? '',
          regId: userId,
          updId: userId,
        })
      }
      return batch
    }),
  }
  return payload
}

// -----------------
// bottom actions
// -----------------
function handleAfterChange(changes, source) {
  // 필요하면 구현
}

const updateWorkOrder = () =>{
    if ( isEmpty(form.workOrderId )) {
        //데이터 확인 여부3
        vInfo('저장 후 작업지시 등록을 진행합니다.')
        return
    }else{

    }
}

const saveInfo = async () => {
  if (isEmpty(form.workOrderDate)) return vWarning('작업지시일자를 입력하세요')
  if (isEmpty(form.areaCd)) return vWarning('구역을 입력하세요')
  if (isEmpty(form.poNo)) return vWarning('수주품목(PO)을 선택하세요')

  const params = rowsToVoPayload()
    // ======================
    // 1) 저장(merge)
    // ======================
    const res = await ApiWorkOrder.saveWorkOrderInfo(params)
    console.log('res? ', res)
    console.log('saveRes?.code ', res.message)
    // RestResponse 기준 분기
    // 예: { code: 0, message: 'success', data: {...} }
    if (res?.code !== 0) {
      // 비즈니스 에러
      vWarning(res.message || '저장 중 오류가 발생했습니다.')
      return
    }

    vSuccess(res.message)
    closeDialog()
}

const clearList = () => {
    allChecked.value = false
    const p = selectedProcess.value
    if (!p) return

    workOrderList.value.forEach((row) => {
    // 해당 공정만 초기화
    row.proc[p] = newProc()
    // (선택) 공정에 itemCd,itemName만 지우고 싶으면 아래처럼
    // row.proc[p].itemCd = ''
    // row.proc[p].itemName = ''
    // row.proc[p].orderQty = 0
    // row.proc[p].workStatus = ''
    // row.proc[p].workOrderDate = null
  })
  // 체크박스 선택상태 초기화도 원하면
  allChecked.value = false
  //workOrderList.value = [newRow()]
}

const closeDialog = async () => {
  dialogRef.value.close()
}


</script>

<style scoped>
.center-dash {
  display: flex;
  align-items: center;
  font-size: 18px;
  height: 100%;
}
:deep(.ht-icon) {
  font-size: 0.95rem;
  opacity: 0.75;
  cursor: pointer;
}
:deep(.ht-icon:hover) {
  opacity: 1;
}
/* Handsontable 헤더 */
.ht_clone_top th {
  background-color: #BCAAA4;
  color: #000;
}
</style>
