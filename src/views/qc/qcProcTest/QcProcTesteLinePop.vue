```vue
<template>
    <div class="mt-4">
        <DataTable
            :value="lineList"
            dataKey="orderDist"
            showGridlines
            class="my-table"
        >
         <!-- =====================================================
                 순번
                 ===================================================== -->
            <Column field="orderDist" header="순번" style="width: 10%">
                <template #body="{ data }">
                    {{ data.orderDist }}
                </template>
            </Column>
            <!-- =====================================================
                 라인명
                 ===================================================== -->
            <Column field="lineName" header="라인명" style="width: 35%">
                <template #body="{ data }">
                    <InputText
                        v-model="data.lineName"
                        class="w-full"
                        placeholder="라인명"
                    />
                </template>
            </Column>
            <!-- =====================================================
                 저울
                 ===================================================== -->
            <Column field="scaleNickname" header="저울" style="width: 35%" >
                <template #body="{ data }">
                    <InputText v-model="data.scaleNickname" class="w-full" placeholder="저울"  readonly @click="scalePop(data)"/>
                </template>
            </Column>
            <!-- =====================================================
                 삭제
                 ===================================================== -->
            <Column
                header="삭제"
                style="width: 10%"
            >
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        :disabled="deleting"
                        @click="deleteLine(data)"
                    />
                </template>
            </Column>
            <template #empty>
                데이터가 없습니다.
            </template>
        </DataTable>
    </div>
    <!-- =============================================================
         버튼
         ============================================================= -->
    <div class="flex justify-end gap-2 mt-3">
        <Button
            label="저장"
            icon="pi pi-save"
            :loading="saving"
            @click="saveLine"
        />

        <Button
            label="닫기"
            icon="pi pi-times"
            severity="secondary"
            @click="closeDialog"
        />
    </div>
</template>


<script setup>
import { ApiQc } from '@/api/apiQc'
import { useAlertStore } from '@/stores/alert'
import { useDialog } from 'primevue'
import { inject, onMounted, ref } from 'vue'
import QcProcTestScalePop from './QcProcTestScalePop.vue'


/* =========================================================
 * Dialog
 * ========================================================= */
const dialogRef = inject('dialogRef')
const dialog = useDialog()
/* =========================================================
 * Alert
 * ========================================================= */
const {vSuccess, vWarning } = useAlertStore()
/* =========================================================
 * 상태
 * ========================================================= */
const saving = ref(false)
const deleting = ref(false)

/* =========================================================
 * Dialog 전달 데이터
 * ========================================================= */
const qcProcTestMstId = ref(null)
const testType = ref('')

const scalePop = (row) =>{
    dialog.open(QcProcTestScalePop, {
        props:{
            header:'저울',
            modal: true,
            draggable: false,
        },
        onClose: (event) =>{
            if(event) {
                row.scaleCd = event.data.scaleCd
                row.scaleNickname = event.data.scaleNickname
            }
        }
    })
}

/* =========================================================
 * Line 기본 데이터 1건 생성
 * ========================================================= */
const createDefaultLine = (orderDist) => {
    return {
        qcProcTestLineId: null,
        qcProcTestMstId:qcProcTestMstId.value,
        testType:testType.value,
        lineName: '',
        scaleNickname: '',
        scaleCd: '',
        orderDist
    }
}
/* =========================================================
 * Line 기본 5개 생성
 *
 * lineList는 무조건 5개
 * ========================================================= */
const createDefaultLineList = () => {
    return Array.from(
        { length: 5 },
        (_, index) =>
            createDefaultLine(index + 1)
    )
}

/* =========================================================
 * Line List
 * 최초에도 무조건 5줄
 * ========================================================= */
const lineList = ref(
    createDefaultLineList()
)

/* =========================================================
 * Line List 초기화
 *
 * 호출할 때마다 무조건 5개
 * ========================================================= */
const resetLineList = () => {
    lineList.value = createDefaultLineList()
}

/* =========================================================
 * 서버 데이터 병합
 * 0개 -> 화면 5개
 * 2개 -> 화면 5개
 * 5개 -> 화면 5개
 * 7개 -> 화면 5개
 * 무조건 orderDist 1 ~ 5만 사용
 * ========================================================= */
const setLineList = (serverList = []) => {
    const defaultList = createDefaultLineList()

    if (!Array.isArray(serverList)) {
        lineList.value = defaultList
        return
    }
    /*
     * 서버에서 5개 이상 내려와도
     * orderDist 1 ~ 5 데이터만 사용
     */
    const validServerList =
        serverList.filter(
            item => {
                const orderDist = Number(item.orderDist)
                return (
                    orderDist >= 1 &&
                    orderDist <= 5
                )
            }
        )

    /*
     * 기본 5개 행에
     * 서버 데이터를 orderDist 기준으로 병합
     */
    lineList.value =
        defaultList.map(
            defaultItem => {
                const savedItem =
                    validServerList.find(
                        item =>
                            Number(
                                item.orderDist
                            ) ===
                            defaultItem.orderDist
                    )
                /*
                 * 저장 데이터 없음
                 */
                if (!savedItem) {
                    return defaultItem
                }

                /*
                 * 저장 데이터 있음
                 */
                return {
                    ...defaultItem,
                    ...savedItem,

                    qcProcTestLineId: savedItem.qcProcTestLineId ??null,
                    qcProcTestMstId: savedItem.qcProcTestMstId ?? qcProcTestMstId.value,
                    testType: savedItem.testType ?? testType.value,
                    lineName: savedItem.lineName ??'',
                    scaleCd: savedItem.scaleCd ?? '',
                    /*
                     * 순번은 서버값을 신뢰하지 않고
                     * 기본 순번을 강제로 유지
                     */
                    orderDist: defaultItem.orderDist
                }
            }
        )
}
/* =========================================================
 * 라인 조회
 * ========================================================= */
const loadLineList = async () => {
    try {
        const params = {
            qcProcTestMstId: qcProcTestMstId.value,
            testType: testType.value
        }
console.log('params 조회:',params)
        const res = await ApiQc.getQcProcTestTabInfo(params)
        console.log('line 조회:',res)
        /*
         * 실제 API Response 구조에 맞게
         * 이 부분만 조정하면 됩니다.
         *
         * 예)
         * res.lineList
         * res.data
         * res
         */
        const serverList = res?.lineList ?? []
        setLineList(serverList)
    }catch (error) {
        console.error(
            '라인 조회 오류:',
            error
        )
        /*
         * 조회 실패해도
         * 무조건 5줄
         */
        resetLineList()
        vWarning('라인정보 조회 중 오류가 발생했습니다.')
    }
}

/* =========================================================
 * 저장
 * ========================================================= */
const saveLine = async () => {
    if (saving.value) {
        return
    }
    try {
        saving.value = true
        /*
         * 항상 5개만 생성
         */
        const saveList =
            lineList.value
                .map(
                    (item, index) => ({
                        ...item,
                        qcProcTestMstId:qcProcTestMstId.value,
                        testType:testType.value,
                    })
                )

        const params = {
            qcProcTestMst :{
                qcProcTestMstId:qcProcTestMstId.value,
                testType:testType.value,
            },
            lineList:saveList
        }

        console.log('라인 저장:', JSON.parse( JSON.stringify(params) ))
        await ApiQc.saveQcProcTestLineList(params)
        vSuccess('저장되었습니다.')
        /*
         * 저장 후 서버 기준으로 다시 조회
         *
         * 조회 후에도 setLineList 때문에
         * 반드시 5줄
         */
       // await loadLineList()
    }
    catch (error) {
        console.error(
            '라인 저장 오류:',
            error
        )
        vWarning('저장 중 오류가 발생했습니다.')
    }finally {
        saving.value = false
    }
}

/* =========================================================
 * 삭제
 * ========================================================= */
const deleteLine = async (item) => {
    if (deleting.value) {
        return
    }
    /*
     * 현재 행의 순번을 보관
     *
     * 삭제 후에도 이 순번의 행은
     * 화면에서 유지해야 함
     */
    const orderDist = Number(item.orderDist)

    try {
        deleting.value = true
        /* =================================================
         * DB에 저장되어 있는 데이터
         * ================================================= */
        if (item.qcProcTestLineId) {
            const params = {
                qcProcTestLineId:item.qcProcTestLineId,
                qcProcTestMstId:qcProcTestMstId.value,
                testType:testType.value
            }
            console.log(
                '라인 삭제:',
                params
            )
            /*
             * 실제 삭제 API명에 맞게 변경
             */
            await ApiQc.deleteQcProcTestLine(
                params
            )
            vSuccess(
                '삭제되었습니다.'
            )
        }
        /* =================================================
         * 화면 데이터 삭제 처리
         *
         * splice 사용 금지
         *
         * 행을 제거하는 것이 아니라
         * 해당 orderDist의 행을 빈 데이터로 교체
         * ================================================= */
        clearLine(orderDist)
    }
    catch (error) {
        console.error('라인 삭제 오류:',error)
        vWarning('삭제 중 오류가 발생했습니다.')
    }
    finally {
        deleting.value = false
    }
}

/* =========================================================
 * 해당 행 초기화
 *
 * 배열에서 제거하지 않는다.
 * 따라서 항상 5줄 유지
 * ========================================================= */
const clearLine = (orderDist ) => {
    const index =
        lineList.value.findIndex(item =>Number(item.orderDist) ===Number(orderDist))

    if (index === -1) return

    /*
     * 해당 위치를 새 빈 객체로 교체
     */
    lineList.value[index] = createDefaultLine(Number(orderDist))
}
/* =========================================================
 * 닫기
 * ========================================================= */
const closeDialog = () => {
    dialogRef?.value?.close()
}

/* =========================================================
 * 최초 진입
 * ========================================================= */
onMounted(async () => {
        const data =dialogRef?.value?.data

        if (!data) {
            resetLineList()
            return
        }

        qcProcTestMstId.value = data.qcProcTestMstId
        testType.value = data.testType
console.log('qcProcTestMstId.value', qcProcTestMstId.value)
console.log('testType.value', testType.value)
        /*
         * Dialog 데이터 설정 후
         * 다시 기본값 생성해야
         *
         * qcProcTestMstId / testType이
         * 기본행에도 들어감
         */
        resetLineList()
        await loadLineList()
    }
)
</script>


<style scoped>
/* DataTable 헤더 */
.line-data-table
:deep(.p-datatable-thead > tr > th) {
    padding: 4px 6px !important;
    height: 30px;
    text-align: center;
}

/* DataTable 셀 */
.line-data-table
:deep(.p-datatable-tbody > tr > td) {
    padding: 2px 4px !important;
    height: 34px;
    text-align: center;
}

/* InputText */
.line-data-table
:deep(.p-inputtext) {
    padding: 4px 6px !important;
    height: 30px;
    width: 100%;
}

/* InputNumber 전체 */
.line-data-table
:deep(.p-inputnumber) {
    width: 100%;
}

/* InputNumber 실제 input */
.line-data-table
:deep(.p-inputnumber-input) {
    padding: 4px 6px !important;
    height: 30px;
    width: 100%;
}

/* 삭제 버튼도 작게 */
.line-data-table
:deep(.p-button) {
    width: 28px;
    height: 28px;
    padding: 2px !important;
}
</style>
```
