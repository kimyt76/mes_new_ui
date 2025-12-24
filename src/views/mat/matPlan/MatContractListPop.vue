<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 79rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="searchList" class="search-form">
            <div class="search-field">
              <FormatFiled
                v-model="form.poNo"
                type="text"
                label="PO No."
                style="width: 150px;"
              />
            </div>
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
              ref="dt"
              :value="contractList"
              dataKey="poNo"
              paginator
              :rows="20"
              :rowsPerPageOptions="[20,30,40]"
              tableStyle="table-layout: fixed; width: 100%"
              columnResizeMode="fit"
              class="my-table h-full"
              scrollable
              scrollHeight="flex"
              showGridlines
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"
                :pt="{ columnHeaderContent: 'justify-center' }"
              ></Column>
              <Column
                field="poNo"
                header="PO No"
                :style="{ width: '140px'}"
                style="text-align: center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="itemCd"
                header="품목코드"
                :style="{ width: '120px'}"
                style="text-align: center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="itemName"
                header="품목명"
                :style="{ width: '460px'}"
                style="text-align: left;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
              <Column
                field="clientName"
                header="고객사명"
                :style="{ width: '200px'}"
                bodyClass="break-words"
                style="text-align: left;"
                :pt="{ columnHeaderContent: 'justify-center' }"
               />
              <Column
                field="qty"
                header="수량"
                :style="{ width: '100px'}"
                style="text-align: center;"
                :pt="{ columnHeaderContent: 'justify-center' }"
              />
            </DataTable>
          </div>
        </div>

        <!-- 🔹 하단 버튼 -->
        <div class="flex gap-2 justify-end pt-3">
          <Button label="선택" class="btn-use" @click="saveInfo" />
          <Button label="닫기"   outlined class="ml-2" @click="emit('close')" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { reactive, ref } from 'vue';

const emit = defineEmits(["confirm", "close"]);

const selectedItem = ref([])
const contractList = ref([])

const form = reactive({
    poNo: '',
    itemCd: '',
    itemName: '',
})

const searchList = async () =>{
    const param = {
        ...form
    }

    contractList.value = await ApiOrder.getContractList(param)
}

const saveInfo = () =>{
    // 여러 개 선택된 row 배열
  if (!selectedItem.value.length) return;
  // ✅ 부모로 데이터만 보냄 (창 닫지는 않음)
  emit('confirm', selectedItem.value);
}

</script>

<style scoped>
/* 검색 영역 아래 구분선 */
.search-section {
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}
/* 리스트 영역: 남은 공간 일부만 사용하도록 */
.list-section {
  flex: 0 0 auto;
  margin-top: 0.75rem;
}

/* 🔥 검색폼을 한 줄로, 간격 최소 */
.search-form {
  display: flex;
  flex-wrap: nowrap;      /* 한 줄 유지 */
  gap: 0.25rem;           /* 필드 간 간격 */
  align-items: flex-end;  /* 라벨/인풋/버튼 하단 맞춤 */
  width: 100%;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
.btn-use {
  background-color: #37474F !important;
  color: white !important;
}
</style>
