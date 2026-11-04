
<template>
<Breadcrumb :home="home" :model="items"/>

<div>
    <div class="mt-2 mb-3 flex gap-2">
        <Button label="품목추가" @click="openPop"/>
        <Button label="초기화" icon="pi pi-refresh" severity="secondary" type="button" @click="allClear" />
        <Button label="계산하기" severity="info" @click="bomCalculation"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
    </div>
</div>

<!-- 상단 BOM 리스트 -->
<div class="table-wrapper">
    <DataTable
        v-model:selection="selectedItem"
        :value="itemBomList"
        selection-mode="multiple"
        data-key="rowId"
        class="my-table bom-table"
        scrollable
        scrollHeight="flex"
        :tableStyle="{ width: '100%', minWidth: '0', tableLayout: 'fixed' }"
        showGridlines
    >
        <Column
            selectionMode="multiple"
            headerStyle="width: 35px"
            style="width: 35px; text-align: center;"
        />

        <Column field="itemCd" header="품목코드"
            :style="{ width: '105px', textAlign: 'center' }" />

        <Column field="bomVer" header="BOM버전"
            :style="{ width: '105px', textAlign: 'center' }" />

        <Column field="itemName" header="품목명"
            :style="{ width: '450px' }" />

        <Column field="unit" header="단위"
            :style="{ width: '55px', textAlign: 'center' }" />

        <Column
            field="qty"
            header="생산량"
            :style="{ width: '130px' }"
            :bodyStyle="{ padding: '0', textAlign: 'right' }"
            :headerStyle="{ padding: '0' }"
        >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.qty"
                    class="w-full"
                    :min="0"
                    size="small"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '100%', textAlign: 'right' }"
                />
            </template>
        </Column>

        <Column field="etc" header="비고"
            :style="{ width: '350px', textAlign: 'left' }" />

        <Column field="actions" header="-"
            :style="{ width: '40px', textAlign: 'center' }"
        >
            <template #body="slotProps">
                <i
                    class="pi pi-trash cursor-pointer"
                    @click="removeRow(slotProps.index)"
                ></i>
            </template>
        </Column>
    </DataTable>
</div>

<!-- 하단 재고 및 소요량 리스트 -->
<div class="stock-table-wrapper">
    <DataTable
        ref="dt"
        v-model:first="first"
        v-model:selection="selectedItem"
        :value="itemStockList"
        data-key="itemCd"
        class="my-table"
        scrollHeight="flex"
        showGridlines
        scrollable
    >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>

        <Column field="itemCd" header="품목코드"
            :style="{ width: '120px', textAlign: 'center'}" />

        <Column field="itemTypeName" header="품목구분"
            :style="{ width: '80px', textAlign: 'center'}" />

        <Column field="itemName" header="품목명"
            :style="{ width: '300px'}" />

        <Column field="spec" header="규격"
            :style="{ width: '50px', textAlign: 'center'}" />

        <Column field="realStockQty" header="재고수량(A)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.realStockQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="reserveStockQty" header="발주(입고예정)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.reserveStockQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="reqQty" header="소요량(B)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.reqQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="differenceQty" header="차이(A-B)"
            :style="{ width: '130px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.differenceQty).toLocaleString() }}
            </template>
        </Column>

        <Column field="customerName" header="구매처"
            :style="{ width: '200px'}" />

        <Column field="orderType" header="사급/자급"
            :style="{ width: '100px', textAlign: 'center'}" />

        <Column field="inPrice" header="단가"
            :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">
                {{ Number(slotProps.data.inPrice).toLocaleString() }}
            </template>
        </Column>
    </DataTable>
</div>

<Dialog
    v-model:visible="bomDialog"
    header="품목조회"
    modal
    :draggable="false"
    :resizable="false"
>
    <BomMultiListPop
        :typeCd="typeCd"
        @selected="handleSelect"
        @close="bomDialog=false"
    />
</Dialog>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { exportToExcel } from '@/util/exportToExcel';
import BomMultiListPop from '@/views/lab/bom/BomMultiListPop.vue';
import { ref } from 'vue';

const { vInfo, vWarning } = useAlertStore()
let rowIdSeq = 0
const first = ref(0)
const bomDialog = ref(false)
const selectedItem = ref([])
const itemBomList = ref([])
const itemStockList = ref([])
const typeCd = ref('M3')
const dt = ref(null)

const removeRow = (index) => {
    itemBomList.value.splice(index, 1)
}

const openPop = () => {
    bomDialog.value = true
}

const handleSelect = (rows) => {
    if (!Array.isArray(rows)) return;
    addRows(rows)
}

// 반제품에 대한 소요량 계산(원재료)
const bomCalculation = async () => {
    const zeroQtyItem = itemBomList.value.find(item => Number(item.qty) === 0);
    if (zeroQtyItem) {
        vInfo("제조량이 0인 품목이 있습니다. 제조량을 입력하세요.");
        return false;
    }

    itemStockList.value = await ApiMat.getItemStockList(itemBomList.value);
}

const allClear = () => {
    rowIdSeq = 0
    selectedItem.value = []
    itemBomList.value = []
    itemStockList.value = []
}

const addRows = (rows) => {
    const rowItem = rows.map((o, index) => ({
        rowId: ++rowIdSeq,
        itemCd: o.itemCd,
        bomVer: o.bomVer,
        itemName: o.itemName,
        unit: o.unit,
        qty: 0,
        etc: o.etc,
        bomId: o.bomId,
    }));

    if (itemBomList.value.length > 0) {
        itemBomList.value.push(...rowItem);
    } else {
        itemBomList.value = [...rowItem];
    }
}

/**
 * title
 */
const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '제조관리' },
    { label: '소요량계산(원재료)' },
]);

const downloadExcel = () => {
    const cols = dt.value?.columns ?? [];

    if (!cols.length) {
        console.warn("No Columns Found");
        return;
    }
    exportToExcel(itemStockList.value, "소요량계산(원재료) 리스트", cols);
}
</script>

<style scoped>
/* 상단 BOM 테이블 영역 */
.table-wrapper {
    width: 1300px;
    max-width: 100%;
    height: 200px;
    min-height: 0;
    margin-bottom: 20px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

/* 하단 테이블 영역 */
.stock-table-wrapper {
    width: 100%;
    height: 570px;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* DataTable 자체 높이 */
:deep(.table-wrapper .p-datatable),
:deep(.stock-table-wrapper .p-datatable) {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* 상단 스크롤 영역 */
:deep(.table-wrapper .p-datatable-table-container) {
    width: 100%;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    scrollbar-gutter: stable;
}

/* 상단 내부 테이블 너비 강제 */
:deep(.bom-table .p-datatable-table) {
    width: 100% !important;
    min-width: 0 !important;
    table-layout: fixed !important;
}

/* 상단 컬럼의 최소 너비 제한 해제 */
:deep(.bom-table .p-datatable-thead > tr > th),
:deep(.bom-table .p-datatable-tbody > tr > td) {
    min-width: 0 !important;
    box-sizing: border-box;
    overflow-wrap: anywhere;
}

/* 상단 입력 컴포넌트 너비 제한 */
:deep(.bom-table .p-inputnumber) {
    width: 100%;
    min-width: 0;
}

:deep(.bom-table .p-inputnumber-input) {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
}

/* 하단 테이블 내부 스크롤 */
:deep(.stock-table-wrapper .p-datatable-table-container) {
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    overflow-y: auto !important;
    overflow-x: auto !important;
}

/* 기존 버튼 스타일 */
.btn-del {
    background-color: #ff6b6b !important;
    color: white !important;
}

/* 기존 헤더 스타일 */
:deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    padding: 8px 8px 0.3rem 0.3rem;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: Lobo, Consolas;
}
</style>
