
<template>
  <div class="stock-popup">
    <!-- 품목 정보 -->
    <div class="stock-item-info">
      <span class="stock-item-code">
        [{{ form.itemCd }}]
      </span>
      <span class="stock-item-name">
        {{ form.itemName }}
      </span>
    </div>

    <!-- 재고 목록: 이 영역만 스크롤 -->
    <div class="stock-table-wrapper">
      <DataTable
        ref="dt"
        v-model:first="first"
        :value="stockList"
        :key="tableKey"
        :loading="loading"
        dataKey="_rowKey"
        scrollable
        scrollHeight="flex"
        showGridlines
        tableStyle="min-width: 100%;"
        class="my-table"
      >
        <Column
          header="No"
          :style="{ minWidth: '55px', textAlign: 'center' }"
        >
          <template #body="slotProps">
            {{ slotProps.index + 1 + first }}
          </template>
        </Column>

        <Column
          field="testNo"
          header="시험번호"
          :style="{ minWidth: '140px', textAlign: 'center' }"
        />

        <Column
          field="purDate"
          header="입고일"
          :style="{ minWidth: '120px', textAlign: 'center' }"
        />

        <Column
          field="expiryDate"
          header="사용기한"
          :style="{ minWidth: '120px', textAlign: 'center' }"
        />

        <!-- 창고별 동적 컬럼 -->
        <Column
          v-for="col in dynamicColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :style="{
            minWidth: '150px',
            textAlign: 'right'
          }"
          :pt="{
            columnHeaderContent: 'justify-center'
          }"
        >
          <template #body="{ data }">
            <div class="text-right">
              {{ formatQty(data[col.field]) }}
            </div>
          </template>
        </Column>

        <Column
          field="totQty"
          header="합계"
          :style="{ minWidth: '110px', textAlign: 'right' }"
        >
          <template #body="slotProps">
            <div class="text-right">
              {{ formatNumber(slotProps.data.totQty) }}
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

    <!-- 닫기 버튼: 스크롤 영역과 분리 -->
    <div class="stock-popup-footer">
      <Button
        label="닫기"
        outlined
        @click="closeDialog"
      />
    </div>

  </div>
</template>

<script setup>
import { ApiStock } from '@/api/apiStock'
import { formatQty, todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import { inject, onMounted, reactive, ref } from 'vue'

const dialogRef = inject('dialogRef')

const first = ref(0)
const loading = ref(false)
const dynamicColumns = ref([])
const stockList = ref([])
const tableKey = ref(0)

const form = reactive({
    type: 'TEST',
    itemTypeCd: 'M1',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST()
})

// =====================================================
// 재고 조회
// =====================================================
const srhList = async () => {
    if (loading.value) return

    loading.value = true
    first.value = 0

    try {
        const params = {
            ...form,
            areaCd: form.areaCd === 'ALL'
                ? null
                : form.areaCd
        }

        const res = await ApiStock.getStockItemList(params)

        dynamicColumns.value = res.dynamicColumns || []

        stockList.value = (res.rows || []).map((row, index) => ({
            ...row,
            _rowKey: form.type === 'TEST'
                ? `${row.itemCd}_${row.testNo ?? ''}_${index}`
                : `${row.itemCd}_${index}`
        }))

        tableKey.value++

    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}

// =====================================================
// 숫자 포맷
// =====================================================
const formatNumber = (value) => {
    return Number(value ?? 0).toLocaleString()
}

// =====================================================
// 팝업 초기화
// =====================================================
onMounted(async () => {
    const row = dialogRef?.value?.data?.row

    if (row) {
        form.itemCd = row.itemCd
        form.itemName = row.itemName
    }

    await srhList()
})

// =====================================================
// 팝업 닫기
// =====================================================
const closeDialog = () => {
    dialogRef?.value?.close()
}
</script>

<style scoped>

/* =====================================================
   팝업 전체
   ===================================================== */
.stock-popup {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;

    /* 화면 높이를 넘지 않도록 제한 */
    max-height: min(540px, calc(70vh - 90px));
    overflow: hidden;
}

/* =====================================================
   품목 정보
   ===================================================== */
.stock-item-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 12px;

    padding: 12px 8px;
    margin-top: 8px;
    margin-bottom: 12px;
}

.stock-item-code {
    font-size: 17px;
    font-weight: 700;
    color: #51423e;
}

.stock-item-name {
    font-size: 17px;
    font-weight: 600;
    color: #333;
}

/* =====================================================
   테이블 영역
   ===================================================== */
.stock-table-wrapper {
    width: 100%;
    min-width: 0;
    min-height: 0;
    flex: 0 1 auto;

    overflow: auto;
    margin-top: 2px;
    margin-bottom: 5px;
}

.my-table {
    width: 100%;
    font-size: 13px;
}

/* =====================================================
   테이블 헤더
   ===================================================== */
:deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    padding: 5px 4px;
}

/* =====================================================
   테이블 데이터
   ===================================================== */
:deep(.my-table .p-datatable-tbody > tr > td) {
    padding: 8px 10px;
    white-space: nowrap;
}

/* =====================================================
   가로 / 세로 스크롤
   ===================================================== */
:deep(.my-table .p-datatable-table-container) {
    overflow: auto;
    max-height: 400px;
}

/* 스크롤바 */
:deep(.my-table .p-datatable-table-container::-webkit-scrollbar),
.stock-table-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

:deep(.my-table .p-datatable-table-container::-webkit-scrollbar-thumb),
.stock-table-wrapper::-webkit-scrollbar-thumb {
    background: #b9aaa5;
    border-radius: 5px;
}

/* =====================================================
   닫기 버튼 영역
   ===================================================== */
.stock-popup-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;

    padding: 10px 0 4px;
    background: var(--p-dialog-background, #fff);
}

</style>
