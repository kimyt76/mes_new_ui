<template>
<div class="usage-popup-layout">
    <div class="usage-popup-header">
    <div class="label mt-2">
         {{ title }}
    </div>

    <div class="mt-3">
        <FloatLabel variant="on">
            <InputText
                ref="barcodeInputRef"
                v-model="barcode"
                @keyup.enter="searchByBarcode"
                autofocus
             />
            <label >바코드(시험번호)</label>
        </FloatLabel>
    </div>

</div>

<div class="usage-popup-tables flex gap-1 mt-2">
    <!-- 좌측 -->
    <div class="basis-[60%] min-w-0 usage-table-panel">
        <DataTable
            :value="workUseList"
            scrollable
            scrollHeight="flex"
            :tableStyle="{ minWidth: '1050px' }"
            show-gridlines
            class="my-table usage-left-table"
        >
         <Column field="no"         header="NO"   :style="{ width: '30px', textAlign: 'center'}" ></Column>
         <Column field="testNo"     header="시험번호"   :style="{ width: '110px', textAlign: 'center'}" ></Column>
         <Column field="itemCd"     header="종목코드"   :style="{ width: '140px', textAlign: 'center'}" ></Column>
         <Column field="lotNo"      header="로트번호"   :style="{ width: '220px', textAlign: 'center'}" ></Column>
         <Column field="reqQty"     header="예상소요량" :style="{ width: '100px', textAlign: 'center'}" ></Column>
         <Column field="useQty"     header="사용량" >
            <template #body="{ data }">
                <InputNumber v-model="data.useQty" inputClass="text-center" :inputStyle="{ width: '90px', 'text-align': 'right' }"  @update:modelValue="calcTot(data)"/>
            </template>
        </Column>
         <Column field="badQty"     header="원불량" >
            <template #body="{ data }">
                <InputNumber v-model="data.badQty" inputClass="text-center" :inputStyle="{ width: '90px', 'text-align': 'right' }"  @update:modelValue="calcTot(data)"/>
            </template>
        </Column>
         <Column field="workBadQty" header="작업불량" >
            <template #body="{ data }">
                <InputNumber v-model="data.workBadQty" inputClass="text-center" :inputStyle="{ width: '90px', 'text-align': 'right' }" @update:modelValue="calcTot(data)"/>
            </template>
        </Column>
         <Column field="totUseQty"   header="총사용량" >
            <template #body="{ data }">
                <InputNumber v-model="data.totUseQty" inputClass="text-center" :inputStyle="{ width: '90px', 'text-align': 'right' }"  readonly/>
            </template>
        </Column>
        </DataTable>
    </div>
    <!-- 우측 재고현황 테이블: 스크롤만 변경 -->
    <div class="basis-[40%] min-w-0 usage-table-panel stock-scroll-area">
        <DataTable
            class="my-table stock-history-table"
            :value="stockItemHistList"
            scrollable
            scrollHeight="flex"
            :tableStyle="{ minWidth: (480 + dynamicColumns.length * 140) + 'px' }"
            showGridlines
        >
            <Column field="no" header="No" :style="{ width: '40px', minWidth: '40px', textAlign: 'center' }" />
            <Column field="testNo" header="시험번호" :style="{ width: '110px', minWidth: '110px', textAlign: 'center' }" />
            <Column field="inDate" header="입고일" :style="{ width: '110px', minWidth: '110px', textAlign: 'center' }" />
            <Column field="expiryDate" header="사용기한" :style="{ width: '110px', minWidth: '110px', textAlign: 'center' }" />
            <!-- 가변 컬럼 -->
            <Column
                v-for="col in dynamicColumns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :style="{ width: '140px', minWidth: '140px' }"
            >
                <template #body="{ data }">
                    <div class="text-right">{{ formatQty(data[col.field]) }}</div>
                </template>
            </Column>
            <Column field="totQty" header="합계" :style="{ width: '110px', minWidth: '110px' }">
                <template #body="{ data }">
                    <div class="text-right">{{ formatQty(data.totQty) }}</div>
                </template>
            </Column>
        </DataTable>
    </div>
</div>

    <div class="usage-popup-footer flex justify-start mt-3 gap-2">
        <Button label="저장" icon="pi pi-check" @click="saveInfo"/>
        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
</div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc';
import { ApiQc } from '@/api/apiQc';
import { ApiStock } from '@/api/apiStock';
import { useAlertStore } from '@/stores/alert';
import { formatQty, isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, ref } from 'vue';

const { vWarning, vInfo, vSuccess} = useAlertStore()
const dynamicColumns = ref([]) // { field, header } 목록
const stockItemHistList = ref([])
const storageList = ref([])

const barcodeInputRef = ref(null)
const barcode = ref('')
const dialogRef = inject('dialogRef')
const workUseList = ref([])
const title = ref('')
let procCd = ref('')

const calcTot = (row) => {
    const use = Number(row.useQty) || 0
    const bad = Number(row.badQty) || 0
    const workBad = Number(row.workBadQty) || 0

    if (  use <  bad + workBad  ) {
        vWarning('사용량보다 불량값이 큽니다.')
        row.totUseQty = 0
        return
    }

    row.totUseQty = use + bad + workBad
}

const saveInfo = async () => {
    if (!workUseList.value.length) {
        vWarning('저장할 데이터가 없습니다.')
        return
    }

    try{
        const totalReqQty = workUseList.value.reduce((sum, row) => sum + (Number(row.reqQty) || 0), 0)
        const totalUseQty = workUseList.value.reduce((sum, row) => sum + (Number(row.useQty) || 0), 0)
        const totalBadQty = workUseList.value.reduce((sum, row) => sum + (Number(row.badQty) || 0), 0)
        const totalWorkBadQty = workUseList.value.reduce((sum, row) => sum + (Number(row.workBadQty) || 0), 0)
        const totalTotUseQty = workUseList.value.reduce((sum, row) => sum + (Number(row.totUseQty) || 0), 0)

        const firstTestNo = workUseList.value[0]?.testNo || ''
        const rowCount = workUseList.value.length
        const rowData = dialogRef.value?.data?.row || {}

        const summaryRow = {
            testNos: rowCount > 1 ? `${firstTestNo} 외 ${rowCount - 1}건` : firstTestNo,
            reqQty: totalReqQty,
            useQty: totalTotUseQty,
            badQty: totalBadQty,
            workBadQty: totalWorkBadQty,
            totUseQty: totalTotUseQty,
            //row 정보
            itemCd: dialogRef.value.data.row.itemCd,
            specInfo: rowData.specInfo,
            exAppearance: rowData.exAppearance,
            packingSpecValue: rowData.packingSpecValue,
            packingSpecUnit: rowData.packingSpecUnit,
            workProcId: dialogRef.value.data.workProcId,
            workBatchId: dialogRef.value.data.workBatchId,
            procCd: procCd.value,
            prodInfoId: dialogRef.value.data.row.prodInfoId,
        }
        const params = {
            prodInfo: summaryRow,
            prodUseList: workUseList.value
        }

        const invalidRow = workUseList.value.find(row => {
            const use = Number(row.useQty) || 0
            const bad = Number(row.badQty) || 0
            const workBad = Number(row.workBadQty) || 0

            return use < bad + workBad
        })

        if (invalidRow) {
            vWarning('사용량보다 불량값이 큰 항목이 있습니다.')
            return
        }

        //부모로 전달전에 prod 업데이트
        const res = await ApiProc.saveProdInfo(params)
        // 부모로 집계 데이터 전달
        dialogRef.value.close(summaryRow)
    }catch(err){
        handleApiError(err)
    }
}

const searchByBarcode = async () =>{
    const code = barcode.value?.trim()

    if (code?.length !== 11) return

    const exists = workUseList.value.some(item => item.testNo === code)
    if (exists) {
        vWarning('이미 추가된 시험번호입니다.')
        barcode.value = ''
        return
    }

    try{
        const res = await ApiQc.getItemTestNoInfo(barcode.value)
        if (!res) {
            vWarning('조회 결과가 없습니다.')
            return
        }

        if ( res.itemTypeCd !== 'M6' ){
            if (res.passState !== 'PASS' || res.testState !== 'END') {
                vWarning('현재 사용 가능한 상태가 아닙니다.')
                barcode.value = ''
                return
            }
        }
        workUseList.value.push({
            no: workUseList.value.length + 1,
            testNo: res.testNo,
            itemCd: res.itemCd,
            lotNo: res.lotNo,
            reqQty: res.qty,
            useQty: 0,
            badQty: 0,
            workBadQty: 0,
            totUseQty: 0,
            prodUseId: res.prodUseId ?? null,
            prodInfoId: res.prodInfoId ?? null,
        })

        barcode.value = ''
    }catch(err){
        handleApiError(err)
    }
}

const loadInventoryList = async (areaCd) => {
  const params = {
    itemCd: dialogRef.value.data.row.itemCd,
    areaCd,
    type: 'TEST'
  }

  const res = await ApiStock.getStockItemHistList(params)
console.log('res', res)
  storageList.value = res.storageList || []
  stockItemHistList.value = res.stockItemHistList || []

  dynamicColumns.value = storageList.value.map((item) => ({
    field: String(item.storageCd).toUpperCase(),
    header: item.storageName
  }))
}

const prodUseId =ref('')
const prodInfoId =ref('')

onMounted( async () =>{
    prodUseId.value = dialogRef.value.data.row.prodUseId
    prodInfoId.value = dialogRef.value.data.row.prodInfoId
    procCd.value = dialogRef.value.data.procCd

    title.value = '['+dialogRef.value.data.row.itemCd+'] '+ dialogRef.value.data.row.itemName

    setTimeout(() => {
        barcodeInputRef.value?.$el?.querySelector('input')?.focus()
    }, 100)

    if (!isEmpty(prodInfoId.value)) {
        workUseList.value = await ApiProc.getProdUseList(prodInfoId.value)

        workUseList.value.forEach(row => {
            calcTot(row)
        })
    }

    //우측 재고리스트
    await loadInventoryList(dialogRef.value.data.areaCd)
})

const closeDialog = () =>{
    dialogRef.value.close()
}



</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}
.label {
  font-weight: 700;
  margin-bottom: 6px;
  font-size: larger;
}

/* 팝업 내부는 고정 레이아웃: 상단 / 테이블 / 하단 버튼 */
.usage-popup-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}
.usage-popup-header, .usage-popup-footer {
    flex: 0 0 auto;
}
.usage-popup-tables {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
}
.usage-table-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}
/* PrimeVue DataTable 자체를 남은 높이에 맞춤 */
:deep(.usage-table-panel .p-datatable) {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
}
:deep(.usage-table-panel .p-datatable-table-container) {
    flex: 1 1 auto;
    min-height: 0;
    max-height: 100%;
    overflow: auto !important;
}
.usage-popup-footer {
    padding-bottom: 2px;
}
</style>
