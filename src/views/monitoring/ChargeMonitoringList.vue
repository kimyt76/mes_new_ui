<template>

<Breadcrumb :home="home" :model="items" />

<div class="mt-3">

    <!-- 설비별 차트 -->
    <Card
        v-for="machine in machines"
        :key="machine.code"
        class="mb-2 monitoring-card"
    >
        <!-- 제목 -->
        <template #title>
            <div class="chart-title">
                {{ machine.name }} - 생산수량 (EA)
            </div>
        </template>

        <!-- 차트 -->
        <template #content>

            <div
                v-if="machine.chartData.labels.length > 0"
                class="chart-container"
            >
                <Chart
                    type="line"
                    :data="machine.chartData"
                    :options="chartOptions"
                />
            </div>

            <div
                v-else
                class="empty-chart"
            >
                조회된 데이터가 없습니다.
            </div>

        </template>

    </Card>

</div>

</template>


<script setup>
import { ApiMonitoring } from '@/api/apiMonitoring'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/* =========================================================
 * 설비
 * ========================================================= */
const machines = ref([
    {
        code: 'SL1',
        name: '튜브충전기',
        chartData: {
            labels: [],
            datasets: []
        }
    },
    {
        code: 'SL4',
        name: '서보충전기(040-579)',
        chartData: {
            labels: [],
            datasets: []
        }
    },
    {
        code: 'SL3',
        name: '서보충전기(040-578)',
        chartData: {
            labels: [],
            datasets: []
        }
    },
    {
        code: 'SL2',
        name: '셀라인충전기',
        chartData: {
            labels: [],
            datasets: []
        }
    }
])

/* =========================================================
 * Chart 옵션
 * ========================================================= */
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    scales: {
        x: {
            grid: {
                display: true
            },

            ticks: {
                autoSkip: true,
                maxTicksLimit: 20
            }
        },
        y: {
            beginAtZero: true,
            suggestedMax: 5000,
            ticks: {
                precision: 0
            }
        }
    }
})

/* =========================================================
 * Polling
 * ========================================================= */
let polling = null

const pollData = () => {
    stopPoll()
    polling = setInterval(() => {
        getDataList()
    }, 60000)
}

const stopPoll = () => {
    if (polling) {
        clearInterval(polling)
        polling = null
    }
}

/* =========================================================
 * 조회
 * ========================================================= */
const getDataList = async () => {
    try {
        const params = {
            strDate: getToday() + ' 00:00',
            endDate: getTomorrow() + ' 00:00'
        }
        const res = await ApiMonitoring.getChargeMonitoringInfo(params)
        /*
         * API 응답 구조
         *
         * {
         *    sl1: [],
         *    sl2: [],
         *    sl3: [],
         *    sl4: []
         * }
         */
        const data = res.data || res.result || {}

        machines.value.forEach(machine => {
            const list = data[machine.code.toLowerCase()] || []
            machine.chartData = makeChartData(list)
        })
    } catch (error) {
        console.error( '충전 모니터링 조회 오류', error )
        clearChartData()
    }
}

/* =========================================================
 * Chart 데이터 생성
 * ========================================================= */
const makeChartData = (list) => {
    if (!list || list.length === 0) {
        return {
            labels: [],
            datasets: []
        }
    }

    return {
        labels: list.map(item =>
            formatTime(item.measureTime)
        ),

        datasets: [
            {
                label: '생산량(EA)',
                data: list.map(item =>
                    Number(item.measureValue || 0)
                ),
                tension: 0.2,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2,
                fill: false
            }
        ]
    }
}

/* =========================================================
 * 차트 초기화
 * ========================================================= */
const clearChartData = () => {
    machines.value.forEach(machine => {
        machine.chartData = {
            labels: [],
            datasets: []
        }
    })
}

/* =========================================================
 * 시간 표시
 *
 * 2026-08-26 09:35:10.000
 *           ↓
 *          09:35
 * ========================================================= */
const formatTime = (value) => {
    if (!value) return ''

    const str = String(value)

    if (str.includes('T')) {
        return str
            .split('T')[1]
            ?.substring(0, 5)
    }

    if (str.includes(' ')) {
        return str
            .split(' ')[1]
            ?.substring(0, 5)
    }

    return str
}


/* =========================================================
 * 오늘
 * ========================================================= */
const getToday = () => {
    const date = new Date()

    return formatDate(date)
}

/* =========================================================
 * 내일
 * ========================================================= */
const getTomorrow = () => {
    const date = new Date()

    date.setDate(
        date.getDate() + 1
    )
    return formatDate(date)
}

/* =========================================================
 * yyyy-MM-dd
 * ========================================================= */
const formatDate = (date) => {
    const yyyy =
        date.getFullYear()

    const mm =
        String(
            date.getMonth() + 1
        ).padStart(2, '0')

    const dd =
        String(
            date.getDate()
        ).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

/* =========================================================
 * Breadcrumb
 * ========================================================= */
const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
    { label: '모니터링' },
    { label: '모니터링' },
    { label: '충전모니터링' }
])

/* =========================================================
 * Life Cycle
 * ========================================================= */
onMounted(() => {
    // 최초 조회
    getDataList()
    // 60초마다 재조회
    pollData()
})


onBeforeUnmount(() => {
    stopPoll()
})

</script>


<style scoped>
/* 전체 카드 */
.monitoring-card {
    width: 100%;
}

/* 카드 제목 */
.chart-title {
    font-size: 14px;
    font-weight: 600;
}

/* 차트 */
.chart-container {
    width: 100%;
    height: 130px;
}

/* 데이터 없음 */
.empty-chart {
    width: 100%;
    height: 130px;
    display: flex;
    align-items: flex-start;
    padding-top: 5px;
    font-size: 13px;
}
/*
 * PrimeVue Card 기본 여백을 줄여서
 * 기존 모니터링 화면처럼 촘촘하게 표시
 */
:deep(.p-card-body) {
    padding: 10px 15px;
}
:deep(.p-card-title) {
    margin-bottom: 6px;
}
:deep(.p-card-content) {
    padding: 5px 0 0 0;
}

</style>
