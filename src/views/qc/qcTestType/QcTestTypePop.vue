<template>
<div class="mt-3">
    <span style="font-size: large; font-weight: bold;"> 품목 :  {{ itemCd }} / {{ itemName }} </span>
</div>

<div class="flex items-center gap-4 mt-3 mb-2">
    <Button label="추가+" @click="addRow" />
    <Button label="전체삭제" severity="danger" outlined @click="removeALLRows" />
</div>

<div>
    <BaseHotTable
        ref="hotRef"
        :data="testTypeMethodList"
        :colHeaders="colHeaders"
        :columns="columns"
        :colWidths="colWidths"
        :rowHeaders="false"
        :height="430"
        width="100%"
        stretchH="all"
        :autoColumnSize="false"
        :copyPaste="true"
        :fillHandle="true"
        :contextMenu="false"
        :manualColumnResize="true"
        :manualRowResize="false"
        :outsideClickDeselects="false"
        :afterChange="afterChange"
        :afterOnCellMouseDown="afterOnCellMouseDown"
    />
</div>

<div class="flex justify-end gap-2 mt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
    <Button label="닫기" outlined class="mr-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import BaseHotTable from '@/components/BaseHotTable.vue';
import { useAlertStore } from '@/stores/alert';
import { useConfirm } from 'primevue';
import { computed, inject, onMounted, ref } from 'vue';

const { vSuccess } = useAlertStore()

const hotRef = ref(null)
const testTypeMethodList = ref([])
const dialogRef = inject('dialogRef')
const deleteIds = ref([])

const itemCd = ref('')
const itemName = ref('')

const colHeaders = [
    '',
    '검사항목',
    '시험방법',
    '시험기준',
    '시험결과',
    '표시순서',
    '-'
]

const colWidths = [
    45,     // 체크
    120,    // 검사항목
    380,    // 시험방법
    190,    // 시험기준
    130,    // 시험결과
    70,     // 표시순서
    40      // 삭제
]

const deleteRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    td.innerHTML = '<i class="pi pi-trash hot-trash-icon"></i>'

    td.style.textAlign = 'center'
    td.style.verticalAlign = 'middle'
    td.style.padding = '0'

    return td
}

const columns = [
    {
        data: 'checked',
        type: 'checkbox',
        className: 'htCenter htMiddle',
        copyable: false
    },
    {
        data: 'testItem',
        type: 'text',
        className: 'htCenter htMiddle'
    },
    {
        data: 'testMethod',
        type: 'text',
        className: 'htLeft htMiddle'
    },
    {
        data: 'testSpec',
        type: 'text',
        className: 'htCenter htMiddle'
    },
    {
        data: 'testResult',
        type: 'text',
        className: 'htCenter htMiddle'
    },
    {
        data: 'orderDist',
        type: 'numeric',
        className: 'htCenter htMiddle',
        numericFormat: {
            pattern: '0'
        }
    },
    {
        data: 'actions',
        readOnly: true,
        renderer: deleteRenderer,
        copyable: false
    }
]

const selectedRows = computed(() => {
    return testTypeMethodList.value.filter(row => row.checked)
})

const isAllSelected = computed(() => {
    return (
        testTypeMethodList.value.length > 0 &&
        selectedRows.value.length === testTypeMethodList.value.length
    )
})

const saveInfo = async () => {
    testTypeMethodList.value.forEach(row => {
        row.itemCd = itemCd.value
    })

    const saveList = testTypeMethodList.value.map(row => {
        const {
            checked,
            actions,
            ...saveRow
        } = row

        return saveRow
    })

    const params = {
        qcTestInfo: {
                    itemCd:itemCd.value
                },
        deleteIds: deleteIds.value,
        testTypeMethodList: saveList
    }

    const res = await ApiQc.saveTestTypeMethod(params)

    vSuccess(res.message)

    closeDialog()
}

const addRow = () => {
    if (!Array.isArray(testTypeMethodList.value)) {
        testTypeMethodList.value = []
    }

    //let sortNum = 1

    // if (testTypeMethodList.value.length > 0) {
    //     const orderList = testTypeMethodList.value
    //         .map(row => Number(row.orderDist) || 0)

    //     sortNum = Math.max(...orderList) + 1
    // }

    testTypeMethodList.value.push({
        checked: false,
        itemCd: itemCd.value,
        testItem: '',
        testMethod: '',
        testSpec: '',
        testResult: '',
        orderDist: '',
        testTypeMethodId: '',
    })

    refreshHot()
}

const removeRow = (index) => {
    const row = testTypeMethodList.value[index]

    if (!row) {
        return
    }

    if (row.testTypeMethodId) {
        if (!deleteIds.value.includes(row.testTypeMethodId)) {
            deleteIds.value.push(row.testTypeMethodId)
        }
    }

    testTypeMethodList.value.splice(index, 1)

    refreshHot()
}

const confirm = useConfirm()
const removeALLRows =  () => {
    if (testTypeMethodList.value.length === 0) {
        return
    }

    confirm.require({
        header: '전체 삭제 확인',
        message: '전체 데이터를 삭제하시겠습니까?\n삭제 후 저장 시 복구할 수 없습니다.',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: '취소',
        acceptLabel: '삭제',
        acceptClass: 'p-button-danger',

        accept: async () => {
            // 기존 데이터 삭제 ID 수집
            testTypeMethodList.value.forEach(row => {
                if (row.testTypeMethodId) {
                    if (!deleteIds.value.includes(row.testTypeMethodId)) {
                        deleteIds.value.push(row.testTypeMethodId)
                    }
                }
            })

            const params  = {
                qcTestInfo: {
                    itemCd:itemCd.value
                },
                deleteIds: deleteIds.value
            }

            // 화면 전체 삭제
            const res = await ApiQc.deleteTestTypeMethod(params)

            testTypeMethodList.value = []
            deleteIds.value = []

            // Handsontable 갱신
            refreshHot()
            vSuccess('전체 삭제되었습니다.')
        }
    })
}

const afterChange = (changes, source) => {
    if (!changes) {
        return
    }

    if (source === 'loadData') {
        return
    }

    changes.forEach(([row, prop, oldValue, newValue]) => {

        if (prop === 'orderDist') {
            testTypeMethodList.value[row].orderDist =
                newValue === null || newValue === ''
                    ? null
                    : Number(newValue)
        }
    })
}

const afterOnCellMouseDown = (event, coords) => {
    if (coords.row < 0) {
        /*
         * 체크박스 Header 클릭
         */
        if (coords.col === 0) {
            toggleAllCheck()
        }

        return
    }

    /*
     * 마지막 삭제 컬럼
     */
    if (coords.col === 6) {
        removeRow(coords.row)
    }
}

const toggleAllCheck = () => {
    const checked = !isAllSelected.value

    testTypeMethodList.value.forEach(row => {
        row.checked = checked
    })

    refreshHot()
}

const refreshHot = () => {
    setTimeout(() => {
        const hot = hotRef.value?.hotInstance

        if (hot) {
            hot.render()
        }
    })
}

onMounted(async () => {
    itemCd.value = dialogRef.value.data.itemCd
    itemName.value = dialogRef.value.data.itemName

    const res = await ApiQc.getQcTestTypeMethod(itemCd.value)

    testTypeMethodList.value = (res || []).map(row => ({
        ...row,
        checked: false
    }))
})

const closeDialog = () => {
    dialogRef.value.close()
}
</script>

<style scoped>
:deep(.handsontable thead th) {
    background-color: #BCAAA4 !important;
    color: white !important;
    font-size: 14px;
    text-align: center;
    font-family: monaco, Consolas;
}

:deep(.handsontable td) {
    font-size: 13px;
    vertical-align: middle;
}

:deep(.handsontable input[type="checkbox"]) {
    cursor: pointer;
}

:deep(.handsontable .htCheckboxRendererInput) {
    cursor: pointer;
}
:deep(.hot-trash-icon) {
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    display: inline-block;
    vertical-align: middle;
}
</style>
