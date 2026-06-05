<template>
    <Breadcrumb :home="home" :model="items" />

    <form @submit.prevent="srhList" class="space-y-4">
        <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
            <template #start>
                <div class="flex flex-wrap items-center gap-2 w-full">
                    <DateRangePicker
                        v-model:startDate="form.strDate"
                        v-model:endDate="form.endDate"
                        @change="handleDateChange"
                    />

                    <FloatLabel variant="on">
                        <Select
                            v-model="form.procCd"
                            :options="procCds"
                            optionLabel="codeNm"
                            optionValue="code"
                            style="width: 120px"
                        />
                        <label for="on_label">관리구분</label>
                    </FloatLabel>

                    <Button
                        label="검색"
                        icon="pi pi-search"
                        type="submit"
                        class="bg-blue-500 text-white hover:bg-blue-600"
                    />
                </div>
            </template>
        </Toolbar>
    </form>

    <div class="flex items-center justify-end gap-2 mb-2">
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
    </div>

    <div class="table-wrap">
        <table class="item-use-table">
            <thead>
                <tr>
                    <th style="width:110px;">칭량일자</th>
                    <th style="width:130px;">제조번호</th>
                    <th style="width:110px;">품목코드</th>
                    <th style="width:350px;">품목명</th>
                    <th style="width:90px;">생산량</th>
                    <th style="width:60px;">단위</th>
                    <th style="width:110px;">품목코드</th>
                    <th style="width:350px;">품목명</th>
                    <th style="width:100px;">규격</th>
                    <th style="width:100px;">소요량</th>
                </tr>
            </thead>

            <tbody>
                <tr v-if="mergedRows.length === 0">
                    <td colspan="10" class="empty-cell">조회된 데이터가 없습니다.</td>
                </tr>

                <tr v-for="(row, index) in mergedRows" :key="index">
                    <td v-if="row._showMerge" :rowspan="row._rowspan" class="text-center">
                        {{ row.prodDate }}
                    </td>

                    <td v-if="row._showMerge" :rowspan="row._rowspan" class="text-center">
                        {{ row.makeNo }}
                    </td>

                    <td v-if="row._showMerge" :rowspan="row._rowspan" class="text-center">
                        {{ row.itemCd }}
                    </td>

                    <td v-if="row._showMerge" :rowspan="row._rowspan">
                        <span class="break-words">{{ row.itemName }}</span>
                    </td>

                    <td v-if="row._showMerge" :rowspan="row._rowspan" class="text-right">
                        {{ formatNumber(row.orderQty) }}
                    </td>

                    <td v-if="row._showMerge" :rowspan="row._rowspan" class="text-center">
                        {{ row.unit }}
                    </td>

                    <td class="text-center">{{ row.bomItemCd }}</td>
                    <td>{{ row.bomItemName }}</td>
                    <td class="text-center">{{ row.spec }}</td>
                    <td class="text-right">{{ formatNumber(row.qty) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ApiStock } from '@/api/apiStock';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { formatNumber, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { computed, onMounted, reactive, ref } from 'vue';

const form = reactive({
    strDate: minMonth(todayKST(), 3),
    endDate: todayKST(),
    procCd: 'ALL',
    itemGrp1: '',
    itemTypeCd: '',
    areaCd: '',
    itemName: '',
    itemCd: '',
    stdDate: todayKST(),
});

const itemUseList = ref([]);

const procCds = ref([
    { code: 'ALL', codeNm: '전체' },
    { code: 'PRC001', codeNm: '칭량/제조' },
    { code: 'PRC003', codeNm: '코팅' },
    { code: 'PRC004', codeNm: '충전' },
    { code: 'PRC005', codeNm: '포장' }
]);

const mergeFields = ['prodDate', 'makeNo', 'itemCd', 'itemName', 'orderQty', 'unit'];

const getMergeKey = (row) => {
    return mergeFields.map((field) => row[field] ?? '').join('|');
};

const mergedRows = computed(() => {
    const list = itemUseList.value ?? [];

    return list.map((row, index, arr) => {
        const currentKey = getMergeKey(row);
        const prevKey = index > 0 ? getMergeKey(arr[index - 1]) : null;

        const isFirst = currentKey !== prevKey;

        let rowspan = 1;

        if (isFirst) {
            for (let i = index + 1; i < arr.length; i++) {
                if (getMergeKey(arr[i]) === currentKey) {
                    rowspan++;
                } else {
                    break;
                }
            }
        }

        return {
            ...row,
            _showMerge: isFirst,
            _rowspan: rowspan
        };
    });
});

const handleDateChange = () => {};

const srhList = async () => {
    const params = {
        ...form
    };

    const data = await ApiStock.getItemUseList(params);

    itemUseList.value = data.sort((a, b) => {
        return getMergeKey(a).localeCompare(getMergeKey(b));
    });
};

onMounted(async () => {});

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '자재관리' },
    { label: '품목별사용량' },
    { label: '품목별사용량 목록' },
]);

const downloadExcel = () => {
    const columns = [
        { field: 'prodDate', header: '칭량일자' },
        { field: 'makeNo', header: '제조번호' },
        { field: 'itemCd', header: '품목코드' },
        { field: 'itemName', header: '품목명' },
        { field: 'orderQty', header: '생산량' },
        { field: 'unit', header: '단위' },
        { field: 'bomItemCd', header: '품목코드' },
        { field: 'bomItemName', header: '품목명' },
        { field: 'spec', header: '규격' },
        { field: 'qty', header: '소요량' }
    ];

    exportToExcel(mergedRows.value, '품목별사용량 리스트', columns);
};
</script>

<style scoped>
.table-wrap {
    width: 100%;
    max-height: 700px;
    overflow: auto;
}

.item-use-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 14px;
    color: #001f4d;
}

.item-use-table th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #BCAAA4;
    color: white;
    text-align: center;
    font-family: monaco, Consolas;
    height: 38px;
    border: 1px solid #dfe7ef;
}

.item-use-table td {
    height: 38px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #dfe7ef;
    vertical-align: middle;
    background-color: white;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.empty-cell {
    text-align: center;
    height: 80px;
    color: #777;
}

.break-words {
    word-break: break-word;
}
</style>
