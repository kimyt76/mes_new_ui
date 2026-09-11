<template>
  <div class="profit-page">
    <div class="screen-toolbar no-print">
      <div class="toolbar-left">
        <FloatLabel variant="on">
          <DatePicker
            v-model="form.dailyDate"
            dateFormat="yy-mm-dd"
            :manualInput="false"
            showIcon
            inputId="dailyDate"
          />
          <label for="dailyDate">기준일자</label>
        </FloatLabel>
      </div>

      <div class="toolbar-right">
        <Button
          label="조회"
          icon="pi pi-search"
          severity="secondary"
          @click="srhInfo"
        />
        <Button label="저장" icon="pi pi-save" @click="saveInfo" />
        <Button
          label="인쇄"
          icon="pi pi-print"
          severity="secondary"
          @click="printPage"
        />
      </div>
    </div>

    <div class="report-header">
      <div class="report-title">일일 손익계산서</div>

      <div class="approval-box print-only">
        <div class="approval-title">결<br />재</div>

        <div
          v-for="item in approvalList"
          :key="item.title"
          class="approval-item"
        >
          <div class="approval-name">
            {{ item.title }}
          </div>
          <div class="approval-sign"></div>
        </div>
      </div>
    </div>

    <div class="report-info">
      <div class="report-date">
        {{ displayDailyDate }}
      </div>
      <div class="report-unit">단위 : 금액(원)</div>
    </div>

    <!-- =========================================================
             1. 원료 당일 재고 현황
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">1. 원료 당일 재고 현황</div>

      <div class="table-wrapper">
        <table class="report-table stock-table">
          <colgroup>
            <col style="width: 105px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th>구 분</th>
              <th>원료 전일재고</th>
              <th class="head-blue">원료 입고</th>
              <th class="head-orange">원료 반품</th>
              <th>원료 불량(폐기)</th>
              <th>원료 외주가공비</th>
              <th class="head-yellow">원료 사용량</th>
              <th class="head-blue">원료 외주 반출</th>
              <th>원료 현재고</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>수 량(kg)</th>
              <td v-for="field in rawQtyFields" :key="field">
                <InputNumber
                  v-model="rawStock[field]"
                  :maxFractionDigits="3"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td rowspan="2">
                <InputText v-model="rawStock.etc" class="cell-input" />
              </td>
            </tr>

            <tr>
              <th>금 액(원)</th>
              <td v-for="field in rawAmtFields" :key="field">
                <InputNumber
                  v-model="rawStock[field]"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =========================================================
             2. 부자재 당일 재고 현황
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">2. 부자재 당일 재고 현황</div>

      <div class="table-wrapper">
        <table class="report-table stock-table">
          <colgroup>
            <col style="width: 105px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th>구 분</th>
              <th>부자재 전일재고</th>
              <th class="head-blue">부자재 입고</th>
              <th class="head-orange">부자재 반품</th>
              <th>부자재 불량(폐기)</th>
              <th>부자재 외주가공비</th>
              <th class="head-yellow">부자재 사용량</th>
              <th class="head-blue">부자재 외주 반출</th>
              <th>부자재 현재고</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>수 량(ea)</th>
              <td v-for="field in subQtyFields" :key="field">
                <InputNumber
                  v-model="subStock[field]"
                  :maxFractionDigits="3"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td rowspan="2">
                <InputText v-model="subStock.etc" class="cell-input" />
              </td>
            </tr>

            <tr>
              <th>금 액(원)</th>
              <td v-for="field in subAmtFields" :key="field">
                <InputNumber
                  v-model="subStock[field]"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =========================================================
             3. 완제품 당일 재고 현황
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">3. 완제품 당일 재고 현황</div>

      <div class="table-wrapper">
        <table class="report-table stock-table">
          <colgroup>
            <col style="width: 105px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 96px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th>구 분</th>
              <th>완제품 전일재고</th>
              <th class="head-blue">완제품 생산</th>
              <th class="head-orange">완제품 생산(외주)</th>
              <th>완제품 불량(폐기)</th>
              <th>완제품 외주가공비</th>
              <th class="head-yellow">완제품 출하</th>
              <th class="head-blue">완제품 반품</th>
              <th>완제품 현재고</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>수 량(ea)</th>
              <td v-for="field in prodQtyFields" :key="field">
                <InputNumber
                  v-model="prodStock[field]"
                  :maxFractionDigits="3"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td rowspan="2">
                <InputText v-model="prodStock.etc" class="cell-input" />
              </td>
            </tr>

            <tr>
              <th>금 액(원)</th>
              <td v-for="field in prodAmtFields" :key="field">
                <InputNumber
                  v-model="prodStock[field]"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =========================================================
             4. 당일 인건비 현황
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">4. 당일 인건비 현황(정규직, 일용직)</div>

      <div class="table-wrapper">
        <table class="report-table labor-table">
          <colgroup>
            <col style="width: 220px" />
            <col style="width: 90px" />
            <col style="width: 90px" />
            <col style="width: 105px" />
            <col style="width: 120px" />
            <col style="width: 165px" />
            <col style="width: 150px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th rowspan="2">구 분</th>
              <th colspan="2">구 분</th>
              <th rowspan="2">인원소계</th>
              <th rowspan="2">근무시간</th>
              <th rowspan="2">금 액</th>
              <th rowspan="2">합계</th>
              <th rowspan="2">비고</th>
            </tr>

            <tr>
              <th>남</th>
              <th>여</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="group in laborGroups" :key="group.workTypeCd">
              <tr v-for="(row, index) in group.rows" :key="row.rowKey">
                <td class="center-cell">
                  {{ row.typeName }}
                </td>

                <td>
                  <InputNumber
                    v-model="row.manCnt"
                    :maxFractionDigits="0"
                    class="cell-number"
                    inputClass="text-right"
                    @update:modelValue="calculateLaborRow(row)"
                  />
                </td>

                <td>
                  <InputNumber
                    v-model="row.womCnt"
                    :maxFractionDigits="0"
                    class="cell-number"
                    inputClass="text-right"
                    @update:modelValue="calculateLaborRow(row)"
                  />
                </td>

                <td class="readonly-number">
                  {{ formatNumber(personTotal(row)) }}
                </td>

                <td>
                  <InputNumber
                    v-model="row.workTime"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                    class="cell-number"
                    inputClass="text-right"
                    @update:modelValue="calculateLaborRow(row)"
                  />
                </td>

                <td class="readonly-number">
                  {{ formatNumber(row.amount) }}
                </td>

                <td
                  v-if="index === 0"
                  :rowspan="group.rows.length"
                  class="group-total-cell"
                >
                  {{ formatNumber(groupTotal(group.rows)) }}
                </td>

                <td>
                  <InputText v-model="row.etc" class="cell-input" />
                </td>
              </tr>
            </template>

            <tr class="total-row">
              <td colspan="6" class="total-title">합 계</td>
              <td class="grand-total-cell">
                {{ formatNumber(laborGrandTotal) }}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =========================================================
             5. 당일 경비 현황
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">5. 당일 경비 현황</div>

      <div class="table-wrapper">
        <table class="report-table expense-table">
          <colgroup>
            <col style="width: 200px" />
            <col style="width: 110px" />
            <col style="width: 300px" />
            <col style="width: 110px" />
            <col style="width: 300px" />
            <col style="width: 150px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th colspan="2">구분</th>
              <th>직접비용</th>
              <th colspan="2">간접비용</th>
              <th>합계</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="center-cell">소모품</td>
              <td rowspan="3" class="center-cell">제조경비</td>
              <td>
                <InputNumber
                  v-model="expense.consumable"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>

              <td rowspan="3" class="center-cell">판관경비</td>
              <td>
                <InputNumber
                  v-model="expense.salesAdmin"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>

              <td rowspan="3" class="group-total-cell">
                {{ formatNumber(expenseTotal) }}
              </td>

              <td rowspan="3">
                <InputText v-model="expense.etc" class="cell-input" />
              </td>
            </tr>

            <tr>
              <td class="center-cell">식대</td>
              <td>
                <InputNumber
                  v-model="expense.meal"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td>
                <InputNumber
                  v-model="expense.indirectEtc1"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>

            <tr>
              <td class="center-cell">기타(접대비외)</td>
              <td>
                <InputNumber
                  v-model="expense.directEtc"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td>
                <InputNumber
                  v-model="expense.indirectEtc2"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- =========================================================
             6. 생산금액
        ========================================================== -->
    <section class="report-section">
      <div class="section-title">6. 생산금액</div>

      <div class="table-wrapper">
        <table class="report-table production-table">
          <colgroup>
            <col style="width: 180px" />
            <col style="width: 220px" />
            <col style="width: 300px" />
            <col style="width: 190px" />
            <col style="width: 190px" />
          </colgroup>

          <thead>
            <tr>
              <th colspan="3">구 분</th>
              <th>금액</th>
              <th>비고</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colspan="3" class="center-cell">납품단가</td>

              <td>
                <InputNumber
                  v-model="production.deliveryAmount"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>

              <td>
                <InputText
                  v-model="production.deliveryEtc"
                  class="cell-input"
                />
              </td>
            </tr>

            <tr>
              <td rowspan="10" class="center-cell">생산원가</td>

              <td rowspan="3" class="center-cell">재료비</td>

              <td class="center-cell">원재료비</td>

              <td class="readonly-number">
                {{ formatNumber(production.rawMaterialCost) }}
              </td>

              <td rowspan="10">
                <InputText v-model="production.costEtc" class="cell-input" />
              </td>
            </tr>

            <tr>
              <td class="center-cell">부재료비</td>

              <td class="readonly-number">
                {{ formatNumber(production.subMaterialCost) }}
              </td>
            </tr>

            <tr class="subtotal-row">
              <td class="center-cell">소 계</td>

              <td class="readonly-number">
                {{ formatNumber(materialSubtotal) }}
              </td>
            </tr>

            <tr>
              <td rowspan="3" class="center-cell">노무비</td>

              <td class="center-cell">직접인건비</td>

              <td class="readonly-number">
                {{ formatNumber(production.directLaborCost) }}
              </td>
            </tr>

            <tr>
              <td class="center-cell">간접인건비</td>

              <td class="readonly-number">
                {{ formatNumber(production.indirectLaborCost) }}
              </td>
            </tr>

            <tr class="subtotal-row">
              <td class="center-cell">소 계</td>

              <td class="readonly-number">
                {{ formatNumber(laborSubtotal) }}
              </td>
            </tr>

            <tr>
              <td rowspan="3" class="center-cell">경비</td>

              <td class="center-cell">제조경비</td>

              <td class="readonly-number">
                {{ formatNumber(production.manufacturingExpense) }}
              </td>
            </tr>

            <tr>
              <td class="center-cell">판관비</td>

              <td class="readonly-number">
                {{ formatNumber(production.salesAdminExpense) }}
              </td>
            </tr>

            <tr class="subtotal-row">
              <td class="center-cell">소 계</td>

              <td class="readonly-number">
                {{ formatNumber(expenseSubtotal) }}
              </td>
            </tr>

            <tr>
              <td colspan="2" class="center-cell">외주 생산 비용</td>

              <td class="readonly-number">
                {{ formatNumber(production.outsourceCost) }}
              </td>
            </tr>

            <tr class="total-row">
              <td colspan="3" class="total-title">총 계</td>

              <td class="grand-total-cell">
                {{ formatNumber(productionCostTotal) }}
              </td>

              <td></td>
            </tr>

            <tr>
              <td colspan="3" class="center-cell strong-cell">
                정상 이익(납품단가)-(재료비+노무비+경비)
              </td>

              <td class="profit-cell">
                {{ formatNumber(normalProfit) }}
              </td>

              <td></td>
            </tr>

            <tr>
              <td colspan="3" class="center-cell strong-cell">이익률</td>

              <td class="profit-cell">
                {{ formatPercent(profitRate) }}
              </td>

              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAlertStore } from "@/stores/alert";
import { handleApiError } from "@/util/errorHandler";
import { computed, reactive, ref } from "vue";

const { vSuccess } = useAlertStore();

/* =========================================================
   기본정보
========================================================= */
const form = reactive({
  dailyId: null,
  dailyDate: new Date(),
});

const approvalList = ref([
  { title: "담 당" },
  { title: "차 장" },
  { title: "상 무" },
  { title: "부 사 장" },
]);

const displayDailyDate = computed(() => {
  if (!form.dailyDate) {
    return "";
  }

  const date =
    form.dailyDate instanceof Date ? form.dailyDate : new Date(form.dailyDate);

  if (Number.isNaN(date.getTime())) {
    return form.dailyDate;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});

/* =========================================================
   1. 원료 당일 재고 현황
========================================================= */
const rawStock = reactive({
  prevQty: 0,
  inQty: 0,
  returnQty: 0,
  discardQty: 0,
  outsourceQty: 0,
  useQty: 0,
  outQty: 0,
  currentQty: 0,

  prevAmt: 0,
  inAmt: 0,
  returnAmt: 0,
  discardAmt: 0,
  outsourceAmt: 0,
  useAmt: 0,
  outAmt: 0,
  currentAmt: 0,

  etc: "",
});

const rawQtyFields = [
  "prevQty",
  "inQty",
  "returnQty",
  "discardQty",
  "outsourceQty",
  "useQty",
  "outQty",
  "currentQty",
];

const rawAmtFields = [
  "prevAmt",
  "inAmt",
  "returnAmt",
  "discardAmt",
  "outsourceAmt",
  "useAmt",
  "outAmt",
  "currentAmt",
];

/* =========================================================
   2. 부자재 당일 재고 현황
========================================================= */
const subStock = reactive({
  prevQty: 0,
  inQty: 0,
  returnQty: 0,
  discardQty: 0,
  outsourceQty: 0,
  useQty: 0,
  outQty: 0,
  currentQty: 0,

  prevAmt: 0,
  inAmt: 0,
  returnAmt: 0,
  discardAmt: 0,
  outsourceAmt: 0,
  useAmt: 0,
  outAmt: 0,
  currentAmt: 0,

  etc: "",
});

const subQtyFields = [
  "prevQty",
  "inQty",
  "returnQty",
  "discardQty",
  "outsourceQty",
  "useQty",
  "outQty",
  "currentQty",
];

const subAmtFields = [
  "prevAmt",
  "inAmt",
  "returnAmt",
  "discardAmt",
  "outsourceAmt",
  "useAmt",
  "outAmt",
  "currentAmt",
];

/* =========================================================
   3. 완제품 당일 재고 현황
========================================================= */
const prodStock = reactive({
  prevQty: 0,
  prodQty: 0,
  outsourceProdQty: 0,
  discardQty: 0,
  outsourceQty: 0,
  shipmentQty: 0,
  returnQty: 0,
  currentQty: 0,

  prevAmt: 0,
  prodAmt: 0,
  outsourceProdAmt: 0,
  discardAmt: 0,
  outsourceAmt: 0,
  shipmentAmt: 0,
  returnAmt: 0,
  currentAmt: 0,

  etc: "",
});

const prodQtyFields = [
  "prevQty",
  "prodQty",
  "outsourceProdQty",
  "discardQty",
  "outsourceQty",
  "shipmentQty",
  "returnQty",
  "currentQty",
];

const prodAmtFields = [
  "prevAmt",
  "prodAmt",
  "outsourceProdAmt",
  "discardAmt",
  "outsourceAmt",
  "shipmentAmt",
  "returnAmt",
  "currentAmt",
];

/* =========================================================
   인건비 단가
========================================================= */
const laborCostList = ref([
  { workTypeCd: "D", manFCost: 0, manDCost: 0, womFCost: 0, womDCost: 0 },
  { workTypeCd: "O", manFCost: 0, manDCost: 0, womFCost: 0, womDCost: 0 },
  { workTypeCd: "N", manFCost: 0, manDCost: 0, womFCost: 0, womDCost: 0 },
]);

/* =========================================================
   4. 당일 인건비 현황
========================================================= */
const laborGroups = ref([
  {
    workTypeCd: "D",
    rows: [
      {
        rowKey: "D-MANAGER",
        workTypeCd: "D",
        employeeType: "MANAGER",
        typeName: "생산(관리)주간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "D-FULL",
        workTypeCd: "D",
        employeeType: "FULL",
        typeName: "생산(정규직)주간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "D-DAY-M",
        workTypeCd: "D",
        employeeType: "DAY_M",
        typeName: "생산(일용직-남)주간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "D-DAY-W",
        workTypeCd: "D",
        employeeType: "DAY_W",
        typeName: "생산(일용직-여)주간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
    ],
  },
  {
    workTypeCd: "O",
    rows: [
      {
        rowKey: "O-MANAGER",
        workTypeCd: "O",
        employeeType: "MANAGER",
        typeName: "생산(관리)주간잔업",
        manCnt: 0,
        womCnt: 0,
        workTime: 2.5,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "O-FULL",
        workTypeCd: "O",
        employeeType: "FULL",
        typeName: "생산(정규직)주간잔업",
        manCnt: 0,
        womCnt: 0,
        workTime: 2.5,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "O-DAY-M",
        workTypeCd: "O",
        employeeType: "DAY_M",
        typeName: "생산(일용직-남)주간잔업",
        manCnt: 0,
        womCnt: 0,
        workTime: 2.5,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "O-DAY-W",
        workTypeCd: "O",
        employeeType: "DAY_W",
        typeName: "생산(일용직-여)주간잔업",
        manCnt: 0,
        womCnt: 0,
        workTime: 2.5,
        amount: 0,
        etc: "",
      },
    ],
  },
  {
    workTypeCd: "N",
    rows: [
      {
        rowKey: "N-MANAGER",
        workTypeCd: "N",
        employeeType: "MANAGER",
        typeName: "생산(관리)야간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "N-FULL",
        workTypeCd: "N",
        employeeType: "FULL",
        typeName: "생산(정규직)야간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "N-DAY-M",
        workTypeCd: "N",
        employeeType: "DAY_M",
        typeName: "생산(일용직-남)야간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
      {
        rowKey: "N-DAY-W",
        workTypeCd: "N",
        employeeType: "DAY_W",
        typeName: "생산(일용직-여)야간",
        manCnt: 0,
        womCnt: 0,
        workTime: 8,
        amount: 0,
        etc: "",
      },
    ],
  },
]);

const personTotal = (row) => {
  return (Number(row.manCnt) || 0) + (Number(row.womCnt) || 0);
};

const getLaborRate = (workTypeCd) => {
  return (
    laborCostList.value.find((item) => item.workTypeCd === workTypeCd) || {}
  );
};

const calculateLaborRow = (row) => {
  const rate = getLaborRate(row.workTypeCd);
  const manCnt = Number(row.manCnt) || 0;
  const womCnt = Number(row.womCnt) || 0;
  const workTime = Number(row.workTime) || 0;
  const baseHours = row.workTypeCd === "O" ? 2.5 : 8;

  let manCost = 0;
  let womCost = 0;

  if (row.employeeType === "MANAGER" || row.employeeType === "FULL") {
    manCost = Number(rate.manFCost) || 0;
    womCost = Number(rate.womFCost) || 0;
  }

  if (row.employeeType === "DAY_M") {
    manCost = Number(rate.manDCost) || 0;
  }

  if (row.employeeType === "DAY_W") {
    womCost = Number(rate.womDCost) || 0;
  }

  row.amount =
    (manCnt * manCost + womCnt * womCost) *
    (baseHours === 0 ? 1 : workTime / baseHours);
};

const groupTotal = (rows) => {
  return rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
};

const laborGrandTotal = computed(() =>
  laborGroups.value.reduce((total, group) => total + groupTotal(group.rows), 0),
);

/* =========================================================
   5. 당일 경비 현황
========================================================= */
const expense = reactive({
  consumable: 0,
  meal: 0,
  directEtc: 0,
  salesAdmin: 0,
  indirectEtc1: 0,
  indirectEtc2: 0,
  etc: "",
});

const directExpenseTotal = computed(
  () =>
    (Number(expense.consumable) || 0) +
    (Number(expense.meal) || 0) +
    (Number(expense.directEtc) || 0),
);

const indirectExpenseTotal = computed(
  () =>
    (Number(expense.salesAdmin) || 0) +
    (Number(expense.indirectEtc1) || 0) +
    (Number(expense.indirectEtc2) || 0),
);

const expenseTotal = computed(
  () => directExpenseTotal.value + indirectExpenseTotal.value,
);

/* =========================================================
   6. 생산금액
========================================================= */
const production = reactive({
  deliveryAmount: 0,
  deliveryEtc: "",
  rawMaterialCost: 0,
  subMaterialCost: 0,
  directLaborCost: 0,
  indirectLaborCost: 0,
  manufacturingExpense: 0,
  salesAdminExpense: 0,
  outsourceCost: 0,
  costEtc: "",
});

const materialSubtotal = computed(
  () =>
    (Number(production.rawMaterialCost) || 0) +
    (Number(production.subMaterialCost) || 0),
);

const laborSubtotal = computed(
  () =>
    (Number(production.directLaborCost) || 0) +
    (Number(production.indirectLaborCost) || 0),
);

const expenseSubtotal = computed(
  () =>
    (Number(production.manufacturingExpense) || 0) +
    (Number(production.salesAdminExpense) || 0),
);

const productionCostTotal = computed(
  () =>
    materialSubtotal.value +
    laborSubtotal.value +
    expenseSubtotal.value +
    (Number(production.outsourceCost) || 0),
);

const normalProfit = computed(
  () => (Number(production.deliveryAmount) || 0) - productionCostTotal.value,
);

const profitRate = computed(() => {
  const deliveryAmount = Number(production.deliveryAmount) || 0;
  return deliveryAmount === 0 ? 0 : (normalProfit.value / deliveryAmount) * 100;
});

const applyCalculatedValues = () => {
  production.rawMaterialCost = Number(rawStock.useAmt) || 0;
  production.subMaterialCost = Number(subStock.useAmt) || 0;
  production.directLaborCost = laborGrandTotal.value;
  production.indirectLaborCost = 0;
  production.manufacturingExpense = directExpenseTotal.value;
  production.salesAdminExpense = indirectExpenseTotal.value;
  production.outsourceCost =
    (Number(rawStock.outsourceAmt) || 0) +
    (Number(subStock.outsourceAmt) || 0) +
    (Number(prodStock.outsourceAmt) || 0);
};

/* =========================================================
   조회
========================================================= */
const srhInfo = async () => {
  try {
    const params = {
      dailyDate: displayDailyDate.value,
    };

    console.log("조회조건", params);

    laborGroups.value.forEach((group) =>
      group.rows.forEach((row) => calculateLaborRow(row)),
    );

    applyCalculatedValues();
  } catch (error) {
    console.error("조회 중 오류 발생:", error);
    handleApiError(error);
  }
};

/* =========================================================
   저장
========================================================= */
const saveInfo = async () => {
  try {
    applyCalculatedValues();

    const params = {
      dailyInfo: form,
      rawStock,
      subStock,
      prodStock,
      laborList: laborGroups.value.flatMap((group) => group.rows),
      expense,
      production,
    };

    console.log("저장 데이터", params);
    vSuccess("저장되었습니다.");
  } catch (error) {
    console.error("저장 중 오류 발생:", error);
    handleApiError(error);
  }
};

/* =========================================================
   인쇄
========================================================= */
const printPage = () => {
  applyCalculatedValues();
  window.print();
};

/* =========================================================
   표시
========================================================= */
const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatPercent = (value) => {
  return `${Number(value || 0).toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`;
};
</script>

<style scoped>
.profit-page {
  width: 100%;
  min-width: 1250px;
  padding: 8px;
  background: #ffffff;
  color: #111111;
  font-size: 12px;
}

.screen-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.report-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 66px;
  border-top: 1px solid #777777;
  border-bottom: 1px solid #777777;
}

.report-title {
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 2px;
}

.report-info {
  position: relative;
  height: 34px;
}

.report-date {
  position: absolute;
  right: 4px;
  top: 3px;
  font-size: 13px;
  font-weight: 700;
}

.report-unit {
  position: absolute;
  right: 4px;
  bottom: 1px;
  font-size: 11px;
  font-weight: 700;
}

.print-only {
  display: none;
}

.approval-box {
  position: absolute;
  right: 0;
  top: 0;
  height: 64px;
  border: 1px solid #333333;
}

.approval-title {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  width: 30px;
  height: 62px;
  border-right: 1px solid #333333;
  font-weight: 700;
  text-align: center;
  line-height: 17px;
}

.approval-item {
  float: left;
  width: 64px;
  height: 62px;
  border-right: 1px solid #333333;
}

.approval-item:last-child {
  border-right: 0;
}

.approval-name {
  height: 20px;
  border-bottom: 1px solid #333333;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  line-height: 20px;
}

.approval-sign {
  height: 41px;
}

.report-section {
  margin-bottom: 3px;
}

.section-title {
  height: 22px;
  padding: 2px 3px;
  border-bottom: 1px solid #444444;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11px;
}

.report-table th,
.report-table td {
  height: 26px;
  padding: 0 3px;
  border: 1px solid #555555;
  background: #ffffff;
  vertical-align: middle;
}

.report-table th {
  font-weight: 500;
  text-align: center;
}

.report-table thead th {
  height: 25px;
  white-space: nowrap;
}

.head-blue {
  background: #d9eaf7 !important;
}

.head-orange {
  background: #f6dfd2 !important;
}

.head-yellow {
  background: #f7edc0 !important;
}

.center-cell {
  text-align: center;
}

.readonly-number {
  padding-right: 6px !important;
  background: #fafafa !important;
  text-align: right;
}

.group-total-cell {
  padding-right: 7px !important;
  background: #fafafa !important;
  font-weight: 500;
  text-align: right;
  vertical-align: middle !important;
}

.total-row td {
  height: 28px;
  background: #f7f7f7;
  border-top: 2px solid #555555;
}

.total-title {
  font-weight: 700;
  text-align: center;
}

.grand-total-cell {
  padding-right: 7px !important;
  font-weight: 700;
  text-align: right;
}

.subtotal-row td {
  background: #fafafa;
  font-weight: 600;
}

.strong-cell {
  font-weight: 700;
}

.profit-cell {
  padding-right: 7px !important;
  background: #fafafa !important;
  font-weight: 700;
  text-align: right;
}

.cell-input,
.cell-number {
  width: 100%;
}

:deep(.cell-input.p-inputtext) {
  width: 100%;
  height: 24px;
  padding: 1px 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  font-size: 11px;
}

:deep(.cell-number.p-inputnumber) {
  width: 100%;
}

:deep(.cell-number .p-inputnumber-input) {
  width: 100%;
  height: 24px;
  padding: 1px 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  font-size: 11px;
}

:deep(.cell-input.p-inputtext:focus),
:deep(.cell-number .p-inputnumber-input:focus) {
  box-shadow: inset 0 0 0 1px #2196f3;
}

.text-right {
  text-align: right;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 7mm;
  }

  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  .profit-page {
    width: 100%;
    min-width: 0;
    padding: 0;
    font-size: 9px;
  }

  .report-header {
    height: 56px;
  }

  .report-title {
    font-size: 22px;
  }

  .approval-box {
    height: 54px;
  }

  .approval-title {
    height: 52px;
  }

  .approval-item {
    width: 52px;
    height: 52px;
  }

  .approval-sign {
    height: 31px;
  }

  .report-info {
    height: 27px;
  }

  .report-section {
    margin-bottom: 2px;
    break-inside: avoid;
  }

  .section-title {
    height: 18px;
    padding: 1px 2px;
    font-size: 9px;
    line-height: 15px;
  }

  .table-wrapper {
    overflow: visible;
  }

  .report-table {
    font-size: 8px;
  }

  .report-table th,
  .report-table td {
    height: 18px;
    padding: 0 2px;
  }

  .report-table thead th {
    height: 18px;
  }

  :deep(.cell-input.p-inputtext),
  :deep(.cell-number .p-inputnumber-input) {
    height: 17px;
    padding: 0 2px;
    font-size: 8px;
  }
}
</style>
