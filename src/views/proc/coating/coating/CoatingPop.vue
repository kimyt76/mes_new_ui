<template>
    <div class="coating-pop-wrap">
        <div class="coating-pop-scale">
        <div class="coating-pop-body">
            <!-- 1. 작업지시 정보 -->
            <div class="section-block">
                <div class="section-label">1. 작업지시 정보</div>

                <table class="info-table">
                    <colgroup>
                        <col class="th-col" />
                        <col class="td-col" />
                        <col class="th-col" />
                        <col class="td-col" />
                        <col class="th-col" />
                        <col class="td-col" />
                        <col class="th-col" />
                        <col class="td-col" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th class="cellBorder cellHeader">작업담당자</th>
                            <td class="cellBorder">{{ itemInfo.managerName }}</td>
                            <th class="cellBorder cellHeader">품목코드</th>
                            <td class="cellBorder">{{ itemInfo.itemCd }}</td>
                            <th class="cellBorder cellHeader">품목명</th>
                            <td class="cellBorder" colspan="3">{{ itemInfo.itemName }}</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">고객사</th>
                            <td class="cellBorder">{{ itemInfo.clientName }}</td>
                            <th class="cellBorder cellHeader">제품타입</th>
                            <td class="cellBorder">{{ itemInfo.prodType }}</td>
                            <th class="cellBorder cellHeader">작업일자</th>
                            <td class="cellBorder">{{ itemInfo.workDate }}</td>
                            <th class="cellBorder cellHeader">작업지시량</th>
                            <td class="cellBorder">{{ itemInfo.orderQty }} EA</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">제조번호</th>
                            <td class="cellBorder">{{ itemInfo.makeNo }}</td>
                            <th class="cellBorder cellHeader">제조량</th>
                            <td class="cellBorder">{{ itemInfo.prodQty }} EA</td>
                            <th class="cellBorder cellHeader" rowspan="2">폭 너비(mm) 및<br />겔 Sheet 적층수</th>
                            <td class="cellBorder" rowspan="2">
                                {{ itemInfo.sheetSpec || 0 }}<br />
                                {{ itemInfo.sheetStacking || 0 }} kg
                            </td>
                            <th class="cellBorder cellHeader" rowspan="2">기준무게<br />(필름제외)</th>
                            <td class="cellBorder" rowspan="2">
                                {{ itemInfo.stdWeight || '' }}<br />
                                {{ itemInfo.stdSize || '' }}
                            </td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">작업처</th>
                            <td class="cellBorder">{{ itemInfo.storageName }}</td>
                            <th class="cellBorder cellHeader">목형 No.</th>
                            <td class="cellBorder">{{ itemInfo.woodenPattern }}</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">작업공정도</th>
                            <td class="cellBorder" colspan="3">{{ itemInfo.workFlow }}</td>
                            <th class="cellBorder cellHeader">비고</th>
                            <td class="cellBorder">{{ itemInfo.etc }}</td>
                            <th class="cellBorder cellHeader">특이사항</th>
                            <td class="cellBorder">{{ itemInfo.memo }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 2. 투입자재 정보 -->
            <div class="section-block">
                <div class="section-label">2. 투입자재 정보</div>
                <DataTable
                    :value="itemList"
                    dataKey="itemCd"
                    show-gridlines
                    class="my-table material-table"
                >
                    <ColumnGroup type="header">
                        <Row>
                            <Column header="No" :rowspan="2" />
                            <Column header="자재정보" :colspan="6" />
                            <Column header="자재사용량" :colspan="6" />
                        </Row>
                        <Row>
                            <Column header="시험번호" field="testNo" :style="{ width: '110px' }" />
                            <Column header="재료명" field="itemName" :style="{ width: '280px' }" />
                            <Column header="규격" field="spec" :style="{ width: '90px' }" />
                            <Column header="성상 및 특성" field="exAppearance" :style="{ width: '170px' }" />
                            <Column header="예상소요량" field="reqQty" :style="{ width: '120px' }" :colspan="2" />
                            <Column header="총사용량" field="totalQty" :style="{ width: '120px' }" :colspan="2" />
                            <Column header="원불량" field="badQty" :style="{ width: '120px' }" :colspan="2" />
                            <Column header="작업불량" field="workBadQty" :style="{ width: '120px' }" :colspan="2" />
                        </Row>
                    </ColumnGroup>

                    <Column field="no" :style="{ width: '40px', textAlign: 'center' }"></Column>
                    <Column field="testNo" :style="{ width: '110px' }"></Column>
                    <Column field="itemName" :style="{ width: '280px' }"></Column>
                    <Column field="spec" :style="{ width: '90px' }"></Column>
                    <Column field="exAppearance" :style="{ width: '170px' }"></Column>
                    <Column field="reqQty" :style="{ width: '120px' }"></Column>
                    <Column field="unit" :style="{ width: '50px' }"></Column>
                    <Column field="totalQty" :style="{ width: '120px' }"></Column>
                    <Column field="unit" :style="{ width: '50px' }"></Column>
                    <Column field="oneErrorQty" :style="{ width: '120px' }"></Column>
                    <Column field="unit" :style="{ width: '50px' }"></Column>
                    <Column field="jobErrorQty" :style="{ width: '120px' }"></Column>
                </DataTable>
            </div>

            <!-- 3, 4 하단 -->
            <div class="bottom-wrap">
                <!-- 3. 작업수행 정보 -->
                <div class="section-box work-section">
                    <div class="section-header">
                        <div class="section-label">3. 작업수행 정보</div>
                        <div class="section-actions">
                            <Button label="신규등록" size="small" @click="openPop('W')" />
                        </div>
                    </div>

                    <div class="section-body">
                        <DataTable
                            :value="workRecodeList"
                            dataKey="workProcId"
                            show-gridlines
                            class="my-table work-table"
                        >
                            <Column field="no"          header="NO" :style="{ width: '40px', textAlign: 'center' }"></Column>
                            <Column field="workDate"    header="작업일자" :style="{ width: '120px', textAlign: 'center' }"></Column>
                            <Column field="workStartTime" header="작업시작시간" :style="{ width: '140px', textAlign: 'center' }"></Column>
                            <Column field="workEndTime" header="작업종료시간" :style="{ width: '140px', textAlign: 'center' }"></Column>
                            <Column field="workerCnt"   header="작업인원(명)" :style="{ width: '120px', textAlign: 'center' }"></Column>
                            <Column field="matUseQty"   header="반제품사용량(kg)" :style="{ width: '130px', textAlign: 'center' }"></Column>
                            <Column field="coatingQty"  header="코팅수량(ea)" :style="{ width: '120px', textAlign: 'center' }"></Column>
                        </DataTable>
                    </div>
                </div>

                <!-- 4. 종합정보 -->
                <div class="section-box summary-section">
                    <div class="section-header">
                        <div class="section-label">4. 종합정보</div>
                    </div>

                    <div class="section-body">
                        <table class="summary-table">
                            <colgroup>
                                <col class="summary-col-th" />
                                <col class="summary-col-td" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th class="cellBorder cellHeader" colspan="2">종합</th>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">계산식</th>
                                    <td class="cellBorder">{{ itemInfo.displayYield }}</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">Lot. 수율</th>
                                    <td class="cellBorder">{{ itemInfo.stdYield }} % 이상</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">총사용량</th>
                                    <td class="cellBorder">{{ totalInfo.totalQty || '' }} kg</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">생산수량</th>
                                    <td class="cellBorder">{{ totalInfo.prodQty || '' }} ea</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">생산수율</th>
                                    <td class="cellBorder">{{ totalInfo.prodYield || '' }} %</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 하단 버튼 -->
        <div class="coating-pop-footer flex gap-2">
            <Button label="작업시작" @click="openPop('S')" />
            <Button label="저장" @click="saveInfo" />
            <Button label="기록서" @click="openPop('D')" />
            <Button label="바코드" @click="openPop('B')" />
            <Button label="작업완료" @click="openPop('C')" />
            <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
        </div>
    </div>
    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const dialog = useDialog();
const dialogRef = inject('dialogRef');

const form = reactive({
    workProcId: '',
});

// 작업지시정보
const itemInfo = reactive({
    managerName: '',
    itemCd: '',
    itemName: '',
    clientName: '',
    storageName: '',
    prodType: '',
    workDate: '',
    orderQty: '',
    makeNo: '',
    prodQty: '',
    workFlow: '',
    woodenPattern: '',
    stdWeight: '',
    sheetSpec: '',
    sheetStacking: '',
    stdSize: '',
    displayYield: '',
    stdYield: '',
    etc: '',
    memo: '',
});

// 투입자재정보
const itemList = ref(
    Array.from({ length: 10 }, (_, i) => ({
        no: i + 1,
        testNo: '',
        itemName: '',
        spec: '',
        exAppearance: '',
        reqQty: '',
        unit: '',
        totalQty: '',
        oneErrorQty: '',
        jobErrorQty: '',
        workProcId: form.workProcId,
    }))
);

// 작업수행정보
const workRecodeList = ref(
    Array.from({ length: 5 }, (_, i) => ({
        no: i + 1,
        workDate: '',
        workStartTime: '',
        workEndTime: '',
        workerCnt: '',
        matUseQty: '',
        coatingQty: '',
        workProcId: form.workProcId,
        itemCd: form.itemCd,
    }))
);

// 종합정보
const totalInfo = reactive({
    totalQty: '',
    prodQty: '',
    prodYield: ''
});

const saveInfo = () => {

};

const openPop = (type) => {

};



onMounted(async () => {
    const params = {
        workProcId: dialogRef.value.data.workProcId,
        procCd: dialogRef.value.data.procCd,
        itemCd: dialogRef.value.data.itemCd
    };

    const res = await ApiProc.getCoatingInfo(params);
    console.log('res', res )

});

const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
.coating-pop-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 15px;
    background: #fff;
}
/* 전체 내용을 2% 축소 */
.coating-pop-scale {
    width: 102.05%;
    height: 102.05%;
    transform: scale(0.98);
    transform-origin: top left;
    display: flex;
    flex-direction: column;
}
.coating-pop-body {
    flex: 1 1 auto;
    overflow: hidden;
    padding: 8px 12px 6px;
}

.coating-pop-footer {
    flex: 0 0 auto;
    padding: 10px 12px 12px;
    border-top: 1px solid #e5e7eb;
    background: #fff;
}

.section-block {
    margin-bottom: 10px;
}

.section-label {
    display: inline-block;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #334155;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.info-table .th-col {
    width: 9%;
}

.info-table .td-col {
    width: 16%;
}

.cellBorder {
    border: 0.5px solid #cfd8e3;
    text-align: center;
    vertical-align: middle;
    padding: 4px 6px;
    word-break: break-word;
    line-height: 1.2;
}

.cellHeader {
    background-color: #8D6E63;
    color: white;
    font-weight: 700;
    height: 30px;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #8D6E63;
    color: white;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
    padding: 4px 6px;
}

:deep(.material-table .p-datatable-thead > tr > th) {
    height: 30px;
}

:deep(.material-table .p-datatable-tbody > tr > td) {
    height: 30px;
    padding: 4px 6px;
    font-size: 15px;
}

:deep(.work-table .p-datatable-thead > tr > th) {
    height: 30px;
}

:deep(.work-table .p-datatable-tbody > tr > td) {
    height: 30px;
    padding: 4px 6px;
    font-size: 15px;
}

.bottom-wrap {
    display: grid;
    grid-template-columns: 6fr 4fr;
    gap: 14px;
    align-items: start;
    height: 300px;
}

.section-box {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.section-body {
    display: block;
    min-height: 0;
}

.section-actions {
    display: flex;
    gap: 8px;
}

.summary-section {
    height: 100%;
}

.summary-section .section-body {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
}

.summary-table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.summary-table .summary-col-th {
    width: 28%;
}

.summary-table .summary-col-td {
    width: 72%;
}

.summary-table th,
.summary-table td {
    height: 32px;
    padding: 4px 10px;
    font-size: 13px;
    line-height: 1.2;
    vertical-align: middle;
    box-sizing: border-box;
}

.summary-table th[colspan='2'] {
    width: auto;
}

.summary-table .cellHeader {
    width: auto !important;   /* 기존 cellHeader width 덮어쓰기 */
    min-width: 0 !important;
}

.summary-table tbody tr:first-child th {
    text-align: center;
}

.summary-table tbody tr:not(:first-child) th {
    text-align: center;
    white-space: nowrap;
}

.summary-table tbody tr:not(:first-child) td {
    text-align: center;
}

:deep(.coating-pop-footer .p-button) {
    padding: 0.5rem 0.9rem;
    font-size: 15px;
}

.mt-3 {
    margin-top: 0.5rem !important;
}
</style>
