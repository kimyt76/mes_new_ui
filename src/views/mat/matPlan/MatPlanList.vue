<template>
    <Breadcrumb :home="home" :model="items"/>
    <form @submit.prevent="srchMatPlanList" class="space-y-4">
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
            <FloatLabel  variant="on">
                <InputText v-model="form.itemCd" class="w-13rem" />
                <label>품목코드</label>
            </FloatLabel>
            <FloatLabel  variant="on">
                <InputText v-model="form.itemName" class="w-20rem" />
                <label>품목명</label>
            </FloatLabel>
            <FloatLabel  variant="on">
                <Select
                    v-model="form.endYn"
                    :options="endYns"
                     optionLabel="codeNm"
                     optionValue="code"
                    class="w-9rem" />
                <label>완료여부</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" class="bg-blue-500 text-white hover:bg-blue-600 w-5rem"  type="submit"/>
        </div>
        </template>
    </Toolbar>
    </Fluid>
    </form>
    <div class="flex items-center justify-end gap-2 mb-2">
        <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick"/>
        <Button label="소요량" class="btn-use" @click="calculate"/>
        <Button label="삭제" class="btn-del" />
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" ></Button>
    </div>
    <div class="flex flex-col mt-2">
        <DataTable
            ref="dt"
            v-model:selection="selectedItem"
            :value="matPlanList"
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
            <Column field="matRegDate"  header="일자"   :style="{ width: '120px'}" />
            <Column field="poNo"        header="PO No"  :style="{ width: '120px'}" />
            <Column field="itemCd"      header="품목코드"   :style="{ width: '130px'}"  >
                <template #body="slotProps">
                    <div @click="bomPop(slotProps.data.itemCd)" class="clickable-cell">
                        {{ slotProps.data.itemCd }}
                    </div>
                </template>
            </Column>
            <Column field="itemName"    header="품목명"   frozen  :style="{ width: '400px', textAlign: 'left'}" bodyClass="break-words" >
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.matPlanId)">
                        {{ slotProps.data.itemName }}
                    </div>
                </template>
            </Column>
            <Column field="qty"         header="수량(완제품)"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="theoryMakeQty"   header="이론제조량" :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.theoryMakeQty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matInstrQty" header="제조지시량(A)"   :style="{ width: '160px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.matInstrQty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matCompQty"  header="제조완료량"      :style="{ width: '160px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.matCompQty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="resMatQty"   header="잔량제조량(B)"   :style="{ width: '160px', textAlign:'right'}">
                <template #body="slotProps">
                     {{ (slotProps.data.resMatQty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matPlanDate" header="제조예정일"     :style="{ width: '120px'}" />
            <Column field="minQty"      header="A-B"           :style="{ width: '160px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.minQty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="etc"         header="비고"           :style="{ width: '180px'}"  />
            <Column field="matInYn"     header="원료입고완료"    :style="{ width: '110px'}"  />
            <Column field="endYn"       header="종결여부"        :style="{ width: '90px'}"  />
        </DataTable>
    </div>

</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import MatPlanDetailPop from './MatPlanDetailPop.vue';

const dt = ref(null)
const dialog = useDialog()
const matPlanList = ref([])
const selectedItem = ref([])
const endYns = ref([
    { codeNm: '진행', code: 'N' },
    { codeNm: '완료', code: 'Y' }
]);


const form = reactive({
  strDate: '',
  toDate: '',
  itemName: '',
  itemCd: '',
  endYn: ''
})

const home = ref({
    icon: 'pi pi-home'
});

const srchMatPlanList = async () => {
  const params = {
    ...form
  };
  matPlanList.value = await ApiMat.getMatPlanList(params);
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
            header: '원료제조계획('+type+')',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
                },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'auto' } }
            }
            // 기타 PrimeVue Dialog props 설정
        },
        // 팝업 B에 전달할 데이터
        data: {
            id
        },
        onClose:(event) => {
            // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.
            srchMatPlanList()
        },
    })
}

const bomPop = (itemCd) =>{

}

const calculate = () =>{
    selectedItem.value

    dialog.open(CalculateEquirementPop, {
        props: {
        header: '소요량 계산(원재료)',
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
        // 반응형 너비 설정 (선택 사항)
        //   breakpoints:{
        //     '960px':'75vw',
        //     '640px':'90vw'
        //   }
        },
        // 팝업 A로 전달할 데이터 (선택 사항)
        data: {
            matPlanList: selectedItem.value
        },
        onClose: async (data) => {
        // 팝업이 닫힐 때 실행할 작업 (선택 사항)
            await srhList()
        }

    })
}

const items = ref([
    { label: '제조관리' },
    { label: '제조관리' },
    { label: '원료제조계획' },
]);

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(matPlanList.value, "원료제조계획 리스트", cols);
}
</script>

<style scoped>
::v-deep(.header-center) {
  display: flex;
  justify-content: center;
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
