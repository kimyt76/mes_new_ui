<template>
<!-- 전체 팝업 카드 -->
<Card class="search-card">
    <template #content>
        <form @submit.prevent="searchList" class="search-form">

            <div class="search-fields">

                <FloatLabel variant="on" class="search-item">
                    <InputText
                        id="itemCd"
                        v-model="form.itemCd"
                        class="w-full"
                    />
                    <label for="itemCd">품목코드</label>
                </FloatLabel>

                <FloatLabel variant="on" class="search-item search-item-name">
                    <InputText
                        id="itemName"
                        v-model="form.itemName"
                        class="w-full"
                    />
                    <label for="itemName">품목명</label>
                </FloatLabel>

                <FloatLabel variant="on" class="search-item">
                    <InputText
                        id="managerName"
                        v-model="form.managerName"
                        class="w-full"
                    />
                    <label for="managerName">담당자명</label>
                </FloatLabel>

                <FloatLabel variant="on" class="search-item search-item-client">
                    <InputText
                        id="clientName"
                        v-model="form.clientName"
                        class="w-full"
                    />
                    <label for="clientName">고객사명</label>
                </FloatLabel>

            </div>

            <div class="search-button-area">
                <Button
                    label="검색"
                    icon="pi pi-search"
                    severity="secondary"
                    type="submit"
                    class="search-button"
                />
            </div>

        </form>
    </template>
</Card>


<!-- 리스트 영역 -->
<div class="list-section mt-3">
    <DataTable
        :value="contractList"
        dataKey="contractItemId"
        paginator
        :rows="15"
        :rowsPerPageOptions="[15, 30, 40]"
        tableStyle="table-layout: fixed; width: 100%"
        columnResizeMode="fit"
        class="my-table"
        scrollable
        scrollHeight="500px"
        showGridlines
        selectionMode="single"
        @row-select="selectedRow"
    >
        <Column field="poNo" header="PO NO" :style="{ width: '130px', textAlign: 'center' }" />
        <Column field="itemName" header="품목명" :style="{ width: '370px' }" />
        <Column field="deliveryReqDate" header="납기일자" :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="clientName" header="고객사명" :style="{ width: '200px' }" />
        <Column field="qty" header="총수량" :style="{ width: '90px', textAlign: 'right' }" >
            <template #body="slotProps">
                {{ Number(slotProps.data.qty || 0).toLocaleString() }}
            </template>
        </Column>

        <Column
            field="reQty"
            header="남은수량"
            :style="{ width: '90px', textAlign: 'right' }"
        >
            <template #body="slotProps">
                {{ Number(slotProps.data.reQty || 0).toLocaleString() }}
            </template>
        </Column>
    </DataTable>
</div>


<!-- 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button
        label="닫기"
        outlined
        @click="closeDialog"
    />
</div>

</template>


<script setup>
import { ApiOrder } from '@/api/apiOrders'
import { inject, onMounted, reactive, ref } from 'vue'

const dialogRef = inject('dialogRef')

const contractList = ref([])

const form = reactive({
    itemCd: '',
    itemName: '',
    managerName: '',
    clientName: ''
})


const searchList = async () => {

    const params = {
        ...form
    }

    contractList.value = await ApiOrder.getContractList(params)
}


onMounted(() => {

    if (dialogRef?.value) {

        dialogRef.value.options.props.style = {
            ...dialogRef.value.options.props.style,
            width: '1100px',
            maxWidth: 'none',
        }

    }

    searchList()
})


const selectedRow = (event) => {
    dialogRef.value.close(event.data)
}


const closeDialog = () => {
    dialogRef.value.close()
}
</script>


<style scoped>

/* ============================= */
/* 검색 영역 */
/* ============================= */

.search-card {
    width: 100%;
    margin-top: 4px;
}


/* PrimeVue Card 내부 여백 */
:deep(.search-card .p-card-body) {
    padding: 14px 16px;
}

:deep(.search-card .p-card-content) {
    padding: 0;
}


/* 검색 전체 한 줄 */
.search-form {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
}


/* 검색 입력 영역 */
.search-fields {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}


/* 기본 검색 필드 */
.search-item {
    width: 175px;
    flex: 0 0 175px;
}


/* 품목명 조금 넓게 */
.search-item-name {
    width: 210px;
    flex-basis: 210px;
}


/* 고객사명 조금 넓게 */
.search-item-client {
    width: 210px;
    flex-basis: 210px;
}


/* Input 높이 통일 */
:deep(.search-item .p-inputtext) {
    width: 100%;
    height: 38px;
    font-size: 13px;
}


/* FloatLabel 글자 */
:deep(.search-item label) {
    font-size: 12px;
}


/* 검색 버튼 영역 */
.search-button-area {
    margin-left: auto;
    flex-shrink: 0;
}


/* 검색버튼 */
.search-button {
    height: 38px;
    min-width: 92px;
}


/* ============================= */
/* 리스트 */
/* ============================= */

.list-section {
    width: 100%;
    height: 500px;
}


/* DataTable Header */
:deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: Monaco, Consolas, monospace;
}


/* DataTable Cell */
:deep(.my-table .p-datatable-tbody > tr > td) {
    font-size: 13px;
}


/* 행 마우스 오버 */
:deep(.my-table .p-datatable-tbody > tr:hover) {
    background-color: #f8fafc;
    cursor: pointer;
}

</style>
