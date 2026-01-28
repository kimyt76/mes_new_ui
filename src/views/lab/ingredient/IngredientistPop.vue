<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 64rem; height: 49rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-3">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.ingredientCode" style="width: 180px" />
                    <label for="on_label1">성분코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.ingredientName" style="width: 180px" />
                    <label for="on_label1">성분명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.functionNm" style="width: 180px" />
                    <label for="on_label1">function명</label>
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
        <div class="list-section mt-3">
          <div class="list-wrapper">
            <DataTable
              v-model:selection="selectedItem"
              :value="ingrediantList"
              dataKey="ingredientCode"
              paginator
              :rows="15"
              :rowsPerPageOptions="[15,30,40]"
              :loading="loading"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table"
              scrollable
              scrollHeight="500px"
              showGridlines
              selectionMode="multiple"
            >
              <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
              <Column field="ingredientCode"    header="성분코드"   style="text-align: center;" :style="{ width: '80px'}"    :pt="{ columnHeaderContent: 'justify-center' }"/>
              <Column field="krIngredientName"  header="국문성분명" style="text-align: left;"   :style="{ width: '200px'}"   :pt="{ columnHeaderContent: 'justify-center' }"/>
              <Column field="enIngredientName"  header="영문성분명" style="text-align: left;"   :style="{ width: '200px'}"   :pt="{ columnHeaderContent: 'justify-center' }"/>
              <Column field="casNo"             header="CAS No"    style="text-align: center;" :style="{ width: '150px'}"   :pt="{ columnHeaderContent: 'justify-center' }"/>
              <Column field="function"          header="function"  style="text-align: center;" :style="{ width: '150px'}"   :pt="{ columnHeaderContent: 'justify-center' }"/>
            </DataTable>
          </div>
        </div>

        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="선택" @click="selectedRow" />
          <Button label="닫기"   outlined class="ml-2" @click="emit('close')" />
        </div>
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { reactive, ref } from 'vue';

const { vInfo } = useAlertStore()
const emit = defineEmits(['selected', 'close']);

const loading = ref(false)
const selectedItem = ref([])
const ingrediantList = ref([])

const form = reactive({
    ingredientCode: '',
    ingredientName: '',
    functionNm: '',
})

const searchList = async () =>{
    loading.value = true

    const params = {
        ...form
    }
    ingrediantList.value = await ApiLab.getIngredientList(params)

    loading.value = false
}

const selectedRow = () =>{
    if ( selectedItem.value.length === 0 ) {
        vInfo('선택된 항목이 없습니다.');
        return;
    }
    emit('selected', selectedItem.value);
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
