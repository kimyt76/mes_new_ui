<template>
<Breadcrumb :home="home" :model="items"/>
<div>
    <div class="mt-2 mb-3 flex  gap-2">
        <div class="search-section">
            <form @submit.prevent ="srhList" class="search-form">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" class="w-13rem" />
                    <label>품목코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-20rem" />
                    <label>품목명</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" severity="secondary" class="w-6rem"/>
            </form>
        </div>
    </div>
    <div class="flex gap-2 w-full h-[730px]">
        <div class="basis-[35%] h-full overflow-auto">
            <DataTable
               v-model:selection="selectRow"
               :value="itemList"
                class="my-table"
                dataKey="itemCd"
                paginator
                :rows="20"
                :rowsPerPageOptions="[20,30,40]"
                scrollable
                scrollHeight="flex"
                show-gridlines
                selectionMode="single"
                :metaKeySelection="false"
                :unselectOnClick="false"
                @row-select="onRowSelect"
             >
             <Column field="itemCd"     header="품목코드" :style="{ width: '80px', textAlign: 'center'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             <Column field="itemName"   header="품목명"   :style="{ width: '320px' , textAlign: 'left'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             </DataTable>
        </div>
        <div class="basis-[65%] h-full overflow-auto">
            <DataTable
                :value="itemBomList"
                class="my-table"
                scrollable
                scrollHeight="700px"
                show-gridlines
             >
             <Column field="itemCd"     header="품목코드"   :style="{ width: '100px' , textAlign: 'center'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             <Column field="itemName"   header="생산품목명" :style="{ width: '500px', textAlign: 'left'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             <Column field="bomVer"     header="BOM버전"    :style="{ width: '120px' , textAlign: 'center'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             <Column field="realContent" header="소요량(100kg당)"   :style="{ width: '130px' , textAlign: 'center'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
             </DataTable>
        </div>
    </div>
</div>
</template>

<script setup>
import { ApiItem } from '@/api/apiItem';
import { ApiLab } from '@/api/apiLab';
import { onMounted, reactive, ref } from 'vue';

const selectRow = ref(null)
const itemList = ref([])
const itemBomList = ref([])
const form = reactive({
    itemTypeCd: 'M1',
    itemCd: '',
    itemName:'',
})

const srhList =  async () =>{
    const params = {
        ...form
    }

    itemList.value = await ApiItem.getItemList(params)
}

const onRowSelect = async (event) => {
    //bom 개발 후에 여기에서 bom 품목리스트를 가져올 예정
  itemBomList.value = await ApiLab.getItemBomList(event.data.itemCd)
};

onMounted( async () =>{
    srhList()
})

/**
 * title
 */
const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '제조계획관리' },
    { label: '품목별소요량(원재료)목록' },
    { label: '품목별소요량(원재료)목록' },
]);
</script>

<style scoped>
/* 검색 영역 아래 구분선 */
.search-section {
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}
/* 리스트 영역: 남은 공간 일부만 사용하도록 */
.list-section {
  flex: 0 0 auto;
  margin-top: 0.75rem;
}

/* 🔥 검색폼을 한 줄로, 간격 최소 */
.search-form {
  display: flex;
  flex-wrap: nowrap;      /* 한 줄 유지 */
  gap: 0.25rem;           /* 필드 간 간격 */
  align-items: flex-end;  /* 라벨/인풋/버튼 하단 맞춤 */
  width: 100%;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: Lobo, Consolas;
}
</style>
