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
  <!-- ✅ 상단 한줄: 좌(바코드+요약) / 우(재고타이틀) -->
  <div class="header-row ml-2">
    <div class="barcode-left">
      <label class="barcode-label">바코드(시험번호)</label>
      <InputText class="barcode-input" v-model="barcode" />
      <Button label="초기화" class="ml-2" outlined @click="resetBarcode" />

      <div class="qty-summary">
        <div>칭량량 : <b>{{ formatQty(totalWeighQty) }} kg</b></div>
        <div>지시량 : <b>{{ formatQty(totalOrderQty) }} kg</b></div>
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
        <Column field="no"      header="No" :style="{ width: '40px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="testNo"  header="시험번호" :style="{ width: '120px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="itemCd"  header="품목코드" :style="{ width: '120px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="lotNo"   header="로트번호" :style="{ width: '180px' }" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="orderQty" header="지시량" :style="{ width: '100px' }" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="{ data }">
                <div class="text-right">{{ formatQty(data.orderQty) }}</div>
            </template>
        </Column>
        <!-- 칭량량: InputNumber로 항상 입력 가능 -->
        <Column field="weighQty" header="칭량량" :style="{ width: '120px' }" :pt="{ columnHeaderContent: 'justify-center' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.weighQty"
              class="w-full compact-input"
              :min="0"
              :maxFractionDigits="6"
              :useGrouping="true"
              :inputStyle="{ width: '100px', textAlign: 'right' }"
              @update:modelValue="() => onChangeRow(slotProps.data)"
            />
          </template>
        </Column>
        <Column field="actions" header="-" :style="{ width: '40px', textAlign:'center' }"  :pt="{ columnHeaderContent: 'justify-center' }">
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
        showGridlines
      >
        <Column field="no"      header="No" :style="{ width: '50px' }"  :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="testNo"  header="시험번호" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="inDate"  header="입고일" :pt="{ columnHeaderContent: 'justify-center' }" />
        <Column field="expireDate" header="사용기한" :pt="{ columnHeaderContent: 'justify-center' }" />
        <!-- 가변 컬럼 -->
        <Column
            v-for="col in dynamicColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :pt="{ columnHeaderContent: 'justify-center' }"
            >
            <template #body="{ data }">
            <div class="text-right">{{ formatQty(data[col.field]) }}</div>
            </template>
        </Column>
        <Column field="sumQty" header="합계" :pt="{ columnHeaderContent: 'justify-center' }">
          <template #body="{ data }">
            <div class="text-right">{{ formatQty(data.sumQty) }}</div>
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
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { computed, inject, onMounted, ref } from 'vue'

const dynamicColumns = ref([]) // { field, header } 목록
const dialogRef = inject('dialogRef')

/** 상단 품목 정보 */
const itemCd = ref('')
const itemName = ref('')

/** 바코드 입력 */
const barcode = ref('')

/** 좌측 입력 테이블 */
const stockItemList = ref([
  {
    no: 1,
    testNo: '25050911004',
    itemCd: 'JRMSZ00091',
    lotNo: '20241206',
    orderQty: 0.5,
    weighQty: 0.5
  }
])

/** 우측 재고현황 테이블 */
const stockItemHistList = ref([
  {
    no: 1,
    testNo: '25050911004',
    inDate: '2025-05-09',
    expireDate: '2027-12-05',
    rawWarehouse: 0.0,
    weighRoom: 2.242,
    sumQty: 2.242
  },
  {
    no: 2,
    testNo: '25111111002',
    inDate: '2025-11-11',
    expireDate: '2027-12-05',
    rawWarehouse: 0.0,
    weighRoom: 25.0,
    sumQty: 25.0
  }
])

/** ✅ 상단 요약: 칭량량 합계 */
const totalWeighQty = computed(() => {
  return stockItemList.value.reduce((acc, cur) => acc + (Number(cur.weighQty) || 0), 0)
})

/** ✅ 상단 요약: 지시량 합계 */
const totalOrderQty = computed(() => {
  return stockItemList.value.reduce((acc, cur) => acc + (Number(cur.orderQty) || 0), 0)
})

/** 숫자 표시 포맷 (최대 6자리) */
const formatQty = (value) => {
  const v = Number(value ?? 0)
  return v.toLocaleString('ko-KR', { maximumFractionDigits: 6 })
}

/** 칭량량 변경 시 호출 */
const onChangeRow = (row) => {
  // 여기서 행 단위로 total 계산이나 유효성 체크 가능
  // 예: row.totalQty = (Number(row.weighQty)||0) + (Number(row.containerWeight)||0)
  // 지금은 상단 computed 합계가 자동 갱신됨
}

/** 행 삭제 */
const removeRow = (idx) => {
  stockItemList.value.splice(idx, 1)
  // no 다시 정렬
  stockItemList.value.forEach((r, i) => (r.no = i + 1))
}

/** 바코드 초기화 */
const resetBarcode = () => {
  barcode.value = ''
}

/** 저장 */
const saveInfo = () => {
  // 저장 로직 구현
  console.log('저장', stockItemList.value)
}

/** 닫기 */
const closeDialog = () => {
  dialogRef.value?.close()
}

onMounted(async () => {
  const row = dialogRef.value?.data || {}

  itemCd.value = row.itemCd ?? ''
  itemName.value = row.itemName ?? ''

  // 예시: itemCd 기반 조회
  // stockItemList.value = await ApiProc.getStockItemList(itemCd.value)
  // stockItemHistList.value = await ApiProc.getStockItemHistList(itemCd.value)
  dynamicColumns.value = [
    { field: 'rawWarehouse', header: '[안산]원재료창고' },
    { field: 'weighRoom', header: '[안산]칭량실' }
  ]

})
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
</style>
