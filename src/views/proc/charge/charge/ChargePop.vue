<template>
    <div class="pop-wrap">
        <div class="coating-pop-scale">
        <div class="pop-body">
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
                            <td class="cellBorder">{{ workOrderInfo.managerName }}</td>
                            <th class="cellBorder cellHeader">품목코드</th>
                            <td class="cellBorder">{{ itemInfo.itemCd }}</td>
                            <th class="cellBorder cellHeader">품목명</th>
                            <td class="cellBorder" colspan="3">{{ itemInfo.itemName }}</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">고객사</th>
                            <td class="cellBorder">{{ workOrderInfo.clientName }}</td>
                            <th class="cellBorder cellHeader">제품타입</th>
                            <td class="cellBorder">{{ itemInfo.prodType }}</td>
                            <th class="cellBorder cellHeader">작업일자</th>
                            <td class="cellBorder">{{ workOrderInfo.prodDate }}</td>
                            <th class="cellBorder cellHeader">작업지시량</th>
                            <td class="cellBorder">{{ workOrderInfo.orderQty }} EA</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">제조번호</th>
                            <td class="cellBorder">{{ workOrderInfo.makeNo }}</td>
                            <th class="cellBorder cellHeader">제조량</th>
                            <td class="cellBorder">{{ workOrderInfo.makeQty || 0 }} EA</td>
                            <th class="cellBorder cellHeader" rowspan="2">LOT<br />표기</th>
                            <td class="cellBorder" rowspan="2">
                                {{ workOrderInfo.lotNo || 0 }}<br />
                            </td>
                            <th class="cellBorder cellHeader" rowspan="2">비고</th>
                            <td class="cellBorder" rowspan="2">
                                <Textarea v-model="workOrderInfo.etc" rows="2"  class="w-full" style="resize: none;"/>
                            </td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">작업처</th>
                            <td class="cellBorder">{{ workOrderInfo.storageName }}</td>
                            <th class="cellBorder cellHeader">목형 No.</th>
                            <td class="cellBorder">{{ itemInfo.woodenPattern }}</td>
                        </tr>
                        <tr>
                            <th class="cellBorder cellHeader">작업공정도</th>
                            <td class="cellBorder" colspan="5">{{ itemInfo.workFlow }}</td>
                            <th class="cellBorder cellHeader">특이사항</th>
                            <td class="cellBorder">
                                <Textarea v-model="workOrderInfo.memo" rows="1"  class="w-full" style="resize: none;"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 2. 투입자재 정보 -->
            <div class="section-block">
                <div class="section-label">2. 투입자재 정보</div>
                <DataTable
                    :value="prodList"
                    dataKey="itemCd"
                    show-gridlines
                    class="my-table material-table"
                    scrollable
                >
                    <ColumnGroup type="header">
                        <Row>
                            <Column header="No" :rowspan="2" />
                            <Column header="자재정보" :colspan="6" />
                            <Column header="자재사용량" :colspan="8" />
                        </Row>
                        <Row>
                            <Column header="시험번호"   field="testNos"      :style="{ width: '150px' }" />
                            <Column header="재료명"     field="matName"     :style="{ width: '140px' }" />
                            <Column header="규격"       field="specInfo"    :style="{ width: '150px' }" />
                            <Column header="성상 및 특성" field="exAppearance" :style="{ width: '170px' }" />
                            <Column header="단위포장규격" field="packingSpecValue" :style="{ width: '180px' }" :colspan="2"/>
                            <Column header="예상소요량" field="reqQty"       :style="{ width: '120px' }" :colspan="2" />
                            <Column header="총사용량"   field="totUseQty"   :style="{ width: '120px' }" :colspan="2" />
                            <Column header="원불량"     field="badQty"      :style="{ width: '120px' }" :colspan="2" />
                            <Column header="작업불량"   field="workBadQty"  :style="{ width: '120px' }" :colspan="2" />
                        </Row>
                    </ColumnGroup>

                    <Column field="no"          :style="{ width: '50px', textAlign: 'center' }"></Column>
                    <Column field="testNos"     :style="{ width: '150px' , textAlign: 'center'}">
                        <template #body="slotProps">
                             <div
                                 style="
                                        width: 100%;
                                        height: 100%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        cursor: pointer;
                                    "
                                @click="selectRowClick(slotProps.data)"
                                >
                                {{ slotProps.data.testNos}}
                            </div>
                        </template>
                    </Column>
                    <Column field="matName"     :style="{ width: '140px' }"></Column>
                    <Column field="specInfo"    :style="{ width: '150px' , textAlign: 'center'}"/>
                    <Column field="exAppearance" :style="{ width: '170px' , textAlign: 'center'}"/>
                    <Column field="packingSpecValue" :style="{ width: '50px' , textAlign: 'center'}"/>
                    <Column field="packingSpecUnit"  :style="{ width: '130px', textAlign: 'center' }"/>
                    <Column field="reqQty"      :style="{ width: '120px' , textAlign: 'right'}"/>
                    <Column field="unit"        :style="{ width: '50px', textAlign: 'center' }"/>
                    <Column field="useQty"      :style="{ width: '120px' , textAlign: 'right'}"/>
                    <Column field="unit"        :style="{ width: '50px' , textAlign: 'center'}"/>
                    <Column field="badQty"      :style="{ width: '120px', textAlign: 'right' }"/>
                    <Column field="unit"        :style="{ width: '50px' , textAlign: 'center'}"/>
                    <Column field="workBadQty"  :style="{ width: '120px' , textAlign: 'right'}"/>
                    <Column field="unit"        :style="{ width: '50px' , textAlign: 'center'}"/>
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
                            :value="workRecordList"
                            dataKey="workProcId"
                            show-gridlines
                            class="my-table work-table"
                        >
                            <Column field="no"          header="NO"                 :style="{ width: '40px', textAlign: 'center' }"></Column>
                            <Column field="workDate"    header="작업일자"           :style="{ width: '120px', textAlign: 'center' }"></Column>
                            <Column field="workStartTime" header="작업시작시간"     :style="{ width: '140px', textAlign: 'center' }"></Column>
                            <Column field="workEndTime" header="작업종료시간"       :style="{ width: '140px', textAlign: 'center' }"></Column>
                            <Column field="workerCnt"   header="작업인원(명)"       :style="{ width: '120px', textAlign: 'center' }"></Column>
                            <Column field="useQty"      header="반제품사용량(kg)"   :style="{ width: '130px', textAlign: 'center' }"></Column>
                            <Column field="prodQty"     header="코팅수량(ea)"       :style="{ width: '120px', textAlign: 'center' }"></Column>
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
                                    <td class="cellBorder">기준 {{ itemInfo.stdYield }} % 이상</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">총사용량</th>
                                    <td class="cellBorder">{{ workOrderInfo.useQty || 0 }} kg</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">생산수량</th>
                                    <td class="cellBorder">{{ workOrderInfo.prodQty || 0 }} ea</td>
                                </tr>
                                <tr>
                                    <th class="cellBorder cellHeader">생산수율</th>
                                    <td class="cellBorder">{{ workOrderInfo.prodYield || 0 }} %</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 하단 버튼 -->
        <div class="pop-footer flex gap-2">
            <Button v-if="isStarted" label="작업시작" @click="openPop('S')" />
            <!-- <Button v-if="!isStarted" label="저장" @click="saveInfo" /> -->
            <Button label="기록서" @click="downloadExcel" />
            <Button label="바코드" @click="openPop('B')" />
            <Button v-if="!isStarted" label="작업완료" @click="workComplete" />
            <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
        </div>
    </div>
    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { useAlertStore } from '@/stores/alert';
import QrCodePop from '@/views/common/QrCodePop.vue';
import { useConfirm, useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';
import ProdUsePop2 from '../../common/ProdUsePop2.vue';
import WorkRecordPop from '../../common/WorkRecordPop.vue';
import ProcChargeStartPop from './ProcChargeStartPop.vue';

const { vWarning, vSuccess, vInfo } = useAlertStore()
const dialog = useDialog();
const dialogRef = inject('dialogRef');
const isStarted = ref(false)
const prodList = ref([])
const workRecordList = ref([])
const form = reactive({
    workProcId: '',
    workBatchId: '',
    workOrderDateSeq: '',
    areaCd: '',
    makeNo : '',
    lotNo: '',
    itemName: '',
    itemCd: '',
    testNo: '',
    expiryDate: '',

    procCd : 'PRC004'
});

// 작업지시정보
const itemInfo = reactive({
    itemCd: '',
    itemName: '',
    clientName: '',
    storageName: '',
    prodType: '',
    workDate: '',
    orderQty: '',
    makeNo: '',
    workFlow: '',
    woodenPattern: '',
    stdWeight: '',
    sheetSpec: '',
    sheetStacking: '',
    stdSize: '',
    displayYield: '',
    stdYield: '',
});

// 투입자재정보
const createProdRow = (i = 0) => ({
    no: i + 1,
    testNos: '',
    matName: '',
    spec: '',
    exAppearance: '',
    packingSpecValue: '',
    packingSpecUnit: '',
    reqQty: '',
    useQty: '',
    badQty: '',
    workBadQty: '',
    unit: '',
    workProcId: form.workProcId,
});

// 작업수행정보
const createWorkRecordRow = (i = 0) => ({
    no: i + 1,
    workDate: '',
    workStartTime: '',
    workEndTime: '',
    workerCnt: '',
    useQty: '',
    prodQty: '',
    workProcId: form.workProcId,
    itemCd: form.itemCd,
    wokRecordId: '',
});

// 종합정보
const workOrderInfo = reactive({
    totUseQty: '',
    managerName: '',
    prodYield: '',
    prodQty: '',
    etc: '',
    memo: '',
});

// 기록서 엑셀 다운로드
const downloadExcel = async () =>{
    const params = {
        itemCd : itemInfo.itemCd,
        procCd : 'PRC004',
        workProcId : form.workProcId,
    }

    try {
        const blob = await ApiProc.downloadRecord(params)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${workOrderInfo.makeNo}_[충전제풐]_${form.itemName}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
    } catch {
        vError('엑셀 다운로드 실패')
    }
}

const saveInfo = () => {

};

//투입정보
const selectRowClick = (row) => {
    dialog.open(ProdUsePop2, {
        props: {
            header: '사용량 입력',
            modal: true,
            draggable: false,
            style: {
                width: '1800px',
                height: '400px'
            },
            contentStyle: {
                height: 'calc(100% - 60px)',
                overflow: 'auto'
            },
            breakpoints: {
                '1280px': '90vw',
                '960px': '95vw'
            }
        },
        data:{
            row,
            itemCd: form.itemCd,
            itemName: form.itemName,
            areaCd: form.areaCd,
            procCd: form.procCd,
        }
        ,onClose: (event) =>{
            if (event) {
                row.testNos = event.data.testNos
                row.reqQty = event.data.reqQty
                row.useQty = event.data.useQty
                row.badQty = event.data.badQty
                row.workBadQty = event.data.workBadQty

                workOrderInfo.useQty = event.data.totUseQty
            }
            callChargeInfo()
        }
    })
}

const popupConfig = {
    S: {
        title: '충전시작',
        component: ProcChargeStartPop,
        width: '520px',
        height: '390px'
    },
    B: {
        title: '바코드',
        component: QrCodePop,  // 실제 컴포넌트로 교체
        width: '1200px',
        height: '300px'
    },
    W: {
        title: '작업수행정보',
        component: WorkRecordPop,
        width: '530px',
        height: '250px'
    }
}

const openPop = (type) => {
    const config = popupConfig[type]
    if (!config?.component) return

    let itemList = []

    itemList.push({
        itemCd: itemInfo.itemCd,
        itemName: itemInfo.itemName,
        lotNo: workOrderInfo.lotNo,
        testNo: workOrderInfo.testNo,
        qty: 0,
        printCnt: 1,
    })

    dialog.open(config.component, {
        props: {
            header: config.title,
            modal: true,
            draggable: false,
            style: {
                width: config.width,
                height: config.height
            },
            contentStyle: {
                height: 'calc(100% - 60px)',
                overflow: 'auto'
            },
            breakpoints: {
                '1280px': '90vw',
                '960px': '95vw'
            }
        },
        data: {
            form,
            itemList,
        },
        onClose: (event) =>{
            if ( type === 'S' ){
                //재조회
                callChargeInfo()
            } else if ( type === 'W' ){
                //작업수행 정보
                callChargeInfo()
            }
        }
    })
};

const confirm = useConfirm()
const workComplete = () =>{
    if(!checkComplete()) return

    confirm.require({
        header: '충전완료 확인',
        message: '충전을을 완료하고, 제조출고를 진행하시겠습니까?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try{
                const params = {
                    procStatus: '42',
                    batchStatus: '42',
                    workProcId: form.workProcId,
                    workBatchId: form.workBatchId,
                    procCd: form.procCd,
                }
                //console.log('params', params)
                const res = await ApiProc.completeCharge(params)
                vSuccess('정상적으로 충전완료 처리하였습니다!')
                closeDialog()
            }catch(err){
                handleApiError(err)
            }
        }
    });
}

const checkComplete = () =>{
    if (workRecordList.value.length === 0 ) {
        vWarning('작업수행정보가 없습니다.')
        return false
    }
    // 그 중 testNos 없는 것 체크
    if ( prodList.value.filter(row => row.matName).some(row => !row.testNos) ){  return false}

    return true
}

const fillRows = (list = [], rowCount, createRow) => {
    return Array.from({ length: rowCount }, (_, i) => ({
        ...createRow(i),
        ...(list[i] || {}),
        no: i + 1, // 번호 강제 유지
    }));
};

const callChargeInfo = async () =>{
    const params = {
        workProcId: dialogRef.value.data.workProcId,
        procCd: dialogRef.value.data.procCd,
        itemCd: dialogRef.value.data.itemCd
    };

    const res = await ApiProc.getProcProdInfo(params);

    Object.assign(itemInfo, res.itemInfo)
    Object.assign(workOrderInfo, res.workOrderProcInfo)
    prodList.value = fillRows(res.prodList, 10, createProdRow);
    workRecordList.value = fillRows(res.workRecordList, 5, createWorkRecordRow);

    form.areaCd = workOrderInfo.areaCd
    form.lotNo = workOrderInfo.lotNo
    form.workOrderDateSeq = workOrderInfo.workOrderDateSeq
    form.makeNo = workOrderInfo.makeNo
    form.workProcId = workOrderInfo.workProcId
    form.workBatchId = workOrderInfo.workBatchId
    form.itemName = itemInfo.itemName
    form.itemCd = itemInfo.itemCd


    if (workOrderInfo.procStatus === '00'){
        isStarted.value = true
    }
}

onMounted( () => {
    callChargeInfo()
});

const closeDialog = () => {
    dialogRef.value.close();
};
</script>

<style scoped>
.pop-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 15px;
    background: #fff;
}
/* 전체 내용을 2% 축소 */
.pop-body {
    flex: 1 1 auto;
    overflow: hidden;
    padding: 1px 4px 2px;
}

.pop-footer {
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

:deep(.pop-footer .p-button) {
    padding: 0.5rem 0.9rem;
    font-size: 15px;
}

.mt-3 {
    margin-top: 0.5rem !important;
}
</style>
