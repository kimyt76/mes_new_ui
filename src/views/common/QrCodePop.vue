
<template>
    <div class="qr-popup">

        <!-- 안내 문구 -->
        <div class="mt-3 qr-header">
            <span class="font-bold size-6">
                - 인쇄매수를 확인하고 출력하세요
            </span>
        </div>

        <!-- 테이블 영역 : 리스트가 많으면 스크롤 -->
        <div class="mt-3 qr-table">
            <DataTable
                :value="itemList"
                class="my-table"
                showGridlines
                scrollable
                scrollHeight="flex"
            >
                <Column
                    field="itemCd"
                    header="품목코드"
                    :style="{ width: '110px', textAlign: 'center' }"
                />

                <Column
                    field="itemName"
                    header="품목명"
                    :style="{ width: '400px' }"
                />

                <Column
                    field="lotNo"
                    header="LOT번호"
                    :style="{ width: '150px', textAlign: 'center' }"
                />

                <Column
                    field="testNo"
                    header="시험번호"
                    :style="{ width: '140px', textAlign: 'center' }"
                />

                <Column
                    field="expiryDate"
                    header="사용기한"
                    :style="{ width: '120px', textAlign: 'center' }"
                />

                <Column
                    field="qty"
                    header="수량"
                    :style="{ width: '100px', textAlign: 'right' }"
                >
                    <template #body="slotProps">
                        <InputNumber
                            v-model="slotProps.data.qty"
                            class="w-full"
                            :min="1"
                            :maxFractionDigits="0"
                            :useGrouping="true"
                            :inputStyle="{
                                width: '70px',
                                textAlign: 'right'
                            }"
                        />
                    </template>
                </Column>

                <Column
                    field="printCnt"
                    header="인쇄매수"
                    :style="{ width: '70px' }"
                >
                    <template #body="slotProps">
                        <InputNumber
                            v-model="slotProps.data.printCnt"
                            class="w-full"
                            :min="1"
                            :maxFractionDigits="0"
                            :useGrouping="true"
                            :inputStyle="{
                                width: '70px',
                                textAlign: 'right'
                            }"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- 하단 버튼 : 항상 표시 -->
        <div class="flex justify-end gap-2 mt-3 qr-footer">
            <Button
                label="인쇄"
                icon="pi pi-print"
                @click="barcodePrint"
            />
            <Button
                label="닫기"
                outlined
                @click="closeDialog"
            />
        </div>

    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef')
const itemList = ref([])
const menuType = ref('')

const barcodePrint = async () => {

    const params = itemList.value.map(v => ({
        testNo: v.testNo,
        qty: v.qty,
        printCnt: v.printCnt ?? 1
    }))

    const win = window.open("", "_blank");

    const pdfBlob = await ApiCommon.barcodePrint(params);

    const url = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
    );

    win.location.href = url;

    win.onload = () => {
        URL.revokeObjectURL(url)
    }
}

onMounted(() => {
    menuType.value = dialogRef.value.data.menuType
    itemList.value = dialogRef.value.data.itemList
})

const closeDialog = () => {
    dialogRef.value.close()
}
</script>

<style scoped>
/* 테이블 헤더 기존 스타일 */
:deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: monaco, Consolas;
}

/* 팝업 전체 높이 */
.qr-popup {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

/* 안내 문구 */
.qr-header {
    flex-shrink: 0;
}

/* 테이블 영역 */
.qr-table {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* DataTable 높이 */
.qr-table :deep(.p-datatable) {
    flex: 1;
    min-height: 0;
    height: 100%;
}

/* 테이블 스크롤 영역 */
.qr-table :deep(.p-datatable-table-container) {
    min-height: 0;
    overflow-y: auto;
}

/* 하단 버튼 영역 */
.qr-footer {
    flex-shrink: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: white;
}
</style>
