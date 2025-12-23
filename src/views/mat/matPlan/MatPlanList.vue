<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchItemList" class="space-y-4">
    <Fluid>
    <Toolbar class="mt-2 mb-2 w-full">
        <template #start>
        <div class="flex flex-wrap gap-3 items-end">
            <DatePicker
            :showIcon="true"
            v-model="form.strDate"
            class="w-11rem"
            />
            <DatePicker
            :showIcon="true"
            v-model="form.toDate"
            class="w-11rem"
            />
            <FloatLabel>
            <InputText v-model="form.itemCd" class="w-13rem" />
            <label>품목코드</label>
            </FloatLabel>
            <FloatLabel>
            <InputText v-model="form.itemName" class="w-20rem" />
            <label>품목명</label>
            </FloatLabel>
            <FloatLabel>
            <InputText v-model="form.customerName" class="w-18rem" />
            <label>거래처명</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" severity="secondary" class="w-6rem"/>
        </div>
        </template>
    </Toolbar>
    </Fluid>


    </form>
    <div class="flex items-center justify-end gap-2 mb-2">
        <Button label="신규" class="btn-new" @click="selectRowClick"/>
        <Button label="소요량" class="btn-use" />
        <Button label="삭제" class="btn-del" />
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" ></Button>
    </div>
    <div class="flex flex-col mt-2">
        <DataTable
            ref="dt"
            v-model="selectedItem"
            :value="itemList"
            dataKey="itemCd"
            paginator
            :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            scrollable
            scrollHeight="650px"
            showGridlines
            class="my-table"
            tableStyle="min-width: 120rem; table-layout: fixed;"
            :pt="{
                column: {
                    headerContent: { class: 'header-center' }
                }
            }"
            >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="matRegDate"      header="일자"   :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column field="poNo"            header="PO No"  :style="{ width: '120px'}" />
            <Column field="customerName"    header="거래처"   :style="{ width: '210px'}" style="text-align: left;"/>
            <Column field="itemCd"          header="품목코드"   :style="{ width: '130px'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column field="itemName"        header="품목명"   frozen  :style="{ width: '400px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.matOrdeId)" class="clickable-cell">
                        {{ slotProps.data.itemName }}
                    </div>
                </template>
            </Column>
            <Column field="qty"                 header="수량"           :style="{ width: '120px'}" />
            <Column field="matInstructionQty"   header="제조지시수량"    :style="{ width: '160px'}" />
            <Column field="matCompleteQty"      header="제조완료수량"    :style="{ width: '160px'}" />
            <Column field="residualMatQty"      header="잔량제조량"     :style="{ width: '160px'}" />
            <Column field="matPlanDate"         header="제조예정일"     :style="{ width: '120px'}" />
            <Column field="etc"                 header="비고"  :style="{ width: '150px'}"  />
            <Column field="completeYn"          header="완료"  :style="{ width: '70px'}"  />
        </DataTable>

    </div>


</template>

<script setup>
import { ApiItem } from '@/api/apiItem';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import MatPlanDetailPop from './MatPlanDetailPop.vue';


const dt = ref(null)
const dialog = useDialog()
const itemList = ref([])
const selectedItem = ref([])

const home = ref({
    icon: 'pi pi-home'
});

const srchItemList = async () => {
  const params = {
    ...form
  };
  itemList.value = await ApiItem.getItemList(params);
};

onMounted( async () => {
  form.toDate = todayKST()
  form.strDate = minMonth(form.toDate)
});


/**
 * 팝업화면
 * @param item
 * @param index
 */
const selectRowClick = (id) => {
    let type = '신규'

    if ( !isEmpty(id)) {
        type = '상세'
    }

    dialog.open( MatPlanDetailPop, {
        props: {
            header: '예상제조계획('+type+')',
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
        data: {
            id
        },
        onClose:(event) => {
            // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.

        },

    })
}

const form = reactive({
  strDate: '',
  toDate: '',
  itemName: '',
  itemCd: '',
  customerName: '',
})

const items = ref([
    { label: '제조관리' },
    { label: '예상제조계획' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(itemList.value, "예상제조계획 리스트", cols);
}
</script>

<style scoped>
::v-deep(.header-center) {
  display: flex;
  justify-content: center;
}
.btn-new {
  background-color: #5a9cff !important;
  color: white !important;
}

.btn-use {
  background-color: #36cfc9 !important;
  color: white !important;
}

.btn-del {
  background-color: #ff6b6b !important;
  color: white !important;
}
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: Lobo, Consolas;
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
</style>
