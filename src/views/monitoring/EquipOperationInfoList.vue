<template>
    <div class="equipment-monitor">
        <!-- Breadcrumb -->
        <Breadcrumb :home="home" :model="items" class="mb-3" />
        <!-- 설비별 -->
        <Card
            v-for="equipment in equipmentList"
            :key="equipment.equipmentCd"
            class="equipment-card"
        >
            <!-- 설비명 -->
            <template #title>
                <div class="equipment-title">
                    {{ equipment.equipmentName }}
                </div>
            </template>

            <!-- Timeline -->
            <template #content>
                <div class="timeline-wrapper">
                    <!-- 시간 Grid -->
                    <div class="timeline">
                        <div class="timeline-grid">
                            <div
                                v-for="hour in hours"
                                :key="hour"
                                class="grid-cell"
                            />
                        </div>

                        <!-- 가동 / 비가동 막대 -->
                        <div
                            v-for="(segment, index) in equipment.segments"
                            :key="index"
                            class="work-bar"
                            :class="segment.status === 'RUN'
                                ? 'status-run'
                                : 'status-stop'"
                            :style="getBarStyle(segment)"
                            :title="getSegmentTitle(segment)"
                        />
                    </div>

                    <!-- 시간 -->
                    <div class="time-label-area">
                        <div
                            v-for="hour in hours"
                            :key="hour"
                            class="time-label"
                        >
                            {{ formatHour(hour) }}
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>


<script setup>

import { onMounted, onUnmounted, ref } from 'vue'

import Breadcrumb from 'primevue/breadcrumb'
import Card from 'primevue/card'

import { ApiMonitoring } from '@/api/apiMonitoring'


/* =========================================================
 * 시간 설정
 * ========================================================= */
const START_HOUR = 8
const END_HOUR = 24

const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, index) => START_HOUR + index
)

/* =========================================================
 * 설비
 * ========================================================= */
const equipmentList = ref([
    {
        equipmentCd: 'SL1',
        equipmentName: '튜브충전기',
        segments: []
    },
    {
        equipmentCd: 'SL4',
        equipmentName: '서보충전기(040-579)',
        segments: []
    },
    {
        equipmentCd: 'SL3',
        equipmentName: '서보충전기(040-578)',
        segments: []
    },
    {
        equipmentCd: 'SL2',
        equipmentName: '셀라인충전기',
        segments: []
    }
])


/* =========================================================
 * 서버 조회
 * ========================================================= */
const getDataList = async () => {

    try {

        const res =
            await ApiMonitoring.getEquipOperationInfoList()

        /*
         * API 구조가
         *
         * {
         *     sl1: [],
         *     sl2: [],
         *     sl3: [],
         *     sl4: []
         * }
         *
         * 또는
         *
         * {
         *     result: {
         *         sl1: [],
         *         ...
         *     }
         * }
         */

        const data = res?.result ?? res?.data ??res ??{}

        setEquipmentSegments(
            'SL1',
            data.sl1 || []
        )
        setEquipmentSegments(
            'SL2',
            data.sl2 || []
        )
        setEquipmentSegments(
            'SL3',
            data.sl3 || []
        )
        setEquipmentSegments(
            'SL4',
            data.sl4 || []
        )
    } catch (error) {
        console.error('설비 가동정보 조회 오류', error)
    }
}


/* =========================================================
 * 해당 설비에 Timeline 적용
 * ========================================================= */

const setEquipmentSegments = (
    equipmentCd,
    list
) => {

    const equipment =
        equipmentList.value.find(
            item =>
                item.equipmentCd === equipmentCd
        )

    if (!equipment) return

    equipment.segments =
        makeSegments(list)
}


/* =========================================================
 * 서버 데이터 → 가동/비가동 구간 생성
 *
 * diff < 60
 *      가동
 *
 * diff >= 60
 *      비가동
 *
 * 기존 Google Timeline 로직과 동일한 개념
 * ========================================================= */

const makeSegments = (list) => {

    const segments = []

    const startMinute =
        START_HOUR * 60

    const currentMinute =
        getCurrentMinute()


    /*
     * 데이터 없음
     *
     * 08:00 ~ 현재까지 비가동
     */
    if (!list || list.length === 0) {

        if (currentMinute > startMinute) {

            segments.push({
                status: 'STOP',
                startMinute,
                endMinute: currentMinute
            })

        }

        return segments
    }


    /*
     * 시간순 정렬
     */
    const sortedList =
        [...list].sort(
            (a, b) =>
                getMinute(a.measureTime)
                -
                getMinute(b.measureTime)
        )


    const firstMinute =
        getMinute(
            sortedList[0].measureTime
        )


    /*
     * 08:00 ~ 첫 데이터
     * 비가동
     */
    if (firstMinute > startMinute) {

        segments.push({
            status: 'STOP',
            startMinute,
            endMinute: firstMinute
        })

    }


    /*
     * 첫 가동 시작
     */
    let runStartMinute =
        firstMinute

    let lastMinute =
        firstMinute


    for (
        let i = 1;
        i < sortedList.length;
        i++
    ) {

        const row =
            sortedList[i]

        const minute =
            getMinute(row.measureTime)


        /*
         * 기존 데이터의 diff 사용
         *
         * 없으면 이전 시간과 차이 계산
         */
        const diff =
            row.diff ??
            ((minute - lastMinute) * 60)


        /*
         * 60초 미만
         * 계속 가동
         */
        if (Number(diff) < 60) {

            lastMinute =
                minute

            continue
        }


        /*
         * 지금까지 가동
         */
        if (
            lastMinute >
            runStartMinute
        ) {

            segments.push({
                status: 'RUN',
                startMinute:
                    runStartMinute,
                endMinute:
                    lastMinute
            })

        }


        /*
         * 비가동 구간
         */
        if (
            minute >
            lastMinute
        ) {

            segments.push({
                status: 'STOP',
                startMinute:
                    lastMinute,
                endMinute:
                    minute
            })

        }


        /*
         * 새로운 가동 시작
         */
        runStartMinute =
            minute

        lastMinute =
            minute
    }


    /*
     * 마지막 가동구간
     */
    if (
        lastMinute >=
        runStartMinute
    ) {

        /*
         * 데이터가 한 건이거나
         * 마지막 구간이 짧은 경우
         * 최소 표시가 필요한 경우를 위해
         * 현재까지 연결하지 않고
         * 마지막 측정 시점까지만 표시
         */

        if (
            lastMinute >
            runStartMinute
        ) {

            segments.push({
                status: 'RUN',
                startMinute:
                    runStartMinute,
                endMinute:
                    lastMinute
            })

        }

    }


    /*
     * 마지막 측정시간 ~ 현재
     * 비가동
     */
    if (
        currentMinute >
        lastMinute
    ) {

        segments.push({
            status: 'STOP',
            startMinute:
                lastMinute,
            endMinute:
                currentMinute
        })

    }


    return segments
}


/* =========================================================
 * 날짜시간 → 하루 기준 분
 *
 * 지원
 *
 * 2026-08-25 10:32:15
 * 2026-08-25T10:32:15
 * 10:32
 * ========================================================= */

const getMinute = (dateTime) => {

    if (!dateTime) return 0

    const value =
        String(dateTime)


    /*
     * yyyy-MM-dd HH:mm:ss
     */
    const timePart =
        value.includes('T')
            ? value.split('T')[1]
            : value.includes(' ')
                ? value.split(' ')[1]
                : value


    const [
        hour = 0,
        minute = 0
    ] =
        timePart
            .split(':')
            .map(Number)


    return (
        (hour * 60)
        +
        minute
    )
}


/* =========================================================
 * 현재시간
 * ========================================================= */
const getCurrentMinute = () => {

    const now =
        new Date()

    let minute =
        (now.getHours() * 60)
        +
        now.getMinutes()


    const minMinute =
        START_HOUR * 60

    const maxMinute =
        END_HOUR * 60


    if (minute < minMinute) {

        return minMinute

    }


    if (minute > maxMinute) {

        return maxMinute

    }


    return minute
}


/* =========================================================
 * 막대 위치 계산
 * ========================================================= */
const getBarStyle = (segment) => {

    const baseMinute =
        START_HOUR * 60

    const totalMinute =
        (END_HOUR - START_HOUR)
        * 60


    let start =
        segment.startMinute

    let end =
        segment.endMinute


    /*
     * 화면 범위 제한
     */
    start =
        Math.max(
            start,
            baseMinute
        )

    end =
        Math.min(
            end,
            END_HOUR * 60
        )


    const left =
        (
            (start - baseMinute)
            /
            totalMinute
        ) * 100


    const width =
        (
            (end - start)
            /
            totalMinute
        ) * 100


    return {
        left: `${left}%`,
        width: `${width}%`
    }
}


/* =========================================================
 * Tooltip
 * ========================================================= */
const getSegmentTitle = (segment) => {

    const status =
        segment.status === 'RUN'
            ? '가동'
            : '비가동'

    return `${status} ${minuteToTime(segment.startMinute)} ~ ${minuteToTime(segment.endMinute)}`
}

/* =========================================================
 * 분 → HH:mm
 * ========================================================= */
const minuteToTime = (minute) => {
    const hour =
        Math.floor(
            minute / 60
        )
    const min =
        minute % 60

    return (
        `${String(hour).padStart(2, '0')}:`
        +
        `${String(min).padStart(2, '0')}`
    )
}

/* =========================================================
 * 시간 Label
 * ========================================================= */

const formatHour = (hour) => {

    return (
        `${String(hour).padStart(2, '0')}:00`
    )
}


/* =========================================================
 * Polling
 * ========================================================= */

let polling = null


onMounted(async () => {
    await getDataList()

    /*
     * 1분마다 조회
     */
    polling = setInterval(
            getDataList,
            60000
        )
})


onUnmounted(() => {
    if (polling) {
        clearInterval(
            polling
        )
    }
})


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
        label: '설비가동정보'
    }
])

</script>


<style scoped>

/* =========================================================
   전체
========================================================= */

.equipment-monitor {

    width: 100%;

    padding: 10px;

    box-sizing: border-box;
}


/* =========================================================
   PrimeVue Card
========================================================= */

.equipment-card {

    margin-top: 15px;

    border-radius: 5px;

    overflow: hidden;

    box-shadow:
        0 2px 4px
        rgba(0, 0, 0, 0.2);
}


/*
 * Card 기본 padding 조절
 */

.equipment-card :deep(.p-card-body) {

    padding: 0;
}


.equipment-card :deep(.p-card-title) {

    margin: 0;

    border-bottom:
        1px solid
        #dddddd;
}


.equipment-card :deep(.p-card-content) {

    padding:
        16px
        16px
        38px
        16px;
}


/* =========================================================
   제목
========================================================= */

.equipment-title {

    height: 52px;

    display: flex;

    align-items: center;

    padding:
        0 16px;

    font-size:
        14px;

    font-weight:
        700;

    color:
        #111111;
}


/* =========================================================
   Timeline
========================================================= */

.timeline-wrapper {

    width:
        100%;
}


.timeline {

    position:
        relative;

    width:
        100%;

    height:
        42px;

    border:
        1px solid
        #cccccc;

    box-sizing:
        border-box;

    overflow:
        hidden;

    background:
        #ffffff;
}


/* =========================================================
   Grid
========================================================= */
.timeline-grid {

    position:
        absolute;

    inset:
        0;

    display:
        grid;

    grid-template-columns:
        repeat(16, 1fr);

    z-index:
        1;
}

.grid-cell {

    height:
        100%;

    border-right:
        1px solid
        #e5e5e5;

    box-sizing:
        border-box;
}

.grid-cell:last-child {

    border-right:
        none;
}
/* =========================================================
   가동 / 비가동
========================================================= */
.work-bar {

    position:
        absolute;

    top:
        8px;

    height:
        25px;

    z-index:
        2;

    cursor:
        default;
}


/*
 * 가동
 */
.status-run {

    background:
        #0066cc;
}


/*
 * 비가동
 */
.status-stop {

    background:
        #ffcccc;
}


/* =========================================================
   시간
========================================================= */

.time-label-area {

    width:
        100%;

    display:
        grid;

    grid-template-columns:
        repeat(16, 1fr);

    margin-top:
        7px;
}


.time-label {

    font-size:
        12px;

    font-weight:
        700;

    color:
        #000000;

    white-space:
        nowrap;

    text-align:
        left;
}


/* =========================================================
   작은 화면
========================================================= */

@media (max-width: 1200px) {

    .equipment-card
    :deep(.p-card-content) {

        overflow-x:
            auto;
    }


    .timeline-wrapper {

        min-width:
            1100px;
    }

}

</style>
