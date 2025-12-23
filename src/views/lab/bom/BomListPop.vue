<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 50rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field">
              <FormatFiled
                v-model="form.itemCd"
                type="text"
                label="품목코드"
                style="width: 150px;"
              />
            </div>
            <div class="search-field">
              <FormatFiled
                v-model="form.itemName"
                type="text"
                label="품목명"
                style="width: 250px;"
              />
            </div>
            <Button
              label="검색"
              icon="pi pi-search"
              severity="secondary"
              type="submit"
              class="search-button"
            />
          </form>
        </div>

        <!-- 🔹 리스트 영역 (높이 제한) -->
        <div class="list-section mt-3">
          <div class="list-wrapper">
            <DataTable
              v-model:selection="selectedItem"
              :value="bomList"
              dataKey="bomId"
              paginator
              :rows="20"
              :rowsPerPageOptions="[20,30,40]"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table h-full"
              scrollable
              scrollHeight="flex"
              showGridlines
              selectionMode="single"
              @rowSelect="selectRow"
            >
              <Column field="itemCd" header="품목코드" :style="{ width: '120px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }"/>
              <Column field="itemName" header="품목명" :style="{ width: '360px'}" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }" />
              <Column field="bomVer" header="BOM버전" :style="{ width: '120px'}" style="text-align:  center;" :pt="{ columnHeaderContent: 'justify-center' }" />
            </DataTable>
          </div>
        </div>

        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="닫기" @click="closeDialog" />
        </div>
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { inject, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref(null)
const bomList = ref([])

const form = reactive({
    itemCd:'',
    itemName:'',

    defaultYn : 'Y',
    approvalState: 'Y',
})

const searchList = async () =>{
    const params = {
        ...form
    }

    bomList.value = await ApiLab.getBomList(params)
}

const selectRow = async () =>{
    const res = await ApiLab.getBomInfo(selectedItem.value.bomId)
    dialogRef.value.close(res.bomRecipeList)
}

const closeDialog = () => {
    dialogRef.value.close()
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
