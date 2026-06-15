<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 50rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-2">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.memberNm" style="width: 180px" />
                    <label for="on_label1">사용자명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.userId" style="width: 180px" />
                    <label for="on_label1">사용자 ID</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.deptNm" style="width: 180px" />
                    <label for="on_label1">부서</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" class="bg-blue-500 text-white hover:bg-blue-600" type="submit" />
            </div>
          </form>
        </div>
        <!-- 🔹 리스트 영역 (높이 제한) -->
        <div class="list-section mt-3">
          <div class="list-wrapper">
            <DataTable
              v-model:selection="selectedItem"
              :value="userList"
              dataKey="userId"
              paginator
              :rows="15"
              :rowsPerPageOptions="[15,30,40]"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table h-full"
              scrollable
              scrollHeight="500px"
              showGridlines
              selectionMode="single"
              @row-select="selectedRow"
            >
              <Column
                field="userId"
                header="사용자ID"
                :style="{ width: '100px'}"
                style="text-align: center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="memberNm"
                header="사용자명"
                :style="{ width: '200px'}"
                style="text-align: left;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="deptNm"
                header="부서"
                :style="{ width: '120px'}"
                style="text-align:  center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
               />
              <Column
                field="jobPosition"
                header="직급"
                :style="{ width: '100px'}"
                style="text-align:  center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
               />
            </DataTable>
          </div>
        </div>

        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
        </div>
    </div>
    </template>
</Card>
</template>

<script setup>

import { ApiSystem } from '@/api/apiSystem';
import { inject, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref([])
const userList = ref([])
const form = reactive({
  memberNm: '',
  userId: '',
  deptNm:'',
})

const searchList = async () =>{
    const params = {
        ...form
    }
    userList.value = await ApiSystem.getUserList(params);
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
