<template>
    <div class="prod-page">
        <div class="page-title"> 완제품 일일 외주 및 생산내역 </div>
        <!-- =========================================================
             1. 당일 완제품 입고 현황
        ========================================================== -->
        <section class="list-section">

            <div class="section-header section-blue">
                <h5>1. 당일 완제품 생산 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('in')" />
            </div>
            <DataTable
                :value="inList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="6" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(inTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(inTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="2" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="생산일자" style="width: 90px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                            readonly
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'itemCd')">
                            <InputText
                            v-model="data.itemCd"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'customerName')">
                            <InputText
                            v-model="data.customerName"
                            class="cell-input text-center"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'itemName')">

                            <InputText
                            v-model="data.itemName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="lotNo" header="LOT" style="width: 220px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'lotNo')">
                            <InputText v-model="data.lotNo" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('in', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 완제품 생산 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>


        <!-- =========================================================
             2. 당일 완제품 외주 생산 내역(판매단가)
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-lime">
                <h5>2. 당일 완제품 외주 생산 내역(판매단가)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('out')" />
            </div>
            <DataTable
                :value="outList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="6" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(outTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(outTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="3" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="입고일자" style="width: 90px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                            readonly
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'itemCd')">
                            <InputText
                            v-model="data.itemCd"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'customerName')">
                            <InputText
                            v-model="data.customerName"
                            class="cell-input text-center"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'itemName')">

                            <InputText
                            v-model="data.itemName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="lotNo" header="LOT" style="width: 220px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'lotNo')">
                            <InputText v-model="data.lotNo" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="storageName" header="입고창고" style="width: 200px; text-align: center" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'storageName')">
                            <InputText v-model="data.storageName" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'out', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('out', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 완제품 생산 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- =========================================================
             3. 당일 완제품 외주 생산 비용(외주단가)
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-lime">
                <h5>3. 당일 완제품 외주 생산 비용(외주단가)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('outExpense')" />
            </div>
            <DataTable
                :value="outExpenseList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="6" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(outExpenseTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(outExpenseTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="3" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="입고일자" style="width: 90px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                            readonly
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'itemCd')">
                            <InputText
                            v-model="data.itemCd"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'customerName')">
                            <InputText
                            v-model="data.customerName"
                            class="cell-input text-center"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'itemName')">

                            <InputText
                            v-model="data.itemName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="lotNo" header="LOT" style="width: 220px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'lotNo')">
                            <InputText v-model="data.lotNo" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="storageName" header="입고창고" style="width: 200px; text-align: center" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'storageName')">
                            <InputText v-model="data.storageName" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'outExpense', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('outExpense', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 완제품 생산 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>
        <!-- =========================================================
             4. 당일 완제품 불량 및 폐기 내역
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-yellow">
                <h5>4. 당일 완제품 불량 및 폐기 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('discard')" />
            </div>
            <DataTable
                :value="discardList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="5" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(discardTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(discardTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="2" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="불량일자" style="width: 90px" >
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'itemCd')">
                        <InputText v-model="data.itemCd" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'customerName')">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'itemName')">
                        <InputText v-model="data.itemName" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount1(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'etc')">
                        <InputText v-model="data.etc" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('discard', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 폐기 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- =========================================================
             5. 당일 완제품 출하 내역
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>5. 당일 완제품 출하 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('shipment')" />
            </div>
            <DataTable
                :value="shipmentList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="6" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(shipmentTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(shipmentTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="3" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="출하일자" style="width: 90px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                            readonly
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'itemCd')">
                            <InputText
                            v-model="data.itemCd"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'customerName')">
                            <InputText
                            v-model="data.customerName"
                            class="cell-input text-center"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'itemName')">

                            <InputText
                            v-model="data.itemName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="lotNo" header="LOT" style="width: 220px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'lotNo')">
                            <InputText v-model="data.lotNo" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="storageName" header="입고창고" style="width: 200px; text-align: center" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'storageName')">
                            <InputText v-model="data.storageName" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'shipment', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('shipment', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 완제품 생산 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- =========================================================
             6. 당일 완제품 반품 내역
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>6. 당일 완제품 반품 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('return')" />
            </div>
            <DataTable
                :value="returnList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="합계" :colspan="6" footerClass="summary-title-cell" />
                        <Column :footer="formatNumber(returnTotalQty)" footerClass="summary-value-cell" />
                        <Column footer="" />
                        <Column :footer="formatNumber(returnTotalAmount)" footerClass="summary-value-cell" />
                        <Column footer="" :colspan="3" />
                    </Row>
                </ColumnGroup>
                <Column field="dailyDate" header="반품일자" style="width: 90px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" style="width: 50px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'itemCd')">
                            <InputText
                            v-model="data.itemCd"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'customerName')">
                            <InputText
                            v-model="data.customerName"
                            class="cell-input text-center"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="itemName" header="품명" style="width: 300px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'itemName')">
                            <InputText
                            v-model="data.itemName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="lotNo" header="LOT" style="width: 220px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'lotNo')">
                            <InputText
                            v-model="data.lotNo"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="qty" header="수량[EA]" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'qty')">
                            <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'inPrice')">
                            <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가액" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="storageName" header="입고창고" style="width: 100px; text-align: center" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'storageName')">
                            <InputText
                            v-model="data.storageName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'return', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 45px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('return', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 반품 내역이 없습니다.
                    </div>
                </template>
            </DataTable>
        </section>


        <!-- =========================================================
             하단 버튼
        ========================================================== -->
        <div class="bottom-buttons">
            <Button v-if="isBtn" label="저장" icon="pi pi-save" @click="saveInfo" />
            <Button v-if="isBtn" label="종결" icon="pi pi-save" @click="updateEndYn" />
            <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
        </div>
    </div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase'
import { useAlertStore } from '@/stores/alert'
import { todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import { computed, inject, onMounted, reactive, ref, } from 'vue'

const isBtn = ref(true)
const { vSuccess, vInfo, } = useAlertStore()
const dialogRef = inject( 'dialogRef', null )
const form = reactive({
    dailyDate: null,
    itemTypeCd: 'M0',
    typeCd: 'S',
    endYn: '',
    dailyId: '',
})

/* =========================================================
   리스트
========================================================= */
const inList = ref([])
const outList = ref([])
const outExpenseList = ref([])
const discardList = ref([])
const shipmentList = ref([])
const returnList = ref([])

/* =========================================================
   삭제 ID 리스트
========================================================= */
const deleteInIds = ref([])
const deleteReturnIds = ref([])
const deleteDiscardIds = ref([])
const deleteOutIds = ref([])
const deleteOutExpenseIds = ref([])
const deleteShipmentIds = ref([])

/* =========================================================
   화면 로딩
========================================================= */
onMounted(async () => {
    try {

        form.dailyId = dialogRef.value?.data?.dailyId ?? null
        form.endYn = dialogRef.value?.data?.endYn ?? 'N'

        if (form.endYn === 'Y') {
            isBtn.value = false
        }

form.dailyId = 13
        const res = await ApiBase.getM0DailyReportInfo( form.dailyId )

        //console.log( 'M0 일일보고서 정보', res )

        if (res.dailyReportInfo) {
            Object.assign( form, res.dailyReportInfo )
        }

        inList.value = res.inList || []
        returnList.value = res.returnList || []
        discardList.value = res.discardList || []
        outExpenseList.value = res.outExpenseList || []
        shipmentList.value = res.shipmentList || []
        outList.value = res.outList || []

    } catch (error) {
        //console.error( '조회 중 오류 발생:', error )
        handleApiError(error)
    }
})

/* =========================================================
   종결
========================================================= */
const updateEndYn = async () => {
    try {
        const params = { dailyId: form.dailyId, endYn: 'Y', }
        await ApiBase.updateDailyReportEndYn( params )
        form.endYn = 'Y'
        isBtn.value = false

        vSuccess( '종결 처리되었습니다.' )
        closeDialog()
    } catch (err) {
        handleApiError(err)
    }
}

/* =========================================================
   신규 ROW
========================================================= */
const createInRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: inList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createOutRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: outList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createOutExpenseRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: outExpenseList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createShipmentRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: shipmentList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createReturnRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: returnList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createDiscardRow = () => ({
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(), orderDist: discardList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

/* =========================================================
   기본 리스트 Mapping
========================================================= */
const listMap = {
    in: inList,
    return: returnList,
    discard: discardList,
    out: outList,
    outExpense: outExpenseList,
    shipment: shipmentList,
}

const addRow = (type) => {
    const rowFactoryMap = {
        in: createInRow,
        return: createReturnRow,
        discard: createDiscardRow,
        out: createOutRow,
        outExpense: createOutExpenseRow,
        shipment: createShipmentRow,
    }

    const targetList = listMap[type]
    const rowFactory = rowFactoryMap[type]

    if ( !targetList || !rowFactory ) {
        return
    }

    targetList.value.push(
        rowFactory()
    )
}

/* =========================================================
   엑셀 붙여넣기
========================================================= */
const pasteColumnMap = {
    in: [ 'itemCd', 'customerName', 'itemName', 'lotNo', 'qty', 'inPrice', 'etc', ],
    out: [ 'itemCd', 'customerName', 'itemName', 'lotNo', 'qty', 'inPrice', 'storageName', 'etc', ],
    outExpense: [ 'itemCd', 'customerName', 'itemName', 'lotNo', 'qty', 'inPrice', 'storageName', 'etc', ],
    discard: [ 'itemCd', 'customerName', 'itemName', 'qty', 'inPrice', 'etc', ],
    shipment: [ 'itemCd', 'customerName', 'itemName', 'lotNo', 'qty', 'inPrice', 'storageName', 'etc', ],
    return: [ 'itemCd', 'customerName', 'itemName', 'lotNo', 'qty', 'inPrice', 'storageName', 'etc', ],
}

const numberPasteFields = [ 'qty', 'inPrice', ]

const handlePaste = ( event, type, startRowIndex, startField ) => {
    event.preventDefault()

    const text = event.clipboardData?.getData( 'text/plain' )

    if ( !text ) {
        return
    }

    const targetList = listMap[type]
    const columns = pasteColumnMap[type]

    if ( !targetList || !columns ) {
        return
    }

    const startColIndex = columns.indexOf( startField )

    if ( startColIndex < 0 ) {
        return
    }

    const pasteRows = text
        .replace( /\r/g, '' )
        .replace( /\n$/, '' )
        .split( '\n' )
        .map( row => row.split( '\t' ) )

    const rowFactoryMap = {
        in: createInRow,
        out: createOutRow,
        outExpense: createOutExpenseRow,
        discard: createDiscardRow,
        shipment: createShipmentRow,
        return: createReturnRow,
    }

    pasteRows.forEach( ( pasteRow, rowOffset ) => {
        const targetRowIndex = startRowIndex + rowOffset

        while ( targetList.value.length <= targetRowIndex ) {
            targetList.value.push( rowFactoryMap[type]() )
        }

        const targetRow = targetList.value[targetRowIndex]

        pasteRow.forEach( ( value, colOffset ) => {
            const field = columns[startColIndex + colOffset]

            if ( !field ) {
                return
            }

            if ( numberPasteFields.includes( field ) ) {
                const numberValue = String( value ).replace( /,/g, '' ).trim()
                targetRow[field] = numberValue === '' ? 0 : Number( numberValue ) || 0
            } else {
                targetRow[field] = value.trim()
            }
        } )
    } )

    targetList.value.forEach( ( row, index ) => {
        if ( 'orderDist' in row ) {
            row.orderDist = index + 1
        }
    } )
}

/* =========================================================
   삭제 ID Mapping
========================================================= */
const deleteIdMap = {
    in: {
        ids: deleteInIds,
        idField: 'dailyPackingId',
    },
    return: {
        ids: deleteReturnIds,
        idField: 'dailyPackingId',
    },
    discard: {
        ids: deleteDiscardIds,
        idField: 'dailyPackingId',
    },
    outExpense: {
        ids: deleteOutExpenseIds,
        idField: 'dailyPackingId',
    },
    out: {
        ids: deleteOutIds,
        idField: 'dailyPackingId',
    },
    shipment: {
        ids: deleteShipmentIds,
        idField: 'dailyPackingId',
    },
}


/* =========================================================
   일반 LIST 삭제
========================================================= */
const removeRow = ( type, index ) => {
    const targetList = listMap[type]
    const deleteInfo = deleteIdMap[type]

    if ( !targetList || index < 0 ) {
        return
    }

    const row = targetList.value[index]

    if (!row) {
        return
    }

    if (deleteInfo) {
        const deleteId = row[ deleteInfo.idField ]

        if ( deleteId != null && deleteId !== '' && !deleteInfo.ids.value.includes( deleteId ) ) {
            deleteInfo.ids.value.push(
                deleteId
            )
        }
    }

    targetList.value.splice( index, 1 )

    targetList.value.forEach(
        (row, rowIndex) => {
            row.orderDist = rowIndex + 1
        }
    )
}

/* =========================================================
   공급가액 계산
========================================================= */
const calculateAmount = (row) => {
    const qty = Number(row.qty) || 0
    const inPrice = Number(row.inPrice) || 0

    return ( qty * inPrice )
}
const calculateAmount1 = (row) => {
    const qty = Number(row.qty) || 0
    const inPrice = Number(row.inPrice) || 0

    return ( qty * inPrice )
}


/* =========================================================
   1. 생산 합계
========================================================= */
const inTotalQty = computed( () => {
        return inList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const inTotalAmount = computed( () => {
        return inList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount( row ) )
            }, 0
        )
    }
)

/* =========================================================
   2. 외주 생산 합계
========================================================= */
const outTotalQty = computed( () => {
        return outList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const outTotalAmount = computed( () => {
        return outList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount( row ) )
            }, 0
        )
    }
)

/* =========================================================
   3. 외주 생산 비용 합계
========================================================= */
const outExpenseTotalQty = computed( () => {
        return outExpenseList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const outExpenseTotalAmount = computed( () => {
        return outExpenseList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount( row ) )
            }, 0
        )
    }
)

/* =========================================================
   4. 불량 및 폐기 합계
========================================================= */
const discardTotalQty = computed( () => {
        return discardList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const discardTotalAmount = computed( () => {
        return discardList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount1( row ) )
            }, 0
        )
    }
)

/* =========================================================
   5. 출하 합계
========================================================= */
const shipmentTotalQty = computed( () => {
        return shipmentList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const shipmentTotalAmount = computed( () => {
        return shipmentList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount( row ) )
            }, 0
        )
    }
)

/* =========================================================
   6. 반품 합계
========================================================= */
const returnTotalQty = computed( () => {
        return returnList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.qty ) || 0 ) )
            }, 0
        )
    }
)

const returnTotalAmount = computed( () => {
        return returnList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateAmount( row ) )
            }, 0
        )
    }
)

/* =========================================================
   숫자 표시
========================================================= */
const formatNumber = ( value, fraction = 3 ) => {
    return Number(
        value || 0
    ).toLocaleString(
        'ko-KR',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits:
                fraction,
        }
    )
}

/* =========================================================
   저장
========================================================= */
const saveInfo = async () => {
    try {
        const params = {
            dailyReportInfo: form,
            inList: inList.value,
            outList: outList.value,
            outExpenseList: outExpenseList.value,
            discardList: discardList.value,
            shipmentList: shipmentList.value,
            returnList: returnList.value,
            deleteInIds: deleteInIds.value,
            deleteOutIds: deleteOutIds.value,
            deleteOutExpenseIds: deleteOutExpenseIds.value,
            deleteDiscardIds: deleteDiscardIds.value,
            deleteShipmentIds: deleteShipmentIds.value,
            deleteReturnIds: deleteReturnIds.value,
        }

        //console.log( '저장 데이터', params )
        await ApiBase.saveDailyReportM0( params )
        vSuccess( '저장되었습니다.' )
        closeDialog()
    } catch (error) {
        //console.error( '저장 중 오류 발생:', error )
        handleApiError( error )
    }
}

/* =========================================================
   닫기
========================================================= */
const closeDialog = () => {
    dialogRef.value.close()
}

/* =========================================================
   초기화
========================================================= */
const reset = () => {
    inList.value = []
    outList.value = []
    outExpenseList.value = []
    discardList.value = []
    shipmentList.value = []
    returnList.value = []
    deleteInIds.value = []
    deleteOutIds.value = []
    deleteOutExpenseIds.value = []
    deleteDiscardIds.value = []
    deleteShipmentIds.value = []
    deleteReturnIds.value = []
}

</script>


<style scoped>
.prod-page {
    width: 100%;
    padding: 4px;
    background: #ffffff;
}

.page-title {
    padding: 6px 8px;
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

.section-green {
    background: #e2f0d9;
}

.section-lime {
    background: #F0F4C3;
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

/* 합계 행 */
:deep(.my-table .p-datatable-tfoot > tr > td) {
    height: 31px;
    padding: 3px 5px;
    border-color: #777777;
    background: #f7f7f7;
}

:deep(.my-table .summary-title-cell) {
    background: #dceef8;
    color: #222222;
    font-weight: 700;
    text-align: center;
}

:deep(.my-table .summary-value-cell) {
    background: #fff2cc;
    color: #222222;
    font-weight: 700;
    text-align: right;
}

.bottom-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 0 30px;
}

/* =========================================================
   PrimeVue DataTable
========================================================= */
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

/* =========================================================
   4. 제품별 완제품 사용량
========================================================= */
.use-table-wrapper {
    width: 100%;
    max-height: 430px;
    overflow: auto;
    border: 1px solid #777;
}

.use-table {
    width: 100%;
    min-width: 1550px;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 12px;
}

.use-table thead {
    position: sticky;
    top: 0;
    z-index: 5;
}

.use-table th {
    height: 31px;
    padding: 3px 5px;
    border: 1px solid #777777;
    background: #f5f5f5;
    color: #222222;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
}

.use-table td {
    height: 30px;
    padding: 1px 3px;
    border: 1px solid #999999;
    background: #ffffff;
    vertical-align: middle;
}

.use-table .merge-cell {
    vertical-align: middle;
}

.use-table .number-cell {
    padding-right: 6px;
    text-align: right;
}

.use-table .calculated-cell {
    background: #fafafa;
}

.use-table .product-total-cell {
    background: #fafafa;
    font-weight: 700;
}

.use-table .total-title {
    text-align: center;
    font-weight: 700;
}

.use-table tfoot td {
    height: 32px;
    background: #fafafa;
    font-weight: 700;
    border-top: 2px solid #777;
}

/* =========================================================
   4번 테이블 PrimeVue Input
========================================================= */
.use-table :deep(.p-inputtext) {
    width: 100%;
    height: 27px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}
.use-table :deep(.p-inputnumber) {
    width: 100%;
}

.use-table :deep(.p-inputnumber-input) {
    width: 100%;
    height: 27px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}

.use-table :deep(.p-button.p-button-icon-only) {
    width: 25px;
    height: 25px;
}

</style>
