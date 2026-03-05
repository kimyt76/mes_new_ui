<template>
  <!-- ✅ 팝업 전체를 고정 크기로 (바깥 스크롤 X) -->
  <Card class="popup-card">
    <template #content>
      <div class="popup-root">
        <!-- 🔹 검색 영역 (고정) -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <FloatLabel  variant="on">
                <InputText v-model="form.poNo" class="w-13rem" />
                <label>품목코드</label>
            </FloatLabel>
            <FloatLabel  variant="on">
                <InputText v-model="form.itemCd" class="w-13rem" />
                <label>품목코드</label>
            </FloatLabel>
            <FloatLabel  variant="on">
                <InputText v-model="form.itemName" class="w-20rem" />
                <label>품목명</label>
            </FloatLabel>
            <Button
              label="검색"
              icon="pi pi-search"
              severity="secondary"
              type="submit"
              class="search-button"
            />
          </form>
        </div>

        <!-- ✅ 리스트 영역 (여기만 스크롤) -->
        <div class="list-section">
          <DataTable
            v-model:selection="selectedItem"
            ref="dt"
            :value="contractList"
            dataKey="poNo"
            paginator
            :rows="20"
            :rowsPerPageOptions="[20,30,40]"
            tableStyle="table-layout: fixed; width: 100%"
            columnResizeMode="fit"
            class="my-table"
            scrollable
            scrollHeight="26rem"
            showGridlines
          >
            <Column
              selectionMode="multiple"
              headerStyle="width: 3rem"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
            <Column
              field="poNo"
              header="PO No"
              :style="{ width: '140px' }"
              style="text-align: center;"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
            <Column
              field="itemCd"
              header="품목코드"
              :style="{ width: '120px' }"
              style="text-align: center;"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
            <Column
              field="itemName"
              header="품목명"
              :style="{ width: '460px' }"
              style="text-align: left;"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
            <Column
              field="clientName"
              header="고객사명"
              :style="{ width: '200px' }"
              bodyClass="break-words"
              style="text-align: left;"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
            <Column
              field="qty"
              header="수량"
              :style="{ width: '100px' }"
              style="text-align: center;"
              :pt="{ columnHeaderContent: 'justify-center' }"
            />
          </DataTable>
        </div>

        <!-- 🔹 하단 버튼 (고정) -->
        <div class="bottom-section">
          <Button label="선택" class="btn-use" @click="saveInfo" />
          <Button label="닫기" outlined class="ml-2" @click="emit('close')" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { reactive, ref } from 'vue';

const emit = defineEmits(['confirm', 'close']);

const selectedItem = ref([]);
const contractList = ref([]);

const form = reactive({
  poNo: '',
  itemCd: '',
  itemName: '',
});

const searchList = async () => {
  const param = { ...form };
  contractList.value = await ApiOrder.getContractList(param);
};

const saveInfo = () => {
  if (!selectedItem.value.length) return;
  emit('confirm', selectedItem.value);
};
</script>

<style scoped>
.popup-card {
  width: 100%;
  height: 100%;
}

/* ✅ 팝업 전체 */
.popup-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ✅ 검색영역 */
.search-section {
  flex: 0 0 auto;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
  overflow: visible;
  padding-top: 0.75rem;
}

.search-form {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  align-items: flex-end;
  width: 100%;
}

/* ✅ 리스트 영역이 남은 높이만 사용 */
.list-section {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  margin-top: 0.75rem;
}

/* ✅ DataTable을 flex column으로 만들어서
      wrapper(스크롤영역)와 paginator를 분리 */
::v-deep(.list-section .p-datatable) {
  flex: 1 1 auto;          /* ⭐ 여기 중요 */
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* ✅ 스크롤 영역 */
::v-deep(.list-section .p-datatable-wrapper) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;          /* ⭐ 스크롤은 여기서 */
}

/* ✅ paginator는 아래 고정 */
::v-deep(.list-section .p-paginator-bottom) {
  flex: 0 0 auto;
}

/* ✅ 하단 버튼 */
.bottom-section {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--surface-border, #e5e7eb);
  background: var(--surface-0, #fff);
}
</style>
