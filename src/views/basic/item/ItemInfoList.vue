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
            <Button label="검색" icon="pi pi-search" severity="secondary" type="submit"></Button>
        </template>
    </Toolbar>
   </Fluid>

    </form>
    <div class="flex items-center justify-end gap-2 mb-2">
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" ></Button>
    </div>
    <div class="flex flex-col mt-2">
        <DataTable
            ref="dt"
            :value="itemList"
            dataKey="itemCd"
            paginator :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollHeight="650px"
            scrollable
            showGridlines
            >
            <Column field="itemTypeName"    header="품목구분"  :style="{ width: '80px'}" />
            <Column field="itemCd"          header="품목코드"  :style="{ width: '110px'}"  :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column field="itemName"        header="품목명"    :style="{ width: '400px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
                <template #body="slotProps">
                    <div @click="selectRowClick(slotProps.data.itemCd, slotProps.data.itemTypeCd)" class="clickable-cell">
                        {{ slotProps.data.itemName }}
                    </div>
                </template>
            </Column>
            <Column field="unit"            header="단위"     :style="{ width: '50px'}" />
            <Column field="Spec"            header="규격"     :style="{ width: '100px'}" />
            <Column field="customerName"    header="거래처"   :style="{ width: '210px'}" style="text-align: left;"/>
            <Column field="businessManager" header="영업담당자"  :style="{ width: '70px'}"  />
            <Column field="labManager"      header="연구담당자"  :style="{ width: '70px'}"  />
        </DataTable>
<Toast position="center" />
    </div>




</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import ItemInfoM0Pop from './ItemInfoM0Pop.vue';
import ItemInfoM1Pop from './ItemInfoM1Pop.vue';
import ItemInfoM2Pop from './ItemInfoM2Pop.vue';
import ItemInfoM3Pop from './ItemInfoM3Pop.vue';
import ItemInfoM4Pop from './ItemInfoM4Pop.vue';
import ItemInfoM5Pop from './ItemInfoM5Pop.vue';
import ItemInfoM6Pop from './ItemInfoM6Pop.vue';


const dt = ref(null)
const dialog = useDialog()
const router = useRouter()
const itemTypeCds = ref([])
const itemList = ref([])
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
    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');
});

const currentComponent = shallowRef(null)

/**
 * 팝업화면
 * @param item
 * @param index
 */
const selectRowClick = (cd, type) => {
    let popTitle = ''
    if ( type === 'M0') {
        currentComponent.value = ItemInfoM0Pop
        popTitle = '완제품'
    }else if ( type === 'M1') {
        currentComponent.value =ItemInfoM1Pop
        popTitle = '원재료'
    }else if ( type === 'M2') {
        currentComponent.value =ItemInfoM2Pop
        popTitle = '부자재'
    }else if ( type === 'M3') {
        currentComponent.value =ItemInfoM3Pop
        popTitle = '반제품'
    }else if ( type === 'M4') {
        currentComponent.value =ItemInfoM4Pop
        popTitle = '제품'
    }else if ( type === 'M5') {
        currentComponent.value = ItemInfoM5Pop
        popTitle = '벌크제품'
    }else if ( type === 'M6') {
        currentComponent.value =ItemInfoM6Pop
        popTitle = '포장품'
    }else if ( type === 'M7') {
        currentComponent.value =ItemInfoM2Pop
        popTitle = '소모품'
    }

    dialog.open( currentComponent.value, {
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

const form = reactive({
    itemName: '',
    itemCd: '',
    customerName: '',
    itemTypeCd: null
})

const items = ref([
    { label: '기본관리' },
    { label: '품목정보목록' },
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
