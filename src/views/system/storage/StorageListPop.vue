<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 50rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-2">
                <FloatLabel>
                    <Select
                        v-model="form.areaCd"
                        :options="areaCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 150px"
                        />
                    <label>창고코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.storageCd" style="width: 180px" />
                    <label for="on_label1">창고코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.storageName" style="width: 180px" />
                    <label for="on_label1">창고명</label>
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
              :value="storageList"
              dataKey="storageCd"
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
              <Column field="storageCd"   header="창고코드"   :style="{ width: '80px'}" />
              <Column field="storageName" header="창고명"     :style="{ width: '200px'}" />
              <Column field="areaName"    header="구역(공장)"  :style="{ width: '110px'}"  />
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

import { ApiCommon } from '@/api/apiCommon';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref(null)
const areaCds  = ref([])
const storageList = ref([])
const form = reactive({
  areaCd: '',
  storageCd: '',
  storageName: '',
  useYn:'Y',
})

const searchList = async () =>{
    const params = {
        ...form
    }
    storageList.value = await ApiSystem.getStorageList(params);
}

const selectedRow = () =>{
    dialogRef.value.close(selectedItem.value);
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
})

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
