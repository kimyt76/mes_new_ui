<template>
<div class="move-popup-layout">
<Card class="move-card">
  <template #content>
    <div class="grid">
      <!-- 좌측 영역 -->
      <div class="col-6">
        <div class="grid mb-3">
          <div class="col-4 flex align-items-center gap-2">
            <FloatLabel variant="on">
              <DatePicker v-model="form.moveRegDate" showIcon iconDisplay="input" />
              <label>이동등록일</label>
            </FloatLabel>

            <span class="center-dash">-</span>

            <FloatLabel variant="on">
              <InputNumber
                v-model="form.regSeq"
                :inputStyle="{ width: '50px', textAlign: 'center' }"
              />
              <label>연번</label>
            </FloatLabel>
          </div>

          <div class="col-4">
            <FloatLabel variant="on">
              <IconField iconPosition="right">
                <InputText v-model="form.moveManagerName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('U')" />
              </IconField>
              <label>이동등록자</label>
            </FloatLabel>
          </div>

          <div class="col-4">
            <FloatLabel variant="on">
              <InputText v-model="form.srcStorageName" class="w-full" disabled/>
              <label>보내는 창고</label>
            </FloatLabel>
          </div>
        </div>

        <div class="grid mb-3">
          <div class="col-4 flex align-items-center gap-2">
            <FloatLabel variant="on">
              <DatePicker v-model="form.moveStockDate" showIcon iconDisplay="input" disabled />
              <label>요청일</label>
            </FloatLabel>
            <span class="center-dash">-</span>

            <FloatLabel variant="on">
              <InputNumber
                v-model="form.seq"
                :inputStyle="{ width: '50px', textAlign: 'center' }"
                disabled
              />
              <label>연번</label>
            </FloatLabel>
          </div>

          <div class="col-4">
            <FloatLabel variant="on">
              <InputText v-model="form.managerName" class="w-full" disabled/>
              <label>요청자</label>
            </FloatLabel>
          </div>

          <div class="col-4">
            <FloatLabel variant="on">
              <InputText v-model="form.tarStorageName" class="w-full" disabled/>
              <label>받는창고</label>
            </FloatLabel>
          </div>
        </div>

        <div class="grid">
          <div class="col-12">
            <FloatLabel variant="on">
              <Textarea v-model="form.etc" rows="1" class="w-full" />
              <label>비고</label>
            </FloatLabel>
          </div>
        </div>
      </div>
      <!-- 우측 요청사항 -->
      <div class="col-6">
        <FloatLabel variant="on">
          <Textarea
            v-model="form.memo"
            rows="5"
            class="w-full request-textarea"
          />
          <label>요청사항</label>
        </FloatLabel>
      </div>
    </div>
  </template>
</Card>


<div class="table-area mt-3">
  <div class="table-box request-table">
    <div class="table-title">요청내역</div>
    <DataTable
        :value="procList"
        class="my-table" showGridlines
        :tableStyle="{ width: '100%', tableLayout: 'fixed' }"
        scrollable scrollHeight="flex"
        @row-click="selectRowClick"
        >
      <Column header="NO" style="width: 40px" :headerStyle="{ textAlign: 'center' }" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="itemCd"    header="품목코드" style="width: 120px" />
      <Column field="itemName"  header="품목명" style="width: 370px" />
      <Column field="qty"       header="요청량" style="width: 90px; text-align: right" />
      <Column field="orderQty"  header="등록량" style="width: 90px; text-align: right" />
    </DataTable>
  </div>

  <div class="table-box stock-table">
    <div class="table-title text-center">창고재고</div>
    <DataTable
        :value="stockList"
        class="my-table"
        showGridlines
        :tableStyle="{ width: '100%', tableLayout: 'fixed' }"
        scrollable scrollHeight="flex"
        @row-dblclick="selectRowDblClick"
        >
      <Column header="NO" style="width: 40px" :headerStyle="{ textAlign: 'center' }" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="testNo"    header="시험번호" style="width: 100px" />
      <Column field="tranDate"  header="입고일자" style="width: 100px" />
      <Column field="qty"       header="재고량" style="width: 90px; text-align: right">
        <template #body="slotProps">
            {{ slotProps.data.qty.toLocaleString() }}
        </template>
      </Column>
    </DataTable>
  </div>

  <div class="table-box move-table">
    <div class="table-title">이동내역</div>
    <DataTable :value="moveItemList" class="my-table" showGridlines scrollable scrollHeight="flex" :tableStyle="{ width: '100%', tableLayout: 'fixed' }">
      <Column header="NO" style="width: 40px" :headerStyle="{ textAlign: 'center' }" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="testNo"    header="시험번호" style="width: 100px" />
      <Column field="itemCd"    header="품목코드" style="width: 110px" />
      <Column field="itemName"  header="품목명"  style="width: 360px" />
      <Column field="qty"       header="이동수량" style="width: 110px; text-align: right" :bodyStyle="{ padding: '2px 4px', textAlign: 'right' }" :headerStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
            <InputNumber v-model="slotProps.data.qty" class="move-qty-input" :inputStyle="{ width: '100%', minWidth: '0', boxSizing: 'border-box', textAlign: 'right' }" />
        </template>
      </Column>
    </DataTable>
  </div>
</div>

<div class="button-area">
  <Button v-if="form.moveStatus === 'Q' || form.moveStatus === 'I'" label="저장"   severity="success"  @click="saveInfo" />
  <Button label="닫기" severity="secondary"  outlined @click="closeDialog" />
</div>


</div>
</template>

<script setup>
import { ApiStock } from '@/api/apiStock';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common.js';
import { handleApiError } from '@/util/errorHandler';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, watch } from 'vue';

const { vWarning, vSuccess } = useAlertStore()
const authStore = useAuthStore()
const isInit = ref(true)
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const procList = ref([])
const stockList = ref([])
const moveItemList = ref([])

const form = reactive({
    //고정값
    moveStockDate: null,
    seq: null,
    managerName: null,
    srcStorageName: null,
    tarStorageName: null,
    memo: null,

    //업데이트값
    moveRegDate: null,
    regSeq: null,
    moveManagerId: authStore.userId,
    moveManagerName: authStore.memberNm,

    //재고조회시 필요
    srcStorageCd: null,
    tarStorageCd: null,
    areaCd: null,
    etc: null,

    areaCd:'',
    typeCd: 'Q',
    moveStatus: '',
    confirmStatus: 'W',
    moveStockId: '',
})

const openPop = (type) =>{
    dialog.open(UserListPop, {
        props: {
            header: '이동 등록자 선택',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
            overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'auto' } }
            }
        },
        onClose: (event) => {
            if (event) {
                form.moveManagerId = event.data.userId
                form.moveManagerName = event.data.memberNm
            }
        }
    })
}


let itemCd = ref('')
let itemName = ref('')
let itemTypeCd = ref('')

const selectRowClick = async (row) => {
    itemCd.value = row.data.itemCd
    itemName.value = row.data.itemName
    itemTypeCd.value = row.data.itemTypeCd

    const params = {
        itemCd: row.data.itemCd,
        storageCd: form.srcStorageCd,
        areaCd: form.areaCd
    }

    stockList.value = await ApiStock.getMoveReqStockList(params)
}

const selectRowDblClick = (row) =>{
    if (!Array.isArray(moveItemList.value)) {
        moveItemList.value = []
    }

    moveItemList.value.push({
        testNo: row.data.testNo,
        itemCd: itemCd.value,
        itemName: itemName.value,
        itemTypeCd: itemTypeCd.value,
        qty: row.data.qty,
    })

}

const saveInfo = async () =>{
    if ( isEmpty(form.moveManagerName) ) return vWarning('이동등록자를 입력해주세요.')
    if ( moveItemList.value.length <= 0 ) return vWarning('이동할 자재를 선택해주세요.')

    try{
        form.moveStatus = 'I'
        const params = {
            moveStockInfo : form,
            deleteMoveReqItemIds: null,
            moveItemList : moveItemList.value
        }

        const res = await ApiStock.saveMoveItem(params)
        vSuccess("저장되었습니다.")
        closeDialog()
    }catch(err) {
        handleApiError(err)
    }
}

watch(() => form.moveRegDate, async (newVal, oldVal) => {
    if (isInit.value) return
    if (form.moveStatus !== 'Q') return

    if (!isEmpty(newVal) && oldVal !== newVal) {
        const params = {
            moveRegDate: newVal
        }
        form.regSeq = await ApiStock.getNextRegSeq(params)
    }
})

onMounted( async () => {
   try {
        isInit.value = true
        form.moveStockId = dialogRef.value?.data?.moveStockId || null

        const res = await ApiStock.getMoveReqInfo(form.moveStockId)

        Object.assign(form, res.moveStockInfo)

        if ( form.moveStatus === 'Q' ) {
            form.moveRegDate = todayKST()
            form.regSeq = await ApiStock.getNextRegSeq({moveRegDate: form.moveRegDate})
        }
        procList.value = res.procItemList
        moveItemList.value = res.moveItemList || []

        // 담당자가 지정되지 않은 경우에만 로그인 사용자 설정
        if (!form.moveManagerId) {
            form.moveManagerId = authStore.userId
        }

        if (!form.moveManagerName) {
            form.moveManagerName = authStore.memberNm
        }

    } catch (err) {
        handleApiError(err)
    } finally {
        isInit.value = false
    }
})


const closeDialog = () => {
  dialogRef.value.close();
};


</script>

<style scoped>
/* Dialog의 기존 높이를 사용하며 버튼 영역은 아래쪽에 유지 */
.move-popup-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

/* 가운데 리스트만 남은 높이를 사용 */
.move-popup-layout > .table-area {
    flex: 1 1 auto;
    min-height: 0;
    padding-bottom: 0;
    overflow: hidden;
}

.move-popup-layout .table-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.move-popup-layout :deep(.my-table) {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.move-popup-layout :deep(.my-table .p-datatable-table-container) {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto !important;
}

.move-popup-layout > .button-area {
    flex: 0 0 auto;
    margin-top: 6px;
}

/* 이 팝업에만 적용: Dialog 콘텐츠의 높이를 자식에 전달 */
:global(.p-dialog:has(.move-popup-layout) .p-dialog-content) {
    display: flex;
    flex-direction: column;
    min-height: 0;
}


.move-card {
  width: 100%;
  min-height: 180px;
  border: 1px solid #d8e2f0;
  box-shadow: none;
}

.request-textarea {
    height: 130px !important;     /* 이미지 정도 높이 */
    resize: none;
    overflow-y: auto !important; /* 내용 많으면 스크롤 */
}

::v-deep(.request-textarea textarea) {
    height: 130px !important;
    resize: none;
    overflow-y: auto !important;
}

.center-dash {
  font-weight: bold;
  padding: 0 4px;
}

/* 팝업 안에서 세 영역이 항상 전체 너비를 나누어 사용 */
.table-area {
  display: grid;
  grid-template-columns: minmax(0, 38fr) minmax(0, 22fr) minmax(0, 40fr);
  align-items: start;
  gap: 10px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-bottom: 12px;
}
.table-box, .request-table, .stock-table, .move-table {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
:deep(.my-table) { width: 100%; min-width: 0; }
:deep(.my-table .p-datatable-table-container) {
  width: 100%;
  max-width: 100%;
  overflow-x: auto !important;
  overflow-y: auto;
}
/* tableLayout=fixed 와 함께 컬럼을 영역 안으로 압축 */
:deep(.my-table .p-datatable-table) {
  width: 100% !important;
  table-layout: fixed !important;
}
:deep(.my-table .p-datatable-thead > tr > th),
:deep(.my-table .p-datatable-tbody > tr > td) {
  box-sizing: border-box;
  min-width: 0 !important;
  overflow-wrap: anywhere;
  white-space: normal;
  padding: 4px 5px;
}
/* 요청내역: NO / 품목코드 / 품목명 / 요청량 / 등록량 */
:deep(.request-table .p-datatable-thead > tr > th:nth-child(1)),
:deep(.request-table .p-datatable-tbody > tr > td:nth-child(1)) { width: 6% !important; }
:deep(.request-table .p-datatable-thead > tr > th:nth-child(2)),
:deep(.request-table .p-datatable-tbody > tr > td:nth-child(2)) { width: 18% !important; }
:deep(.request-table .p-datatable-thead > tr > th:nth-child(3)),
:deep(.request-table .p-datatable-tbody > tr > td:nth-child(3)) { width: 50% !important; }
:deep(.request-table .p-datatable-thead > tr > th:nth-child(4)),
:deep(.request-table .p-datatable-tbody > tr > td:nth-child(4)) { width: 13% !important; }
:deep(.request-table .p-datatable-thead > tr > th:nth-child(5)),
:deep(.request-table .p-datatable-tbody > tr > td:nth-child(5)) { width: 13% !important; }
/* 창고재고: NO / 시험번호 / 입고일자 / 재고량 */
:deep(.stock-table .p-datatable-thead > tr > th:nth-child(1)),
:deep(.stock-table .p-datatable-tbody > tr > td:nth-child(1)) { width: 10% !important; }
:deep(.stock-table .p-datatable-thead > tr > th:nth-child(2)),
:deep(.stock-table .p-datatable-tbody > tr > td:nth-child(2)) { width: 33% !important; }
:deep(.stock-table .p-datatable-thead > tr > th:nth-child(3)),
:deep(.stock-table .p-datatable-tbody > tr > td:nth-child(3)) { width: 32% !important; }
:deep(.stock-table .p-datatable-thead > tr > th:nth-child(4)),
:deep(.stock-table .p-datatable-tbody > tr > td:nth-child(4)) { width: 25% !important; }
/* 이동내역: 마지막 이동수량에 고정 비율을 확보 */
:deep(.move-table .p-datatable-thead > tr > th:nth-child(1)),
:deep(.move-table .p-datatable-tbody > tr > td:nth-child(1)) { width: 6% !important; }
:deep(.move-table .p-datatable-thead > tr > th:nth-child(2)),
:deep(.move-table .p-datatable-tbody > tr > td:nth-child(2)) { width: 17% !important; }
:deep(.move-table .p-datatable-thead > tr > th:nth-child(3)),
:deep(.move-table .p-datatable-tbody > tr > td:nth-child(3)) { width: 18% !important; }
:deep(.move-table .p-datatable-thead > tr > th:nth-child(4)),
:deep(.move-table .p-datatable-tbody > tr > td:nth-child(4)) { width: 41% !important; }
:deep(.move-table .p-datatable-thead > tr > th:nth-child(5)),
:deep(.move-table .p-datatable-tbody > tr > td:nth-child(5)) { width: 18% !important; }
:deep(.move-table .move-qty-input),
:deep(.move-table .p-inputnumber),
:deep(.move-table .p-inputnumber-input) {
  display: block;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
}
@media (max-width: 1100px) {
  .table-area { grid-template-columns: minmax(0, 1fr); }
}

.table-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.text-center {
  text-align: center;
}

.button-area {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    min-height: 48px;
    padding: 6px 16px;
    margin-top: 6px;

    background: #f8fafc;
    border-top: 1px solid #d8e2f0;
    border-radius: 0 0 6px 6px;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 13px;
  text-align: center;
  padding: 4px 8px;
}

::v-deep(.my-table .p-datatable-tbody > tr > td) {
  font-size: 13px;
  padding: 4px 8px;
}

:deep(.my-table .p-datatable-table-container) {
  scrollbar-width: thin;
  scrollbar-color: #aab4c0 #f1f5f9;
}

:deep(.my-table .p-datatable-table-container::-webkit-scrollbar) {
  width: 7px;
  height: 7px;
}

:deep(.my-table .p-datatable-table-container::-webkit-scrollbar-thumb) {
  background: #aab4c0;
  border-radius: 8px;
}
</style>
