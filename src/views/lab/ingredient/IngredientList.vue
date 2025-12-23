<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srhIngredientList" class="space-y-4">
    <Fluid class="flex">
        <Toolbar class="flex mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <FormatFiled
                v-model="form.functionCd"
                type="select"
                label="function"
                :options="functions"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 160px;"
            />
            <FormatFiled
                v-model="form.ingredientName"
                type="text"
                label="성분명"
                style="width: 200px;"
            />
            <FormatFiled
                v-model="form.regName"
                type="text"
                label="등록자"
                style="width: 160px;"
            />

            <Button label="검색" icon="pi pi-search" severity="secondary" type="submit"></Button>
        </template>
    </Toolbar>
   </Fluid>
    </form>
    <div class="flex items-center justify-end gap-2 mb-2">
        <Button label="신규" icon="pi pi-plus" severity="secondary" @click="openPop('')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" ></Button>
    </div>
    <div class="flex flex-col mt-2">
        <DataTable
            :value="ingredientList"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="650px"
            showGridlines
            >
            <Column field="ingredientCode"    header="성분코드"  :style="{ width: '100px'}" >
                <template #body="slotProps">
                    <div @click="openPop(slotProps.data.ingredientCode)" class="clickable-cell" style="cursor: pointer; text-decoration: underline;">
                        {{ slotProps.data.ingredientCode }}
                    </div>
                </template>
            </Column>
            <Column field="krIngredientName"    header="국문성분명"     :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;"/>
            <Column field="enIngredientName"    header="영문성분명"     :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;"/>
            <Column field="cnIngredientName"    header="중문성분명"     :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;"/>
            <Column field="casNo"               header="CAS NO."        :style="{ width: '100px'}" />
            <Column field="functionNm"          header="function"       :style="{ width: '180px'}" style="text-align: left;"/>
            <Column field="regName"             header="등록자"         :style="{ width: '80px'}" />
            <Column field="updName"             header="수정자"         :style="{ width: '80px'}" />
            <Column field="etc"                 header="비고"           :style="{ width: '120px'}"  />
        </DataTable>
    </div>

<Dialog
    v-model:visible="visible"
    modal
    header="성분정보"
    :draggable="false"
    :resizable="false"
    :style="{ width: '65rem', height: '44rem' }"
    >
    <IngredientPop
      :id="id"
      @saved="selectInfo"
      @close-visible="visible=false"

    />
 </Dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import IngredientPop from './IngredientPop.vue';

const router = useRouter()
const { vError, vSuccess} = useAlertStore()
const visible = ref(false)
const functions = ref([])
const ingredientList = ref([])
const home = ref({
    icon: 'pi pi-home'
});

const title = ref('')
const id = ref('')

const srhIngredientList = async () => {
  const params = {
    ...form
  };
  ingredientList.value = await ApiLab.getIngredientList(params);
};

onMounted( async () => {
    functions.value = await ApiCommon.getCodeList('fn_cd');
});

const selectInfo = (msg) =>{
    vSuccess("저장되었습니다.")
    srhIngredientList()
}

const openPop = (cd) => {
    console.log('cd', cd)
    if (isEmpty(cd)){
        title.value = "성분 신규"
        id.value = ''
    }else{
        title.value = "성분 상세"
        id.value = cd
    }
    visible.value = true
}

const form = reactive({
  ingredientName: '',
  functionCd : '',
  regName: '',
})

const items = ref([
    { label: '연구관리' },
    { label: '성분관리조회' },
]);
</script>

<style scoped>
/*
::v-deep(.my-table .p-datatable-thead > tr > th .p-column-header-content) {
  justify-content: center !important;
  align-items: center;
  display: flex;
}
*/
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 15px;
}

::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 6px 6px 0.1rem 0.1rem;
  font-size: 15px;
  text-align: center;
  font-family: monaco, Consolas;
}

::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  cursor: pointer;

}
:deep(.custom-dialog .p-dialog-header) {
  background-color: #1976d2;
  color: white;
}
</style>
