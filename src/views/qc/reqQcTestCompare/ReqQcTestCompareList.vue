<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <DatePicker v-model="form.strDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <DatePicker v-model="form.toDate" showIcon fluid iconDisplay="input" inputId="icondisplay" style="width: 130px"/>
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.itemName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop" />
                    </IconField>
                    <label>품목</label>
                </FloatLabel>

                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<!-- 검색영역 아래 / 테이블 위 -->
    <div class="test-item-filter-wrap">
        <button
            type="button"
            class="test-item-filter-btn"
            :class="{ active: selectedTestItem === 'ALL' }"
            @click="selectedTestItem = 'ALL'"
        >
            전체
        </button>

        <button
            v-for="item in testItemOptions"
            :key="item"
            type="button"
            class="test-item-filter-btn"
            :class="{ active: selectedTestItem === item }"
            @click="selectedTestItem = item"
        >
            {{ item }}
        </button>
    </div>

<div class="mt-2">
    <DataTable
        ref="dt"
        v-model:first="first"
        :value="filteredItemList"
        dataKey="qcTestId"
        scrollHeight="680px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="testNo"      header="시험번호" :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="testItem"    header="검사항목" :style="{ width: '150px', textAlign: 'center'}" />
        <Column field="testMethod"  header="시험방법" :style="{ width: '450px'}" />
        <Column field="testSpec"    header="시험기준" :style="{ width: '320px', textAlign: 'center'}" />
        <Column field="testResult"  header="시험결과" :style="{ width: '120px', textAlign: 'center'}" />
        <Column field="testDate"    header="시험일자" :style="{ width: '100px', textAlign: 'center'}"   />
        <Column field="testerName"  header="시험자"   :style="{ width: '80px', textAlign: 'center'}" />
        <Column field="passState"   header="판정"     :style="{ width: '80px', textAlign: 'center'}" />
    </DataTable>
</div>
<!-- 오른쪽: 버튼 -->
<div class="flex justify-end mt-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
</div>
</template>

<script setup>
import { ApiQc } from '@/api/apiQc';
import { useAlertStore } from '@/stores/alert';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const { vWarning } = useAlertStore()
const dt = ref(null)
const first = ref(0)
const dialog = useDialog()
const selectedTestItem = ref('ALL')
const methodList = ref([])
const form = reactive({
    strDate: '',
    toDate: '',
    itemName: '',
    itemCd: '',
})

const testItemOptions = computed(() => {
    const names = methodList.value
        .map(item => item.testItem)
        .filter(name => !!name)

    return [...new Set(names)]
})

const filteredItemList = computed(() => {
    if (selectedTestItem.value === 'ALL') {
        return methodList.value
    }

    return methodList.value.filter(
        item => item.testItem === selectedTestItem.value
    )
})

watch(selectedTestItem, () => {
    first.value = 0
})

const openPop = () =>{
    dialog.open(ItemListSinglePop,{
        props:{
            header: '품목리스트',
            modal: true,
            draggable: false,
        }
        ,onClose: event => {
            if(event){
                form.itemName = event.data.itemName
                form.itemCd = event.data.itemCd
            }
        }
    } )
}

const srhList = async () =>{
    if(  isEmpty(form.itemName) ) return vWarning("품목을 선택해주세요!!")
    selectedTestItem.value = 'ALL'

    const params = {
        ...form
    }

    methodList.value = await ApiQc.getQcTestTypeMethodComp(params)
}

onMounted( () => {
    form.strDate = minMonth(todayKST(), 2)
    form.toDate = todayKST()
})

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(methodList.value, "품목별 검사비교 리스트", cols);
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '품질관리' },
    { label: '품목별 검사비교' },
    { label: '품목별 검사비교목록' },
]);
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}


.test-item-filter-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 10px 0;
}

.test-item-filter-btn {
    padding: 6px 14px;
    border: 1px solid #cfd6e4;
    border-radius: 16px;
    background: #fff;
    color: #49566b;
    cursor: pointer;
    font-size: 13px;
}

.test-item-filter-btn.active {
    background: #4a90e2;
    border-color: #4a90e2;
    color: #fff;
}
</style>
