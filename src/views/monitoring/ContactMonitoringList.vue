<template>
<Breadcrumb :home="home" :model="items"/>

<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.tagCd"
                        :options="tagCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 220px"
                    />
                    <label>설비선택</label>
                </FloatLabel>

                <FloatLabel variant="on">
                    <DatePicker
                        v-model="form.stdDate"
                        showIcon
                        dateFormat="yy-mm-dd"
                        :manualInput="false"
                    />
                    <label>기준일자</label>
                </FloatLabel>
                <Button
                    label="검색"
                    icon="pi pi-search"
                    type="submit"
                    class="bg-blue-500 text-white hover:bg-blue-600"
                />
                <Button
                    label="초기화"
                    icon="pi pi-refresh"
                    severity="secondary"
                    type="button"
                    @click="searchReset"
                />
            </div>
        </template>
    </Toolbar>
</form>


<div class="monitor-wrapper">
    <!-- 왼쪽 접점 목록 -->
    <div class="tag-list">

        <DataTable
            v-model:selection="selectedTag"
            v-model:first="first"
            :value="tagInfoList"
            dataKey="tagCd"
            selectionMode="single"
            scrollHeight="750px"
            scrollable
            showGridlines
            class="my-table"
            @row-select="onRowSelect"
        >
            <Column header="No" :style="{ width: '50px', textAlign:'center' }">
                <template #body="slotProps">
                    {{ slotProps.index + 1 + first }}
                </template>
            </Column>
            <Column field="tagCd"  header="접점코드" :style="{ width: '140px', textAlign:'center' }"/>
            <Column field="tagName" header="접점명" :style="{ minWidth: '220px' }" />
        </DataTable>
    </div>

    <!-- 오른쪽 차트 -->
    <div class="chart-area">
        <Card class="w-full">
            <template #title>
                <div class="chart-title">
                    [{{ selectedTag?.tagCd || '선택된 접점 없음' }}]
                    {{ selectedTag?.tagName || '' }}
                </div>
            </template>
            <template #content>
                <div
                    v-if="loading"
                    class="flex justify-center items-center chart-container"
                >
                    <ProgressSpinner />
                </div>
                <div
                    v-else-if="chartData.labels.length > 0"
                    class="chart-container"
                >
                    <Chart
                        type="line"
                        :data="chartData"
                        :options="chartOptions"
                        class="h-full"
                    />
                </div>
                <div v-else class="empty-chart" >
                    조회된 데이터가 없습니다.
                </div>
            </template>
        </Card>
    </div>
</div>

</template>


<script setup>
import { ApiMonitoring } from '@/api/apiMonitoring'
import { todayKST } from '@/util/common'
import { onMounted, reactive, ref } from 'vue'

const first = ref(0)
const tagInfoList = ref([])
const selectedTag = ref(null)
const loading = ref(false)

/* 설비 */
const tagCds = ref([
    { code: 'SL1', codeNm: '튜브충전기' },
    { code: 'SL2', codeNm: '셀라인충전기' },
    { code: 'SL3', codeNm: '서보충전기(040-578)' },
    { code: 'SL4', codeNm: '서보충전기(040-579)' },
])

/* 조회조건 */
const form = reactive({
    tagCd: 'SL1',
    stdDate: todayKST()
})

/* 차트 데이터 */
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: '측정값',
            data: [],
            tension: 0.2,
            pointRadius: 2,
            borderWidth: 2
        }
    ]
})

/* 차트 옵션 */
const chartOptions = ref({
    maintainAspectRatio: false,
    responsive: true,
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
            title: {
                display: false
            },

            ticks: {
                autoSkip: true,
                maxTicksLimit: 15
            }
        },

        y: {
            beginAtZero: true,

            title: {
                display: false
            }
        }
    }
})

/**
 * 검색
 */
const srhList = async () => {
    try {
        loading.value = true

        const params = {
            tagCd: form.tagCd,
            stdDate: form.stdDate
        }

        const res = await ApiMonitoring.getContactTagInfo(params)

        tagInfoList.value = res || res || []

        /*
         * 첫 번째 접점 자동 선택
        */
        if (tagInfoList.value.length > 0) {
            selectedTag.value = tagInfoList.value[0]
            await getTagValue(selectedTag.value)
        } else {
            selectedTag.value = null
            clearChart()
        }
    } catch (error) {
        console.error('접점목록 조회 오류', error)
        tagInfoList.value = []
        selectedTag.value = null
        clearChart()
    } finally {
        loading.value = false
    }
}

/**
 * 행 선택
 */
const onRowSelect = async (event) => {
    if (!event?.data) return
        selectedTag.value = event.data
        await getTagValue(event.data)
}

/**
 * 접점 측정값 조회
 */
const getTagValue = async (row) => {
    if (!row?.tagCd) return
    try {
        loading.value = true
        const params = {
            tagCd: row.tagCd,
            /*
             * API가 기존처럼 LocalDateTime 문자열을 받는다면
             */
            strDate: `${form.stdDate} 00:00`,
            endDate: getNextDate(form.stdDate)
        }
        const res = await ApiMonitoring.getContactTagValue(params)

        const list = res.data || res.result || []

        makeChartData(list)

    } catch (error) {
        console.error('접점 측정값 조회 오류', error)
        clearChart()
    } finally {
        loading.value = false
    }
}

/**
 * 차트 데이터 구성
 *
 * 서버 응답 예
 *
 * {
 *   measureTime : '2026-08-26 10:20:00',
 *   measureValue : 125
 * }
 */
const makeChartData = (list) => {
    if (!list || list.length === 0) {
        clearChart()
        return
    }

    chartData.value = {
        labels: list.map(item =>
            formatTime(item.measureTime)
        ),

        datasets: [
            {
                label: '측정값',

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

/**
 * 차트 초기화
 */
const clearChart = () => {
    chartData.value = {
        labels: [],
        datasets: [
            {
                label: '측정값',
                data: [],
                tension: 0.2,
                pointRadius: 2,
                borderWidth: 2
            }
        ]
    }
}

/**
 * 시간 표시
 *
 * 2026-08-26 10:23:15
 * →
 * 10:23
 */
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


/**
 * 다음 날짜
 *
 * 2026-08-26
 * →
 * 2026-08-27 00:00
 */
const getNextDate = (value) => {
    if (!value) return null

    const date = new Date(`${value}T00:00:00`)

    date.setDate(date.getDate() + 1)

    const yyyy = date.getFullYear()

    const mm = String(
        date.getMonth() + 1
    ).padStart(2, '0')

    const dd = String(
        date.getDate()
    ).padStart(2, '0')

    return `${yyyy}-${mm}-${dd} 00:00`
}

/**
 * 초기화
 */
const searchReset = () => {
    form.tagValueCd = 'SL1'
    form.stdDate = todayKST()
    first.value = 0
    selectedTag.value = null
    tagInfoList.value = []
    clearChart()
}

/**
 * Breadcrumb
 */
const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
    { label: '모니터링' },
    { label: '모니터링' },
    { label: '접점모니터링' }
])

onMounted(() => {
    srhList()
})

</script>


<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
.monitor-wrapper {
    display: flex;
    width: 100%;
    gap: 8px;
}

/* 왼쪽 */
.tag-list {
    width: 34%;
    min-width: 430px;
}

/* 오른쪽 */
.chart-area {
    flex: 1;
    min-width: 0;
}

.chart-title {
    font-size: 15px;
    font-weight: 600;
}

/*
 * 원본 화면은 차트 높이가 낮지만
 * 실사용에서는 이 정도가 보기 편함
 */
.chart-container {
    width: 100%;
    height: 300px;
}

.empty-chart {
    height: 300px;
    display: flex;
    align-items: flex-start;
    padding-top: 5px;
    font-size: 14px;
}


/*
 * 선택된 row 강조
 */
:deep(.p-datatable-tbody > tr.p-highlight) {
    background: #dff7f4;
}


/*
 * 행 클릭 가능하게
 */
:deep(.p-datatable-tbody > tr) {
    cursor: pointer;
}


/*
 * 표 글자 크기
 */
:deep(.my-table .p-datatable-tbody > tr > td) {
    font-size: 13px;
    padding: 4px 8px;
}


/*
 * 헤더
 */
:deep(.my-table .p-datatable-thead > tr > th) {
    font-size: 13px;
    padding: 5px 8px;
}

</style>
