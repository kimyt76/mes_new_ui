<template>
    <div class="usage-page">
        <div class="page-title">
            부자재 일일 입고 및 사용내역
        </div>
        <!-- 1. 원료 입고 -->
        <section class="list-section">
            <div class="section-header section-blue">
                <h5>1. 당일 부자재 입고 현황</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('receipt')"/>
            </div>
            <DataTable
                :value="receiptList"
                class="my-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <Column field="date" header="입고일자" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.date" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="seq" header="NO" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber v-model="data.seq" :useGrouping="false" class="cell-number" inputClass="text-center"/>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemCd" header="원료코드" style="width: 120px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="itemName" header="원료명" style="min-width: 230px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="unit" header="단위" style="width: 80px">
                    <template #body="{ data }">
                        <Select
                            v-model="data.unit"
                            :options="unitOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="cell-select"
                        />
                    </template>
                </Column>
                <Column field="receiptQty" header="입고량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.receiptQty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>

                <Column field="unitPrice" header="단가" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.unitPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>

                <Column field="amount" header="금액" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="areaName" header="입고창고" style="min-width: 230px">
                    <template #body="{ data }">
                        <InputText v-model="data.areaName" class="cell-input" />
                    </template>
                </Column>
                <Column field="remark" header="비고" style="min-width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.remark" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('receipt', index)"/>
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 원료 입고 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            입고량:
                            {{ formatNumber(receiptTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(receiptTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 2. 당일 부자재 반품 내역 -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>2. 당일 부자재 반품 내역</h5>
                <Button
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('return')"
                />
            </div>
            <DataTable
                :value="returnList"
                class="my-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="date" header="일자" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.date" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="seq" header="순번" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.seq"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column field="itemCd" header="원료코드" style="width: 120px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>

                <Column field="itemName" header="원료명" style="min-width: 250px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>

                <Column field="unit" header="단위" style="width: 80px">
                    <template #body="{ data }">
                        <Select
                            v-model="data.unit"
                            :options="unitOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="cell-select"
                        />
                    </template>
                </Column>
                <Column field="returnQty" header="반품량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.returnQty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>

                <Column field="remark" header="비고" style="min-width: 250px">
                    <template #body="{ data }">
                        <InputText v-model="data.remark" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            @click="removeRow('return', index)"
                        />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 반품 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 3. 당일 부자재 불량 및 폐기 내역-->
        <section class="list-section">
            <div class="section-header section-gray">
                <h5>3. 당일 부자재 불량 및 폐기 내역</h5>
                <Button
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('discard')"
                />
            </div>
            <DataTable
                :value="discardList"
                class="my-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="date" header="일자" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.date" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="seq" header="순번" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.seq"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column field="itemCd" header="원료코드" style="width: 120px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>

                <Column field="itemName" header="원료명" style="min-width: 250px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>

                <Column field="unit" header="단위" style="width: 80px">
                    <template #body="{ data }">
                        <Select
                            v-model="data.unit"
                            :options="unitOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="cell-select"
                        />
                    </template>
                </Column>

                <Column field="discardQty" header="폐기량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.discardQty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>

                <Column field="remark" header="비고" style="min-width: 250px">
                    <template #body="{ data }">
                        <InputText v-model="data.remark" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            @click="removeRow('discard', index)"
                        />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 폐기 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 4. 제품별 부자재 사용량 -->
        <section class="list-section">
            <div class="section-header section-yellow">
                <h5>4. 제품별 부자재 사용량</h5>
                <Button
                    label="행 추가"
                    icon="pi pi-plus"
                    size="small"
                    class="add-button"
                    @click="addRow('usage')"
                />
            </div>
            <DataTable
                :value="usageList"
                class="my-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="date" header="일자" frozen style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.date" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="seq" header="순번" frozen style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.seq"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column field="itemCd" header="원료코드" frozen style="width: 120px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>

                <Column field="itemName" header="원료명" style="min-width: 230px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>

                <Column field="productName" header="생산품목" style="min-width: 280px">
                    <template #body="{ data }">
                        <InputText v-model="data.productName" class="cell-input" />
                    </template>
                </Column>

                <Column field="lotNo" header="LOT NO." style="width: 140px">
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="unit" header="단위" style="width: 80px">
                    <template #body="{ data }">
                        <Select
                            v-model="data.unit"
                            :options="unitOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="cell-select"
                        />
                    </template>
                </Column>

                <Column field="usageQty" header="사용량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.usageQty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>

                <Column field="managerName" header="사용자" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.managerName" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="remark" header="비고" style="min-width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.remark" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" frozen style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            @click="removeRow('usage', index)"
                        />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 부자재 사용 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            사용량:
                            {{ formatNumber(usageTotalQty) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>
        <div class="bottom-buttons">
            <Button
                label="저장"
                icon="pi pi-save"
                @click="save"
            />

            <Button label="초기화"  icon="pi pi-refresh" severity="secondary" outlined @click="reset" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const unitOptions = [
    { label: 'kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'L', value: 'L' },
    { label: 'mL', value: 'mL' },
    { label: 'EA', value: 'EA' },
]

const receiptList = ref([])
const returnList = ref([])
const discardList = ref([])
const usageList = ref([])
const stockList = ref([])
const ospList = ref([])

const createReceiptRow = () => ({
    date: '',
    seq: receiptList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    receiptQty: 0,
    unitPrice: 0,
    remark: '',
})

const createReturnRow = () => ({
    date: '',
    seq: returnList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    returnQty: 0,
    remark: '',
})

const createDiscardRow = () => ({
    date: '',
    seq: discardList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    discardQty: 0,
    remark: '',
})

const createUsageRow = () => ({
    date: '',
    seq: usageList.value.length + 1,
    itemCd: '',
    itemName: '',
    productName: '',
    lotNo: '',
    unit: 'kg',
    usageQty: 0,
    managerName: '',
    remark: '',
})

const createStockRow = () => ({
    date: '',
    seq: stockList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    prevQty: 0,
    receiptQty: 0,
    usageQty: 0,
    remark: '',
})
const createOspRow = () => ({
    date: '',
    seq: ospList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    prevQty: 0,
    receiptQty: 0,
    usageQty: 0,
    remark: '',
})

const listMap = {
    receipt: receiptList,
    return: returnList,
    discard: discardList,
    usage: usageList,
    stock: stockList,
    osp: ospList,
}

const addRow = (type) => {
    const rowFactoryMap = {
        receipt: createReceiptRow,
        return: createReturnRow,
        discard: createDiscardRow,
        usage: createUsageRow,
        stock: createStockRow,
        osp: createOspRow,
    }

    const targetList = listMap[type]
    const rowFactory = rowFactoryMap[type]

    if (!targetList || !rowFactory) return

    targetList.value.push(rowFactory())
}

const removeRow = (type, index) => {
    const targetList = listMap[type]

    if (!targetList || index < 0) return

    targetList.value.splice(index, 1)

    targetList.value.forEach((row, rowIndex) => {
        row.seq = rowIndex + 1
    })
}

const calculateAmount = (row) => {
    const qty = Number(row.receiptQty) || 0
    const unitPrice = Number(row.unitPrice) || 0

    return qty * unitPrice
}

const calculateStockQty = (row) => {
    const prevQty = Number(row.prevQty) || 0
    const receiptQty = Number(row.receiptQty) || 0
    const usageQty = Number(row.usageQty) || 0

    return prevQty + receiptQty - usageQty
}

const receiptTotalQty = computed(() => {
    return receiptList.value.reduce(
        (sum, row) => sum + (Number(row.receiptQty) || 0),
        0,
    )
})

const receiptTotalAmount = computed(() => {
    return receiptList.value.reduce(
        (sum, row) => sum + calculateAmount(row),
        0,
    )
})

const usageTotalQty = computed(() => {
    return usageList.value.reduce(
        (sum, row) => sum + (Number(row.usageQty) || 0),
        0,
    )
})

const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('ko-KR', {
        maximumFractionDigits: 3,
    })
}

const save = async () => {
    const params = {
        receiptList: receiptList.value,
        returnList: returnList.value,
        discardList: discardList.value,
        usageList: usageList.value,
        stockList: stockList.value,
        ospList: ospList.value,
    }

    console.log('저장 데이터', params)
    // 실제 API 호출
    // await ApiMaterial.saveDailyMaterialUsage(params)
}

const reset = () => {
    receiptList.value = []
    returnList.value = []
    discardList.value = []
    usageList.value = []
    stockList.value = []
    ospList.value = []
}
</script>

<style scoped>
.usage-page {
    width: 100%;
    min-width: 1200px;
    padding: 12px;
    background: #ffffff;
}

.page-title {
    padding: 10px 12px;
    margin-bottom: 12px;
    border: 1px solid #cfcfcf;
    border-left: 5px solid #607d8b;
    background: #fafafa;
    font-size: 20px;
    font-weight: 700;
}

.list-section {
    margin-bottom: 18px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 38px;
    padding: 4px 8px;
    border: 1px solid #bdbdbd;
    border-bottom: 0;
}

.section-header h5 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
}

.section-blue {
    background: #dceef8;
}

.section-orange {
    background: #fbe6d5;
}

.section-gray {
    background: #eeeeee;
}

.section-yellow {
    background: #fff2cc;
}

.add-button {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
}

.cell-input,
.cell-select,
.cell-number {
    width: 100%;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.empty-message {
    padding: 18px;
    text-align: center;
    color: #777777;
}

.table-summary {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 40px;
    padding-right: 15px;
    font-weight: 700;
}

.bottom-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 0 30px;
}

/* DataTable 전체 글꼴 및 행 높이 */
:deep(.my-table) {
    font-size: 12px;
}

:deep(.my-table .p-datatable-table) {
    min-width: 100%;
    table-layout: fixed;
}

:deep(.my-table .p-datatable-thead > tr > th) {
    height: 31px;
    padding: 3px 5px;
    background: #f5f5f5;
    border-color: #777777;
    color: #222222;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
}

:deep(.my-table .p-datatable-tbody > tr > td) {
    height: 30px;
    padding: 1px 3px;
    border-color: #999999;
    vertical-align: middle;
}

:deep(.my-table .p-inputtext) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}

:deep(.my-table .p-inputnumber) {
    width: 100%;
}

:deep(.my-table .p-inputnumber-input) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}

:deep(.my-table .p-select) {
    width: 100%;
    height: 26px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
}

:deep(.my-table .p-select-label) {
    padding: 4px 5px;
    font-size: 12px;
}

:deep(.my-table .p-select-dropdown) {
    width: 24px;
}

:deep(.my-table .readonly-input input) {
    background: #f3f3f3;
    color: #333333;
    font-weight: 600;
}

:deep(.my-table .p-datatable-footer) {
    padding: 7px 10px;
    border-color: #777777;
    background: #fafafa;
    font-size: 12px;
}

:deep(.my-table .p-button.p-button-icon-only) {
    width: 25px;
    height: 25px;
}
</style>
