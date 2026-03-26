<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchItemList" class="space-y-4">
    <Fluid class="flex">
        <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <FormatFiled
                v-model="form.itemTypeCd"
                type="select"
                label="품목구분"
                :options="itemTypeCds"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 150px;"
            />
            <FormatFiled
                v-model="form.itemName"
                type="text"
                label="품목명"
                style="width: 260px;"
            />
            <FormatFiled
                v-model="form.itemCd"
                type="text"
                label="품목코드"
                style="width: 160px;"
            />
            <FormatFiled
                v-model="form.customerName"
                type="text"
                label="거래처명"
                style="width: 200px;"
            />
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600"></Button>
        </template>
    </Toolbar>
   </Fluid>
    </form>
    <div class="flex items-center justify-between mb-2">
        <!-- 왼쪽: 총 건수 -->
        <div class="font-semibold ml-2">
            총 {{ totalCount }} 건
        </div>

        <!-- 오른쪽: 버튼 -->
        <div class="flex items-center gap-2">
            <Button label="신규" icon="pi pi-plus" severity="secondary" @click="newItem" />
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
        </div>
    </div>
    <div class="flex flex-col mt-2" ref="tableWrapper">
        <DataTable
            ref="dt"
            v-model:selection="selectedItem"
            :loading="loading"
            :value="itemList"
            selectionMode="single"
            dataKey="itemCd"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="700px"
            showGridlines
            >
            <Column selectionMode="single"  headerStyle="width: 2.5rem" style="text-align: center;"/>
            <Column field="itemTypeName"    header="품목구분"  :style="{ width: '80px'}" />
            <Column field="itemCd"          header="품목코드"  :style="{ width: '110px'}"  />
            <Column field="itemName"        header="품목명"    :style="{ width: '420px'}" bodyClass="break-words">
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">{{ slotProps.data.itemName }}</div>
                </template>
            </Column>
            <Column field="unit"            header="단위"     :style="{ width: '50px', textAlign:'center'}" />
            <Column field="Spec"            header="규격"     :style="{ width: '100px', textAlign:'center'}" />
            <Column field="customerName"    header="거래처"   :style="{ width: '210px'}" />
            <Column field="inPrice"         header="입고단가"  :style="{ width: '80px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
            </Column>
            <Column field="outPrice"        header="출고단가"  :style="{ width: '80px', textAlign:'right'}">
                <template #body="slotProps">{{ Number(slotProps.data.outPrice).toLocaleString() }}</template>
            </Column>
            <Column field="itemGrp2Name"    header="제품유형"  :style="{ width: '90px', textAlign:'center'}"  />
            <Column field="useYn"          header="사용유무"  :style="{ width: '70px', textAlign:'center'}"  />
        </DataTable>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import ItemDetailPop from './ItemDetailPop.vue';
import ItemRegPop from './ItemRegPop.vue';
import ItemSub from './ItemSub.vue';
import ItemThird from './ItemThird.vue';

const dialog = useDialog()
const dt = ref(null);
const itemTypeCds = ref([])
const itemList = ref([])
const selectedItem = ref(null);
const loading = ref(false)
const tableWrapper = ref(null);
const totalCount = computed(() => {
  return Array.isArray(itemList.value) ? itemList.value.length : 0
})
const form = reactive({
    itemName: '',
    itemCd: '',
    customerName: '',
    itemTypeCd: null
})

const srchItemList = async () => {
    loading.value = true
    const params = {
        ...form
    };
    itemList.value = await ApiItem.getItemList(params);
    loading.value = false
};

const newItem = () => {
  const item = selectedItem.value

  if (!item) {
    console.log('신규: ItemRegPop')

    dialog.open(ItemRegPop, {
      props: {
        header: '품목 등록',
        modal: true,
        maximizable: false,
        draggable: true,
        style: { overflow: 'hidden' },
        pt: {
          root: { style: { overflow: 'hidden' } },
          content: { style: { overflow: 'hidden' } }
        }
      },
      data: {
        asItemCd: null,
        asItemName: null,
        itemTypeCd: null,
      }
    })

    return
  }

  // 2. 선택된 품목이 있는 경우
  const type = item.itemTypeCd

  let component = ItemRegPop
  if (type === 'M4') {
    component = ItemSub
  } else if (['M0', 'M3', 'M5', 'M6'].includes(type)) {
    component = ItemThird
  }

  dialog.open(component, {
    props: {
      header: '품목 등록',
      modal: true,
      maximizable: false,
      draggable: true,
      style: { overflow: 'hidden' },
      pt: {
        root: { style: { overflow: 'hidden' } },
        content: { style: { overflow: 'hidden' } }
      }
    },
    data: {
      asItemCd: item.itemCd,
      asItemName: item.itemName,
      itemTypeCd: item.itemTypeCd,
    }
  })
}


/**
 * 상세화면
 * @param item
 * @param index
 */
const selectRowClick = (cd) => {
    dialog.open(ItemDetailPop, {
        props:{
            header: '품목상세',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        data: cd,
        onClose:(event) => {
            srchItemList()
        },
    })
}

const handleDocumentClick = (e) => {
  // table 영역 밖을 클릭했는지 체크
  if (tableWrapper.value && !tableWrapper.value.contains(e.target)) {
    selectedItem.value = null; // ← 선택 초기화 (radio 체크도 해제)
  }
};

onMounted( async () => {
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');

    document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '기본관리' },
    { label: '품목관리' },
    { label: '품목목록' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(itemList.value, "품목리스트", cols);
}


</script>

<style scoped>
.search-section {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}

/* 🔥 검색 form을 한 줄로 강제 정렬 */
.search-form {
  display: flex;
  flex-wrap: nowrap;        /* 줄바꿈 금지 */
  gap: 0.75rem;             /* 요소 간 간격 */
  align-items: flex-end;    /* 모든 입력 필드를 동일 baseline에 정렬 */
  width: 100%;
}

/* 리스트 영역 */
.list-section {
  flex: 1;
  min-height: 0;
}

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
  text-align: left;
}

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
  padding: 6px 6px 0.1rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}


</style>
