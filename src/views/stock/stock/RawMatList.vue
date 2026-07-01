<template>
<Breadcrumb :home="home" :model="items"/>

<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DateRangePicker
                    v-model:startDate="form.strDate"
                    v-model:endDate="form.endDate"
                    @change="handleDateChange"
                />

                <FloatLabel variant="on">
                    <Select
                        v-model="form.itemGrp1"
                        :options="itemGrp1s"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 120px"
                    />
                    <label>관리구분</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" style="width: 180px"/>
                    <label>품목명</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" style="width: 120px"/>
                    <label>품목코드</label>
                </FloatLabel>

                <Button
                    label="검색"
                    icon="pi pi-search"
                    type="submit"
                    class="bg-blue-500 text-white hover:bg-blue-600"
                />
            </div>
        </template>
    </Toolbar>
</form>

<div class="flex items-center justify-end gap-2 mb-2">
    <Button
        label="엑셀"
        icon="pi pi-file-excel"
        severity="success"
        @click="downloadExcel"
    />
</div>

<DataTable
    ref="dt"
    :value="rawMatList"
    scrollable
    scrollHeight="700px"
    showGridlines
    tableStyle="min-width:180rem; table-layout: fixed;"
    class="my-table"
    :virtualScrollerOptions="{ itemSize: 34 }"
>
    <Column field="orderType" header="관리구분" frozen :style="center120" :headerStyle="headerStyle"/>
    <Column field="itemCd" header="품목코드" frozen :style="center150" :headerStyle="headerStyle"/>
    <Column field="itemName" header="품목명" frozen :style="{ width: '400px' }"  :headerStyle="headerStyle"/>
    <Column field="customerName" header="납품업체" frozen :style="{ width: '300px' }" :headerStyle="headerStyle"/>
    <Column field="inPriceText" header="단가" frozen :style="right100" :headerStyle="headerStyle"/>
    <Column field="basicQtyText" header="기초재고수량" :style="right120" :headerStyle="headerStyle"/>
    <Column field="basicAmtText" header="기초재고금액" :style="right120" :headerStyle="headerStyle"/>
    <Column field="asQtyText" header="입고수량"     :style="right100" :headerStyle="headerStyle"/>
    <Column field="asAmtText" header="입고금액"     :style="right100" :headerStyle="headerStyle"/>
    <Column field="esQtyText" header="출고수량"     :style="right100" :headerStyle="headerStyle"/>
    <Column field="esAmtText" header="출고금액"     :style="right100" :headerStyle="headerStyle"/>
    <Column field="psQtyText" header="반품조정수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="tsQtyText" header="검사샘플수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="qsQtyText" header="연구샘플수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="ssQtyText" header="실사조정수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="vsQtyText" header="과입조정수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="wsQtyText" header="계정변경수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="xsQtyText" header="매출조정수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="usQtyText" header="사용조정수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="finalQtyText" header="기말재고수량" :style="right100" :headerStyle="headerStyle"/>
    <Column field="finalAmtText" header="기말재고금액" :style="right100" :headerStyle="headerStyle"/>
</DataTable>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';

const dt = ref(null);
const itemGrp1s = ref([]);
const rawMatList = ref([]);

const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    itemGrp1: '',
    itemTypeCd: 'M1',
    itemName: '',
    itemCd: '',
});

const headerStyle = {
    backgroundColor: '#BCAAA4',
    color: 'white',
    fontSize: '14px',
    textAlign: 'center',
    fontFamily: 'monaco, Consolas',
    padding: '0.4rem 0.1rem'
};

const center120 = { width: '120px', textAlign: 'center' };
const center150 = { width: '150px', textAlign: 'center' };
const right100 = { width: '100px', textAlign: 'right' };
const right120 = { width: '120px', textAlign: 'right' };

const formatNumber = (value) => {
    return Number(value ?? 0).toLocaleString();
};

const makeDisplayRow = (row) => ({
    ...row,

    inPriceText: formatNumber(row.inPrice),

    basicQtyText: formatNumber(row.basicQty),
    basicAmtText: formatNumber(row.basicAmt),

    asQtyText: formatNumber(row.asQty),
    asAmtText: formatNumber(row.asAmt),

    esQtyText: formatNumber(row.esQty),
    esAmtText: formatNumber(row.esAmt),

    psQtyText: formatNumber(row.psQty),
    tsQtyText: formatNumber(row.tsQty),
    qsQtyText: formatNumber(row.qsQty),
    ssQtyText: formatNumber(row.ssQty),
    vsQtyText: formatNumber(row.vsQty),
    wsQtyText: formatNumber(row.wsQty),
    xsQtyText: formatNumber(row.xsQty),
    usQtyText: formatNumber(row.usQty),

    finalQtyText: formatNumber(row.finalQty),
    finalAmtText: formatNumber(row.finalAmt),
});

const handleDateChange = () => {};

const srhList = async () => {
    const params = { ...form };
    const data = await ApiStock.getTranLedger(params);

    rawMatList.value = (data ?? []).map(makeDisplayRow);
};

onMounted(async () => {
    itemGrp1s.value = await ApiCommon.getCodeList('item_grp1');
});

const home = ref({
    icon: 'pi pi-home',
});

const items = ref([
    { label: '자재관리' },
    { label: '원재료수불부' },
    { label: '원재료수불부 목록' },
]);

const downloadExcel = () => {
    const cols = dt.value?.columns ?? [];

    if (!cols.length) {
        console.warn('No Columns Found');
        return;
    }

    exportToExcel(rawMatList.value, '원재료수불부 리스트', cols);
};
</script>

<style scoped>
:deep(.my-table.p-datatable .p-datatable-thead > tr > th) {
    background-color: #BCAAA4 !important;
    color: white !important;
    font-size: 14px;
    text-align: center;
    font-family: monaco, Consolas;
    padding: 0.3rem 0.4rem;
}

:deep(.p-datatable.my-table th) {
    background-color: #BCAAA4 !important;
    color: white !important;
}

::v-deep(.my-table .p-datatable-tbody > tr > td) {
    padding: 0.25rem 0.4rem;
    font-size: 13px;
    height: 34px;
}

::v-deep(.my-table .p-datatable-tbody > tr) {
    height: 34px;
}
</style>
