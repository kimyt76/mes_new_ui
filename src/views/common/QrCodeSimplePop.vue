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
            <Button label="검색" icon="pi pi-search" class="bg-blue-500 text-white hover:bg-blue-600"  @click="addRow"/>
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
import { inject, nextTick, onMounted, ref } from 'vue';

const { vSuccess, vWarning, vInfo } = useAlertStore()
const dialogRef = inject('dialogRef')
const itemList = ref([])
const barcodeInput = ref(null)
const testNo = ref('')

let scanTimer = null
let lastKeyTime = 0
let scannerKeyCount = 0

const isSearching = ref(false)
const lastProcessedBarcode = ref('')

const init = async () =>{
    testNo.value = ''
    lastProcessedBarcode.value = ''
    scannerKeyCount = 0
    lastKeyTime = 0

    clearTimeout(scanTimer)

    await focusBarcode()
}

const handleKeydown = (event) =>{
    if (event.key === 'Enter') {
        return
    }

    const now = Date.now()

    if (lastKeyTime > 0) {
        const diff = now - lastKeyTime

        // 스캐너는 일반적으로 문자간 입력속도가 매우 빠름
        if (diff < 50) {
            scannerKeyCount++
        } else {
            // 직접 입력으로 판단
            scannerKeyCount = 0
        }
    }

    lastKeyTime = now
}

const handleBarcodeInput = () =>{
    clearTimeout(scanTimer)

    const barcode = testNo.value?.trim()

    if (!barcode) {
        scannerKeyCount = 0
        return
    }

    /*
     * QR / 바코드 스캐너는 짧은 시간에 연속으로 값을 입력하기 때문에
     * scannerKeyCount가 일정 횟수 이상이면 스캔으로 판단한다.
     *
     * 직접 입력은 Enter를 눌러야 조회된다.
     */
    scanTimer = setTimeout(() => {
        if (scannerKeyCount >= 2 && barcode) {
            addRow()
        }

    }, 80)
}

const handleEnter = async () =>{
    clearTimeout(scanTimer)

    const barcode = testNo.value?.trim()

    if (!barcode) {
        return vWarning('바코드 또는 시험번호를 입력해주세요.');
    }

    /*
     * 스캐너가 마지막에 Enter를 같이 전송하는 경우
     * 이미 자동 조회한 값이면 다시 조회하지 않는다.
     */
    if (lastProcessedBarcode.value === barcode) {
        testNo.value = ''
        lastProcessedBarcode.value = ''
        scannerKeyCount = 0

        await focusBarcode()

        return
    }

    await addRow()
}

const addRow = async () =>{
    const barcode = testNo.value?.trim();

    if (!barcode) {
        return vWarning('바코드 또는 시험번호를 입력해주세요.');
    }

    if (isSearching.value) {
        return
    }

    if (lastProcessedBarcode.value === barcode) {
        return
    }

    isSearching.value = true
    lastProcessedBarcode.value = barcode

    try {
        const res = await ApiQc.getItemTestNoInfo(barcode);

        if (!res) {
            testNo.value = '';
            lastProcessedBarcode.value = ''
            scannerKeyCount = 0

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
            scannerKeyCount = 0

            await focusBarcode()

            return vWarning('이미 추가된 시험번호입니다.');
        }

        itemList.value.push(item);

        testNo.value = '';
        lastProcessedBarcode.value = ''
        scannerKeyCount = 0
        lastKeyTime = 0

        await focusBarcode();

    } catch (err) {
        lastProcessedBarcode.value = ''
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
