<template>
    <Breadcrumb :home="home" :model="items"/>

    <form @submit.prevent="srhList" class="space-y-4">
        <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
            <template #start>
                <div class="flex flex-wrap items-center gap-2 w-full">

                    <!-- 설비 -->
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

                    <!-- 기준일자 -->
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
                <Column
                    header="No"
                    :style="{ width: '50px', textAlign:'center' }"
                >
                    <template #body="slotProps">
                        {{ slotProps.index + 1 + first }}
                    </template>
                </Column>

                <Column
                    field="tagCd"
                    header="접점코드"
                    :style="{ width: '140px', textAlign:'center' }"
                />

                <Column
                    field="tagName"
                    header="접점명"
                    :style="{ minWidth: '220px' }"
                />
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

                    <!-- 로딩 -->
                    <div
                        v-if="loading"
                        class="flex justify-center items-center chart-container"
                    >
                        <ProgressSpinner />
                    </div>

                    <!-- 차트 -->
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

                    <!-- 데이터 없음 -->
                    <div
                        v-else
                        class="empty-chart"
                    >
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


/* =========================================================
 * 설비
 * ========================================================= */
const tagCds = ref([
    {
        code: 'SL1',
        codeNm: '튜브충전기'
    },
    {
        code: 'SL2',
        codeNm: '셀라인충전기'
    },
    {
        code: 'SL3',
        codeNm: '서보충전기(040-578)'
    },
    {
        code: 'SL4',
        codeNm: '서보충전기(040-579)'
    }
])


/* =========================================================
 * 날짜를 Date 객체로 변환
 *
 * DatePicker는 Date 객체를 사용하도록 통일
 *
 * 입력 가능:
 * 2026-09-03
 * 2026-09-03 00:00
 * Date 객체
 * ========================================================= */
const toDate = (value) => {

    if (!value) {
        return new Date()
    }

    /*
     * 이미 Date 객체이면 복사
     */
    if (value instanceof Date) {
        return new Date(value)
    }

    /*
     * 문자열인 경우
     */
    if (typeof value === 'string') {

        const dateStr = value.substring(0, 10)

        const parts = dateStr.split('-')

        if (parts.length === 3) {

            const year = Number(parts[0])
            const month = Number(parts[1]) - 1
            const day = Number(parts[2])

            return new Date(
                year,
                month,
                day
            )
        }
    }

    return new Date(value)
}


/* =========================================================
 * 조회조건
 *
 * DatePicker의 날짜값은 Date 객체로 통일
 * ========================================================= */
const form = reactive({

    tagCd: 'SL1',

    stdDate: toDate(todayKST())

})


/* =========================================================
 * 차트 데이터
 * ========================================================= */
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


/* =========================================================
 * 차트 옵션
 * ========================================================= */
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


/* =========================================================
 * 검색
 * ========================================================= */
const srhList = async () => {

    try {

        loading.value = true

        const params = {

            tagCd: form.tagCd,

            /*
             * 접점 목록 조회에서는 yyyy-MM-dd만 전송
             */
            stdDate: formatDate(form.stdDate)

        }

        console.log('접점목록 조회조건', params)

        const res =
            await ApiMonitoring.getContactTagInfo(params)


        /*
         * API 응답 구조 대응
         */
        tagInfoList.value =
            res?.data ||
            res?.result ||
            res ||
            []


        /*
         * 첫 번째 접점 자동 선택
         */
        if (tagInfoList.value.length > 0) {

            selectedTag.value =
                tagInfoList.value[0]

            await getTagValue(
                selectedTag.value
            )

        } else {

            selectedTag.value = null

            clearChart()

        }

    } catch (error) {

        console.error(
            '접점목록 조회 오류',
            error
        )

        tagInfoList.value = []

        selectedTag.value = null

        clearChart()

    } finally {

        loading.value = false

    }
}


/* =========================================================
 * 행 선택
 * ========================================================= */
const onRowSelect = async (event) => {

    console.log(
        '선택 접점',
        event?.data
    )

    if (!event?.data) {
        return
    }

    await getTagValue(
        event.data
    )
}


/* =========================================================
 * 날짜 포맷
 *
 * Date
 * →
 * yyyy-MM-dd
 *
 * 문자열이 들어와도 처리 가능
 * ========================================================= */
const formatDate = (value) => {

    if (!value) {
        return ''
    }

    let date = value


    /*
     * 문자열이면 Date로 변환
     */
    if (!(value instanceof Date)) {

        date = toDate(value)

    }


    /*
     * 유효하지 않은 날짜
     */
    if (
        !date ||
        isNaN(date.getTime())
    ) {

        console.error(
            '잘못된 날짜값',
            value
        )

        return ''

    }


    const yyyy =
        date.getFullYear()


    const mm =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            '0'
        )


    const dd =
        String(
            date.getDate()
        ).padStart(
            2,
            '0'
        )


    return `${yyyy}-${mm}-${dd}`
}


/* =========================================================
 * 다음 날짜
 *
 * Date
 * →
 * 다음날 00:00
 *
 * 예)
 * 2026-09-03
 * →
 * 2026-09-04 00:00
 * ========================================================= */
const getNextDate = (value) => {

    if (!value) {
        return null
    }


    const date =
        toDate(value)


    date.setDate(
        date.getDate() + 1
    )


    return `${formatDate(date)} 00:00`
}


/* =========================================================
 * 접점 측정값 조회
 * ========================================================= */
const getTagValue = async (row) => {

    if (!row?.tagCd) {
        return
    }

    try {

        loading.value = true


        /*
         * Spring LocalDateTime
         *
         * @JsonFormat(
         *   pattern = "yyyy-MM-dd HH:mm"
         * )
         *
         * 형식에 맞춰서 전송
         */
        const params = {

            tagCd: row.tagCd,

            strDate:
                `${formatDate(form.stdDate)} 00:00`,

            endDate:
                getNextDate(form.stdDate)

        }


        console.log(
            '측정값 조회조건',
            params
        )


        /*
         * 실제 전송값 예
         *
         * {
         *   tagCd   : 'SL1P04',
         *   strDate : '2026-09-03 00:00',
         *   endDate : '2026-09-04 00:00'
         * }
         */


        const res =
            await ApiMonitoring
                .getContactTagValue(params)


        const list =
            res?.data ||
            res?.result ||
            res ||
            []


        makeChartData(list)


    } catch (error) {

        console.error(
            '접점 측정값 조회 오류',
            error
        )

        clearChart()

    } finally {

        loading.value = false

    }
}


/* =========================================================
 * 차트 데이터 구성
 *
 * 서버 응답 예
 *
 * {
 *   measureTime  : '2026-09-03T10:20:00',
 *   measureValue : 125
 * }
 * ========================================================= */
const makeChartData = (list) => {

    if (
        !list ||
        list.length === 0
    ) {

        clearChart()

        return

    }


    chartData.value = {

        labels:
            list.map(
                item =>
                    formatTime(
                        item.measureTime
                    )
            ),

        datasets: [
            {

                label: '측정값',

                data:
                    list.map(
                        item =>
                            Number(
                                item.measureValue || 0
                            )
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


/* =========================================================
 * 시간 표시
 *
 * 서버:
 * 2026-09-03T10:23:15
 *
 * 또는
 *
 * 2026-09-03 10:23:15
 *
 * 화면:
 * 10:23
 * ========================================================= */
const formatTime = (value) => {

    if (!value) {
        return ''
    }


    const str =
        String(value)


    /*
     * LocalDateTime 기본 형태
     */
    if (
        str.includes('T')
    ) {

        return str
            .split('T')[1]
            ?.substring(0, 5)

    }


    /*
     * yyyy-MM-dd HH:mm:ss
     */
    if (
        str.includes(' ')
    ) {

        return str
            .split(' ')[1]
            ?.substring(0, 5)

    }


    return str
}


/* =========================================================
 * 초기화
 * ========================================================= */
const searchReset = () => {

    /*
     * 기존 tagValueCd 오류 수정
     */
    form.tagCd = 'SL1'


    /*
     * DatePicker는 Date 객체 유지
     */
    form.stdDate =
        toDate(todayKST())


    first.value = 0

    selectedTag.value = null

    tagInfoList.value = []

    clearChart()
}


/* =========================================================
 * Breadcrumb
 * ========================================================= */
const home = ref({
    icon: 'pi pi-home'
})


const items = ref([
    {
        label: '모니터링'
    },
    {
        label: '모니터링'
    },
    {
        label: '접점모니터링'
    }
])


/* =========================================================
 * 최초 조회
 * ========================================================= */
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


/* =========================================================
 * 전체 영역
 * ========================================================= */
.monitor-wrapper {
    display: flex;
    width: 100%;
    gap: 8px;
}


/* =========================================================
 * 왼쪽 접점 목록
 * ========================================================= */
.tag-list {
    width: 34%;
    min-width: 430px;
}


/* =========================================================
 * 오른쪽 차트
 * ========================================================= */
.chart-area {
    flex: 1;
    min-width: 0;
}


.chart-title {
    font-size: 15px;
    font-weight: 600;
}


/* =========================================================
 * 차트 높이
 * ========================================================= */
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


/* =========================================================
 * 선택된 행
 * ========================================================= */
:deep(.my-table .p-datatable-tbody > tr.p-highlight) {
    background: #dff7f4;
}


/* =========================================================
 * 행 클릭
 * ========================================================= */
:deep(.my-table .p-datatable-tbody > tr) {
    cursor: pointer;
}


/* =========================================================
 * 테이블 내용
 * ========================================================= */
:deep(.my-table .p-datatable-tbody > tr > td) {
    font-size: 13px;
    padding: 4px 8px;
}


/* =========================================================
 * 테이블 헤더
 * ========================================================= */
:deep(.my-table .p-datatable-thead > tr > th) {
    font-size: 13px;
    padding: 5px 8px;
}

</style>
