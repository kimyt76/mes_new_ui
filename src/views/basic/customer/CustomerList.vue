<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <Select v-model="form.customerType"
                 :options="custormTypes"
                 optionLabel="codeNm" optionValue="code"
                style="width: 150px"
            />
            <label for="on_label1">거래처구분</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerName" style="width: 200px" />
                <label for="on_label1">거래처명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerCd" style="width: 180px" />
                <label for="on_label1">거래처코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.customerManager" style="width: 180px" />
                <label for="on_label1">거래처담당자</label>
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
        <Button label="신규" icon="pi pi-plus" severity="secondary"  @click="selectRowClick('')"></Button>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    </div>
</div>

<div>
    <DataTable
        ref="dt"
        :value="customerList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width: 100rem; table-layout: fixed;"
        class="my-table"
        >
        <Column field="customerTypeName"    header="구분"  :style="{ width: '50px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerName"        header="거래처명"  frozen  :style="{ width: '200px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.customerCd)" class="clickable-cell">
                    {{ slotProps.data.customerName }}
                </div>
            </template>
        </Column>
        <Column field="address"         header="주소"       :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="president"       header="대표자명"    :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="businessNo"      header="사업자번호"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="tel"             header="전화번호"   :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerManager" header="거래처담당자"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="email"           header="이메일"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="customerManagerTel"    header="핸드폰번호"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="memberName"      header="담당자명"  :style="{ width: '60px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import CustomerPop from './CustomerPop.vue';

const dialog = useDialog()
const customerList = ref([])
const totalCount = computed(() => {
  return Array.isArray(customerList.value) ? customerList.value.length : 0
})
const custormTypes = ref([])
const dt = ref(null)
const form  =reactive({
    customerType: null,
    customerName: '',
    customerCd: '',
    customerManager: '',
})

const srhList = async () =>{
    const params = {
        ...form
    }
    customerList.value = await ApiBase.getCustomerList(params)
}

const selectRowClick = (id) =>{
    let title = '거래처 등록'

    if (!isEmpty(id)) {
        title = '거래처 상세'
    }

    dialog.open( CustomerPop, {
        props:{
            header: title,
            width: '700px',
            modal: true,
            style: {
                overflow: 'hidden'
                },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
            closable: true,
            resizable: false,
        },
        // 팝업 B에 전달할 데이터
        data: id,
        onClose:(event) => {
            // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.
            srhList()
        },
    })
}

onMounted( async () =>{
    //거래처구분
    custormTypes.value = await ApiCommon.getCodeList('CUSTOMER_TYPE');
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '기본관리' },
    { label: '거래처관리' },
    { label: '거래처목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(customerList.value, "거래처 리스트", cols);
}

</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;
}

</style>
