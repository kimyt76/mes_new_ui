<template>

    <Breadcrumb
        :home="home"
        :model="items"
        class="compact-breadcrumb"
    />

    <!-- =====================================================
         검색조건
    ====================================================== -->
    <form
        @submit.prevent="srhList"
        class="search-form"
    >

        <Toolbar class="compact-toolbar">

            <template #start>

                <div class="search-area">

                    <DateRangePicker
                        v-model:startDate="form.strDate"
                        v-model:endDate="form.endDate"
                        @change="handleDateChange"
                    />

                    <FloatLabel variant="on">

                        <Select
                            v-model="form.prodType"
                            :options="prodTypes"
                            optionLabel="codeNm"
                            optionValue="code"
                            class="search-select"
                        />

                        <label>제품유형</label>

                    </FloatLabel>


                    <FloatLabel variant="on">

                        <InputText
                            v-model="form.poNo"
                            class="input-po"
                        />

                        <label>수주번호</label>

                    </FloatLabel>


                    <FloatLabel variant="on">

                        <InputText
                            v-model="form.clientName"
                            class="input-client"
                        />

                        <label>고객사명</label>

                    </FloatLabel>


                    <FloatLabel variant="on">

                        <InputText
                            v-model="form.managerName"
                            class="input-manager"
                        />

                        <label>담당자</label>

                    </FloatLabel>


                    <FloatLabel variant="on">

                        <InputText
                            v-model="form.itemName"
                            class="input-item-name"
                        />

                        <label>품목명</label>

                    </FloatLabel>


                    <FloatLabel variant="on">

                        <InputText
                            v-model="form.itemCd"
                            class="input-item-cd"
                        />

                        <label>품목코드</label>

                    </FloatLabel>


                    <div class="end-area">

                        <Checkbox
                            v-model="form.endYn"
                            inputId="setYn"
                            trueValue="Y"
                            falseValue="N"
                            binary
                        />

                        <label
                            for="setYn"
                            class="cursor-pointer end-label"
                        >
                            종결
                        </label>

                    </div>
                    <Button label="검색" icon="pi pi-search" type="submit" />
                </div>
            </template>
        </Toolbar>
    </form>
    <!-- =====================================================
         엑셀
    ====================================================== -->
    <div class="button-area">
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" class="excel-button" @click="downloadExcel" />
    </div>

    <!-- =====================================================
         테이블
    ====================================================== -->
    <div class="table-area">

        <DataTable
            ref="dt"
            :value="orderPlanList"
            scrollable
            scrollHeight="flex"
            showGridlines
            class="my-table"
            tableStyle=" min-width: 104rem; table-layout: fixed; "
        >
            <!-- No -->
            <Column
                header="No"
                :style="{
                    width: '34px',
                    textAlign: 'center'
                }"
            >
                <template #body="slotProps">

                    {{ slotProps.index + 1 }}

                </template>
            </Column>


            <!-- =====================================================
                 PO No
            ====================================================== -->
            <Column field="poNo" header="PO No" frozen :style="{ width: '95px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <div v-if="Number(slotProps.data.rowId) === 0" class="clickable-cell text-ellipsis" @click=" fieldClick( slotProps.data, 'poNo' ) " >
                        {{ slotProps.data.poNo }}
                    </div>
                    <div v-else class="text-ellipsis" >
                        {{ slotProps.data.poNo }}
                    </div>
                </template>
            </Column>
            <Column field="prodType" header="제품유형" frozen :style="{ width: '65px', textAlign: 'center' }" />
            <Column field="clientName" header="고객사명" frozen :style="{ width: '100px' }" />
            <Column field="managerId" header="담당자" frozen :style="{ width: '75px', textAlign: 'center' }" />
            <Column field="itemCd" header="품목코드" frozen :style="{ width: '100px', textAlign: 'center' }" />
            <Column field="itemName" header="품목명" frozen :style="{ width: '210px' }" />
            <!-- =====================================================
                 주문수량
            ====================================================== -->
            <Column field="qty" header="수량" :style="{ width: '72px', textAlign: 'right' }" >
                <template #body="slotProps"> {{ formatNumber( slotProps.data.qty ) }} </template>
            </Column>
            <Column field="deliveryReqDate" header="납기희망일" :style="{ width: '82px', textAlign: 'center' }" />
            <Column field="orderTypeName" header="수주유형" :style="{ width: '60px', textAlign: 'center' }" />
            <!-- =====================================================
                 선금여부
            ====================================================== -->
            <Column field="advancePayYn" header="선금여부" :style="{ width: '45px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <span
                        v-if="Number(slotProps.data.rowId) === 0"
                        class="yn-cell"
                        :class="
                            slotProps.data.advancePayYn === 'Y'
                                ? 'yn-y'
                                : 'yn-n'
                        "
                        @click=" fieldClick( slotProps.data, 'advancePayYn' ) "
                    >
                        {{ slotProps.data.advancePayYn }}
                    </span>
                </template>
            </Column>
            <!-- =====================================================
                 제품사양서
            ====================================================== -->
            <Column field="prodSheet" header="제품사양서" :style="{ width: '48px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <span
                        v-if="Number(slotProps.data.rowId) === 0"
                        class="yn-cell"
                        :class="
                            slotProps.data.prodSheet === 'Y'
                                ? 'yn-y'
                                : 'yn-n'
                        "
                        @click="
                            fieldClick(
                                slotProps.data,
                                'prodSheet'
                            )
                        "
                    >
                        {{ slotProps.data.prodSheet }}
                    </span>
                </template>
            </Column>

            <!-- =====================================================
                 원재료 세팅
            ====================================================== -->
            <Column field="m1Yn" header="원재료세팅여부" :style="{ width: '52px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <span
                        v-if="Number(slotProps.data.rowId) === 0"
                        class="yn-cell"
                        :class="
                            slotProps.data.m1Yn === 'Y'
                                ? 'yn-y'
                                : 'yn-n'
                        "
                        @click="
                            fieldClick(
                                slotProps.data,
                                'm1Yn'
                            )
                        "
                    >
                        {{ slotProps.data.m1Yn }}
                    </span>
                </template>
            </Column>

            <!-- =====================================================
                 부자재 세팅
            ====================================================== -->
            <Column
                field="m2Yn"
                header="부자재세팅여부"
                :style="{
                    width: '52px',
                    textAlign: 'center'
                }"
            >

                <template #body="slotProps">

                    <span
                        v-if="Number(slotProps.data.rowId) === 0"
                        class="yn-cell"
                        :class="
                            slotProps.data.m2Yn === 'Y'
                                ? 'yn-y'
                                : 'yn-n'
                        "
                        @click="
                            fieldClick(
                                slotProps.data,
                                'm2Yn'
                            )
                        "
                    >
                        {{ slotProps.data.m2Yn }}
                    </span>

                </template>

            </Column>


            <!-- =====================================================
                 부자재 계획 - 자급 J
            ====================================================== -->
            <Column field="bjPlanDate" header="부자재계획일자(자급)" :style="{ width: '80px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell"
                        @click="fieldClick(slotProps.data, 'bjPlanDate')"
                    >
                        {{ slotProps.data.bjPlanDate || '\u00A0' }}
                    </div>
                </template>
            </Column>
            <Column field="bjQty" header="부자재계획수량(자급)" :style="{ width: '72px', textAlign: 'right' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell text-right"
                        @click="fieldClick(slotProps.data, 'bjQty')"
                    >
                        {{ formatNumber(slotProps.data.bjQty) || '\u00A0' }}
                    </div>
                </template>
            </Column>

            <!-- =====================================================
                 부자재 계획 - 사급 S
            ====================================================== -->
            <Column field="bsPlanDate" header="부자재계획일자(사급)" :style="{ width: '80px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell"
                        @click="fieldClick(slotProps.data, 'bsPlanDate')"
                    >
                        {{ slotProps.data.bsPlanDate || '\u00A0' }}
                    </div>
                </template>
            </Column>
            <Column field="bsQty" header="부자재계획수량(사급)" :style="{ width: '72px', textAlign: 'right' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell text-right"
                        @click="fieldClick(slotProps.data, 'bsQty')"
                    >
                        {{ formatNumber(slotProps.data.bsQty) || '\u00A0' }}
                    </div>
                </template>
            </Column>
            <!-- =====================================================
                 출고 계획 O
            ====================================================== -->
            <Column field="outPlanDate" header="출고희망일" :style="{ width: '82px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell"
                        @click="fieldClick(slotProps.data, 'outPlanDate')"
                    >
                        {{ slotProps.data.outPlanDate || '\u00A0' }}
                    </div>
                </template>
            </Column>

            <Column field="outQty" header="출고희망수량" :style="{ width: '72px', textAlign: 'right' }" >
                <template #body="slotProps">
                    <div
                        class="clickable-cell text-right"
                        @click="fieldClick(slotProps.data, 'outQty')"
                    >
                        {{ formatNumber(slotProps.data.outQty) || '\u00A0' }}
                    </div>
                </template>
            </Column>

            <!-- =====================================================
                 칭량
            ====================================================== -->
            <Column field="weighProdDate" header="칭량" :style="{ width: '78px', textAlign: 'center' }" >
                <template #body="slotProps">
                    <span v-if=" Number( slotProps.data.rowId ) === 0 " >
                        {{ slotProps.data.weighProdDate }}
                    </span>
                    <span v-else>
                        {{ formatNumber( slotProps.data.weighProdDate ) }}
                    </span>
                </template>
            </Column>

            <!-- =====================================================
                 제조
                 matProdDate 클릭
            ====================================================== -->
            <Column field="matProdDate" header="제조" :style="{ width: '78px', textAlign: 'center' }" >
                <template #body="slotProps">

                    <span
                        v-if="
                            Number(
                                slotProps.data.rowId
                            ) === 0
                        "
                        class="clickable-cell"
                        @click="
                            fieldClick(
                                slotProps.data,
                                'matProdDate'
                            )
                        "
                    >
                        {{ slotProps.data.matProdDate }}
                    </span>

                    <span v-else>
                        {{
                            formatNumber(
                                slotProps.data.matProdDate
                            )
                        }}
                    </span>

                </template>

            </Column>


            <!-- =====================================================
                 포장
            ====================================================== -->
            <Column
                field="packingProdDate"
                header="포장"
                :style="{
                    width: '78px',
                    textAlign: 'center'
                }"
            >

                <template #body="slotProps">

                    <span
                        v-if="
                            Number(
                                slotProps.data.rowId
                            ) === 0
                        "
                    >
                        {{ slotProps.data.packingProdDate }}
                    </span>

                    <span v-else>
                        {{
                            formatNumber(
                                slotProps.data.packingProdDate
                            )
                        }}
                    </span>

                </template>

            </Column>


            <!-- =====================================================
                 창고
            ====================================================== -->
            <Column
                field="storageCnt"
                header="창고"
                :style="{
                    width: '65px',
                    textAlign: 'right'
                }"
            >

                <template #body="slotProps">

                    {{
                        formatNumber(
                            slotProps.data.storageCnt
                        )
                    }}

                </template>

            </Column>


            <!-- =====================================================
                 실제 출고
            ====================================================== -->
            <Column
                field="shipmentReqDate"
                header="출고일/수량"
                :style="{
                    width: '82px',
                    textAlign: 'right'
                }"
            >

                <template #body="slotProps">

                    <span
                        v-if="
                            Number(
                                slotProps.data.rowId
                            ) === 0
                        "
                    >
                        {{ slotProps.data.shipmentReqDate }}
                    </span>

                    <span v-else>
                        {{
                            formatNumber(
                                slotProps.data.shipmentReqDate
                            )
                        }}
                    </span>

                </template>

            </Column>


            <!-- =====================================================
                 종결
            ====================================================== -->
            <Column
                field="statusType"
                header="종결"
                :style="{
                    width: '50px',
                    textAlign: 'center'
                }"
            >

                <template #body="slotProps">

                    <span
                        v-if="slotProps.data.statusType"
                        :class="
                            slotProps.data.statusType === 'ING'
                                ? 'text-red'
                                : 'text-blue'
                        "
                        class="click-text"
                        @click="
                            toggleEndYn(
                                slotProps.data
                            )
                        "
                    >

                        {{
                            slotProps.data.statusType === 'END'
                                ? '종결'
                                : '미종결'
                        }}

                    </span>

                </template>

            </Column>


            <!-- =====================================================
                 리드타임
            ====================================================== -->
            <Column
                field="readDay"
                header="리드타임"
                :style="{
                    width: '55px',
                    textAlign: 'right'
                }"
            >

                <template #body="slotProps">

                    {{
                        formatNumber(
                            slotProps.data.readDay
                        )
                    }}

                </template>

            </Column>


            <!-- =====================================================
                 합계
            ====================================================== -->
            <ColumnGroup type="footer">

                <Row>

                    <Column footer="" />

                    <Column
                        footer="합계 :"
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />

                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />


                    <!-- qty -->
                    <Column
                        :footer="
                            formatNumber(
                                total.qty
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />
                    <Column footer="" />


                    <!-- bjPlanDate -->
                    <Column footer="" />


                    <!-- bjQty -->
                    <Column
                        :footer="
                            formatNumber(
                                total.bjQty
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- bsPlanDate -->
                    <Column footer="" />


                    <!-- bsQty -->
                    <Column
                        :footer="
                            formatNumber(
                                total.bsQty
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- outPlanDate -->
                    <Column footer="" />


                    <!-- outQty -->
                    <Column
                        :footer="
                            formatNumber(
                                total.outQty
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 칭량 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.weighProdDate
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 제조 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.matProdDate
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 포장 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.packingProdDate
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 창고 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.storageCnt
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 출고수량 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.shipmentReqDate
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />


                    <!-- 종결 -->
                    <Column footer="" />


                    <!-- 리드타임 -->
                    <Column
                        :footer="
                            formatNumber(
                                total.readDay
                            )
                        "
                        footerStyle="
                            text-align:right;
                            font-weight:700;
                        "
                    />

                </Row>

            </ColumnGroup>

        </DataTable>

    </div>

</template>


<script setup>

import { ApiOrder } from '@/api/apiOrders'
import DateRangePicker from '@/components/DateRangePicker.vue'

import {
    addMonth,
    minMonth,
    todayKST
} from '@/util/common'

import { exportToExcel } from '@/util/exportToExcel'

import {
    computed,
    onMounted,
    reactive,
    ref
} from 'vue'

import { useDialog } from 'primevue/usedialog'
import OrderPlanRegPop from './OrderPlanRegPop.vue'
import OrderStockPop from './orderStockPop.vue'
import WorkOrderPop from './workOrderPop.vue'


/*
 * ============================================================
 * 팝업
 *
 * 실제 프로젝트의 파일경로에 맞게 변경
 * ============================================================
 */


const dialog = useDialog()

const dt = ref(null)

const orderPlanList = ref([])

const prodTypes = ref([])



// ============================================================
// 검색조건
// ============================================================
const form = reactive({

    strDate: minMonth(
        todayKST(),
        1
    ),

    endDate: addMonth(
        todayKST(),
        2
    ),

    prodType: null,

    poNo: '',

    clientName: '',

    managerName: '',

    itemName: '',

    itemCd: '',

    endYn: 'N',

})



const handleDateChange = () => {

}



// ============================================================
// 숫자 변환
// ============================================================
const toNum = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {

        return 0

    }


    const num = Number(
        String(value)
            .replaceAll(',', '')
            .trim()
    )


    return Number.isNaN(num)
        ? 0
        : num

}



// ============================================================
// 합계
//
// rowId = 0
//
// qty
// bsQty
// bjQty
// outQty
// readDay
//
// rowId = 1
//
// weighProdDate
// matProdDate
// packingProdDate
// storageCnt
// shipmentReqDate
// ============================================================
const total = computed(() => {

    const result = {

        qty: 0,

        bsQty: 0,

        bjQty: 0,

        outQty: 0,

        shipmentQty: 0,

        readDay: 0,

        weighProdDate: 0,

        matProdDate: 0,

        packingProdDate: 0,

        storageCnt: 0,

        shipmentReqDate: 0

    }


    orderPlanList.value.forEach(row => {

        const rowId =
            Number(row.rowId)


        // =====================================================
        // 첫 번째 ROW
        // =====================================================
        if (rowId === 0) {

            result.qty +=
                toNum(row.qty)


            result.bsQty +=
                toNum(row.bsQty)


            result.bjQty +=
                toNum(row.bjQty)


            result.outQty +=
                toNum(row.outQty)


            result.shipmentQty +=
                toNum(row.shipmentQty)


            result.readDay +=
                toNum(row.readDay)

        }


        // =====================================================
        // 두 번째 ROW
        // =====================================================
        else if (rowId === 1) {

            result.weighProdDate +=
                toNum(row.weighProdDate)


            result.matProdDate +=
                toNum(row.matProdDate)


            result.packingProdDate +=
                toNum(row.packingProdDate)


            result.storageCnt +=
                toNum(row.storageCnt)


            result.shipmentReqDate +=
                toNum(row.shipmentReqDate)

        }

    })


    return result

})

// ============================================================
// 숫자 표시
//
// 100.000000 -> 100
// 100.500000 -> 100.5
// 1234       -> 1,234
// ============================================================
const formatNumber = (value) => {
    if ( value === null || value === undefined || value === '' ) {
        return ''
    }

    const num = Number(
        String(value)
            .replaceAll(',', '')
            .trim()
    )

    if (Number.isNaN(num)) {
        return value
    }

    return num.toLocaleString(
        'ko-KR',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6
        }
    )
}



// ============================================================
// 조회
// ============================================================
const srhList = async () => {
    const params = {
        ...form
    }

    orderPlanList.value = await ApiOrder.getOrderPlanList( params )
}

// ============================================================
// 필드 구분
//
// PO
//   poNo
//
// MAT
//   matProdDate
//
// PLAN
//   J : bjPlanDate / bjQty
//   S : bsPlanDate / bsQty
//   O : outPlanDate / outQty
//
// YN
//   advancePayYn
//   prodSheet
//   m1Yn
//   m2Yn
// ============================================================
const getFieldType = (field) => {
    // =====================================================
    // PO 전용 팝업
    // =====================================================
    if (field === 'poNo') {
        return { popupType: 'PO', planType: null, }
    }

    // =====================================================
    // 제조일 전용 팝업
    // =====================================================
    if (field === 'matProdDate') {
        return { popupType: 'MAT', planType: null, }
    }

    // =====================================================
    // 부자재 자급
    // J
    // =====================================================
    if ( [ 'bjPlanDate', 'bjQty' ].includes(field) ) {
        return { popupType: 'PLAN', planType: 'J', }

    }

    // =====================================================
    // 부자재 사급
    // S
    // =====================================================
    if ( [ 'bsPlanDate', 'bsQty' ].includes(field) ) {
        return { popupType: 'PLAN', planType: 'S', }
    }

    // =====================================================
    // 출고
    // O
    // =====================================================
    if ( [ 'outPlanDate', 'outQty' ].includes(field) ) {
        return { popupType: 'PLAN', planType: 'O', }
    }

    // =====================================================
    // Y/N 업데이트
    // =====================================================
    if ( [ 'advancePayYn', 'prodSheet', 'm1Yn', 'm2Yn' ].includes(field) ) {
        return { popupType: 'YN', planType: null, }
    }

    return null
}


// ============================================================
// 전체 필드 클릭 공통 함수
// ============================================================
const fieldClick = async ( row, field ) => {
    console.log('클릭됨 =================')
    console.log('field = ', field)
    console.log('row = ', row)

    const info = getFieldType(field)

    if (!info) {
        console.warn( '등록되지 않은 field', field )
        return
    }

    console.log( 'fieldClick', { row, field, info } )
    // =====================================================
    // PO
    // =====================================================
    if ( info.popupType === 'PO' ) {
        openPoPop(row)
        return
    }
    // =====================================================
    // 제조
    // =====================================================
    if ( info.popupType === 'MAT' ) {
        openMatProdPop(row)
        return
    }
    // =====================================================
    // 계획 J / S / O
    // =====================================================
    if ( info.popupType === 'PLAN' ) {
        openPlanPop( row, info.planType, field )
        return
    }
    // =====================================================
    // Y/N
    // =====================================================
    if ( info.popupType === 'YN' ) {
        await updateYn( row, field )
    }
}

// ============================================================
// PO 팝업
// ============================================================
const openPoPop = (row) => {
    dialog.open(
        OrderStockPop,
        {
            props: {
                header: '소요량 상세',
                modal: true,
                draggable: false,
                style: {
                    width: '800px',
                },
            },
            data: {
                /*
                 * 실제 조회에 필요한 키를 넘기면 됨
                 */
                poNo: row.poNo,
                itemCd: row.itemCd,
                contractId: row.contractId,
                row: row,
            },
            onClose: () => {
                //srhList()
            },
        }
    )
}

// ============================================================
// J / S / O 계획 팝업
//
// J = 부자재 자급
// S = 부자재 사급
// O = 출고
//
// 같은 팝업을 사용하고 planType으로 구분
// ============================================================
const openPlanPop = ( row, planType, field ) => {
    let title = ''

    switch (planType) {
        case 'J':
            title = '부자재 계획 - 자급'
            break
        case 'S':
            title = '부자재 계획 - 사급'
            break
        case 'O':
            title = '출고 희망 계획'
            break
        default:
            title = '계획 등록'
            break
    }

    dialog.open(OrderPlanRegPop, {
            props: {
                header: title,
                modal: true,
                draggable: false,
                style: {
                    width: '900px',
                },
            },

            data: {
                // =============================================
                // 기본키
                // =============================================
                poNo: row.poNo,
                itemCd: row.itemCd,
                contractId: row.contractId,

                // =============================================
                // 중요
                //
                // J / S / O
                // =============================================
                typeCd: planType,

                // =============================================
                // 클릭한 필드
                //
                // bjPlanDate
                // bjQty
                // bsPlanDate
                // bsQty
                // outPlanDate
                // outQty
                // =============================================
                field: field,
                // =============================================
                // 필요하면 전체 ROW 사용
                // =============================================
                row:row,
            },
            onClose: () => {
                srhList()
            },
        }
    )
}

// ============================================================
// 제조일 팝업
// ============================================================
const openMatProdPop = (row) => {
    dialog.open( WorkOrderPop, {
            props: {
                header: '제조 공정',
                modal: true,
                draggable: false,
                style: {
                    width: '900px',
                },
            },
            data: {
                poNo: row.poNo,
                itemCd: row.itemCd,
                contractId: row.contractId,
                matProdDate: row.matProdDate,
                row: row,
            },
            onClose: () => {
                //srhList()
            },
        }
    )
}

// ============================================================
// Y / N 변경
//
// advancePayYn
// prodSheet
// m1Yn
// m2Yn
//
// field 이름까지 서버로 보내서
// 서버에서 어떤 컬럼인지 구별
// ============================================================
const updateYn = async ( row, field ) => {
    const currentValue = String( row[field] ?? 'N' ).trim()
    const newValue = currentValue === 'Y' ? 'N' : 'Y'
    const params = {
        /*
         * 서버 UPDATE 조건에 필요한 KEY
         *
         * 실제 테이블 PK가 있다면
         * poNo보다 contractItemId 등을 사용하는 것이 더 안전함
         */
        poNo: row.poNo,
        itemCd: row.itemCd,
        contractId: row.contractId,
        contractItemId: row.contractItemId,
        // 변경 필드
        field: field,

        // 변경 값
        value: newValue,
    }

    console.log( 'YN 변경', params )

    try {
        /*
         * API 이름은 실제 apiOrders.js에 맞게 변경
         *
         * 예)
         *
         * updateOrderPlanYn(params)
         */
        const res = await ApiOrder.updateOrderPlanYn( params )

        console.log( 'updateOrderPlanYn', res )
        /*
         * 서버 저장 성공 후
         * 화면 바로 변경
         */
        row[field] = newValue
    } catch (error) {
        console.error( 'Y/N 변경 오류', error )
    }
}


// ============================================================
// 종결
// ============================================================
const toggleEndYn = async (row) => {
    console.log( 'toggleEndYn', row )
}

// ============================================================
// Excel
// ============================================================
const downloadExcel = () => {
    const cols = dt.value?.columns ?? []

    if (!cols.length) {
        console.warn( 'No Columns Found' )
        return
    }

    exportToExcel( orderPlanList.value, '수주별 계획 리스트', cols )
}

// ============================================================
// mounted
// ============================================================
onMounted(async () => {
    /*
     * 필요하면 공통코드 조회
     */
    await srhList()
})


// ============================================================
// Breadcrumb
// ============================================================
const home = ref({
    icon: 'pi pi-home',
})

const items = ref([
    { label: '영업관리' },
    { label: '수주제조계획' },
    { label: '수주제조계획목록' },
])

</script>


<style scoped>

/* ============================================================
   Breadcrumb
============================================================ */
::v-deep(.compact-breadcrumb) {

    padding: 4px 6px !important;

    margin: 0 !important;

    font-size: 11px;

    min-height: 28px;

}


/* ============================================================
   검색
============================================================ */
.search-form {

    margin: 2px 0 0 0;

    padding: 0;

}


::v-deep(.compact-toolbar) {

    padding: 3px 5px !important;

    margin: 0 !important;

    min-height: 38px;

}


.search-area {

    display: flex;

    align-items: center;

    flex-wrap: wrap;

    gap: 4px;

    width: 100%;

}


/* ============================================================
   Input
============================================================ */
::v-deep(
    .search-area
    .p-inputtext
) {

    height: 28px;

    padding: 2px 5px !important;

    font-size: 11px !important;

}


.input-po {

    width: 100px;

}


.input-client {

    width: 110px;

}


.input-manager {

    width: 80px;

}


.input-item-name {

    width: 135px;

}


.input-item-cd {

    width: 100px;

}


/* ============================================================
   Select
============================================================ */
.search-select {

    width: 100px !important;

}


::v-deep(
    .search-area
    .p-select
) {

    height: 28px !important;

    min-height: 28px !important;

    font-size: 11px;

}


::v-deep(
    .search-area
    .p-select-label
) {

    padding: 3px 5px !important;

    font-size: 11px !important;

}


/* ============================================================
   Checkbox
============================================================ */
.end-area {

    display: flex;

    align-items: center;

    gap: 2px;

    white-space: nowrap;

}


.end-label {

    font-size: 11px;

}


/* ============================================================
   Button
============================================================ */
::v-deep(.p-button) {

    height: 28px;

    padding: 3px 7px !important;

    font-size: 11px !important;

}


/* ============================================================
   Excel
============================================================ */
.button-area {

    display: flex;

    justify-content: flex-end;

    align-items: center;

    margin: 2px 0;

}


.excel-button {

    height: 27px !important;

}


/* ============================================================
   Table
============================================================ */
.table-area {

    margin-top: 2px;

    width: 100%;

    overflow: hidden;

}


.my-table {

    height: 750px;

    font-size: 11px;

}


/* ============================================================
   Header
============================================================ */
::v-deep(
    .my-table
    .p-datatable-thead
    > tr
    > th
) {

    background-color: #BCAAA4;

    color: white;

    font-family: Lobo, Consolas;

    font-size: 11px !important;

    font-weight: 600;

    text-align: center;

    padding: 2px !important;

    height: 28px !important;

    line-height: 1.05;

}


/* ============================================================
   Body
============================================================ */
::v-deep(
    .my-table
    .p-datatable-tbody
    > tr
    > td
) {

    height: 25px !important;

    padding: 1px 3px !important;

    font-size: 11px !important;

    line-height: 1.05;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

}


/* ============================================================
   Footer
============================================================ */
::v-deep(
    .my-table
    .p-datatable-tfoot
    > tr
    > td
) {

    height: 29px !important;

    padding: 2px 3px !important;

    font-size: 11px !important;

    font-weight: 700;

    background-color: #f3f3f3;

    border-top: 2px solid #888;

}

/* ============================================================
   클릭 가능한 CELL
============================================================ */
.clickable-cell {
    display: block;
    width: 100%;
    min-height: 22px;
    line-height: 22px;
    cursor: pointer;
}

.clickable-cell:hover {
    background-color: #f5f5f5;
    color: #1976d2;
}

/* ============================================================
   Y / N CELL
============================================================ */
.yn-cell {

    cursor: pointer;

    font-weight: 700;

    display: inline-block;

    width: 100%;

    text-align: center;

}


.yn-cell:hover {

    text-decoration: underline;

}


/* Y */
.yn-y {

    color: #1976d2;

}


/* N */
.yn-n {

    color: #999;

}


/* ============================================================
   종결 클릭
============================================================ */
.click-text {

    cursor: pointer;

    font-size: 11px;

}


/* ============================================================
   ellipsis
============================================================ */
.text-ellipsis {

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

    width: 100%;

}


/* ============================================================
   상태
============================================================ */
.text-red {

    color: #e53935;

    font-weight: 600;

}


.text-blue {

    color: #1976d2;

    font-weight: 600;

}

</style>
