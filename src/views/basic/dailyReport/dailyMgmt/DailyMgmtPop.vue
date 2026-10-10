<template>
  <div class="profit-page">
    <div class="screen-toolbar no-print">
      <div class="toolbar-left">
        <FloatLabel variant="on">
          <DatePicker
            v-model="form.dailyDate"
            dateFormat="yy-mm-dd"
            :manualInput="false"
            inputId="dailyDate"
            disabled
          />
          <label for="dailyDate">기준일자</label>
        </FloatLabel>
      </div>
      <div class="toolbar-right">
        <Button label="조회" icon="pi pi-search" severity="secondary" @click="srhInfo" />
        <Button label="저장" icon="pi pi-save" @click="saveInfo" />
        <!-- <Button label="인쇄" icon="pi pi-print" severity="secondary" @click="printPage" /> -->
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadDailyMgmt"/>
      </div>
    </div>

    <div class="report-header">
      <div class="report-title">일일 손익계산서</div>
      <div class="approval-box print-only">
        <div class="approval-title">결<br />재</div>
        <div v-for="item in approvalList" :key="item.title" class="approval-item" >
          <div class="approval-name"> {{ item.title }} </div>
          <div class="approval-sign"></div>
        </div>
      </div>
    </div>
    <div class="report-info">
      <div class="report-date"> {{ displayDailyDate }} </div>
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
            <col style="width: 12%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>수 량(kg)</th>
              <td v-for="field in rawQtyFields" :key="field">
                <span v-if="field === 'currentQty'" class="readonly-number stock-current">{{ formatNumber(stockCurrent.rawQty) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
                  :maxFractionDigits="6"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
            <tr>
              <th>금 액(원)</th>
              <td v-for="field in rawAmtFields" :key="field">
                <span v-if="field === 'currentAmt'" class="readonly-number stock-current">{{ formatNumber(stockCurrent.rawAmt) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
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
            <col style="width: 12%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>수 량(ea)</th>
              <td v-for="field in subQtyFields" :key="field">
                <span v-if="field === 'currentQty'" class="readonly-number stock-current">{{ formatNumber(stockCurrent.subQty) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
                  :maxFractionDigits="6"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
            <tr>
              <th>금 액(원)</th>
              <td v-for="field in subAmtFields" :key="field">
                <span v-if="field === 'currentAmt'" class="readonly-number stock-current">{{ stockCurrent.subAmt == null ? "-" : formatNumber(stockCurrent.subAmt) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
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
            <col style="width: 12%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
            <col style="width: 11%" />
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>수 량(ea)</th>
              <td v-for="field in prodQtyFields" :key="field">
                <span v-if="field === 'currentQty'" class="readonly-number stock-current">{{ formatNumber(stockCurrent.prodQty) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
                  :maxFractionDigits="6"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
            <tr>
              <th>금 액(원)</th>
              <td v-for="field in prodAmtFields" :key="field">
                <span v-if="field === 'currentAmt'" class="readonly-number stock-current">{{ formatNumber(stockCurrent.prodAmt) }}</span>
                <InputNumber
                  v-else
                  v-model="dailyMgmt[field]"
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
            <col style="width: 25%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 10%" />
            <col style="width: 12%" />
            <col style="width: 12%" />
            <col style="width: 12%" />
            <col style="width: 11%" />
          </colgroup>

          <thead>
            <tr>
              <th rowspan="2">구 분</th>
              <th colspan="2">구 분</th>
              <th rowspan="2">인원소계</th>
              <th rowspan="2">근무시간</th>
              <th rowspan="2">시간당 단가</th>
               <th rowspan="2">금 액</th>
              <th rowspan="2">합계</th>
            </tr>

            <tr>
              <th>남</th>
              <th>여</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="center-cell">생산(관리)주간</td>
              <td><InputNumber v-model="dailyMgmt.mgmtDayMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.mgmtDayFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.mgmtDayMaleCnt) + number(dailyMgmt.mgmtDayFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.mgmtDayWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.mgmtDayHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.mgmtDayMaleCnt, dailyMgmt.mgmtDayFemaleCnt, dailyMgmt.mgmtDayWorkHour, dailyMgmt.mgmtDayHourlyCost)) }}</td>
              <td rowspan="4" class="group-total-cell">{{ formatNumber(dayLaborTotal) }}</td>
            </tr>
            <tr>
              <td class="center-cell">생산(정규직)주간</td>
              <td><InputNumber v-model="dailyMgmt.regularDayMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.regularDayFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.regularDayMaleCnt) + number(dailyMgmt.regularDayFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.regularDayWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.regularDayHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.regularDayMaleCnt, dailyMgmt.regularDayFemaleCnt, dailyMgmt.regularDayWorkHour, dailyMgmt.regularDayHourlyCost)) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-남)주간</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleDayMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleDayFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyMaleDayMaleCnt) + number(dailyMgmt.dailyMaleDayFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleDayWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleDayHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyMaleDayMaleCnt, dailyMgmt.dailyMaleDayFemaleCnt, dailyMgmt.dailyMaleDayWorkHour, dailyMgmt.dailyMaleDayHourlyCost)) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-여)주간</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleDayMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleDayFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyFemaleDayMaleCnt) + number(dailyMgmt.dailyFemaleDayFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleDayWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleDayHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyFemaleDayMaleCnt, dailyMgmt.dailyFemaleDayFemaleCnt, dailyMgmt.dailyFemaleDayWorkHour, dailyMgmt.dailyFemaleDayHourlyCost)) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(관리)주간잔업</td>
              <td><InputNumber v-model="dailyMgmt.mgmtOvertimeMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.mgmtOvertimeFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.mgmtOvertimeMaleCnt) + number(dailyMgmt.mgmtOvertimeFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.mgmtOvertimeWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.mgmtDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.mgmtOvertimeMaleCnt, dailyMgmt.mgmtOvertimeFemaleCnt, dailyMgmt.mgmtOvertimeWorkHour, (dailyMgmt.mgmtDayHourlyCost * 1.5))) }}</td>
              <td rowspan="4" class="group-total-cell">{{ formatNumber(overtimeLaborTotal) }}</td>
            </tr>
            <tr>
              <td class="center-cell">생산(정규직)주간잔업</td>
              <td><InputNumber v-model="dailyMgmt.regularOvertimeMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.regularOvertimeFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.regularOvertimeMaleCnt) + number(dailyMgmt.regularOvertimeFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.regularOvertimeWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.regularDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.regularOvertimeMaleCnt, dailyMgmt.regularOvertimeFemaleCnt, dailyMgmt.regularOvertimeWorkHour, (dailyMgmt.regularDayHourlyCost * 1.5))) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-남)주간잔업</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleOvertimeMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleOvertimeFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyMaleOvertimeMaleCnt) + number(dailyMgmt.dailyMaleOvertimeFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleOvertimeWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.dailyMaleDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyMaleOvertimeMaleCnt, dailyMgmt.dailyMaleOvertimeFemaleCnt, dailyMgmt.dailyMaleOvertimeWorkHour, (dailyMgmt.dailyMaleDayHourlyCost * 1.5))) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-여)주간잔업</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleOvertimeMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleOvertimeFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyFemaleOvertimeMaleCnt) + number(dailyMgmt.dailyFemaleOvertimeFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleOvertimeWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.dailyFemaleDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyFemaleOvertimeMaleCnt, dailyMgmt.dailyFemaleOvertimeFemaleCnt, dailyMgmt.dailyFemaleOvertimeWorkHour, (dailyMgmt.dailyFemaleDayHourlyCost * 1.5))) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(관리)야간</td>
              <td><InputNumber v-model="dailyMgmt.mgmtNightMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.mgmtNightFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.mgmtNightMaleCnt) + number(dailyMgmt.mgmtNightFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.mgmtNightWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.mgmtDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.mgmtNightMaleCnt, dailyMgmt.mgmtNightFemaleCnt, dailyMgmt.mgmtNightWorkHour, (dailyMgmt.mgmtDayHourlyCost * 1.5))) }}</td>
              <td rowspan="4" class="group-total-cell">{{ formatNumber(nightLaborTotal) }}</td>
            </tr>
            <tr>
              <td class="center-cell">생산(정규직)야간</td>
              <td><InputNumber v-model="dailyMgmt.regularNightMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.regularNightFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.regularNightMaleCnt) + number(dailyMgmt.regularNightFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.regularNightWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><span class="readonly-number stock-current">{{ formatNumber((dailyMgmt.regularDayHourlyCost * 1.5)) }}</span></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.regularNightMaleCnt, dailyMgmt.regularNightFemaleCnt, dailyMgmt.regularNightWorkHour, (dailyMgmt.regularDayHourlyCost * 1.5))) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-남)야간</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleNightMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleNightFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyMaleNightMaleCnt) + number(dailyMgmt.dailyMaleNightFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleNightWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyMaleNightHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyMaleNightMaleCnt, dailyMgmt.dailyMaleNightFemaleCnt, dailyMgmt.dailyMaleNightWorkHour, dailyMgmt.dailyMaleNightHourlyCost)) }}</td>

            </tr>
            <tr>
              <td class="center-cell">생산(일용직-여)야간</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleNightMaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleNightFemaleCnt" :maxFractionDigits="0" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(number(dailyMgmt.dailyFemaleNightMaleCnt) + number(dailyMgmt.dailyFemaleNightFemaleCnt)) }}</td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleNightWorkHour" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td><InputNumber v-model="dailyMgmt.dailyFemaleNightHourlyCost" :maxFractionDigits="2" class="cell-number" inputClass="text-right" /></td>
              <td class="readonly-number">{{ formatNumber(laborAmount(dailyMgmt.dailyFemaleNightMaleCnt, dailyMgmt.dailyFemaleNightFemaleCnt, dailyMgmt.dailyFemaleNightWorkHour, dailyMgmt.dailyFemaleNightHourlyCost)) }}</td>

            </tr>
            <tr class="total-row">
              <td colspan="7" class="total-title">합 계</td>
              <td class="grand-total-cell">
                {{ formatNumber(laborGrandTotal) }}
              </td>
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
            <col style="width: 15%" />
            <col style="width: 13%" />
            <col style="width: 23%" />
            <col style="width: 13%" />
            <col style="width: 23%" />
            <col style="width: 13%" />
          </colgroup>
          <thead>
            <tr>
              <th colspan="2">구분</th>
              <th>직접비용</th>
              <th colspan="2">간접비용</th>
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center-cell">소모품</td>
              <td rowspan="3" class="center-cell">제조경비</td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.suppliesDirectCost"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td rowspan="3" class="center-cell">판관경비<br>(기타·감가상각·금융)</td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.adminEtcIndirectCost"
                   title="기타판관 경비"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td rowspan="3" class="group-total-cell">
                {{ formatNumber(expenseTotal) }}
              </td>
            </tr>
            <tr>
              <td class="center-cell">식대</td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.mealDirectCost"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.depreciationIndirectCost"
                   title="감가상각비"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
            </tr>
            <tr>
              <td class="center-cell">기타(전력비외)</td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.etcDirectCost"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
                />
              </td>
              <td>
                <InputNumber
                  v-model="dailyMgmt.financeIndirectCost"
                   title="금융비용"
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
            <col style="width: 17%" />
            <col style="width: 20%" />
            <col style="width: 38%" />
            <col style="width: 25%" />
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">구 분</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="center-cell">납품금액</td>
              <td>
                <InputNumber
                  :modelValue="production.deliveryAmount"
                   :disabled="true"
                  :maxFractionDigits="0"
                  class="cell-number"
                  inputClass="text-right"
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

              <td>
                  <InputNumber
                    v-model="dailyMgmt.indirectLaborCost"
                    :maxFractionDigits="0"
                    class="cell-number"
                    inputClass="text-right"
                  />
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
            </tr>

            <tr>
              <td colspan="3" class="center-cell strong-cell">
                정상 이익(납품단가)-(재료비+노무비+경비)
              </td>

              <td class="profit-cell">
                {{ formatNumber(normalProfit) }}
              </td>
            </tr>

            <tr>
              <td colspan="3" class="center-cell strong-cell">이익률</td>

              <td class="profit-cell">
                {{ formatPercent(profitRate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ApiBase } from "@/api/apiBase";
import { useAlertStore } from "@/stores/alert";
import { isEmpty } from '@/util/common';
import { handleApiError } from "@/util/errorHandler";
import { computed, inject, onMounted, reactive, ref } from "vue";

const dialogRef = inject("dialogRef");
const { vSuccess } = useAlertStore();
const form = reactive({ dailyDate: new Date() });
const approvalList = ref([{ title: "담 당" }, { title: "차 장" }, { title: "상 무" }, { title: "부 사 장" }]);
const displayDailyDate = computed(() => {
  if (!form.dailyDate) return "";
  const d = form.dailyDate instanceof Date ? form.dailyDate : new Date(form.dailyDate);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

// DB tb_daily_mgmt와 1:1 매칭하는 단일 저장 객체 (계산식 및 비고 제외)
const initialDailyMgmt = () => ({
  dailyId: null,
  rawPrevStockQty: 0,
  rawPrevStockAmt: 0,
  rawReceiptQty: 0,
  rawReceiptAmt: 0,
  rawReturnQty: 0,
  rawReturnAmt: 0,
  rawDefectQty: 0,
  rawDefectAmt: 0,
  rawOutsourceQty: 0,
  rawOutsourceAmt: 0,
  rawUsageQty: 0,
  rawUsageAmt: 0,
  rawOutboundQty: 0,
  rawOutboundAmt: 0,
  subPrevStockQty: 0,
  subPrevStockAmt: 0,
  subReceiptQty: 0,
  subReceiptAmt: 0,
  subReturnQty: 0,
  subReturnAmt: 0,
  subDefectQty: 0,
  subDefectAmt: 0,
  subOutsourceQty: 0,
  subOutsourceAmt: 0,
  subUsageQty: 0,
  subUsageAmt: 0,
  subOutboundQty: 0,
  subOutboundAmt: 0,
  productPrevStockQty: 0,
  productPrevStockAmt: 0,
  productProdQty: 0,
  productProdAmt: 0,
  productOutsourceProdQty: 0,
  productOutsourceProdAmt: 0,
  productDefectQty: 0,
  productDefectAmt: 0,
  productOutsourceQty: 0,
  productOutsourceAmt: 0,
  productShipmentQty: 0,
  productShipmentAmt: 0,
  productReturnQty: 0,
  productReturnAmt: 0,
  mgmtDayMaleCnt: 0,
  mgmtDayFemaleCnt: 0,
  mgmtDayWorkHour: 0,
  mgmtDayHourlyCost: 0,
  regularDayMaleCnt: 0,
  regularDayFemaleCnt: 0,
  regularDayWorkHour: 0,
  regularDayHourlyCost: 0,
  dailyMaleDayMaleCnt: 0,
  dailyMaleDayFemaleCnt: 0,
  dailyMaleDayWorkHour: 0,
  dailyMaleDayHourlyCost: 0,
  dailyFemaleDayMaleCnt: 0,
  dailyFemaleDayFemaleCnt: 0,
  dailyFemaleDayWorkHour: 0,
  dailyFemaleDayHourlyCost: 0,
  mgmtOvertimeMaleCnt: 0,
  mgmtOvertimeFemaleCnt: 0,
  mgmtOvertimeWorkHour: 0,
  regularOvertimeMaleCnt: 0,
  regularOvertimeFemaleCnt: 0,
  regularOvertimeWorkHour: 0,
  dailyMaleOvertimeMaleCnt: 0,
  dailyMaleOvertimeFemaleCnt: 0,
  dailyMaleOvertimeWorkHour: 0,
  dailyFemaleOvertimeMaleCnt: 0,
  dailyFemaleOvertimeFemaleCnt: 0,
  dailyFemaleOvertimeWorkHour: 0,
  mgmtNightMaleCnt: 0,
  mgmtNightFemaleCnt: 0,
  mgmtNightWorkHour: 0,
  regularNightMaleCnt: 0,
  regularNightFemaleCnt: 0,
  regularNightWorkHour: 0,
  dailyMaleNightMaleCnt: 0,
  dailyMaleNightFemaleCnt: 0,
  dailyMaleNightWorkHour: 0,
  dailyMaleNightHourlyCost: 0,
  dailyFemaleNightMaleCnt: 0,
  dailyFemaleNightFemaleCnt: 0,
  dailyFemaleNightWorkHour: 0,
  dailyFemaleNightHourlyCost: 0,
  suppliesDirectCost: 0,
  mealDirectCost: 0,
  etcDirectCost: 0,
  adminEtcIndirectCost: 0,
  depreciationIndirectCost: 0,
  financeIndirectCost: 0,
  indirectLaborCost: 0,
});
const dailyMgmt = reactive(initialDailyMgmt());

// 화면 반복 렌더링용 필드명. 저장 데이터는 모두 dailyMgmt에만 존재
const rawQtyFields = ["rawPrevStockQty", "rawReceiptQty", "rawReturnQty", "rawDefectQty", "rawOutsourceQty", "rawUsageQty", "rawOutboundQty"].concat("currentQty");
const rawAmtFields = ["rawPrevStockAmt", "rawReceiptAmt", "rawReturnAmt", "rawDefectAmt", "rawOutsourceAmt", "rawUsageAmt", "rawOutboundAmt"].concat("currentAmt");
const subQtyFields = ["subPrevStockQty", "subReceiptQty", "subReturnQty", "subDefectQty", "subOutsourceQty", "subUsageQty", "subOutboundQty"].concat("currentQty");
const subAmtFields = ["subPrevStockAmt", "subReceiptAmt", "subReturnAmt", "subDefectAmt", "subOutsourceAmt", "subUsageAmt", "subOutboundAmt"].concat("currentAmt");
const prodQtyFields = ["productPrevStockQty", "productProdQty", "productOutsourceProdQty", "productDefectQty", "productOutsourceQty", "productShipmentQty", "productReturnQty"].concat("currentQty");
const prodAmtFields = ["productPrevStockAmt", "productProdAmt", "productOutsourceProdAmt", "productDefectAmt", "productOutsourceAmt", "productShipmentAmt", "productReturnAmt"].concat("currentAmt");

const number = (v) => Number(v) || 0;
const stockCurrent = computed(() => ({
  rawQty: number(dailyMgmt.rawPrevStockQty) + number(dailyMgmt.rawReceiptQty) - number(dailyMgmt.rawUsageQty),
  rawAmt: number(dailyMgmt.rawPrevStockAmt) + number(dailyMgmt.rawReceiptAmt) - number(dailyMgmt.rawUsageAmt),
  subQty: number(dailyMgmt.subPrevStockQty) + number(dailyMgmt.subReceiptQty) - number(dailyMgmt.subReturnQty) - number(dailyMgmt.subDefectQty) - number(dailyMgmt.subUsageQty) - number(dailyMgmt.subOutboundQty),
  // 엑셀에서 부자재 현재고 금액은 계산식이 없으므로 표시하지 않음
  subAmt: null,
  prodQty: number(dailyMgmt.productPrevStockQty) + number(dailyMgmt.productProdQty) + number(dailyMgmt.productOutsourceProdQty) - number(dailyMgmt.productShipmentQty) - number(dailyMgmt.productReturnQty),
  prodAmt: number(dailyMgmt.productPrevStockAmt) + number(dailyMgmt.productProdAmt) + number(dailyMgmt.productOutsourceProdAmt) - number(dailyMgmt.productDefectAmt) - number(dailyMgmt.productShipmentAmt) - number(dailyMgmt.productReturnAmt),
}));

// 인건비는 배열 없이 각 DB 필드를 직접 사용하며, 계산 결과만 화면에 표시
const laborAmount = (maleCnt, femaleCnt, workHour, hourlyCost) =>
  (number(maleCnt) + number(femaleCnt)) * number(workHour) * number(hourlyCost);

const dayLaborTotal = computed(() =>
  laborAmount(dailyMgmt.mgmtDayMaleCnt, dailyMgmt.mgmtDayFemaleCnt, dailyMgmt.mgmtDayWorkHour, dailyMgmt.mgmtDayHourlyCost) +
  laborAmount(dailyMgmt.regularDayMaleCnt, dailyMgmt.regularDayFemaleCnt, dailyMgmt.regularDayWorkHour, dailyMgmt.regularDayHourlyCost) +
  laborAmount(dailyMgmt.dailyMaleDayMaleCnt, dailyMgmt.dailyMaleDayFemaleCnt, dailyMgmt.dailyMaleDayWorkHour, dailyMgmt.dailyMaleDayHourlyCost) +
  laborAmount(dailyMgmt.dailyFemaleDayMaleCnt, dailyMgmt.dailyFemaleDayFemaleCnt, dailyMgmt.dailyFemaleDayWorkHour, dailyMgmt.dailyFemaleDayHourlyCost)
);
const overtimeLaborTotal = computed(() =>
  laborAmount(dailyMgmt.mgmtOvertimeMaleCnt, dailyMgmt.mgmtOvertimeFemaleCnt, dailyMgmt.mgmtOvertimeWorkHour, (dailyMgmt.mgmtDayHourlyCost * 1.5)) +
  laborAmount(dailyMgmt.regularOvertimeMaleCnt, dailyMgmt.regularOvertimeFemaleCnt, dailyMgmt.regularOvertimeWorkHour, (dailyMgmt.regularDayHourlyCost * 1.5)) +
  laborAmount(dailyMgmt.dailyMaleOvertimeMaleCnt, dailyMgmt.dailyMaleOvertimeFemaleCnt, dailyMgmt.dailyMaleOvertimeWorkHour, (dailyMgmt.dailyMaleDayHourlyCost * 1.5)) +
  laborAmount(dailyMgmt.dailyFemaleOvertimeMaleCnt, dailyMgmt.dailyFemaleOvertimeFemaleCnt, dailyMgmt.dailyFemaleOvertimeWorkHour, (dailyMgmt.dailyFemaleDayHourlyCost * 1.5))
);
const nightLaborTotal = computed(() =>
  laborAmount(dailyMgmt.mgmtNightMaleCnt, dailyMgmt.mgmtNightFemaleCnt, dailyMgmt.mgmtNightWorkHour, (dailyMgmt.mgmtDayHourlyCost * 1.5)) +
  laborAmount(dailyMgmt.regularNightMaleCnt, dailyMgmt.regularNightFemaleCnt, dailyMgmt.regularNightWorkHour, (dailyMgmt.regularDayHourlyCost * 1.5)) +
  laborAmount(dailyMgmt.dailyMaleNightMaleCnt, dailyMgmt.dailyMaleNightFemaleCnt, dailyMgmt.dailyMaleNightWorkHour, dailyMgmt.dailyMaleNightHourlyCost) +
  laborAmount(dailyMgmt.dailyFemaleNightMaleCnt, dailyMgmt.dailyFemaleNightFemaleCnt, dailyMgmt.dailyFemaleNightWorkHour, dailyMgmt.dailyFemaleNightHourlyCost)
);
const laborGrandTotal = computed(() => dayLaborTotal.value + overtimeLaborTotal.value + nightLaborTotal.value);

const directExpenseTotal = computed(() => number(dailyMgmt.suppliesDirectCost) + number(dailyMgmt.mealDirectCost) + number(dailyMgmt.etcDirectCost));
const indirectExpenseTotal = computed(() => number(dailyMgmt.adminEtcIndirectCost) + number(dailyMgmt.depreciationIndirectCost) + number(dailyMgmt.financeIndirectCost));
const expenseTotal = computed(() => directExpenseTotal.value + indirectExpenseTotal.value);
const production = computed(() => ({
  deliveryAmount: number(dailyMgmt.productProdAmt) + number(dailyMgmt.productOutsourceProdAmt),
  rawMaterialCost: number(dailyMgmt.rawUsageAmt) + number(dailyMgmt.rawOutboundAmt),
  subMaterialCost: number(dailyMgmt.subUsageAmt),
  directLaborCost: laborGrandTotal.value,
  indirectLaborCost: number(dailyMgmt.indirectLaborCost),
  manufacturingExpense: directExpenseTotal.value,
  salesAdminExpense: indirectExpenseTotal.value,
  outsourceCost: number(dailyMgmt.productOutsourceAmt),
}));
const materialSubtotal = computed(() => production.value.rawMaterialCost + production.value.subMaterialCost);
const laborSubtotal = computed(() => production.value.directLaborCost + production.value.indirectLaborCost);
const expenseSubtotal = computed(() => production.value.manufacturingExpense + production.value.salesAdminExpense);
const productionCostTotal = computed(() => materialSubtotal.value + laborSubtotal.value + expenseSubtotal.value + production.value.outsourceCost);
const normalProfit = computed(() => production.value.deliveryAmount - productionCostTotal.value);
const profitRate = computed(() => production.value.deliveryAmount ? normalProfit.value / production.value.deliveryAmount * 100 : 0);

// 조회 API는 프로젝트의 실제 메서드가 확인되면 연결 필요.
// 조회 결과는 Object.assign(dailyMgmt, initialDailyMgmt(), res.data...)로 매핑.
const srhInfo = async () => {
  console.log("조회조건", { dailyDate: displayDailyDate.value });
};

const saveInfo = async () => {
  try {
    // 화면/계산 필드 없이 tb_daily_mgmt에 대응하는 단일 평면 객체만 전송
    const params = { ...dailyMgmt };
    // 신규 저장 시 dailyId는 null이며 서버에서 생성/확정해야 합니다.
    await ApiBase.saveDailyMgmt(params);
    console.log("저장 데이터", params);
    vSuccess("저장되었습니다.");
  } catch (error) {
    console.error("저장 중 오류 발생:", error);
    handleApiError(error);
  }
};
const printPage = () => window.print();
const formatNumber = value => value == null ? "" : number(value).toLocaleString("ko-KR", { maximumFractionDigits: 6 });
const formatPercent = value => `${number(value).toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%`;

onMounted( async () => {
   dailyMgmt.dailyId = dialogRef?.value?.data?.dailyId ?? null

   if (!isEmpty(dailyMgmt.dailyId)) {
    const res = await ApiBase.getDailyMgmtInfo(dailyMgmt.dailyId);

    Object.assign(dailyMgmt,  res);
   }else{

   }

});



const downloadDailyMgmt = async () => {
    if (!dailyMgmt.dailyId) {
        vInfo('저장 후 다운로드 가능합니다.')
        return
    }

    try {
        const params = {
            typeCd: 'M',
            dailyId: dailyMgmt.dailyId
        }

        const res = await ApiBase.downloadDailyReport(params)
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `생산일보통합대장_${dailyMgmt.dailyDate}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        handleApiError(error)
    }
}

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
.stock-current { display: block; min-height: 24px; line-height: 24px; }
</style>
