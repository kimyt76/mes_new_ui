<template>
<div class="flex justify-start mt-3">
    <Button label="품목추가" severity="secondary" @click="openPop"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
 <!-- ✅ Handsontable 공통 컴포넌트 -->
  <div class="w-full mt-2">
    <BaseHotTable
      ref="hotTable"
      :data="stockList"
      :colHeaders="colHeaders"
      :columns="columns"
      :rowHeaders="true"
      :height="430"
       width="100%"
      :afterChange="onAfterChange"
      :afterSelection="onAfterSelection"
    />
  </div>

<div class="flex justify-end gap-2 mt-2">
    <Button v-if="isBtn" label="저장" severity="success" @click="saveInfo"/>
    <Button v-if="isBtn" label="삭제" severity="danger" @click="deleteRealStock"></Button>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>
</template>

<script setup>
import { ApiStock } from '@/api/apiStock';
import BaseHotTable from '@/components/BaseHotTable.vue';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler.js';
import { useDialog } from 'primevue';
import { inject, onMounted, ref } from 'vue';
import * as XLSX from 'xlsx';
import ItemListPop from './ItemListPop.vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef')
const { vError, vSuccess, vInfo, vWarning } = useAlertStore()
const stockList = ref([])
const isBtn = ref(false)
const realStockMstId = ref(null)
const hotTable = ref(null)
const colHeaders = ['품목코드', '품목명', '시험번호', '장부수량', '실사수량', '차이', '비고']
//Handsontable 컬럼 정의
const columns = [
  { data: 'itemCd', type: 'text', className: 'htCenter', width: 130, readOnly: true },
  { data: 'itemName', type: 'text', width: 300 , readOnly: true},
  { data: 'testNo', type: 'text', className: 'htCenter', width: 120, readOnly: true },
  { data: 'docStockQty', type: 'numeric', className: 'htRight', width: 110 ,numericFormat: {
    pattern: '0,0.[000000]'
  }},
  { data: 'reqlStockQty', type: 'numeric', className: 'htRight', width: 110 , numericFormat: {
    pattern: '0,0.[000000]'
  }},
  { data: 'diffStockQty', type: 'numeric', className: 'htRight', width: 110, numericFormat: {
    pattern: '0,0.[000000]'
  },readOnly: true},
  { data: 'etc', type: 'text', width: 150 },
]

const saveInfo =  async () =>{
    try{
        const params = {
            realStock: {
                realStockMstId: realStockMstId.value
            },
            realStockItemList: stockList.value
        }

        const res = await ApiStock.saveRealStockItemList(params)
        vSuccess("실사재고 품목이 등록되었습니다.")
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const deleteRealStock = async () =>{
    try{
        const res = await ApiStock.deleteRealStock(realStockMstId.value)
        vSuccess("삭제되었습니다.")
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const downloadExcel = async () =>{
    if (!stockList.value || stockList.value.length === 0) {
        return vWarning('다운로드할 데이터가 없습니다.')
    }

    const excelData = stockList.value.map((item, index) => ({
        'No.': index + 1,
        '품목코드': item.itemCd ?? '',
        '품목명': item.itemName ?? '',
        '시험번호': item.testNo ?? '',
        '장부수량': item.docStockQty ?? 0,
        '실사수량': item.reqlStockQty ?? 0,
        '차이': item.diffStockQty ?? 0,
        '비고': item.etc ?? '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook,worksheet,'장부재고')
    XLSX.writeFile(workbook,'장부재고.xlsx')
}

const openPop = () =>{
    dialog.open(ItemListPop, {
        props:{
            header: '재고품목 조회',
            modal: true,
            draggable: false,
        },
        onClose:(event) =>{
            if(event) {
              addRow(event.data)
            }
        }
    })
}

const addRow = (obj) =>{
    if (!obj || !Array.isArray(obj)) return

    const newItems = obj.map(item => ({
        realStockItemId: null,
        itemCd: item.itemCd,
        itemName: item.itemName,
        testNo: item.testNo,
        docStockQty: item.currentStockQty ?? 0,
        reqlStockQty: null,
        diffStockQty: null,
        etc: ''
    }))

    stockList.value.push(...newItems)
}

const onAfterChange = (changes, source) => {
  if (!changes) return

  // Handsontable 내부 계산으로 다시 들어오는 경우 방지
  if (source === 'loadData' || source === 'calc') return

  const hot = hotTable.value?.hotInstance
  if (!hot) return

  changes.forEach(([row, prop, oldValue, newValue]) => {
    if (prop !== 'reqlStockQty') return

    // 실사수량 삭제
    if (newValue === null || newValue === '' || newValue === undefined) {
      hot.setDataAtRowProp(
        row,
        'diffStockQty',
        null,
        'calc'
      )
      return
    }

    const docQty = Number(
      hot.getDataAtRowProp(row, 'docStockQty') ?? 0
    )

    const reqlQty = Number(newValue)

    hot.setDataAtRowProp(
      row,
      'diffStockQty',
      reqlQty - docQty,
      'calc'
    )
  })
}

const onAfterSelection = () =>{
}

onMounted( async () =>{
    let endYn = dialogRef.value.data.endYn

    if ( endYn === 'N' ) {
        isBtn.value = true
    }

    realStockMstId.value = dialogRef.value.data.realStockMstId

    stockList.value = await ApiStock.getRealStockItemList(realStockMstId.value)
    console.log('stockList.value',stockList.value)
})

const closeDialog = () =>{
    dialogRef.value.close()
}


</script>

<style scoped>
.hot-wrapper {
  width: 100%;
  padding-right: 15px;
  box-sizing: border-box;
}
:deep(.handsontable thead th) {
  background-color: #bca9a2 !important;
}
</style>
