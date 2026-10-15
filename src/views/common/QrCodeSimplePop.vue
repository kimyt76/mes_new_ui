
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
    <Button label="저장" severity="success" @click="saveInfo"/>
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

const handleBarcodeInput = (event) =>{
    clearTimeout(scanTimer)
    const barcode = String(testNo.value ?? '').trim()
    if (!barcode) {
        resetScanState()
        return
    }
    if (isSearching.value) {
        return
    }
    // 스캐너가 문자열을 한 번에 입력하는 경우
    if (event?.inputType === 'insertFromPaste') {
        scanPasteDetected = true
    }
    // 키보드 이벤트 없이 전체 문자열이 입력되는 장치 대응
    if (scanInputCount === 0 && barcode.length >= SCAN_MIN_LENGTH) {
        scanPasteDetected = true
    }
    scanTimer = setTimeout(() => {
        const currentBarcode = String(testNo.value ?? '').trim()
        if (!currentBarcode || isSearching.value) {
            return
        }
        const elapsed = scanStartTime > 0 ? lastKeyTime - scanStartTime : 0
        const isFastScan =
            scanInputCount >= SCAN_MIN_LENGTH &&
            scanFastCount >= Math.max(3, Math.floor((scanInputCount - 1) * 0.6)) &&
            elapsed <= Math.max(500, scanInputCount * SCAN_INTERVAL)

        if (currentBarcode.length === SCAN_MIN_LENGTH && (isFastScan || scanPasteDetected)) {
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
