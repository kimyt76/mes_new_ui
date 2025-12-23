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
                    <InputText id="on_label1" v-model="form.prodName" style="width: 180px" />
                    <label for="on_label1">제품명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.labNo" style="width: 180px" />
                    <label for="on_label1">Lab No.</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.managerName" style="width: 180px" />
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
              :value="recipeList"
              dataKey="recipeId"
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
                <Column field="rowNum"      header="No."      style="width: 30px; text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }"/>
                <Column field="prodName"    header="제품명"    style="text-align: left;" :style="{ width: '300px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }"></Column>
                <Column field="clientName"   header="고객사"   style="text-align: left;"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
                <Column field="labNo"        header="Lab No"  style="text-align: center;"   :style="{ width: '160px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
                <Column field="managerName"  header="담당자"   style="text-align: center;"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
            </DataTable>
          </div>
        </div>
    </div>
    <!-- 🔹 하단 버튼 -->
    <div class="flex gap-2 justify-end pt-3">
      <Button label="닫기" @click="closeDialog"></Button>
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref([])
const recipeList = ref([])

const form = reactive({
    prodName:'',
    labNo: '',
    managerName: '',
})

const searchList = async () =>{
    const params = {
        ...form
    }
    recipeList.value = await ApiLab.getRecipeList(params)
}

onMounted( async () =>{

})

const selectedRow = async () =>{
    const res = await ApiLab.getRecipeInfo(selectedItem.value.recipeId)
    dialogRef.value.close(res.recipeList);
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
