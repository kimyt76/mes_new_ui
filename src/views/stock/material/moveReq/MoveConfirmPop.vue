<template>
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
              <DatePicker v-model="form.moveReqDate" showIcon iconDisplay="input" disabled />
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

        <div class="col-4">
            <FloatLabel variant="on">
              <IconField iconPosition="right">
                <InputText v-model="form.confirmerName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('U')" />
              </IconField>
              <label>확인자</label>
            </FloatLabel>
          </div>
        <div class="col-4">
            <FloatLabel variant="on">
                <Select v-model="form.moveStatus"
                   :options="moveStatuss"
                   optionLabel="codeNm"
                   optionValue="code"
                    style="width: 120px"
                />
                <label for="on_label">진행상태</label>
            </FloatLabel>
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
        @row-click="selectRowClick"
        >
      <Column header="#" style="width: 40px">
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
  <div class="table-box move-table">
    <div class="table-title">이동내역</div>
    <DataTable :value="moveItemList" class="my-table" showGridlines>
      <Column header="#" style="width: 40px">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="testNo"    header="시험번호" style="width: 100px" />
      <Column field="itemCd"    header="품목코드" style="width: 110px" />
      <Column field="itemName"  header="품목명"  style="width: 360px" />
      <Column field="qty"       header="이동수량" style="width: 90px; text-align: right" :bodyStyle="{ padding: '0', textAlign: 'right' }" :headerStyle="{ padding: '0' }">
        <template #body="slotProps">
            <InputNumber v-model="slotProps.data.qty" :inputStyle="{ width: '100px', textAlign: 'right' }" />
        </template>
      </Column>
    </DataTable>
  </div>
</div>

<div class="button-area">
  <Button v-if="form.moveStatus === 'Q'" label="저장" severity="success" @click="saveInfo" />
  <Button label="닫기" outlined @click="closeDialog" />
</div>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common.js';
import { handleApiError } from '@/util/errorHandler';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref } from 'vue';

const { vWarning, vSuccess } = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const procList = ref([])
const moveItemList = ref([])
const moveStatuss = ref([])

const form = reactive({
    //고정값
    moveReqDate: null,
    seq: null,
    managerName: null,
    srcStorageName: null,
    tarStorageName: null,
    memo: null,

    //업데이트값
    moveRegDate: null,
    regSeq: null,
    moveManagerId: null,
    moveManagerName: null,
    confirmerId: null,
    confirmerName: null,

    //재고조회시 필요
    srcStorageCd: null,
    tarStorageCd: null,
    areaCd: null,

    etc: null,
    moveStatus: '',

    moveStockId: '',
})


const openPop = (type) =>{
    dialog.open(UserListPop, {
        props: {
            header: '확인자 선택',
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
            console.log("event", event)
            console.log("data", event.data)
            if (event) {
                form.confirmerId = event.data.userId
                form.confirmerName = event.data.memberNm
            }
        }
    })
}

const saveInfo = async () =>{
    if ( isEmpty(form.moveManagerName) ) return vWarning('확인자를 입력해주세요.')

    try{
        form.moveStatus = 'C'
        const params = {
            moveReqInfo : form,
            moveItemList : moveItemList.value
        }

        const res = await ApiStock.saveMoveItem(params)
        vSuccess(res.message)
        closeDialog()
    }catch(err) {
        handleApiError(err)
    }
}


onMounted( async () => {
    moveStatuss.value = await ApiCommon.getCodeList('MOVE_STATUS')

    form.moveStockId = dialogRef.value?.data?.moveStockId || null
    const res = await ApiStock.getMoveReqInfo(form.moveStockId)

    Object.assign(form, res.moveReqInfo)
    procList.value = res.procItemList
    moveItemList.value = res.moveItemList || []
})

const closeDialog = () => {
  dialogRef.value.close();
};


</script>

<style scoped>
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

.table-area {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
}

.table-box {
  display: flex;
  flex-direction: column;
}

.request-table {
  width: 670px;
}

.stock-table {
  width: 300px;
}

.move-table {
  flex: 1;
  min-width: 650px;
}

.table-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.text-center {
  text-align: center;
}

.button-area {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 18px;
  display: flex;
  gap: 4px;
  padding-top: 14px;
  background: #fafafa;
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
</style>
