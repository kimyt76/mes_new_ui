<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchItemList" class="space-y-4">
     <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 120px"
                />
                <label for="on_label">품목구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 150px"/>
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerName" style="width: 150px"/>
                <label for="on_label1">거래처명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemCategory1" :options="itemCategory1s"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 180px"
                />
                <label for="on_label">제품유형(대)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.itemCategory2" :options="itemCategory2s"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 150px"
                />
                <label for="on_label">제품유형(중)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.functionalTypeCd" :options="functionalTypeCds"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 190px"
                />
                <label for="on_label">기능성분류</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600"></Button>
        </div>
        </template>
    </Toolbar>
    </form>
    <div class="flex items-center justify-between mb-2">
        <!-- 왼쪽: 총 건수 -->
        <div class="font-semibold ml-2">
            총 {{ totalCount }} 건
        </div>

        <!-- 오른쪽: 버튼 -->
        <div class="flex items-center gap-2">
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
        </div>
    </div>
    <div class="flex flex-col mt-2">
        <DataTable
            ref="dt"
            :value="itemList"
            dataKey="itemCd"
            :loading="loading"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="650px"
            scrollable
            showGridlines
            >
            <Column header="No" :style="{ width: '40px', textAlign:'center'}">
                <template #body="slotProps">
                    {{ slotProps.index + 1 + (dt?.first ?? 0) }}
                </template>
            </Column>
            <Column field="itemTypeName"    header="품목구분"  :style="{ width: '80px'}" />
            <Column field="itemCd"          header="품목코드"  :style="{ width: '110px'}" />
            <Column field="itemName"        header="품목명"    :style="{ width: '400px'}" bodyClass="break-words">
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.itemCd, slotProps.data.itemTypeCd)" class="clickable-cell">
                        {{ slotProps.data.itemName }}
                    </div>
                </template>
            </Column>
            <Column field="unit"            header="단위"     :style="{ width: '50px', textAlign:'center'}" />
            <Column field="Spec"            header="규격"     :style="{ width: '80px', textAlign:'center'}" />
            <Column field="customerName"    header="거래처"   :style="{ width: '210px'}" />
            <Column field="businessManager" header="영업담당자"  :style="{ width: '80px', textAlign:'center'}"  />
            <Column field="labManager"      header="담당연구원"  :style="{ width: '80px', textAlign:'center'}"  />
            <Column field="itemCategory1Name"   header="제품유형(대)"  :style="{ width: '120px', textAlign:'center'}"  />
            <Column field="itemCategory2Name"   header="제품유형(중)"  :style="{ width: '120px', textAlign:'center'}"  />
        </DataTable>
    </div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ItemInfoM0Pop from './ItemInfoM0Pop.vue';
import ItemInfoM1Pop from './ItemInfoM1Pop.vue';
import ItemInfoM2Pop from './ItemInfoM2Pop.vue';
import ItemInfoM3Pop from './ItemInfoM3Pop.vue';
import ItemInfoM4Pop from './ItemInfoM4Pop.vue';
import ItemInfoM5Pop from './ItemInfoM5Pop.vue';
import ItemInfoM6Pop from './ItemInfoM6Pop.vue';

const dt = ref(null)
const dialog = useDialog()
const loading = ref(false)
const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const functionalTypeCds = ref([])
const itemList = ref([])
const totalCount = computed(() => {
  return Array.isArray(itemList.value) ? itemList.value.length : 0
})
const form = reactive({
    itemName: '',
    itemCd: '',
    customerName: '',
    itemCategory1: '',
    itemCategory2: '',
    functionalTypeCd: '',
    itemTypeCd: null
})

watch(() => form.itemCategory1, async (newVal) => {
  itemCategory2s.value = await ApiItem.getProdMList(form.itemCategory1)
})

const srchItemList = async () => {
    loading.value =true

    const params = {
        ...form
    };
    itemList.value = await ApiItem.getItemList(params);

    loading.value = false
};


onMounted( async () => {
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList()
    functionalTypeCds.value = await ApiCommon.getCodeList('FUNCTIONAL_TYPE')
});

/**
 * 팝업화면
 * @param item
 * @param index
 */
const selectRowClick = (cd, type) => {
    let popTitle = ''
    let currentComponent = ''

    if ( type === 'M0') {
        currentComponent = ItemInfoM0Pop
        popTitle = '완제품'
    }else if ( type === 'M1') {
        currentComponent =ItemInfoM1Pop
        popTitle = '원재료'
    }else if ( type === 'M2') {
        currentComponent =ItemInfoM2Pop
        popTitle = '부자재'
    }else if ( type === 'M3') {
        currentComponent =ItemInfoM3Pop
        popTitle = '반제품'
    }else if ( type === 'M4') {
        currentComponent =ItemInfoM4Pop
        popTitle = '제품'
    }else if ( type === 'M5') {
        currentComponent = ItemInfoM5Pop
        popTitle = '벌크제품'
    }else if ( type === 'M6') {
        currentComponent =ItemInfoM6Pop
        popTitle = '포장품'
    }else if ( type === 'M7') {
        currentComponent =ItemInfoM2Pop
        popTitle = '소모품'
    }

    dialog.open( currentComponent, {
        props: {
        header: '품목정보관리('+popTitle+')',
        modal: true,
        maximizable: false,
        draggable: true,
        style: {
            overflow: 'hidden'
        },
        pt: {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } }
        }
        // 기타 PrimeVue Dialog props 설정
        },
        // 팝업 B에 전달할 데이터
        data: cd
    })
}

const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: '기본관리' },
    { label: '품목정보관리' },
    { label: '품목정보관리목록' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(itemList.value, "품목정보리스트", cols);
}
</script>

<style scoped>
:deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
/* 헤더 내부 flex 컨텐츠 중앙정렬 */
:deep(.my-table .p-datatable-thead > tr > th .p-datatable-column-header-content) {
  justify-content: center !important;
}
/* 텍스트(span)도 중앙정렬 + 폭 100% */
:deep(.my-table .p-datatable-thead > tr > th .p-datatable-column-title) {
  width: 100%;
  text-align: center !important;
}
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 7px 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: Roboto;
}
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
  text-align: left;
}
</style>
