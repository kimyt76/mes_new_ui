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
                    <Select
                        v-model="form.itemTypeCd"
                        :options="itemTypeCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 120px"
                    />
                    <label>품목구분</label>
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
    :value="subMatList"
    scrollHeight="700px"
    scrollable
    showGridlines
    tableStyle="min-width:180rem; table-layout: fixed;"
    class="my-table"
    :virtualScrollerOptions="{ itemSize: 34 }"
>
    <Column field="orderType" header="관리구분" frozen :style="center90" :headerStyle="headerStyle" />
    <Column field="itemTypeName" header="품목구분" frozen :style="center90" :headerStyle="headerStyle" />
    <Column field="itemCd" header="품목코드" frozen :style="center130" :headerStyle="headerStyle" />
    <Column field="itemName" header="품목명" frozen :style="{ width: '430px' }" bodyClass="break-words" :headerStyle="headerStyle" />
    <Column field="customerName" header="납품업체" frozen :style="{ width: '250px' }" bodyClass="break-words" :headerStyle="headerStyle" />

    <Column field="inPriceText" header="단가" frozen :style="right100" :headerStyle="headerStyle" />

    <Column field="basicQtyText" header="기초재고수량" :style="right120" :headerStyle="headerStyle" />
    <Column field="basicAmtText" header="기초재고금액" :style="right120" :headerStyle="headerStyle" />

    <Column field="asQtyText" header="입고수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="asAmtText" header="입고금액" :style="right100" :headerStyle="headerStyle" />

    <Column field="esQtyText" header="출고수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="esAmtText" header="출고금액" :style="right100" :headerStyle="headerStyle" />

    <Column field="psQtyText" header="반품조정수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="tsQtyText" header="검사샘플수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="qsQtyText" header="연구샘플수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="ssQtyText" header="실사조정수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="vsQtyText" header="과입조정수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="wsQtyText" header="계정변경수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="xsQtyText" header="매출조정수량" :style="right100" :headerStyle="headerStyle" />
    <Column field="usQtyText" header="사용조정수량" :style="right100" :headerStyle="headerStyle" />

    <Column field="finalQtyText" header="기말재고수량" :style="right120" :headerStyle="headerStyle" />
    <Column field="finalAmtText" header="기말재고금액" :style="right120" :headerStyle="headerStyle" />
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
const subMatList = ref([]);

const itemTypeCds = ref([
    { code: 'M2', codeNm: '부자재' },
    { code: 'M7', codeNm: '소모품' }
]);

const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    itemGrp1: '',
    itemTypeCd: 'M2',
    itemName: '',
    itemCd: '',
});

const headerStyle = {
    backgroundColor: '#BCAAA4',
    color: 'white',
    fontSize: '14px',
    textAlign: 'center',
    fontFamily: 'monaco, Consolas',
    padding: '0.3rem 0.4rem'
};

const center90 = { width: '90px', textAlign: 'center' };
const center130 = { width: '130px', textAlign: 'center' };
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

    subMatList.value = (data ?? []).map(makeDisplayRow);
};

onMounted(async () => {
    itemGrp1s.value = await ApiCommon.getCodeList('item_grp1');
});

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '자재관리' },
    { label: '부자재 수불부' },
    { label: '부자재 수불부 목록' },
]);

const downloadExcel = () => {
    const cols = dt.value?.columns ?? [];

    if (!cols.length) {
        console.warn('No Columns Found');
        return;
    }

    exportToExcel(subMatList.value, '부자재수불부 리스트', cols);
};
</script>

<style scoped>
::v-deep(.my-table .p-datatable-tbody > tr > td) {
    padding: 0.25rem 0.4rem;
    font-size: 13px;
    height: 34px;
}

::v-deep(.my-table .p-datatable-tbody > tr) {
    height: 34px;
}
</style>
