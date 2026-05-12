<template>
  <!-- 상단 영역: 품목 / 발행자 기록사항 -->
  <div class="top-area">
    <div class="left-info">
      <div class="label">품 목</div>
      <div class="value">[{{ itemCd }}] {{ itemName }}</div>
    </div>
    <div class="right-info">
      <div class="label">발행자 기록사항</div>
    </div>
  </div>
  <Divider />
  <!-- 상단 한줄: 좌(바코드+요약) / 우(재고타이틀) -->
  <div class="header-row ml-2">
    <div class="barcode-left">
      <label class="barcode-label ml-2">바코드(시험번호)</label>
      <InputText
            ref="barcodeInputRef"
            class="barcode-input"
            v-model="barcode"
            @keyup.enter="searchByBarcode"
            autofocus
        />
      <Button label="초기화" class="ml-2" outlined @click="resetBarcode" />

      <div class="qty-summary">
        <div>칭량량 : <b>{{ formatQty(totalWeighQty) }} kg</b></div>
        <div>지시량 : <b>{{ formatQty(orderQty) }} kg</b></div>
      </div>
    </div>

    <!-- ✅ 오른쪽 : 재고현황 타이틀 -->
    <div class="right-title">
      [{{ itemCd }}] {{ itemName }} 재고 현황
    </div>
  </div>

  <!-- 본문: 좌/우 2단 테이블 -->
  <div class="content-area">
    <!-- 좌측 입력 테이블 -->
    <div class="panel">
      <DataTable
        class="my-table"
        :value="stockItemList"
        scrollable
        scrollHeight="420px"
        showGridlines
      >
        <Column field="no"      header="No" :style="{ width: '40px' }"  />
        <Column field="testNo"  header="시험번호" :style="{ width: '120px' }"  />
        <Column field="itemCd"  header="품목코드" :style="{ width: '120px' }"  />
        <Column field="lotNo"   header="로트번호" :style="{ width: '180px' }" bodyClass="break-words"  />
        <Column field="orderQty" header="지시량" :style="{ width: '100px' }" >
            <template #body="{ data }">
                <div class="text-right">{{ formatQty(data.orderQty) }}</div>
            </template>
        </Column>
        <!-- 칭량량: InputNumber로 항상 입력 가능 -->
        <Column field="weighQty" header="칭량량" :style="{ width: '120px' }" >
            <template #body="slotProps">
                <div
                class="weigh-cell"
                @click="openWeighQtyPopup(slotProps.data)"
                style="width: 100px; text-align: right; cursor: pointer;"
                >
                {{  formatQty(slotProps.data.weighQty) }}
                </div>
            </template>
        </Column>
        <Column field="actions" header="-" :style="{ width: '40px', textAlign:'center' }"  >
          <template #body="slotProps">
            <i class="pi pi-trash cursor-pointe" @click="removeRow(slotProps.index)"></i>
          </template>
        </Column>
      </DataTable>
    </div>
    <!-- 우측 재고현황 테이블 -->
    <div class="panel">
      <DataTable
        class="my-table"
        :value="stockItemHistList"
        scrollable
        scrollHeight="420px"
        :tableStyle="{ minWidth: '600px' }"
        showGridlines
      >
        <Column field="no"          header="No"         :style="{ width: '40px', textAlign:'center' }"   />
        <Column field="testNo"      header="시험번호"   :style="{ width: '110px', textAlign:'center' }" />
        <Column field="inDate"      header="입고일"     :style="{ width: '110px', textAlign:'center' }" />
        <Column field="expiryDate"  header="사용기한"   :style="{ width: '110px', textAlign:'center' }" />
        <!-- 가변 컬럼 -->
        <Column
            v-for="col in dynamicColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :style="{ width: '140px', minWidth: '140px' }"
            >
            <template #body="{ data }">
                <div class="text-right">{{ formatQty(data[col.field]) }}</div>
            </template>
        </Column>
        <Column field="totQty" header="합계" >
          <template #body="{ data }">
            <div class="text-right">{{ formatQty(data.totQty) }}</div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <!-- 하단 버튼 -->
  <div class="bottom-area">
    <Button label="저장" class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
  </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc'
import { ApiQc } from '@/api/apiQc'
import { ApiStock } from '@/api/apiStock'
import { useAlertStore } from '@/stores/alert'
import { isEmpty, todayKST } from '@/util/common'
import { useDialog } from 'primevue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import { computed, inject, onMounted, ref, watch } from 'vue'
import BagWeightInfoPop from '../../common/BagWeightInfoPop.vue'

const {vInfo, vWarning, vSuccess} = useAlertStore()
const dynamicColumns = ref([]) // { field, header } 목록
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const barcodeInputRef = ref(null)
/** 상단 품목 정보 */
const itemCd = ref('')
const itemName = ref('')
const weighId = ref('')
const workProcId = ref('')
const storageCd = ref('')
const orderQty = ref(0)
/** 바코드 입력 */
const barcode = ref('')
const deleteWeighItems = ref([])
const storageList = ref([])
/** 좌측 입력 테이블 */
const stockItemList = ref([])
/** 우측 재고현황 테이블 */
const stockItemHistList = ref([])

/** 상단 요약: 칭량량 합계 */
const totalWeighQty = computed(() => {
  return stockItemList.value.reduce((acc, cur) => acc + (Number(cur.weighQty) || 0), 0)
})

/** 상단 요약: 지시량 합계 */
// const totalOrderQty = computed(() => {
//   return stockItemList.value.reduce((acc, cur) => acc + (Number(cur.orderQty) || 0), 0)
// })

//좌측 테스트번호로 조회
const searchByBarcode = async () => {
  const testNo = String(barcode.value ?? '').trim()
  if (!testNo) return

  const res = await ApiQc.getItemTestNoInfo(testNo)

  const r = res?.data ?? res
  if (!r) return vInfo('조회 결과가 없습니다.')
  if ( new Date(todayKST()) > new Date(r.expiryDate)) {
    vWarning('사용기한이 지난 원자재입니다.')
    return
  }
  //이미 있는 값이면 추가 안함 (중복 방지)
  const exists = stockItemList.value.some(item => item.testNo === r.testNo)
  if (exists) {
    barcode.value = ''
    return
  }

  stockItemList.value.push({
    no: stockItemList.value.length + 1,
    testNo: r.testNo ?? '',
    itemCd: r.itemCd ?? itemCd.value,
    lotNo: r.lotNo ?? '',
    orderQty: Number(orderQty.value ?? 0),
    weighQty: 0,
    weighId: weighId.value ?? '',
    workProcId: workProcId.value ?? '',
    storageCd:  r.storageCd ?? storageCd.value ?? '',
  })

  barcode.value = ''
}

const openWeighQtyPopup = (row) =>{
    dialog.open(BagWeightInfoPop, {
        props:{
            header: '칭량량 입력',
            modal: true,
            maximizable: false,
            draggable: false,
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: {
            form: {
                areaCd: dialogRef.value?.data?.form.areaCd,
                storageCd: dialogRef.value?.data?.form.storageCd,
                isBtn: 'S'
            }
        },
        onClose: (weight) => {
            if (weight !== undefined) {
                row.weighQty = weight.data
                onChangeRow(row)
            }
        }
    })
}

watch(barcode, (newVal) => {
    if (newVal && newVal.length === 11) {
        searchByBarcode();
    }
});

/** 숫자 표시 포맷 (최대 6자리) */
const formatQty = (value) => {
  const v = Number(value ?? 0)
  return v.toLocaleString('ko-KR', { maximumFractionDigits: 6 })
}

/** 칭량량 변경 시 호출 */
const onChangeRow = async (row) => {
  // 여기서 행 단위로 total 계산이나 유효성 체크 가능
  if ( (Number(totalWeighQty.value)||0) > (Number(orderQty.value)||0) ) {
    vWarning('지시량보다 칭량량이 많습니다.')
     return
  }

    saveInfo()
}

/** 행 삭제 */
const removeRow = (idx) => {
    const row = stockItemList.value[idx]

    if (row.weighInvId) {
        deleteWeighItems.value.push(row.weighInvId)
    }
    stockItemList.value.splice(idx, 1)
    stockItemList.value.forEach((r, i) => (r.no = i + 1))
}

/** 바코드 초기화 */
const resetBarcode = () => {
  barcode.value = ''
}

/** 저장 */
const saveInfo = async () => {
  // 저장 로직 구현
  const testNosArray = stockItemList.value.map(item => item.testNo)

  if ( orderQty.value >  totalWeighQty.value) {
    vWarning('지시량보다 칭량량이 적습니다.')
    return
  }

  const params = {
    weighInfo : {
        itemCd: itemCd.value,
        itemName: itemName.value,
        weighId: weighId.value,
        workProcId: workProcId.value,
        storageCd: storageCd.value,
    },
    weighList : stockItemList.value,
    deleteWeighItems: deleteWeighItems.value,
  }

  const params1 = {
    weighQty: totalWeighQty.value,
    testNos : testNosArray.join(',')
  }

  try{
    const res = await ApiProc.saveWeighList(params)
    deleteWeighItems.value = []
  }catch(err){
    handleApiError(err)
  }

  dialogRef.value.close(params1)
}

/** 닫기 */
const closeDialog = () => {
  dialogRef.value?.close()
}

const loadInventoryList = async (areaCd) => {
  const params = {
    itemCd: itemCd.value,
    areaCd
  }

  const res = await ApiStock.getStockItemHistList(params)

  storageList.value = res.storageList || []
  stockItemHistList.value = res.stockItemHistList || []
  console.log('stockItemHistList.value ', stockItemHistList.value )

  dynamicColumns.value = storageList.value.map((item) => ({
    field: String(item.storageCd).toUpperCase(),
    header: item.storageName
  }))
}

let tmpTestNo = ref('')
onMounted(async () => {
  setTimeout(() => {
    barcodeInputRef.value?.$el?.querySelector('input')?.focus()
  }, 100)

  const dialogData = dialogRef.value?.data || {}
  const rowData = dialogData.row || {}
  const formData = dialogData.form || {}

  itemCd.value = rowData.itemCd ?? ''
  itemName.value = rowData.itemName ?? ''
  weighId.value = rowData.weighId ?? ''
  orderQty.value = Number(rowData.orderQty ?? 0)
  tmpTestNo.value = rowData.testNo ?? ''


  if (!isEmpty(tmpTestNo.value)) {
    await getStockTestNoList()
  }

  const areaCd = formData.areaCd ?? ''
  workProcId.value = formData.workProcId ?? ''
  storageCd.value = formData.storageCd ?? ''

  await loadInventoryList(areaCd)
})

const getStockTestNoList = async () =>{
     const params = {
        testNos: tmpTestNo.value,
        weighId: weighId.value
    }
    console.log('params', params)
    stockItemList.value = await ApiProc.getStockTestNoList(params)
}

</script>

<style scoped>
/* 상단 정보 영역 */
.top-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
  margin-top: 8px;
}
.label {
  font-weight: 700;
  margin-bottom: 6px;
}
.value {
  font-size: 18px;
  font-weight: 800;
}

/* ✅ 상단 한 줄(좌/우) */
.header-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: center;
  margin-bottom: 10px;
}

/* ✅ 바코드 영역(왼쪽) */
.barcode-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.barcode-label {
  min-width: 140px;
}
.barcode-input {
  width: 250px;
}

/* ✅ 칭량량/지시량 요약 */
.qty-summary {
  margin-left: 85px;
  font-size: 14px;
  line-height: 1.3;
  white-space: nowrap;
}

/* ✅ 오른쪽 타이틀 */
.right-title {
  font-size: 18px;
  font-weight: 800;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 좌/우 테이블 레이아웃 */
.content-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  height: 400px;
}
.panel {
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
}

/* 하단 버튼 */
.bottom-area {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

/* ✅ 요청하신 헤더 스타일 그대로 */
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}

/* ✅ 행/셀 padding 줄이기 (컴팩트) */
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 4px 7px !important;
  height: 35px;              /* row 높이 강제 */
  font-size: 14px;
  vertical-align: middle;
}
/* ✅ InputNumber 자체 padding/높이 줄이기 */
::v-deep(.compact-input .p-inputtext) {
  padding: 2px 4px !important;
  height: 28px;
  font-size: 13px;
}
.right-panel {
  overflow-x: auto;
}
::v-deep(.my-table .p-datatable-wrapper) {
  overflow: auto;
}
</style>
