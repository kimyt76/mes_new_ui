<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 49rem; height: 45rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field flex gap-3">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.itemName" style="width: 180px" />
                    <label for="on_label1">품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.itemCd" style="width: 180px" />
                    <label for="on_label1">품목코드</label>
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
              :value="bomList"
              dataKey="bomId"
              paginator
              :rows="15"
              :rowsPerPageOptions="[15,30,40]"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table"
              scrollable
              scrollHeight="450px"
              showGridlines
              selectionMode="multiple"
            >
              <Column selectionMode="multiple"  headerStyle="width: 2rem" :style="{ textAlign: 'center'}" ></Column>
              <Column field="itemCd"    header="품목코드" :style="{ width: '80px', textAlign: 'center'}"  />
              <Column field="itemName"  header="품목명" :style="{ width: '300px', textAlign: 'left'}"     />
              <Column field="bomVer"    header="BOM버전" :style="{ width: '90px', textAlign: 'center'}"    />
            </DataTable>
          </div>
        </div>
        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="선택" @click="selectedRow" />
          <Button label="닫기"  outlined class="ml-2" @click="emit('close')" />
        </div>
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits(["selected", "close"]);
const selectedItem = ref([])
const bomList = ref([])
const props = defineProps({
   typeCd: {
    type: String,
   },
   cd: {
    type: String,
   },
   name: {
    type: String,
   },
})

const form = reactive({
    itemTypeCd : '',
    itemCd:'',
    itemName:'',

    defaultYn : 'Y',
    approvalState: 'Y',
})

const searchList = async () =>{
    selectedItem.value = []
    const params = {
        ...form
    }
    bomList.value = await ApiLab.getBomList(params)

}

const selectedRow = () => {
    emit('selected', selectedItem.value)
}

onMounted(() =>{
    form.itemTypeCd = props.typeCd
})

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
