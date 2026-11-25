
<template>
<Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
    <template #start>
        <div class="flex gap-2">
            <FloatLabel variant="on">
            <InputText
                ref="barcodeInput"
                id="on_label"
                v-model="testNo"
                style="width: 180px"
                @keydown="handleKeydown"
                @input="handleBarcodeInput"
                @keyup.enter="handleEnter"
                @paste.prevent="handleBarcodePaste"
                />
            <label for="on_label">바코드(시험번호)</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" class="bg-blue-500 text-white hover:bg-blue-600" @click="addRow"/>
            <Button label="초기화" icon="pi pi-refresh" severity="secondary" type="button" @click="init" />
        </div>
    </template>
</Toolbar>
<div>
    <DataTable
        :value="itemList"
        scrollHeight="500px"
        class="my-table"
        showGridlines
        >
        <Column field="testNo"      header="시험번호"   :style="{ width: '120px', textAlign: 'center'}" />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', textAlign: 'center'}" />
        <Column field="itemName"    header="품목명"     :style="{ width: '300px'}" />
        <Column field="actions"     header="-"    :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex justify-end gap-2 mt-2">
    <Button label="저장" severity="success"  :disabled="writeYn !== 'Y'" @click="saveGuard(saveInfo)"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>
</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import { inject, nextTick, onMounted, onUnmounted, ref } from 'vue';

const { vSuccess, vWarning, vInfo } = useAlertStore()
const dialogRef = inject('dialogRef')
const itemList = ref([])
const barcodeInput = ref(null)
const testNo = ref('')

let scanTimer = null
let lastKeyTime = 0
let scannerKeyCount = 0
let scanStartTime = 0
let scanInputCount = 0
let scanFastCount = 0
let scanPasteDetected = false

const SCAN_INTERVAL = 100
const SCAN_WAIT = 120
const SCAN_MIN_LENGTH =11

const isSearching = ref(false)
const lastProcessedBarcode = ref('')

const resetScanState = () => {
    clearTimeout(scanTimer)
    scanTimer = null
    lastKeyTime = 0
    scannerKeyCount = 0
    scanStartTime = 0
    scanInputCount = 0
    scanFastCount = 0
    scanPasteDetected = false
}

const handleBarcodePaste = async (event) => {
    if (isSearching.value) {
        return
    }

    // 복사한 문자열 가져오기
    const clipboardText = event.clipboardData?.getData('text') ?? ''

    // 모든 공백, 줄바꿈, 탭 제거
    const barcode = clipboardText.replace(/\s+/g, '')

    resetScanState()
    lastProcessedBarcode.value = ''

    testNo.value = barcode

    // 공백 제거 후 11자리 체크
    if (barcode.length !== SCAN_MIN_LENGTH) {
        await focusBarcode()
        return vWarning('시험번호는 11자리여야 합니다.')
    }

    // 정상적인 시험번호이면 자동 조회
    await addRow()
}

const init = async () =>{
    testNo.value = ''
    lastProcessedBarcode.value = ''
    resetScanState()
    await focusBarcode()
}

const handleKeydown = (event) =>{
    if (event.key === 'Enter') {
        return
    }
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return
    }
    if (event.key.length !== 1) {
        return
    }
    const now = Date.now()
    if (lastKeyTime === 0 || now - lastKeyTime > 300) {
        scanStartTime = now
        scanInputCount = 1
        scanFastCount = 0
        scannerKeyCount = 0
    } else {
        scanInputCount++
        const diff = now - lastKeyTime
        if (diff <= SCAN_INTERVAL) {
            scanFastCount++
            scannerKeyCount++
        }
    }
    lastKeyTime = now
}

const handleBarcodeInput = (event) => {
    clearTimeout(scanTimer)

    const barcode = String(event?.target?.value ?? testNo.value ?? '').trim()

    if (!barcode) {
        resetScanState()
        return
    }

    if (isSearching.value) {
        return
    }

    // 11자리가 아니면 조회하지 않음
    if (barcode.length !== SCAN_MIN_LENGTH) {
        return
    }

    scanTimer = setTimeout(() => {
        const currentBarcode = String(testNo.value ?? '').trim()

        if (!currentBarcode || isSearching.value) {
            return
        }

        // 중복 조회 방지
        if (lastProcessedBarcode.value === currentBarcode) {
            return
        }

        // 입력 방식과 관계없이 11자리이면 자동 조회
        if (currentBarcode.length === SCAN_MIN_LENGTH) {
            addRow()
        }
    }, SCAN_WAIT)
}

const handleEnter = async () =>{
    clearTimeout(scanTimer)
    const barcode = String(testNo.value ?? '').trim()
    if (!barcode || isSearching.value) {
        return
    }
    if (lastProcessedBarcode.value === barcode) {
        return
    }
    await addRow()
}

const addRow = async () =>{
    const barcode = String(testNo.value ?? '').trim()
    if (!barcode) {
        return vWarning('바코드 또는 시험번호를 입력해주세요.');
    }
    if (isSearching.value) {
        return
    }
    if (lastProcessedBarcode.value === barcode) {
        return
    }
    clearTimeout(scanTimer)
    isSearching.value = true
    lastProcessedBarcode.value = barcode
    try {
        const res = await ApiQc.getItemTestNoInfo(barcode);
        if (!res) {
            testNo.value = '';
            lastProcessedBarcode.value = ''
            resetScanState()
            await focusBarcode()
            return vWarning('조회된 품목이 없습니다.');
        }
        const item = {
            testNo: res.testNo,
            itemCd: res.itemCd,
            itemName: res.itemName,
            itemTypeCd: res.itemTypeCd || ''
        };
        const exists = itemList.value.some(o => o.testNo === item.testNo);
        if (exists) {
            testNo.value = '';
            lastProcessedBarcode.value = ''
            resetScanState()
            await focusBarcode()
            return vWarning('이미 추가된 시험번호입니다.');
        }
        itemList.value.push(item);
        testNo.value = '';
        lastProcessedBarcode.value = ''
        resetScanState()
        await focusBarcode();
    } catch (err) {
        lastProcessedBarcode.value = ''
        resetScanState()
        handleApiError(err);
        await focusBarcode()
    } finally {
        isSearching.value = false
    }
}

const focusBarcode = async () => {
    await nextTick();
    const el = barcodeInput.value?.$el
    if (el instanceof HTMLInputElement) {
        el.focus()
    } else {
        el?.querySelector('input')?.focus()
    }
};

const saveInfo = () =>{
    dialogRef.value.close(itemList.value);
}

const removeRow = (index) =>{
    itemList.value.splice(index, 1);
}

const closeDialog = () => {
    dialogRef.value.close();
};

onMounted(() =>{
    focusBarcode()
})

onUnmounted(() => {
    clearTimeout(scanTimer)
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
</style>
