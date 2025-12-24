<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 55rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-2">
                <FloatLabel variant="on">
                    <Select v-model="form.customerGrp1"
                    :options="customerGrp1s"
                    optionLabel="codeNm" optionValue="code"
                    style="width: 150px"
                    />
                    <label for="on_label1">거래유형</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="form.customerGrp2"
                    :options="customerGrp2s"
                    optionLabel="codeNm" optionValue="code"
                    style="width: 150px"
                    />
                    <label for="on_label1">업무유형</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.customerName" style="width: 180px" />
                    <label for="on_label1">거래처명</label>
                </FloatLabel>
                <Button
                label="검색"
                icon="pi pi-search"
                severity="secondary"
                type="submit"
                class="search-button"
                />
            </div>
          </form>
        </div>
        <!-- 🔹 리스트 영역 (높이 제한) -->
        <div class="list-section mt-3 h-[500px]">
          <div class="overflow-auto">
            <DataTable
              v-model:selection="selectedItem"
              :value="customerList"
              dataKey="customerCd"
              paginator
              :rows="15"
              :rowsPerPageOptions="[15,30,40]"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table"
              scrollable
              scrollHeight="500px"
              showGridlines
              selectionMode="single"
              @row-select="selectedRow"
            >
              <Column
                field="customerCd"
                header="거래처코드"
                :style="{ width: '110px'}"
                style="text-align: center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="customerName"
                header="거래처명"
                :style="{ width: '330px'}"
                style="text-align: left;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="customerManager"
                header="담당자"
                :style="{ width: '100px'}"
                style="text-align:  center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
               />
              <Column
                field="tel"
                header="전화번호"
                :style="{ width: '120px'}"
                style="text-align:  center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
               />
            </DataTable>
          </div>
        </div>
    </div>
    <!-- 🔹 하단 버튼 -->
    <div class="flex gap-2 justify-end pt-3">
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref([])
const customerList = ref([])
const customerGrp1s = ref([])
const customerGrp2s = ref([])

const form = reactive({
  customerGrp1: '',
  customerGrp2: '',
  businessCd:'',
  customerName: '',
})

const searchList = async () =>{
    const params = {
        ...form
    }
    customerList.value = await ApiBase.getCustomerList(params);
}

onMounted( async () =>{
    customerGrp1s.value = await ApiCommon.getCodeList('CUSTOMER_GRP1')
    customerGrp2s.value = await ApiCommon.getCodeList('CUSTOMER_GRP2')
})

const selectedRow = () =>{
    dialogRef.value.close(selectedItem.value);
}

const closeDialog = () =>{
    dialogRef.value.close();
}
</script>

<style scoped>

.btn-use {
  background-color: #37474F !important;
  color: white !important;
}
/* 검색 영역 아래 구분선 */
.search-section {
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}

/* 🔥 검색폼을 한 줄로, 간격 최소 */
.search-form {
  display: flex;
  flex-wrap: nowrap;      /* 한 줄 유지 */
  gap: 0.25rem;           /* 필드 간 간격 */
  align-items: flex-end;  /* 라벨/인풋/버튼 하단 맞춤 */
  width: 100%;
}
/* 리스트 영역: 남은 공간 일부만 사용하도록 */
.list-section {
  flex: 0 0 auto;
  margin-top: 0.75rem;
}
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}


</style>
