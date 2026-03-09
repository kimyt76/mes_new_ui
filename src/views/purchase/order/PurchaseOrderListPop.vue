<template>
  <div class="popup-wrap">
    <!-- 검색 카드 -->
    <Card class="search-card">
      <template #content>
        <form @submit.prevent="searchList" class="search-form">
          <div class="search-field flex gap-3">
            <FloatLabel variant="on">
              <Select
                v-model="form.itemTypeCd"
                :options="itemTypeCds"
                optionLabel="codeNm"
                optionValue="code"
                style="width: 120px"
              />
              <label>품목구분</label>
            </FloatLabel>

            <FloatLabel variant="on">
              <InputText v-model="form.itemName" style="width: 200px" />
              <label>품목명</label>
            </FloatLabel>

            <FloatLabel variant="on">
              <InputText v-model="form.itemCd" style="width: 150px" />
              <label>품목코드</label>
            </FloatLabel>

            <Button
              label="검색"
              icon="pi pi-search"
              severity="secondary"
              type="submit"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- 리스트 -->
    <div class="list-section">
      <DataTable
        v-model:selection="selectedItem"
        :value="purOrderList"
        dataKey="purOrderId"
        paginator
        :rows="15"
        :rowsPerPageOptions="[15, 30, 40]"
        tableStyle="table-layout: fixed; width: 100%"
        columnResizeMode="fit"
        scrollable
        scrollHeight="flex"
        class="my-table"
        showGridlines
        selectionMode="multiple"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" :style="{ textAlign: 'center' }" />
        <Column field="purOrderDateSeq" header="발주일자No" :style="{ width: '130px', textAlign: 'center' }" />
        <Column field="itemCd" header="품목코드" :style="{ width: '110px', textAlign: 'center' }" />
        <Column field="itemName" header="품목명" :style="{ width: '300px', textAlign: 'left' }" />
        <Column field="spec" header="규격" :style="{ width: '90px', textAlign: 'center' }" />
        <Column field="totQty" header="수량" :style="{ width: '90px', textAlign: 'center' }">
            <template #body="slotProps">{{ Number(slotProps.data.totQty).toLocaleString() }}</template>
        </Column>
      </DataTable>
    </div>

    <!-- 하단 버튼 -->
    <div class="button-section">
      <Button label="선택" @click="selectedRow" />
      <Button label="닫기" outlined class="ml-2" @click="emit('close')" />
    </div>
  </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiPurchase } from '@/api/apiPurchase';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';

const { vWarning } = useAlertStore()
const emit = defineEmits(["selected", "close"]);
const selectedItem = ref([])
const purOrderList = ref([])
const subItemList = ref([])
const itemTypeCds = ref([])
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
})

const searchList = async () =>{
    if (isEmpty(form.itemTypeCd)) return vWarning("품목구분은 필수입니다.")

    const params = {
        ...form
    }
    purOrderList.value = await ApiPurchase.getPurchaseOrderList(params)
}

const selectedRow = async () => {

    if ( selectedItem.value.length === 0) return vWarning("선택된 발주가 없습니다." )

    if (form.itemTypeCd !== 'M1'){
        const purOrderIds = selectedItem.value.map(v => v.purOrderId)
        subItemList.value = await ApiPurchase.getSubItemList(purOrderIds)
        emit('selected', subItemList.value)
    }else{
        emit('selected', selectedItem.value)
    }



}

onMounted( async () =>{
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
})
</script>

<style scoped>
.popup-wrap {
  width: 70rem;
  height: 45rem;
  display: flex;
  flex-direction: column;
}

.search-card {
  flex-shrink: 0;
}

.list-section {
  flex: 1;
  min-height: 0;
  margin-top: 0.75rem;
}

.button-section {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.75rem;
}

.search-form {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  align-items: flex-end;
  width: 100%;
}

::v-deep(.p-card-content) {
  padding: 0.1rem;
}

::v-deep(.my-table) {
  height: 100%;
}

::v-deep(.my-table .p-datatable-wrapper) {
  height: 100%;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
</style>
