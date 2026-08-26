<template>

<Breadcrumb :home="home" :model="items" />
<!-- =========================================================
     검색조건
========================================================= -->
<form @submit.prevent="srhList">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex items-center gap-2">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.year"
                        :options="years"
                        placeholder="년도 선택"
                        style="width: 130px"
                    />
                    <label>기준년도</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" type="submit" />
            </div>
        </template>
    </Toolbar>
</form>

<!-- =========================================================
     생산실적 TABLE
========================================================= -->
<div class="table-area">
    <DataTable
        :value="workOrderList"
        scrollable
        showGridlines
        class="my-table table-fixed-height"
        tableStyle="min-width: 1600px; table-layout: fixed;"
    >
        <!-- =================================================
             2단 HEADER
        ================================================== -->
        <ColumnGroup type="header">
            <Row>
                <Column header="유형구분" :colspan="2" />
                <Column header="월별 평균수율 내역(%)" :colspan="13"/>
            </Row>
            <Row>
                <Column header="대분류" :style="{ width: '150px' }" />
                <Column header="중분류" :style="{ width: '180px' }" />
                <Column
                    v-for="month in 12"
                    :key="`header-${month}`"
                    :header="`${month}월`"
                    :style="{ width: '100px' }"
                />
                <Column header="전체 평균수율" :style="{ width: '140px' }" />
            </Row>
        </ColumnGroup>
        <!-- 대분류 -->
        <Column field="prodLgName" :style="{width: '150px',textAlign: 'center'}"/>
        <!-- 중분류 -->
        <Column field="prodMdName" :style="{width: '180px',textAlign: 'center'}"/>
        <!-- 1월 ~ 12월 -->
        <Column
            v-for="month in 12"
            :key="`body-${month}`"
            :field="`mon${month}Avg`"
            :style="{
                width: '100px',
                textAlign: 'right'
            }"
        >
            <template #body="slotProps">
                {{  formatNumber(slotProps.data[`mon${month}Avg`])}}
            </template>
        </Column>
        <!-- 총 생산수량 -->
        <Column field="totAvgYield" :style="{width: '140px',textAlign: 'right',fontWeight: '600'}">
            <template #body="slotProps">
                {{  formatNumber(slotProps.data.totAvgYield)}}
            </template>
        </Column>
    </DataTable>
</div>
<!-- =========================================================
     CHART AREA
========================================================= -->
<div class="chart-wrapper">
    <!-- =====================================================
         BAR CHART
    ====================================================== -->
    <div class="chart-box bar-area">

        <div class="chart-title">
            월별 생산수율
        </div>
        <div
            v-if="workOrderList.length > 0"
            class="bar-chart"
        >

            <Chart
                type="bar"
                :data="barChartData"
                :options="barChartOptions"
            />
        </div>

        <div
            v-else
            class="empty-chart"
        >
            조회된 데이터가 없습니다.
        </div>

    </div>
    <!-- =====================================================
         DOUGHNUT CHART
    ====================================================== -->
    <div class="chart-box doughnut-area">
        <div class="chart-title">
            생산수율
        </div>
        <div
            v-if="workOrderList.length > 0"
            class="doughnut-chart"
        >

            <Chart
                type="doughnut"
                :data="doughnutChartData"
                :options="doughnutChartOptions"
                :plugins="[
                    ChartDataLabels,
                    doughnutCenterPlugin
                ]"
            />

        </div>


        <div
            v-else
            class="empty-chart"
        >
            조회된 데이터가 없습니다.
        </div>

    </div>

</div>

</template>


<script setup>
import { ApiBase } from '@/api/apiBase'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, onMounted, reactive, ref } from 'vue'
/* =========================================================
 * 현재년도
========================================================= */
const currentYear = new Date().getFullYear()

/* =========================================================
 * LIST
========================================================= */
const workOrderList = ref([])

/* =========================================================
 * 검색조건
========================================================= */
const form = reactive({
    year: currentYear
})

/* =========================================================
 * 년도 LIST
 *
 * 현재년도 ~ 2020
========================================================= */
const years = ref(
    Array.from(
        {
            length: currentYear - 2020 + 1
        },
        (_, index) =>
            currentYear - index
    )
)

/* =========================================================
 * 차트 색상
========================================================= */
const chartColors = [
    '#42A5F5',
    '#FFA726',
    '#66BB6A',
    '#EF5350',
    '#AB47BC',
    '#26A69A',
    '#FFCA28',
    '#5C6BC0',
    '#EC407A',
    '#8D6E63',
    '#78909C',
    '#7E57C2',
    '#26C6DA',
    '#D4E157',
    '#FF7043',
    '#29B6F6',
    '#9CCC65',
    '#FFB74D',
    '#BA68C8',
    '#4DB6AC'
]

/* =========================================================
 * 중분류별 색상
========================================================= */
const colorMap = computed(() => {
    const map = {}

    workOrderList.value.forEach(
        (item, index) => {

            const key =
                item.prodMdName
                || `item-${index}`


            map[key] =
                chartColors[
                    index
                    %
                    chartColors.length
                ]
        }
    )

    return map
})

/* =========================================================
 * 조회
========================================================= */
const srhList = async () => {
    try {
        /*
         * 예)
         *
         * year    : 2026
         * strDate : 2026-01-01
         * endDate : 2027-01-01
         */
        const params = {
            year:form.year,
            strDate: `${form.year}-01-01`,
            endDate:`${Number(form.year) + 1}-01-01`
        }

        const res = await ApiBase.getProdPerformanc(params)
        workOrderList.value = res|| res || []
    } catch (error) {
        console.error( '생산실적 조회 오류', error)
        workOrderList.value = []
    }
}

/* =========================================================
 * 숫자 FORMAT
========================================================= */
const formatNumber = (value) => {
    return Number(
        value || 0
    ).toLocaleString()
}

/* =========================================================
 * 차트 전체 표시명
 *
 * 예:
 * 하이드로겔-마스크팩
========================================================= */
const getChartLabel = (item) => {
    const lg = item.prodLgName || ''
    const md = item.prodMdName || ''

    if (!lg) {
        return md
    }

    if (!md) {
        return lg
    }

    return `${lg}-${md}`
}

/* =========================================================
 * BAR DATA
========================================================= */

const barChartData = computed(() => {
    if (!workOrderList.value.length) {

        return {
            labels: [],
            datasets: []
        }
    }

    return {
        /*
         * 1월 ~ 12월
         */
        labels: Array.from(
            {
                length: 12
            },
            (_, index) =>
                `${index + 1}월`
        ),

        /*
         * 모든 생산분류
         */
        datasets:
            workOrderList.value.map(
                item => {
                    const color =
                        colorMap.value[
                            item.prodMdName
                        ]
                    return {
                        label:getChartLabel(item),
                        data: Array.from(
                            {
                                length: 12
                            },
                            (_, index) =>
                                Number(
                                    item[
                                        `mon${index + 1}Avg`
                                    ]
                                    || 0
                                )
                        ),
                        backgroundColor:color,
                        borderColor:color,
                        borderWidth:1,
                        borderRadius:2
                    }
                }
            )
    }
})

/* =========================================================
 * BAR OPTION
========================================================= */
const barChartOptions = computed(() => ({

    responsive: true,
    maintainAspectRatio: false,

    interaction: {
        mode: 'nearest',
        intersect: true
    },

    plugins: {

        legend: {
            position: 'bottom',

            labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                boxWidth: 10,
                boxHeight: 10,
                padding: 10,

                font: {
                    size: 11
                }
            }
        },

        tooltip: {
            enabled: true,

            // 해당 Bar 하나만
            mode: 'nearest',
            intersect: true,

            callbacks: {

                title: (context) => {

                    if (!context?.length) {
                        return ''
                    }

                    return context[0].label
                },

                label: (context) => {

                    const name =
                        context.dataset.label

                    const avg =
                        Number(
                            context.raw || 0
                        ).toLocaleString()

                    return `${name} : ${avg} %`
                }
            }
        },

        datalabels: {
            display: false
        }
    },

    scales: {

        x: {
            grid: {
                display: false
            },

            ticks: {
                font: {
                    size: 12
                }
            }
        },

        y: {
            beginAtZero: true,
            ticks: {
                callback: (value) => Number(value).toLocaleString()
            }
        }
    }

}))


/* =========================================================
 * DOUGHNUT DATA
========================================================= */
const doughnutChartData = computed(() => {
    if (!workOrderList.value.length) {
        return {
            labels: [],
            datasets: []
        }
    }

    return {
        /*
         * 범례 / Tooltip에는
         * 대분류-중분류
         */
        labels:workOrderList.value.map(
                item =>getChartLabel(item)
            ),
        datasets: [
            {
                /*
                 * 연간 전체수율
                 */
                data: workOrderList.value.map(
                        item =>
                            Number(item.totAvgYield|| 0)
                    ),

                /*
                 * 중분류별 색상
                 */
                backgroundColor:
                    workOrderList.value.map(
                        item =>

                            colorMap.value[
                                item.prodMdName
                            ]
                    ),

                /*
                 * 흰색 경계선
                 */
                borderColor:'#ffffff',
                borderWidth:3,

                /*
                 * 조각 사이 간격
                 */
                spacing:4,

                /*
                 * 조각 모서리
                 */
                borderRadius:6,

                /*
                 * 마우스 오버 시
                 * 조각이 밖으로 이동
                 */
                hoverOffset:14
            }
        ]
    }
})


/* =========================================================
 * DOUGHNUT OPTIONS
========================================================= */

const doughnutChartOptions = computed(() => ({

    responsive: true,

    maintainAspectRatio: false,


    /*
     * 가운데 구멍
     */
    cutout:
        '54%',


    layout: {

        padding: {

            top: 15,

            bottom: 10,

            left: 15,

            right: 15

        }

    },


    plugins: {

        /* =================================================
         * 범례
        ================================================== */
        legend: {

            position: 'bottom',


            labels: {

                usePointStyle: true,

                pointStyle: 'circle',

                boxWidth: 9,

                boxHeight: 9,

                padding: 10,


                font: {

                    size: 11

                }

            }

        },


        /* =================================================
         * Tooltip
        ================================================== */
        tooltip: {

            enabled: true,


            callbacks: {

                label: (context) => {

                    const value =
                        Number(
                            context.raw || 0
                        )


                    const total =
                        context.dataset.data.reduce(

                            (sum, current) =>

                                sum
                                +
                                Number(
                                    current || 0
                                ),

                            0

                        )


                    const percent =

                        total === 0

                            ? '0.0'

                            : (

                                value
                                /
                                total
                                *
                                100

                            ).toFixed(1)


                    return (
                        `${context.label} : `
                        +
                        `${value.toLocaleString()} EA `
                        +
                        `(${percent}%)`
                    )

                }

            }

        },


        /* =================================================
         * 조각 내부 %
        ================================================== */
        datalabels: {

            /*
             * 너무 작은 조각은
             * 퍼센트 표시하지 않음
             */
            display: (context) => {

                const data =
                    context.dataset.data


                const total =
                    data.reduce(

                        (sum, current) =>

                            sum
                            +
                            Number(
                                current || 0
                            ),

                        0

                    )


                const value =
                    Number(

                        data[
                            context.dataIndex
                        ]
                        || 0

                    )


                const percent =

                    total === 0

                        ? 0

                        : value / total * 100


                return percent >= 3

            },


            /*
             * 34.6%
             */
            formatter: (
                value,
                context
            ) => {

                const data =
                    context.dataset.data


                const total =
                    data.reduce(

                        (sum, current) =>

                            sum
                            +
                            Number(
                                current || 0
                            ),

                        0

                    )


                const percent =

                    total === 0

                        ? 0

                        : Number(
                            value || 0
                        )
                        /
                        total
                        *
                        100


                return (
                    `${percent.toFixed(1)}%`
                )

            },


            /*
             * 이미지처럼 흰 글씨
             */
            color:
                '#ffffff',


            /*
             * 퍼센트 뒤 반투명 배경
             */
            backgroundColor:
                'rgba(255,255,255,0.20)',


            borderRadius:
                5,


            padding: {

                top: 4,

                bottom: 4,

                left: 6,

                right: 6

            },


            font: {

                size: 11,

                weight: 'bold'

            }

        }

    }

}))


/* =========================================================
 * DOUGHNUT CENTER PLUGIN
 *
 * 기본:
 *
 * 총 생산수량
 * 25,800,000 EA
 * 11개 유형
 *
 * Hover:
 *
 * 아이패치(POUCH)
 * 8,922,726 EA
 * 34.6%
========================================================= */

const doughnutCenterPlugin = {

    id: 'doughnutCenterText',


    afterDraw(chart) {

        const meta =
            chart.getDatasetMeta(0)


        /*
         * 데이터가 없으면 종료
         */
        if (
            !meta
            ||
            !meta.data
            ||
            !meta.data.length
        ) {

            return

        }


        const dataset =
            chart.data.datasets[0]


        if (!dataset) {

            return

        }


        /*
         * 실제 Doughnut의 중심좌표
         */
        const centerX =
            meta.data[0].x

        const centerY =
            meta.data[0].y


        /*
         * 전체 생산량
         */
        const total =
            dataset.data.reduce(

                (sum, value) =>

                    sum
                    +
                    Number(
                        value || 0
                    ),

                0

            )


        /*
         * 기본값
         */
        let title =
            '총 생산수량'

        let value =
            total

        let subText =
            `${workOrderList.value.length}개 유형`


        /*
         * 현재 Hover중인 조각
         */
        const active =
            chart.getActiveElements()


        if (
            active
            &&
            active.length > 0
        ) {

            const index =
                active[0].index


            /*
             * 가운데는 너무 길지 않도록
             * 중분류만 표시
             */
            title =
                workOrderList.value[index]
                    ?.prodMdName
                ||
                chart.data.labels[index]


            value =
                Number(
                    dataset.data[index]
                    || 0
                )


            const percent =

                total === 0

                    ? 0

                    : (

                        value
                        /
                        total
                        *
                        100

                    ).toFixed(1)


            subText =
                `${percent}%`

        }


        const ctx =
            chart.ctx


        ctx.save()


        ctx.textAlign =
            'center'

        ctx.textBaseline =
            'middle'


        /* =================================================
         * 제목
        ================================================== */

        ctx.fillStyle =
            '#8A94A6'

        ctx.font =
            '11px Arial'


        /*
         * 제목이 긴 경우
         * 최대 길이 제한
         */
        let displayTitle =
            String(title || '')


        if (
            displayTitle.length > 15
        ) {

            displayTitle =
                displayTitle.substring(
                    0,
                    14
                )
                +
                '…'

        }


        ctx.fillText(

            displayTitle,

            centerX,

            centerY - 25

        )


        /* =================================================
         * 생산수량
        ================================================== */

        ctx.fillStyle =
            '#334155'

        ctx.font =
            'bold 18px Arial'


        ctx.fillText(

            `${value.toLocaleString()} EA`,

            centerX,

            centerY

        )


        /* =================================================
         * 비율 / 유형 수
        ================================================== */

        ctx.fillStyle =
            '#94A3B8'

        ctx.font =
            '11px Arial'


        ctx.fillText(

            subText,

            centerX,

            centerY + 25

        )
        ctx.restore()
    }
}


/* =========================================================
 * Breadcrumb
========================================================= */
const home = ref({
    icon:'pi pi-home'
})

const items = ref([
    {   label:'기본관리'},
    {   label:'기타관리'},
    {   label:'생산수율 목록'}
])

/* =========================================================
 * 최초 조회
========================================================= */
onMounted(() => {
    srhList()
})

</script>


<style scoped>

/* =========================================================
   TABLE AREA
========================================================= */

.table-area {

    height:
        370px;

    width:
        100%;

    border:
        1px solid #ddd;

    border-radius:
        5px;

    padding:
        12px;

    background:
        #fff;

    overflow:
        hidden;

}


/* =========================================================
   DataTable 전체 높이
========================================================= */

:deep(
    .table-fixed-height.p-datatable
) {

    height:
        100%;

    display:
        flex;

    flex-direction:
        column;

}


/* =========================================================
   DataTable Scroll
========================================================= */

:deep(
    .table-fixed-height
    .p-datatable-table-container
) {

    flex:
        1;

    min-height:
        0;

    overflow:
        auto;

}


/* =========================================================
   TABLE HEADER
========================================================= */

:deep(
    .my-table
    .p-datatable-thead
    > tr
    > th
) {

    background-color:
        #BCAAA4;

    color:
        white;

    font-size:
        13px;

    font-weight:
        600;

    text-align:
        center;

    font-family:
        monaco,
        Consolas;

    padding:
        5px;

    white-space:
        nowrap;

}


/* =========================================================
   TABLE BODY
========================================================= */

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

    white-space:
        nowrap;

}

/* =========================================================
   CHART WRAPPER
========================================================= */
.chart-wrapper {
    display: flex;
    width: 100%;
    gap: 8px;
    margin-top: 12px;
    height: 400px;
}


/* =========================================================
   CHART BOX
========================================================= */
.chart-box {
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;

    padding: 10px 14px;

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    display: flex;
    flex-direction: column;

    height: 100%;
    min-width: 0;
}


/* =========================================================
   BAR
========================================================= */
.bar-area {
    flex: 65;
}

.bar-chart {
    flex: 1;
    min-height: 0;
    width: 100%;
    position: relative;
}


/* =========================================================
   DOUGHNUT
========================================================= */
.doughnut-area {
    flex: 35;
}

.doughnut-chart {
    flex: 1;
    min-height: 0;
    width: 100%;
    position: relative;
}


/* =========================================================
   CHART
========================================================= */
:deep(.bar-chart .p-chart),
:deep(.doughnut-chart .p-chart) {
    width: 100% !important;
    height: 100% !important;
}

:deep(.bar-chart canvas),
:deep(.doughnut-chart canvas) {
    width: 100% !important;
    height: 100% !important;
}


/* =========================================================
   TITLE
========================================================= */
.chart-title {
    flex-shrink: 0;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 5px;
}

/* =========================================================
   EMPTY
========================================================= */
.empty-chart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    color: #777;
    font-size: 13px;
}

</style>
