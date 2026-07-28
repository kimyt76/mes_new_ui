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
                    <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                    <label for="on_label1">고객사명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.businessNo" style="width: 180px" />
                    <label for="on_label1">사업자번호</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.businessManagerName" style="width: 180px" />
                    <label for="on_label1">담당자</label>
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
              v-model="first"
              :value="clientList"
              dataKey="clientId"
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
              <Column header="No" :style="{ width: '40px', textAlign:'center'}">
                <template #body="slotProps">
                    {{ slotProps.index + 1 + first }}
                </template>
              </Column>
              <Column field="clientName" header="고객사명" :style="{ width: '330px'}" style="text-align: left;"/>
              <Column field="businessNo" header="사업자번호" :style="{ width: '120px'}" style="text-align: center;"/>
              <Column field="president" header="대표자명" :style="{ width: '100px'}" style="text-align:  center;" />
            </DataTable>
          </div>
        </div>
    </div>
    <!-- 🔹 하단 버튼 -->
    <div class="flex gap-2 justify-end pt-3">
      <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { inject, reactive, ref } from 'vue';

const first = ref(0)
const dialogRef = inject('dialogRef')
const selectedItem = ref([])
const clientList = ref([])

const form = reactive({
  clientName: '',
  businessManagerName: '',
  businessNo: '',
  managerRank2From : 'ALL',
  managerRank2To : 'ALL',
})

const searchList = async () =>{
    const params = {
        ...form
    }
    clientList.value = await ApiBase.getClientList(params);
}

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
