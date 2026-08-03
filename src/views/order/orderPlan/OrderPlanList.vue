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
                <Select v-model="form.prodType" :options="prodTypes"
                   optionLabel="codeNm"
                   optionValue="code"
                   style="width: 120px"
                />
                <label for="on_label">제품유형</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.poNo" />
                <label for="on_label1">수주번호</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.managerName" />
                <label for="on_label1">담당자</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" />
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div class="flex flex-col mt-2">
        <DataTable
            ref="dt"
            v-model:first="first"
            :value="orderPlanList"
            dataKey="contractItemId"
            paginator
            :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            scrollable
            scrollHeight="flex"
            showGridlines
            class="my-table"
            tableStyle="min-width: 120rem; table-layout: fixed;"
            >
            <Column header="No" :style="{ width: '40px', textAlign:'center'}">
                <template #body="slotProps">
                    {{ slotProps.index + 1 + first }}
                </template>
            </Column>
            <Column field="poNo"        header="PO No"  frozen :style="{ width: '120px'}" >
                <template #body="slotProps">
                    <div @click="openBomDialogPop(slotProps.data)" class="clickable-cell">
                        {{ slotProps.data.itemCd }}
                    </div>
                </template>
            </Column>
            <Column field="matRegDate"  header="제품유형"   frozen :style="{ width: '120px'}" />
            <Column field="matRegDate"  header="고객사명"   frozen :style="{ width: '120px'}" />
            <Column field="matRegDate"  header="담당자"   frozen :style="{ width: '120px'}" />
            <Column field="itemCd"      header="품목코드" frozen :style="{ width: '130px'}"  >
                <template #body="slotProps">
                    <div @click="bomPop(slotProps.data.itemName)" class="clickable-cell">
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
            <Column field="qty"         header="수량"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matPlanDate" header="납기희망일"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="수주유형"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="선금여부"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="제품사양서"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="원재료종결"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="부자재종결"     :style="{ width: '120px'}" />
            <Column field="matPlanDate" header="부자재계획일자(자급)"     :style="{ width: '120px'}" />
            <Column field="qty"         header="부자재계획수량(자급)"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matPlanDate" header="부자재계획일자(사급)"     :style="{ width: '120px'}" />
            <Column field="qty"         header="부자재계획수량(사급)"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="matPlanDate" header="출고희망일자"     :style="{ width: '120px'}" />
            <Column field="qty"         header="출고희망수량"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
            <Column field="etc"         header="제조예정일"           :style="{ width: '180px'}"  />
            <Column field="etc"         header="칭량시작일"           :style="{ width: '180px'}"  />
            <Column field="etc"         header="제조시작일"           :style="{ width: '180px'}"  >
                <template #body="slotProps">
                    <div @click="openMakeInfoPop(slotProps.data)" class="clickable-cell">
                        {{ slotProps.data.itemCd }}
                    </div>
                </template>
            </Column>
            <Column field="etc"         header="포장시작일"           :style="{ width: '180px'}"  />
            <Column field="qty"         header="창고수"   :style="{ width: '120px', textAlign:'right'}">
                <template #body="slotProps">
                    {{ (slotProps.data.qty ?? 0).toLocaleString() }}
                </template>
            </Column>
             <Column field="etc"        header="출고일자"           :style="{ width: '180px'}"  />
            <Column field="endYn"       header="종결여부"        :style="{ width: '90px'}"  >
                 <template #body="slotProps">
                    <span
                        :class="slotProps.data.endYn === 'Y' ? 'text-red' : 'text-blue'"
                        class="click-text"
                        @click="toggleEndYn(slotProps.data)"
                    >
                        {{ slotProps.data.endYn === 'Y' ? '종결' : '미종결' }}
                    </span>
                </template>
            </Column>
            <Column field="etc"         header="리드타임"           :style="{ width: '180px'}"  />
        </DataTable>
    </div>

</template>

<script setup>
import { addMonth, minMonth, todayKST } from '@/util/common';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const first = ref(0)
const dialog = useDialog()
const orderPlanList = ref([])
const prodTypes = ref([])
const form = reactive({
    strDate: minMonth(todayKST(), 1),
    endDate: addMonth(todayKST(), 2),
    prodType: null,
    poNo: '',
    clientName: '',
    managerName: '',
    itemName: '',
    itemCd: '',
});


//소요량 호출
const openBomDialogPop = (row) ={
    //원재료는 사급원료만 표시 자급일경우 표시하지 않음
}

//제조 호출
const openMakeInfoPop = (row) ={
    //원재료는 사급원료만 표시 자급일경우 표시하지 않음
}

//부자재계획 정보 저장 팝업 호출
const openSubMatInfoPop = (row) ={
    //
}



const srhList = () =>{

}

onMounted(() => {

});
const home = ref({
  icon: 'pi pi-home',
});

const items = ref([
  { label: '주문관리' },
  { label: '수주제조계획일정' },
  { label: '수주제조계획일정목록' },
]);
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: Lobo, Consolas;
}
.my-table {
    height: 750px;
}
</style>
