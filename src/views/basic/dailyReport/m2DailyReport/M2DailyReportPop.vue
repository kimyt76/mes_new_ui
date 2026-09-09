<template>
    <div class="prod-page">
        <div class="page-title"> 부자재 일일 입고 및 사용내역 </div>
        <!-- =========================================================
             1. 당일 부자재 입고 현황
        ========================================================== -->
        <section class="list-section">

            <div class="section-header section-blue">
                <h5>1. 당일 부자재 입고 현황</h5>
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

                <Column
                    field="dailyDate"
                    header="입고일자"
                    style="width: 100px"
                >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                            readonly
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 70px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px" >
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
                <Column field="qty" header="수량[EA]" style="width: 110px" >
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
                <Column field="inPrice" header="단가" style="width: 110px" >
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
                <Column
                    field="storageName"
                    header="입고창고"
                    style="width: 100px"
                >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'storageName')">
                            <InputText
                            v-model="data.storageName"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column
                    field="etc"
                    header="비고"
                    style="width: 180px"
                >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'in', index, 'etc')">
                            <InputText
                            v-model="data.etc"
                            class="cell-input"
                        />
                        </div>
                    </template>
                </Column>
                <Column
                    header="삭제"
                    style="width: 55px; text-align: center"
                >
                    <template #body="{ index }">
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            @click="removeRow('in', index)"
                        />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 부자재 입고 내역이 없습니다.
                    </div>
                </template>
                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span> 수량: {{ formatNumber(inTotalQty) }} </span>
                        <span> 금액: {{ formatNumber(inTotalAmount) }} </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- =========================================================
             2. 당일 부자재 반품 내역
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>2. 당일 부자재 반품 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('return')" />
            </div>
            <DataTable
                :value="returnList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="dailyDate" header="반품일자" style="width: 100px" >
                    <template #body="{ data }">
                            <InputText
                            v-model="data.dailyDate"
                            class="cell-input text-center"
                        />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" style="width: 70px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px" >
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
                <Column field="qty" header="수량[EA]" style="width: 110px" >
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
                <Column field="inPrice" header="단가" style="width: 110px" >
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
                <Column field="storageName" header="반품창고" style="width: 100px" >
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
                <Column header="삭제" style="width: 55px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('return', index)" />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 반품 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 :</span>
                        <span> 수량: {{ formatNumber(returnTotalQty) }} </span>
                        <span> 금액: {{ formatNumber(returnTotalAmount) }} </span>
                    </div>
                </template>
            </DataTable>
        </section>
        <!-- =========================================================
             3. 당일 부자재 불량 및 폐기 내역
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-gray">
                <h5>3. 당일 부자재 불량 및 폐기 내역</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('discard')" />
            </div>
            <DataTable
                :value="discardList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="dailyDate" header="불량일자" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" style="width: 70px" >
                    <template #body="{ data }">
                            <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px" >
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
                <Column field="badQty" header="원불량수량[EA]" style="width: 110px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'badQty')">
                            <InputNumber
                            v-model="data.badQty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="workBadQty" header="작업불량수량[EA]" style="width: 110px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'workBadQty')">
                            <InputNumber
                            v-model="data.workBadQty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                        </div>
                    </template>
                </Column>
                <Column field="inPrice" header="단가" style="width: 110px" >
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
                <Column field="supplyPrice" header="공급가" style="width: 120px" >
                    <template #body="{ data }">
                            <InputNumber
                            :modelValue="calculateAmount1(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="storageName" header="발생장소" style="width: 100px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'storageName')">
                        <InputText v-model="data.storageName" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px" >
                    <template #body="{ data, index }">
                        <div @paste.prevent="handlePaste($event, 'discard', index, 'etc')">
                        <InputText v-model="data.etc" class="cell-input" />
                        </div>
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center" >
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('discard', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 폐기 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 :</span>
                        <span> 수량: {{ formatNumber(discardTotalQty) }} </span>
                        <span> 금액: {{ formatNumber(discardTotalAmount) }} </span>
                    </div>
                </template>
            </DataTable>
        </section>
                <!-- =========================================================
             4. 제품별 부자재 사용량
             제품 / 생산수량 / 총합계 / 개당단가는 ROWSPAN 처리
        ========================================================== -->
        <section class="list-section">
            <div class="section-header section-green">
                <h5>4. 제품별 부자재 사용량</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('use')" />
            </div>
            <div class="use-table-wrapper">
                <table class="use-table">
                    <thead>
                        <tr>
                            <th style="width: 90px"> 사용일자 </th>
                            <th style="width: 280px"> 제품명 </th>
                            <th style="width: 105px"> 생산수량[EA] </th>
                            <th style="width: 400px"> BOM </th>
                            <th style="width: 105px"> 소요량[EA] </th>
                            <th style="width: 90px"> 단가 </th>
                            <th style="width: 120px"> 합계 </th>
                            <th style="width: 130px"> 총합계 </th>
                            <th style="width: 110px"> 개당단가[원] </th>
                            <th style="width: 180px"> 비고 </th>
                            <th style="width: 55px"> 삭제 </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template
                            v-for="group in groupedUseList"
                            :key="group.groupKey"
                        >
                            <tr
                                v-for="(row, rowIndex) in group.rows"
                                :key=" row.dailySubUseId ?? `${group.groupKey}-${rowIndex}` "
                            >
                                <!-- 사용일자 -->
                                <td v-if="rowIndex === 0" :rowspan="group.rows.length" class="merge-cell text-center" >
                                    <InputText v-model="group.masterRow.dailyDate" class="cell-input text-center" />
                                </td>
                                <!-- 제품명 -->
                                <td
                                    v-if="rowIndex === 0"
                                    :rowspan="group.rows.length"
                                    class="merge-cell"
                                >
                                    <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'itemName')">
                                        <InputText v-model="group.masterRow.itemName" class="cell-input" />
                                    </div>
                                </td>
                                <!-- 생산수량 -->
                                <td v-if="rowIndex === 0" :rowspan="group.rows.length" class="merge-cell" >
                                    <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'prodQty')">
                                    <InputNumber
                                        v-model="group.masterRow.prodQty"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="3"
                                        class="cell-number"
                                        inputClass="text-right"
                                    />
                                </div>
                                </td>
                                <!-- BOM -->
                                <td> <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'bomName')">
                                    <InputText v-model="row.bomName" class="cell-input" />
                                </div> </td>
                                <!-- 소요량 -->
                                <td>
                                    <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'requiredQuantity')">
                                    <InputNumber
                                        v-model="row.requiredQuantity"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="3"
                                        class="cell-number"
                                        inputClass="text-right"
                                    />
                                </div>
                                </td>
                                <!-- 단가 -->
                                <td>
                                    <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'inPrice')">
                                    <InputNumber
                                        v-model="row.inPrice"
                                        mode="decimal"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="2"
                                        class="cell-number"
                                        inputClass="text-right"
                                    />
                                </div>
                                </td>
                                <!-- BOM별 합계 requiredQuantity × inPrice -->
                                <td class="number-cell calculated-cell">
                                    {{ formatNumber( calculateUseSumPrice(row) ) }}
                                </td>
                                <!-- 제품별 총합계 BOM별 sumPrice 합계 -->
                                <td
                                    v-if="rowIndex === 0"
                                    :rowspan="group.rows.length"
                                    class="merge-cell number-cell product-total-cell"
                                >
                                    {{ formatNumber( group.totalPrice ) }}
                                </td>
                                <!-- 개당 단가 totalPrice / prodQty -->
                                <td
                                    v-if="rowIndex === 0"
                                    :rowspan="group.rows.length"
                                    class="merge-cell number-cell product-total-cell"
                                >
                                    {{ formatNumber( group.unitPrice, 0 ) }}
                                </td>
                                <!-- 비고 -->
                                <td>
                                    <div @paste.prevent="handlePaste($event, 'use', useList.indexOf(row), 'etc')">
                                        <InputText v-model="row.etc" class="cell-input" />
                                    </div>
                                </td>
                                <!-- 행 삭제 -->
                                <td class="text-center">
                                    <Button icon="pi pi-trash" severity="danger" text rounded @click="removeUseRow( row )" />
                                </td>
                            </tr>
                        </template>

                        <tr v-if=" groupedUseList.length === 0 " >
                            <td colspan="11" class="empty-message" >
                                등록된 사용량 내역이 없습니다.
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="total-title" > 합 계 </td>
                            <td class="number-cell">
                                {{ formatNumber( useRequiredTotal ) }}
                            </td>
                            <td></td>
                            <td class="number-cell"> {{ formatNumber( useSumPriceTotal ) }} </td>
                            <td class="number-cell"> {{ formatNumber( useTotalPrice ) }} </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
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
    itemTypeCd: 'M2',
    typeCd: 'S',
    endYn: '',
    dailyId: '',
})

/* =========================================================
   리스트
========================================================= */
const inList = ref([])
const returnList = ref([])
const discardList = ref([])
const useList = ref([])

/* =========================================================
   삭제 ID 리스트
========================================================= */
const deleteInIds = ref([])
const deleteReturnIds = ref([])
const deleteDiscardIds = ref([])
const deleteUseIds = ref([])

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
form.dailyId = 11
        const res = await ApiBase.getM2DailyReportInfo( form.dailyId )

        console.log( 'M2 일일보고서 정보', res )

        if (res.dailyReportInfo) {
            Object.assign( form, res.dailyReportInfo )
        }

        inList.value = res.inList || []
        returnList.value = res.returnList || []
        discardList.value = res.discardList || []

        /*
         * 기존 DB에서 조회한 useList는
         * 화면용 그룹 Key를 생성해준다.
         */
        useList.value = initializeUseList( res.useList || [] )

    } catch (error) {
        console.error( '조회 중 오류 발생:', error )
        handleApiError(error)
    }
})

/* =========================================================
   사용량 화면 전용 Group Key 생성
========================================================= */
let useGroupSeq = 0
const createUseGroupKey = () => {
    useGroupSeq += 1
    return `USE_${Date.now()}_${useGroupSeq}`
}

/*
 * DB에서 조회된 데이터는 _groupKey가 없기 때문에
 * 같은 제품끼리 묶어준다.
 *
 * 우선순위
 *
 * packingItemCd
 * itemCd
 * packingItemName
 *
 * + 날짜 + 생산수량을 같이 사용
 */
const initializeUseList = (list) => {
    const keyMap = new Map()

    return list.map((row, index) => {
        const productKey = [
            row.dailyDate ?? '',
            row.packingItemCd ??
                row.itemCd ??
                row.itemName ??
                index,
            row.prodQty ?? '',
        ].join('|')

        if (!keyMap.has(productKey)) {
            keyMap.set(
                productKey,
                createUseGroupKey()
            )
        }
        return {
            ...row,
            _groupKey:
                keyMap.get(productKey),
        }
    })
}

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
    badQty: 0,
    workBadQty: 0,
    inPrice: 0,
    etc: '',
})

/*
 * 제품별 부자재 사용량 신규 ROW
 */
const createUseRow = () => ({
    dailySubUseId: null,
    dailyDate: !form.dailyId ? todayKST() : form.dailyDate ?? todayKST(),
    orderDist: useList.value.length + 1,
    /*
     * 신규 ROW는 독립된 ROW로 생성
     */
    _groupKey: createUseGroupKey(),
    itemName: '',
    prodQty: 0,
    bomName: '',
    requiredQuantity: 0,
    inPrice: 0,
    sumPrice: 0,
    totalPrice: 0,
    unitPrice: 0,
    etc: '',
})


/* =========================================================
   기본 리스트 Mapping
========================================================= */
const listMap = {
    in: inList,
    return: returnList,
    discard: discardList,
    use: useList,
}

const addRow = (type) => {
    const rowFactoryMap = {
        in: createInRow,
        return: createReturnRow,
        discard: createDiscardRow,
        use: createUseRow,
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
    in: [ 'itemCd', 'customerName', 'itemName', 'qty', 'inPrice', 'storageName', 'etc', ],
    return: [ 'itemCd', 'customerName', 'itemName', 'qty', 'inPrice', 'storageName', 'etc', ],
    discard: [ 'itemCd', 'customerName', 'itemName', 'badQty', 'workBadQty', 'inPrice', 'storageName', 'etc', ],
    use: [ 'itemName', 'prodQty', 'bomName', 'requiredQuantity', 'inPrice', 'etc', ],
}

const numberPasteFields = [ 'qty', 'badQty', 'workBadQty', 'prodQty', 'requiredQuantity', 'inPrice', ]

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
        return: createReturnRow,
        discard: createDiscardRow,
        use: createUseRow,
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
        idField: 'dailySubItemId',
    },
    return: {
        ids: deleteReturnIds,
        idField: 'dailySubItemId',
    },
    discard: {
        ids: deleteDiscardIds,
        idField: 'dailySubItemId',
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
   BOM ROW 삭제
========================================================= */
const removeUseRow = ( row ) => {
    if (!row) {
        return
    }

    const index = useList.value.indexOf( row )

    if (index < 0) {
        return
    }

    if ( row.dailySubUseId != null && row.dailySubUseId !== '' && !deleteUseIds.value.includes( row.dailySubUseId ) ) {
        deleteUseIds.value.push(
            row.dailySubUseId
        )
    }

    useList.value.splice( index, 1 )
    resetUseOrderDist()
}

/* =========================================================
   useList 순번 재설정
========================================================= */
const resetUseOrderDist = () => {
    useList.value.forEach(
        (row, index) => {
            row.orderDist = index + 1
        }
    )
}

/* =========================================================
   입고 / 반품 공급가액
========================================================= */
const calculateAmount = (row) => {
    const qty = Number(row.qty) || 0
    const inPrice = Number(row.inPrice) || 0

    return ( qty * inPrice )
}
const calculateAmount1 = (row) => {
    const badQty = Number(row.badQty) || 0
    const workBadQty = Number(row.workBadQty) || 0
    const inPrice = Number(row.inPrice) || 0

    return ( ( badQty + workBadQty ) * inPrice )
}

/* =========================================================
   BOM별 금액
   sumPrice = requiredQuantity × inPrice
========================================================= */

const calculateUseSumPrice = ( row ) => {
    const requiredQuantity = Number( row.requiredQuantity ) || 0
    const inPrice = Number( row.inPrice ) || 0

    return ( requiredQuantity * inPrice )
}

/* =========================================================
   제품별 그룹
========================================================= */
const groupedUseList = computed( () => {
        const groupMap = new Map()

        useList.value.forEach(
            (row) => {
                /*
                 * 신규/조회 모두
                 * 화면용 groupKey 사용
                 */
                if (!row._groupKey) {
                    row._groupKey = createUseGroupKey()
                }

                const groupKey = row._groupKey

                if ( !groupMap.has( groupKey ) ) {
                    groupMap.set( groupKey, { groupKey, masterRow: row, rows: [], } )
                }

                groupMap
                    .get(groupKey)
                    .rows
                    .push(row)
            }
        )

        return Array
            .from(
                groupMap.values()
            )
            .map(
                group => {
                    /*
                     * 제품의 BOM 금액 총합
                     */
                    const totalPrice = group.rows.reduce( ( sum, row ) => { return ( sum + calculateUseSumPrice( row ) ) }, 0 )
                    const prodQty = Number( group.masterRow.prodQty ) || 0

                    /*
                     * 개당 단가
                     */
                    const unitPrice = prodQty > 0 ? ( totalPrice / prodQty ) : 0

                    return { ...group, totalPrice, unitPrice, }
                }
            )
    }
)


/* =========================================================
   1. 입고 합계
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
   2. 반품 합계
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
   3. 폐기 합계
========================================================= */
const discardTotalQty = computed( () => {
        return discardList.value.reduce( ( sum, row ) => {
                return (
                    sum +
                    (
                        Number(
                            row.badQty
                        ) || 0
                    ) +
                    (
                        Number(
                            row.workBadQty
                        ) || 0
                    )
                )
            },
            0
        )
    }
)

const discardTotalAmount = computed( () => {
        return discardList.value.reduce(
            ( sum, row ) => {
                const qty = ( Number( row.badQty ) || 0 ) + ( Number( row.workBadQty ) || 0 )
                const inPrice = Number( row.inPrice ) || 0

                return ( sum + ( qty * inPrice ) )
            }, 0
        )
    }
)

/* =========================================================
   4. 부자재 사용량 전체 소요량
========================================================= */
const useRequiredTotal = computed( () => {
        return useList.value.reduce(
            ( sum, row ) => {
                return ( sum + ( Number( row.requiredQuantity ) || 0 ) )
            }, 0
        )
    }
)

/* =========================================================
   BOM별 금액 전체 합계
========================================================= */
const useSumPriceTotal = computed( () => {
        return useList.value.reduce(
            ( sum, row ) => {
                return ( sum + calculateUseSumPrice( row ) )
            }, 0
        )
    }
)

/* =========================================================
   제품별 totalPrice 전체 합계
========================================================= */
const useTotalPrice = computed( () => {
        return groupedUseList.value.reduce(
            ( sum, group ) => {
                return ( sum + group.totalPrice )
            }, 0
        )
    }
)

/* =========================================================
   저장 전 사용량 계산
========================================================= */
const prepareUseList = () => {
    groupedUseList.value.forEach(
        group => {
            const master = group.masterRow
            const prodQty = Number( master.prodQty ) || 0

            /*
             * 해당 제품의 BOM 총합
             */
            const totalPrice =
                group.rows.reduce(
                    ( sum, row ) => {
                        return ( sum + calculateUseSumPrice( row ) )
                    }, 0
                )

            /*
             * 개당단가
             */
            const unitPrice = prodQty > 0 ? ( totalPrice / prodQty ) : 0

            /*
             * 같은 제품에 속한 BOM ROW에
             * 공통 정보 적용
             */
            group.rows.forEach(
                row => {
                    row.dailyDate = master.dailyDate
                    row.packingItemCd = master.packingItemCd
                    row.packingItemName = master.packingItemName
                    row.prodQty = prodQty
                    /*
                     * BOM별 금액
                     */
                    row.sumPrice = calculateUseSumPrice( row )

                    /*
                     * 제품 총합계
                     */
                    row.totalPrice = totalPrice

                    /*
                     * 개당단가
                     */
                    row.unitPrice = unitPrice
                }
            )
        }
    )
}

/* =========================================================
   저장용 useList 생성
   _groupKey는 화면 전용이므로 서버에 보내지 않음
========================================================= */
const getSaveUseList = () => {
    return useList.value.map(
        row => {
            const { _groupKey, ...saveRow } = row
            return saveRow
        }
    )
}

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
        /*
         * 사용량 금액 계산
         */
        prepareUseList()

        /*
         * 화면용 _groupKey 제거
         */
        const saveUseList = getSaveUseList()
        const params = {
            dailyReportInfo: form,
            inList: inList.value,
            returnList: returnList.value,
            discardList: discardList.value,
            useList: saveUseList,
            deleteInIds: deleteInIds.value,
            deleteReturnIds: deleteReturnIds.value,
            deleteDiscardIds: deleteDiscardIds.value,
            deleteUseIds: deleteUseIds.value,
        }

        console.log( '저장 데이터', params )
        await ApiBase.saveDailyReportM2( params )
        vSuccess( '저장되었습니다.' )
        closeDialog()
    } catch (error) {
        console.error( '저장 중 오류 발생:', error )
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
    returnList.value = []
    discardList.value = []
    useList.value = []
    deleteInIds.value = []
    deleteReturnIds.value = []
    deleteDiscardIds.value = []
    deleteUseIds.value = []
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
   4. 제품별 부자재 사용량
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
