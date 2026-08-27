<template>
<Breadcrumb :home="home" :model="items" />
<!-- =========================================================
     조회조건
========================================================= -->
<form @submit.prevent="srhList">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-2 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-4">
                <!-- 기준년도 -->
                <FloatLabel variant="on">
                    <Select
                        v-model="form.year"
                        :options="years"
                        style="width: 130px"
                    />
                    <label>기준년도</label>
                </FloatLabel>

                <!-- 데이터 / 차트 -->
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="viewType" inputId="viewData" value="DATA" />
                        <label for="viewData" class="cursor-pointer font-semibold" >데이터보기</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <RadioButton v-model="viewType" inputId="viewChart" value="CHART" />
                        <label for="viewChart" class="cursor-pointer font-semibold" >차트보기</label>
                    </div>
                </div>
                <Button label="검색" icon="pi pi-search" type="submit" />
            </div>
        </template>
    </Toolbar>
</form>

<!-- =========================================================
     데이터 보기
========================================================= -->
<div v-if="viewType === 'DATA'" class="content-card" >
    <DataTable
        :value="customerProdList"
        scrollable
        scrollHeight="650px"
        showGridlines
        class="my-table"
        tableStyle="min-width: 1600px;"
    >
        <!-- =================================================
             2단 HEADER
        ================================================== -->
        <ColumnGroup type="header">
            <Row>
                <Column header="구분" :colspan="2" />
                <Column header="하이드로겔" :colspan="5" />
                <Column header="시트" :colspan="4" />
                <Column header="불용성" :colspan="1" />
                <Column header="기초" :colspan="1" />
                <Column header="" :colspan="2" />
            </Row>
            <Row>
                <Column header="No" :style="{ width: '50px' }" />
                <Column header="거래처명" :style="{ width: '230px' }" />
                <!-- 하이드로겔 -->
                <Column header="마스크팩" />
                <Column header="아이패치(JAR)" />
                <Column header="아이패치(POUCH)" />
                <Column header="립패치" />
                <Column header="기타(특수모양)" />
                <!-- 시트 -->
                <Column header="마스크팩" />
                <Column header="아이패치" />
                <Column header="립패치" />
                <Column header="기타(특수모양)" />
                <!-- 불용성 -->
                <Column header="패치류" />
                <!-- 기초 -->
                <Column header="기초화장품" />
                <Column header="기타" />
                <Column header="합계" />
            </Row>
        </ColumnGroup>

        <!-- No -->
        <Column :style="{ width: '50px', textAlign: 'center' }" >
            <template #body="slotProps"> {{ slotProps.index + 1 }} </template>
        </Column>

        <!-- 거래처 -->
        <Column field="clientName" :style="{ width: '230px' }" />
        <!-- 동적 중분류 -->
        <Column
            v-for="category in prodCategories"
            :key="category.code"
            :field="category.field"
            :style="{
                width: category.width || '110px',
                textAlign: 'right'
            }"
        >
            <template #body="slotProps">
                {{ formatNumber( slotProps.data[category.field] ) }}
            </template>
        </Column>
        <!-- 합계 -->
        <Column field="totalQty" :style="{ width: '120px', textAlign: 'right', fontWeight: '600' }" >
            <template #body="slotProps">
                {{ formatNumber( slotProps.data.totalQty ) }}
            </template>
        </Column>
    </DataTable>
</div>

<!-- =========================================================
     차트 보기
========================================================= -->
<div v-else class="chart-content" >
    <!-- =====================================================
         중분류 선택 영역
    ====================================================== -->
    <div class="category-toolbar">
        <div class="category-title">
            중분류 선택
        </div>
        <!-- 전체 -->
        <Button
            label="전체"
            size="small"
            :severity="
                selectedCategory === null
                    ? 'primary'
                    : 'secondary'
            "
            :outlined="selectedCategory !== null"
            @click="selectedCategory = null"
        />
        <!-- 중분류 -->
        <Button
            v-for="category in prodCategories"
            :key="category.code"
            :label="category.label"
            size="small"
            :severity="
                selectedCategory === category.code
                    ? 'primary'
                    : 'secondary'
            "
            :outlined="
                selectedCategory !== category.code
            "
            @click="selectedCategory = category.code"
        />
    </div>

    <!-- =====================================================
         BAR CHART
    ====================================================== -->
    <div class="bar-card">
        <div class="chart-title">
            업체별 생산량
        </div>
        <div
            v-if="customerProdList.length > 0"
            class="customer-bar-chart"
        >
            <Chart type="bar" :data="customerBarData" :options="customerBarOptions" />
        </div>
        <div v-else class="empty-area" > 조회된 데이터가 없습니다. </div>
    </div>
</div>

</template>


<script setup>
import { ApiBase } from '@/api/apiBase'
import { computed, onMounted, reactive, ref } from 'vue'
/* =========================================================
 * 현재년도
========================================================= */
const currentYear = new Date().getFullYear()
const years = ref(
    Array.from(
        {
            length:
                currentYear - 2020 + 1
        },
        (_, index) =>
            currentYear - index
    )
)

/* =========================================================
 * 검색조건
========================================================= */
const form = reactive({
    year: currentYear
})

/* =========================================================
 * 보기 형태
========================================================= */
const viewType = ref('DATA')

/* =========================================================
 * 선택 중분류
 *
 * null = 전체
========================================================= */
const selectedCategory = ref(null)

/* =========================================================
 * LIST
========================================================= */
const customerProdList = ref([])

/* =========================================================
 * 중분류 정의
 *
 * 실제 서버 필드명으로 변경
========================================================= */
const prodCategories = ref([
    {
        code: 'HG_MASK',
        label: '하이드로겔 마스크팩',
        field: 'qty1'
    },
    {
        code: 'HG_JAR',
        label: '하이드로겔 아이패치(JAR)',
        field: 'qty2'
    },
    {
        code: 'HG_POUCH',
        label: '하이드로겔 아이패치(POUCH)',
        field: 'qty3'
    },
    {
        code: 'HG_LIP',
        label: '하이드로겔 립패치',
        field: 'qty4'
    },
    {
        code: 'HG_ETC',
        label: '하이드로겔 기타(특수모양)',
        field: 'qty5'
    },
    {
        code: 'SHEET_MASK',
        label: '시트 마스크팩',
        field: 'qty6'
    },
    {
        code: 'SHEET_EYE',
        label: '시트 아이패치',
        field: 'qty7'
    },
    {
        code: 'SHEET_LIP',
        label: '시트 립패치',
        field: 'qty8'
    },
    {
        code: 'SHEET_ETC',
        label: '시트 기타(특수모양)',
        field: 'qty9'
    },
    {
        code: 'PATCH',
        label: '불용성 패치류',
        field: 'qty10'
    },
    {
        code: 'BASIC',
        label: '기초 화장품',
        field: 'qty11'
    },
    {
        code: 'ETC',
        label: '기타',
        field: 'etcQty'
    }
])

/* =========================================================
 * 차트 색상
========================================================= */
const chartColors = [
    '#42A5F5',
    '#FFA726',
    '#26A69A',
    '#EF5350',
    '#BDBDBD',
    '#5C6BC0',
    '#FFCA28',
    '#AB47BC',
    '#66BB6A',
    '#FF7043',
    '#78909C',
    '#EC407A'
]

/* =========================================================
 * 색상 MAP
========================================================= */
const categoryColorMap = computed(() => {
    const map = {}

    prodCategories.value.forEach(
        (item, index) => {
            map[item.code] =
                chartColors[
                    index %
                    chartColors.length
                ]
        }
    )

    return map
})


/* =========================================================
 * 선택 여부에 따른 색상
========================================================= */
const getCategoryColor = ( category, alpha = 1 ) => {
    const color = categoryColorMap.value[category.code]

    /*
     * 전체 선택
     */
    if (!selectedCategory.value) {
        return color
    }

    /*
     * 선택된 중분류
     */
    if (selectedCategory.value === category.code ) {
        return color
    }

    /*
     * 선택되지 않은 것은
     * 투명하게 처리
     */
    return hexToRgba( color, alpha )
}

/* =========================================================
 * HEX → RGBA
========================================================= */
const hexToRgba = ( hex, alpha ) => {
    const value = hex.replace('#', '')
    const r = parseInt(value.substring(0, 2), 16 )
    const g = parseInt( value.substring(2, 4), 16 )
    const b = parseInt( value.substring(4, 6), 16 )
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* =========================================================
 * BAR DATA
========================================================= */
const customerBarData = computed(() => {
        if (!customerProdList.value.length) {
            return {
                labels: [],
                datasets: []
            }
        }

        return {
            /*
             * Y축 거래처
             */
            labels: customerProdList.value.map(
                    item => item.clientName
                ),

            /*
             * 모든 중분류는 항상 표시
             */
            datasets: prodCategories.value.map(
                    category => {
                        const selected = !selectedCategory.value || selectedCategory.value === category.code

                        return {
                            label: category.label,
                            data: customerProdList.value.map(
                                    item => Number( item[ category.field ] || 0 )
                                ),
                            /*
                             * 선택된 중분류
                             * → 진하게
                             *
                             * 나머지
                             * → 흐리게
                             */
                            backgroundColor: selected ? categoryColorMap.value[ category.code ] : getCategoryColor( category, 0.12 ),
                            borderColor: selected ? categoryColorMap.value[ category.code ] : getCategoryColor( category, 0.25 ),
                            borderWidth: selected ? 1 : 0,
                            /*
                             * 선택된 중분류를
                             * 시각적으로 앞으로
                             */
                            order: selected ? 0 : 10
                        }
                    }
                )
        }
    })


/* =========================================================
 * BAR OPTION
 *
 * 가로 Bar
========================================================= */
const customerBarOptions = computed(() => ({
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: true
        },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 10,
                    font: { size: 11 }
                }
            },

            tooltip: {
                mode: 'nearest',
                intersect: true,
                callbacks: {
                    title:
                        context => {
                            if (!context?.length ) {
                                return ''
                            }

                            return (context[0].label)
                        },
                    label:
                        context => {
                            const name = context .dataset .label
                            const qty = Number( context.raw || 0 ) .toLocaleString()

                            return ( `${name} : ` + `${qty} EA` )
                        }
                }
            }
        },

        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: value =>
                            Number( value ) .toLocaleString()
                }
            },

            y: {
                stacked: false,
                ticks: {
                    autoSkip: false,
                    font: { size: 11 }
                }
            }
        }
    }))

/* =========================================================
 * 검색
========================================================= */
const srhList = async () => {
    try {
        const params = {
            year: form.year,
            strDate: `${form.year}-01-01`,
            endDate: `${Number(form.year) + 1}-01-01`
        }

        /*
         * API는 실제 메서드로 교체
         */
        const res = await ApiBase.getProdCompany(params)

        customerProdList.value = res?.data || res || []

    } catch (error) {
        console.error('업체별 생산량 조회 오류', error )
        customerProdList.value = []
    }
}

/* =========================================================
 * 숫자 FORMAT
========================================================= */
const formatNumber = value =>
    Number( value || 0 ) .toLocaleString()


/* =========================================================
 * Breadcrumb
========================================================= */
const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
    { label: '관리정보' },
    { label: '업체별생산량' }
])

/* =========================================================
 * 최초조회
========================================================= */
onMounted(() => {
    srhList()
})

</script>


<style scoped>

/* =========================================================
   CONTENT CARD
========================================================= */

.content-card {

    width: 100%;

    padding: 12px;

    border: 1px solid #ddd;

    border-radius: 5px;

    background: #fff;

}


/* =========================================================
   TABLE
========================================================= */

:deep(
    .my-table
    .p-datatable-thead
    > tr
    > th
) {

    background:
        #f2f2f2;

    color:
        #444;

    text-align:
        center;

    font-size:
        13px;

    padding:
        5px 6px;

}


:deep(
    .my-table
    .p-datatable-tbody
    > tr
    > td
) {

    font-size:
        13px;

    padding:
        4px 6px;

}


/* =========================================================
   CHART CONTENT
========================================================= */

.chart-content {

    width:
        100%;

}


/* =========================================================
   CATEGORY TOOLBAR
========================================================= */

.category-toolbar {

    display:
        flex;

    align-items:
        center;

    flex-wrap:
        wrap;

    gap:
        6px;

    padding:
        10px 12px;

    margin-bottom:
        8px;

    background:
        #fff;

    border:
        1px solid #ddd;

    border-radius:
        5px;

}


.category-title {

    margin-right:
        8px;

    font-size:
        13px;

    font-weight:
        600;

}


/* =========================================================
   BAR CARD
========================================================= */

.bar-card {

    width:
        100%;

    height:
        720px;

    padding:
        12px;

    background:
        #fff;

    border:
        1px solid #ddd;

    border-radius:
        5px;

}


/* =========================================================
   CHART TITLE
========================================================= */

.chart-title {

    font-size:
        15px;

    font-weight:
        600;

    margin-bottom:
        8px;

}


/* =========================================================
   BAR
========================================================= */

.customer-bar-chart {

    width:
        100%;

    height:
        calc(100% - 30px);

    position:
        relative;

}


:deep(
    .customer-bar-chart
    .p-chart
) {

    width:
        100% !important;

    height:
        100% !important;

}


:deep(
    .customer-bar-chart
    canvas
) {

    width:
        100% !important;

    height:
        100% !important;

}


/* =========================================================
   EMPTY
========================================================= */

.empty-area {

    height:
        650px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    color:
        #777;

}


/* =========================================================
   작은 화면
========================================================= */
@media (
    max-width: 1100px
) {

    .bar-card {

        height:
            600px;

    }

}

</style>
