<template>
  <div class="calc-pop-root">
    <div class="flex mt-3 gap-2">
      <Button label="품목+" @click="addItem" />
      <Button label="계산하기" @click="calculateItem" />
    </div>

    <!-- ✅ 상단 테이블: 4개까지만 보이고, 이후는 내부 스크롤 -->
    <div class="top-table-area">
      <DataTable
        :value="itemBomList"
        data-key="itemCd"
        class="my-table top-table"
        scrollable
        :scrollHeight="'var(--top-body-h)'"
        showGridlines
      >
        <Column field="bomVer" header="BOM버전" :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="itemCd" header="품목코드" :style="{ width: '100px', textAlign: 'center' }" />
        <Column field="itemName" header="품목명" :style="{ width: '380px' }" />
        <Column field="unit" header="단위" :style="{ width: '50px', textAlign: 'center' }" />
        <Column field="qty" header="제조량" :style="{ width: '120px', textAlign: 'center' }">
          <template #body="slotProps">
            <InputNumber
              v-model="slotProps.data.qty"
              :min="0"
              :maxFractionDigits="0"
              size="small"
              :inputStyle="{ width: '100%', textAlign: 'right' }"
            />
          </template>
        </Column>
        <Column field="actions" header="-" :style="{ width: '20px', textAlign: 'center' }">
          <template #body="slotProps">
            <i class="pi pi-trash cursor-pointer" @click="removeRow(slotProps.index)"></i>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- ✅ 하단 테이블: 남는 공간 내부 스크롤 + 헤더 고정 -->
    <div class="bottom-table-area mt-4">
      <DataTable
        ref="dt"
        v-model:selection="selectedItem"
        :value="itemStockList"
        data-key="itemCd"
        class="my-table bottom-table"
        scrollable
        :scrollHeight="'flex'"
        showGridlines
      >
        <Column selectionMode="multiple" headerStyle="width: 1rem" style="text-align: center;" />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px', textAlign: 'center' }" />
        <Column field="itemName"    header="품목명"     :style="{ width: '350px' }" />
        <Column field="spec"        header="규격"       :style="{ width: '90px', textAlign: 'center' }" />
        <Column field="realStockQty" header="재고수량(A)" :style="{ width: '140px', textAlign: 'right' }"

        ></Column>
        <Column field="qty"         header="소요량(B)"      :style="{ width: '140px', textAlign: 'right' }" >

        </Column>
        <Column field="reserveStockQty" header="발주(입고예정)" :style="{ width: '140px', textAlign: 'right' }" >

        </Column>
        <Column field="differenceQty" header="차이(A-B)"    :style="{ width: '100px', textAlign: 'right' }" >

        </Column>
        <Column field="customerName"    header="구매처"        :style="{ width: '250px' }" />
      </DataTable>
    </div>

    <div class="footer-area">
      <div class="mt-2 mb-3 flex gap-2">
        <Button label="발주서등록" @click="openPop('P')" />
        <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" ></Button>
        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
      </div>
    </div>

    <Dialog
        v-model:visible="bomDialog"
        header="품목조회"
        modal
        :draggable="true"
        :resizable="false"
        >
      <BomMultiListPop :typeCd="typeCd" @selected="handleSelect" @close="bomDialog = false" />
    </Dialog>
  </div>
</template>

<script setup>
import { ApiMat } from '@/api/apiMat';
import { useAlertStore } from '@/stores/alert';
import { exportToExcel } from '@/util/exportToExcel';
import BomMultiListPop from '@/views/lab/bom/BomMultiListPop.vue';
import PurchaseOrderPop from '@/views/purchase/order/PurchaseOrderPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, ref } from 'vue';

const { vInfo, vWarning} = useAlertStore()
const dialog = useDialog();
const bomDialog = ref(false);
const dialogRef = inject('dialogRef');

const selectedItem = ref([]);
const itemBomList = ref([]);
const itemStockList = ref([]);
const itemTypeCd = ref('')
const typeCd = ref('');

const addItem = () => {
  bomDialog.value = true;
};

const handleSelect = (obj) => {
  if (!Array.isArray(obj)) return;
  addRows(obj);
};

const addRows = (rows) => {
  const rowItem = rows.map((o) => ({
    itemCd: o.itemCd,
    bomVer: o.bomVer,
    itemName: o.itemName,
    unit: o.unit,
    qty: 0,
    resMatQty: o.etc,
    itemTypeCd: o.itemTypeCd,
    bomId: o.bomId,
  }));
  itemBomList.value = itemBomList.value.length > 0 ? [...itemBomList.value, ...rowItem] : [...rowItem];
};

const calculateItem = async () => {
    const zeroQtyItem = itemBomList.value.find(
        item => Number(item.qty) === 0
    );
    if (zeroQtyItem) {
        vInfo("제조량이 0인 품목이 있습니다. 제조량을 입력하세요.");
        return false;
    }

    itemStockList.value = await ApiMat.getItemStockList(itemBomList.value);
};

const validition = () =>{
    if (selectedItem.value.length === 0) {
        vInfo("발주할 목록을 선택하세요")
        return false
    }

    const cuSet = new Set(
        selectedItem.value.map(item => item.customerCd)
    );

    if (cuSet.size > 1) {
        vInfo("구매처가 서로 다른 품목이 포함되어 있습니다.")
        return false
    }

    return true
}

const openPop = () => {
    if ( !validition() ) return;

   dialog.open(PurchaseOrderPop, {
     props: {
         header: '발주서등록',
         modal: true
         },
         data: {
            itemList : selectedItem.value,
            itemTypeCd : itemTypeCd,
            customerCd : selectedItem.value[0]?.customerCd,
            customerName : selectedItem.value[0]?.customerName
         },
         onClose: (event) =>{

         }
   });
};

const removeRow = (index) => {
  itemBomList.value.splice(index, 1);
};

onMounted( async () => {
  typeCd.value = dialogRef?.value?.data
  if (dialogRef?.value?.data?.type === 'P') {
       typeCd.value = '';
       itemTypeCd.value = 'M2'

       //자동조회
       const res = await ApiMat.getRequiredAmount(dialogRef?.value?.data?.list )

       itemBomList.value = res.itemBomList
       itemStockList.value = res.itemStockList;
  } else{
       typeCd.value = 'M3';
       itemTypeCd.value = 'M1'
  }
});

const closeDialog = () => {
  dialogRef.value.close();
};

const downloadExcel = () =>{
    const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }

  exportToExcel(itemStockList.value, "소요량 리스트", cols);
}
</script>

<style scoped>
/* ===== 팝업 전체 ===== */
.calc-pop-root {
  width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* ✅ row 높이 기준값: 위/아래 동일하게 맞추기 */
  --row-h: 34px;             /* 한 행 높이 */
  --thead-h: 40px;           /* 헤더 높이(대략) */
  --top-body-h: calc(var(--row-h) * 4);  /* ✅ 위 테이블: 4행만 보이기 */
}

.top-table-area {
  margin-top: 6px;
  flex: 0 0 auto;
}

.bottom-table-area {
  margin-top: 8px;
  flex: 1 1 auto;
  min-height: 0;     /* flex 내부 스크롤 필수 */
  overflow: hidden;
}

.footer-area {
  flex: 0 0 auto;
}

/* ===== 공통 헤더 스타일 ===== */
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: Lobo, Consolas;

  /* ✅ 헤더 높이 통일 */
  height: var(--thead-h);
  padding: 6px 6px !important;
}

/* ===== 공통 바디 row 높이/패딩 통일(위/아래 동일) ===== */
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  height: var(--row-h);
  padding: 3px 6px !important;
  vertical-align: middle;
  font-size: 14px;
}

/* ✅ InputNumber 높이도 row에 맞추기 */
::v-deep(.my-table .p-inputnumber-input) {
  height: calc(var(--row-h) - 8px);
  padding: 0 8px !important;
}

/* (선택) InputNumber wrapper도 줄이기 */
::v-deep(.my-table .p-inputnumber) {
  width: 100%;
}
</style>
