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
                        v-model="form.areaCd"
                        :options="areaCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 120px"
                    />
                    <label>구역(공장)</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" style="width: 180px"/>
                    <label>품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" style="width: 120px" />
                    <label>품목코드</label>
                </FloatLabel>
                <div class="flex items-center gap-2">
                    <Button rounded  icon="pi pi-chevron-left" class="tw-ml-5 p-button-sm" @click="searchDateAdd(-1)" type="button"/>
                    <Calendar
                        ref="val_stdDate"
                        v-model="form.stdDate"
                        showIcon
                        dateFormat="yy-mm-dd"
                        placeholder="기준일자"
                        class="tw-w-32 tw-ml-3 tw-mt-1 tw-mr-3"
                    />
                    <Button rounded icon="pi pi-chevron-right" class="tw-mr-5 p-button-sm" @click="searchDateAdd(1)" type="button" />
                </div>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600"/>
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"/>
</div>
<div>
    <DataTable
        ref="dt"
        :value="useByM1List"
        paginator
        :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="table-layout: fixed;"
        class="my-table"
    >
        <Column field="itemCd"      header="품목코드"  frozen :style="{ width: '110px', textAlign:'center'}" />
        <Column field="itemName"    header="품목명"  frozen :style="{ width: '280px'}" />
        <Column field="testNo"      header="시험번호"  frozen :style="{ width: '110px', textAlign:'center'}" />
        <Column field="expiryDate"  header="사용기한" frozen :style="{ width: '110px', textAlign:'center'}" />
        <Column field="remainingDay" header="잔여일" frozen :style="{ width: '90px', textAlign:'right'}" />
        <Column field="totQty"      header="합계" frozen :style="{ width: '100px', textAlign:'right'}">
            <template #body="slotProps">{{ formatNumber(slotProps.data.totQty) }}</template>
        </Column>
        <!-- 창고 동적 컬럼 -->
        <Column
            v-for="col in dynamicColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :style="{ width: '120px', textAlign:'right'}"
            >
            <template #body="slotProps">
                {{ formatNumber(slotProps.data[col.field]) }}
            </template>
        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { addDay, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { computed, onMounted, reactive, ref } from 'vue';

const dt = ref(null);

const areaCds = ref([]);
const useByM1List = ref([]);
const dynamicColumns = ref([]);

const totalCount = computed(() => {
    return Array.isArray(useByM1List.value) ? useByM1List.value.length : 0;
});

const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST(),
});

const handleDateChange = () => {

};

const formatNumber = (value) => {
    const num = Number(value ?? 0);
    return num.toLocaleString();
};

const srhList = async () => {
    const params = {
        ...form
    };

    const result = await ApiStock.getUseByM1List(params);

    dynamicColumns.value = result.dynamicColumns ?? [];
    useByM1List.value = result.rows ?? [];
};

const searchDateAdd = (day) => {
    form.stdDate = addDay(form.stdDate, day);
};

onMounted(async () => {
    areaCds.value = await ApiCommon.getCodeList('area');
    await srhList();
});

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '재고관리' },
    { label: '사용기한(원재료)' },
    { label: '사용기한(원재료목록)' },
]);

const downloadExcel = () => {
    const fixedColumns = [
        { field: 'rowNum', header: 'No.' },
        { field: 'itemCd', header: '품목코드' },
        { field: 'itemName', header: '품목명' },
        { field: 'testNo', header: '시험번호' },
        { field: 'expiryDate', header: '사용기한' },
        { field: 'remainDate', header: '잔여일' },
        { field: 'totQty', header: '합계' },
    ];

    const excelColumns = [
        ...fixedColumns,
        ...dynamicColumns.value
    ];

    const excelRows = useByM1List.value.map((row, index) => ({
        rowNum: index + 1,
        ...row
    }));

    exportToExcel(excelRows, '사용기한(원재료) 리스트', excelColumns);
};
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: monaco, Consolas;
}
</style>
