<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DateRangePicker
                v-model:startDate="form.strDate"
                v-model:endDate="form.endDate"
                @change="handleDateChange"
            />
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 200px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.businessNo" style="width: 180px" />
                <label for="on_label1">사업자번호</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.saleManagerName" style="width: 180px" />
                <label for="on_label1">영업담당자</label>
            </FloatLabel>
            <FloatLabel variant="on">
                 <Select v-model="form.managerRank2From" :options="managerRank"
                   optionLabel="codeNm"
                   optionValue="code"
                    style="width: 120px"
                />
                <label for="on_label1">등급범위(시작)</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.managerRank2To" style="width: 120px"
                    :options="managerRank"
                    optionLabel="codeNm"
                    optionValue="code"
                    />
                <label for="on_label1">등급범위(종료)</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary"  @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model="first"
        :value="clientList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        tableStyle="min-width: 100rem; table-layout: fixed;"
        class="my-table"
        >
        <Column header="No" :style="{ width: '40px', textAlign:'center'}">
            <template #body="slotProps">
                {{ slotProps.index + 1 + first }}
            </template>
        </Column>
        <Column field="businessNo"      header="고객사코드"  style="text-align: center;"        :style="{ width: '110px'}" "/>
        <Column field="businessManagerName" header="영업담당자"    style="text-align: center;"  :style="{ width: '100px'}" "/>
        <Column field="customerName"    header="고객사명"  frozen  :style="{ width: '300px'}" bodyClass="break-words" style="text-align: left;" ">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.clientId)" class="clickable-cell">
                    {{ slotProps.data.clientName }}
                </div>
            </template>
        </Column>
        <Column field="president"           header="대표자명"      style="text-align: center;"  :style="{ width: '100px'}" "/>
        <Column field="oneYearAgo"          :header="String(year1)" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.oneYearAgo).toLocaleString() }}</template>
        </Column>
        <Column field="twoYearAgo"          :header="String(year2)" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.twoYearAgo).toLocaleString() }}</template>
        </Column>
        <Column field="threeYearAgo"        :header="String(year3)" :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.threeYearAgo).toLocaleString() }}</template>
        </Column>
        <Column field="firstDelaDate"       header="최초거래일자"  style="text-align: center;"  :style="{ width: '120px'}" "/>
        <Column field="lastDelaDate"        header="최종거래일자"  style="text-align: center;"  :style="{ width: '120px'}" "/>
        <Column field="managerRank"         header="관리등급"     style="text-align: center;"   :style="{ width: '80px'}" "/>
    </DataTable>
</div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { reactive, ref } from 'vue';
import ClientDetailPop from './ClientDetailPop.vue';

const first = ref(0)
const dialog = useDialog()
const clientList = ref([])
const dt = ref(null)
const form  =reactive({
  strDate: minMonth(todayKST(), 3),
  endDate: todayKST(),
  clientName : '',
  saleManagerName: '',
  businessNo: '',
  managerRank2From: 'ALL',
  managerRank2To: 'ALL',
})

const managerRank = ref([
  { codeNm: '전체', code: 'ALL' },
  { codeNm: 'A', code: 'A' },
  { codeNm: 'B', code: 'B' },
  { codeNm: 'C', code: 'C' },
])

const srhList = async () =>{
    const params = {
        ...form
    }
    clientList.value = await ApiBase.getClientList(params)
}

const currentYear = new Date().getFullYear();

const year1 = currentYear - 1;
const year2 = currentYear - 2;
const year3 = currentYear - 3;

const handleDateChange = () =>{

}
const selectRowClick = (id) =>{
    let title = '고객사 등록'

    if (!isEmpty(id)) {
        title = '고객사 상세'
    }
    dialog.open( ClientDetailPop, {
        props:{
            header: title,
            width: '700px',
            modal: true,
            draggable: true,
            style: {
                overflow: 'hidden'
                },
            pt: {
                content: {
                    style: {
                        maxHeight: 'calc(90vh - 4rem)', // 헤더/푸터 높이 제외 영역
                        overflow: 'auto',               // 🔥 스크롤 활성화
                    }
                },
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

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '고객사관리' },
    { label: '고객사목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    return;
  }
  exportToExcel(clientList.value, "고객사 리스트", cols);
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
  text-align: left;
}

</style>
