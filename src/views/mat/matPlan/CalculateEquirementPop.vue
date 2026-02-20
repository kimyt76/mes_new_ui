<template>
<div class="table-wrapper">
    <DataTable
        :value="itemBomList"
        selection-mode="multiple"
        data-key="itemCd"
        class="my-table"
        scrollHeight="400px"
        showGridlines
    >
        <Column field="bomVer"      header="BOM버전"    :style="{ width: '100px'}"  />
        <Column field="itemCd"      header="품목코드"   :style="{ width: '120px'}"  />
        <Column field="itemName"    header="품목명"     :style="{ width: '380px'}"  />
        <Column field="unit"        header="단위"       :style="{ width: '50px'}"   />
        <Column field="qty"         header="잔량제조량"     :style="{ width: '140px'}"  >
            <template #body="slotProps">
                <InputNumber
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '120px', 'text-align': 'right' }"
                />
            </template>
        </Column>
    </DataTable>
</div>
<div>
    <DataTable
        v-model:selection="selectedItem"
        :value="itemStockList"
        data-key="itemCd"
        class="my-table"
        scrollHeight="600px"
        showGridlines
    >
        <Column selectionMode="multiple"headerStyle="width: 1rem" style="text-align: center;" />
        <Column field="itemCd"          header="품목코드"       :style="{ width: '120px'}"  />
        <Column field="itemName"        header="품목명"         :style="{ width: '300px'}"  />
        <Column field="spec"            header="규격"           :style="{ width: '50px'}"  />
        <Column field="stockQty"        header="재고수량(A)"    :style="{ width: '130px'}"  />
        <Column field="calculation"     header="소요량(B)"      :style="{ width: '130px'}"  />
        <Column field="orderQty"        header="발주(입고예정)"  :style="{ width: '130px'}"  />
        <Column field="differenceQty"   header="차이(A-B)"      :style="{ width: '130px'}"  />
        <Column field="customrerName"   header="구매처"         :style="{ width: '200px'}"  />
    </DataTable>
</div>
<div>
    <div class="mt-2 mb-3 flex  gap-2">
        <Button label="발주서등록" @click="openPop"/>
        <Button label="엑셀"  />
        <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
    </div>
</div>

</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { makeLikeCondition } from '@/util/common';
import PurchaseOrderMPop from '@/views/purchase/order/PurchaseOrderMPop.vue';
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef')
const selectedItem = ref([])
const receivedList = ref(dialogRef.value?.data?.list ?? [])

const itemBomList = ref([])
const itemStockList = ref([])

const openPop = () =>{
    dialogRef.open(PurchaseOrderMPop, {
        props:{
            header: '발주서등록',
            modal:true,
        },
        data: {

        }
    })
}

onMounted( async () =>{
    const params = {
        itemCds:  receivedList.value.map(item => item.itemCd).join(','),
        itemTypeCd: 'M3',
        itemNames: makeLikeCondition(receivedList.value, "item_name"),
    }

    const res = await ApiLab.getItemsBomList(params)
console.log('res', res)
    itemBomList.value = res.itemBomList
    itemStockList.value = res.itemStockList
})

const closeDialog = () =>{
    dialogRef.value.close()
}

/**
 *  title
 */
const home = ref({
    icon: 'pi pi-home'
});


</script>

<style scoped>
.table-wrapper {
  height: 200px;           /* 원하는 div 높이 */
  overflow: hidden;
  margin-top: 3px;
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
