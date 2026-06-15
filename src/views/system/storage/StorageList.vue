<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchList" class="space-y-4">
       <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel>
                <Select
                    v-model="form.areaCd"
                    :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                     style="width: 150px"
                    />
                <label>창고코드</label>
            </FloatLabel>
            <FloatLabel>
                <InputText v-model="form.storageCd"  />
                <label>창고코드</label>
            </FloatLabel>
            <FloatLabel>
                <InputText v-model="form.storageName"  style="width: 200px" />
                <label>창고명</label>
            </FloatLabel>
            <FloatLabel>
                <Select
                    v-model="form.useYn"
                    :options="useYns"
                    optionLabel="codeNm"
                    optionValue="code"
                     style="width: 120px"
                    />
                <label>사용유무</label>
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
            <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')" />
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
        </div>
    </div>
    <div class="flex flex-col mt-2" ref="tableWrapper">
        <DataTable
            ref="dt"
            v-model:selection="selectedItem"
            :value="storageList"
            dataKey="storageCd"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="700px"
            showGridlines
            >
            <Column field="storageCd"   header="창고코드"   :style="{ width: '80px'}" />
            <Column field="storageName" header="창고명"     :style="{ width: '110px'}" >
                <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.storageCd)" class="clickable-cell">
                    {{ slotProps.data.storageName }}
                </div>
            </template>
            </Column>
            <Column field="areaName"    header="구역(공장)"  :style="{ width: '110px'}"  />
            <Column field="useYn"       header="사용유무"   :style="{ width: '70px', textAlign:'center'}"  />
        </DataTable>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiSystem } from '@/api/apiSystem';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import StoragePop from './StoragePop.vue';

const dialog = useDialog()
const dt = ref(null);
const areaCds = ref([])
const useYns = ref([])
const storageList = ref([])
const selectedItem = ref(null);
const totalCount = computed(() => {
  return Array.isArray(storageList.value) ? storageList.value.length : 0
})
const form = reactive({
    areaCd: '',
    storageCd: '',
    storageName: '',
    useYn: ''
})

const srchList = async () => {
    const params = {
        ...form
    };
    storageList.value = await ApiSystem.getStorageList(params);
};

const selectRowClick = (id) => {
    let title = ''
console.log('id', id)
    if (isEmpty(id)) {
        title = '창고등록'
    }else {
        title = '창고상세'
    }

    dialog.open( StoragePop, {
        props:  {
            header: title,
            modal: true,
        },
        data: id,
        onClose: async (data) => {
            await srchList()
        }
    })

}

onMounted( async () => {
    areaCds.value = await ApiCommon.getCodeList('area');
    useYns.value = await ApiCommon.getCodeList('use_yn');
});

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '기본관리' },
    { label: '창고관리' },
    { label: '창고목록' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(storageList.value, "창고리스트", cols);
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
