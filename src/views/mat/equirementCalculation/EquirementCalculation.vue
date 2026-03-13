<template>
<Breadcrumb :home="home" :model="items"/>
<div>
    <div class="mt-2 mb-3 flex  gap-2">
        <Button label="품목추가" @click="openPop"/>
        <Button label="초기화" @click="allClear" class="ml-5"/>
        <Button label="계산하기" @click="bomCalculation"/>
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" ></Button>
    </div>
</div>

<div class="table-wrapper">
    <DataTable
        v-model:selection="selectedItem"
        :value="itemBomList"
        selection-mode="multiple"
        data-key="itemCd"
        class="my-table"
        scrollHeight="250px"
        tableStyle="width: 1300px"
        showGridlines
     >
        <Column selectionMode="multiple"    headerStyle="width: 2rem" style="text-align: center;" />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '110px', 'text-align': 'center'}"  />
        <Column field="bomVer"      header="BOM버전"    :style="{ width: '110px', 'text-align': 'center'}"  />
        <Column field="itemName"    header="품목명"     :style="{ width: '500px'}"  />
        <Column field="unit"        header="단위"       :style="{ width: '60px', 'text-align': 'center'}"   />
        <Column field="qty"         header="생산량"     :style="{ width: '130px'}"  >
            <template #body="slotProps">
                <InputNumber
                     v-model="slotProps.data.qty"
                    class="w-full"
                    :min="0"
                    size="small"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '100%', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="etc"     header="비고"   :style="{ width: '380px', textAlign: 'left'}"  />
        <Column field="actions" header="-"      :style="{ width: '20px', textAlign: 'center'}"  >
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="mt-3">
    <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="itemStockList"
        data-key="itemCd"
        class="my-table"
        scrollHeight="600px"
        showGridlines
    >
        <Column field="itemCd"          header="품목코드"       :style="{ width: '120px', 'text-align': 'center'}"  />
        <Column field="itemTypeName"    header="품목구분"       :style="{ width: '80px', 'text-align': 'center'}"  />
        <Column field="itemName"        header="품목명"         :style="{ width: '300px'}"  />
        <Column field="spec"            header="규격"           :style="{ width: '50px', 'text-align': 'center'}"  />
        <Column field="realStockQty"    header="재고수량(A)"    :style="{ width: '130px', 'text-align': 'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.realStockQty).toLocaleString() }}</template>
        </Column>
        <Column field="reserveStockQty" header="발주(입고예정)"  :style="{ width: '130px', 'text-align': 'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.reserveStockQty).toLocaleString() }}</template>
        </Column>
        <Column field="qty"             header="소요량(B)"      :style="{ width: '130px', 'text-align': 'right'}" >
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="differenceQty"   header="차이(A-B)"      :style="{ width: '130px', 'text-align': 'right'}"  >
            <template #body="slotProps">{{ Number(slotProps.data.differenceQty).toLocaleString() }}</template>
        </Column>
        <Column field="customerName"   header="구매처"         :style="{ width: '200px'}"  />
        <Column field="orderType"      header="사급/자급"      :style="{ width: '100px', 'text-align': 'center'}"  />
        <Column field="inPrice"        header="단가"           :style="{ width: '100px', 'text-align': 'right' }" >
            <template #body="slotProps">{{ Number(slotProps.data.inPrice).toLocaleString() }}</template>
        </Column>
    </DataTable>
</div>

<Dialog
    v-model:visible="bomDialog"
     header="품목조회"
     modal
    :draggable="false"
    :resizable="false"
    >
    <!-- 자식 컴포넌트에 이벤트 바인딩 -->
    <BomMultiListPop
        :typeCd="typeCd"
        @selected="handleSelect"
        @close="bomDialog=false"
        />
</Dialog>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { exportToExcel } from '@/util/exportToExcel';
import BomMultiListPop from '@/views/lab/bom/BomMultiListPop.vue';
import { ref } from 'vue';

const { vInfo, vWarning} = useAlertStore()
const bomDialog = ref(false)
const selectedItem = ref([])
const itemBomList = ref([])
const itemStockList = ref([])
const typeCd = ref('M3')
const dt = ref(null)

const removeRow = () =>{
    itemBomList.value.splice(index,1)
}

const openPop = () =>{
    bomDialog.value = true
}

const handleSelect = (rows) =>{
    if (!Array.isArray(rows)) return;
    addRows(rows)
}

//반제품에 대한 소요량 계산(원재료)
const bomCalculation = async ()=>{
    const zeroQtyItem = itemBomList.value.find(item => Number(item.qty) === 0);
    if (zeroQtyItem) {
        vInfo("제조량이 0인 품목이 있습니다. 제조량을 입력하세요.");
        return false;
    }

    itemStockList.value = await ApiMat.getItemStockList(itemBomList.value);
}

const allClear = () =>{
    itemBomList.value = []
    itemStockList.value = []
}

const addRows = (rows) =>{
    const rowItem = rows.map((o, index) => ({
      itemCd: o.itemCd,
      bomVer: o.bomVer,
      itemName: o.itemName,
      unit: o.unit,
      qty: 0,
      etc: o.etc,
      bomId: o.bomId,
  }));

  if (itemBomList.value.length > 0) {
    itemBomList.value.push(...rowItem);
  } else {
    itemBomList.value = [...rowItem];
  }
}

/**
 *  title
 */
const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '제조관리' },
    { label: '소요량계산(원재료)' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(itemStockList.value, "소요량계산(원재료) 리스트", cols);
}
</script>

<style scoped>
.table-wrapper {
  height: 200px;           /* 원하는 div 높이 */
  overflow: hidden;
}

.btn-del {
  background-color: #ff6b6b !important;
  color: white !important;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  padding: 8px 8px 0.3rem 0.3rem;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: Lobo, Consolas;
}
</style>
