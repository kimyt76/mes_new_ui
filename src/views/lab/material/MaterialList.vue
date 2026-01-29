<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 150px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 250px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label2" v-model="form.ingredientName" style="width: 250px" />
                <label for="on_label2">성분명</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
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
        <Button label="엑셀" icon="pi pi-file-excel" severity="success"  @click="downloadExcel"></Button>
    </div>
</div>
<div>
    <DataTable
        ref="dt"
        paginator :rows="20"
        :value="materialList"
        dataKey="itemCd"
        :loading="loading"
        :rowsPerPageOptions="[20,30,40]"
        scrollable
        scrollHeight="650px"
        showGridlines
        class="my-table"
        >
        <Column field="rowNum"    header="No."  style="width: 20px; text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCd"    header="품목코드"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemName"  header="품목명"    :style="{ width: '400px', textAlign:'left'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div
                    style="cursor: pointer; text-decoration: underline;"
                    @click="selectRowClick(slotProps.data.itemCd)" class="clickable-cell">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="customerName"   header="거래처"  :style="{ width: '200px', textAlign:'left'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="itemCompany"   header="제조원"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="inPrice"  header="입고단가"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ Number(slotProps.data.inPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="outPrice"  header="출고단가"  :pt="{ columnHeaderContent: 'justify-center' }" :style="{ width: '80px', textAlign:'right'}" >
            <template #body="slotProps">
                {{ Number(slotProps.data.outPrice).toLocaleString() }}
            </template>
        </Column>
        <Column field="vegan"   header="Vegan"  :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="halal"   header="Halal"  :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="rspo"    header="RSPO"  :style="{ width: '50px', textAlign:'center'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>

</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import MaterialDetailPop from './MaterialDetailPop.vue';

const dialog = useDialog()
const materialList = ref([])
const loading = ref(false)
const totalCount = computed(() => {
  return Array.isArray(materialList.value) ? materialList.value.length : 0
})
const dt = ref(null)
const form = reactive({
    itemName : '',
    itemCd: '',
    ingredientName: '',
})

const srhList = async () =>{
    loading.value = true

    const params = {
        ...form
    }

    materialList.value = await ApiLab.getMaterialItemList(params)

    loading.value = false
}

onMounted( async () => {
  //const page = store.getPage(routeName)

  //if (!isEmpty(page.searchParams)) {
  //  Object.assign(form, page.searchParams)
  //  srhList()
  //}
})

const selectRowClick = (item) => {
    dialog.open(MaterialDetailPop, {
    props: {
      header: '원료 상세',
      modal: true,
      maximizable: false,
        draggable: true,
        style: {
            overflow: 'auto'
            },
        pt: {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'auto' } }
        },
       // 반응형 너비 설정 (선택 사항)
    //   breakpoints:{
    //     '960px':'75vw',
    //     '640px':'90vw'
    //   }
    },
    // 팝업 A로 전달할 데이터 (선택 사항)
    data: item
  })
}

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(materialList.value, "원료리스트", cols);
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '원료관리' },
    { label: '원료목록' },
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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8.5px 7px 0.3rem 0.1rem;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

</style>
