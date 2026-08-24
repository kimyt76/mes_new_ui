<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <DateRangePicker
                v-model:startDate="form.strDate"
                v-model:endDate="form.endDate"
                start-label="출고지시시작일"
                end-label="출고지시종료일"
                @change="handleDateChange"
            />
             <DateRangePicker
                v-model:startDate="form.strReqDate"
                v-model:endDate="form.endReqDate"
                start-label="출고요청일"
                end-label="출고요청일"
                @change="handleDateChange"
            />
             <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.clientName" style="width: 180px" />
                <label for="on_label1">고객사명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.poNo" style="width: 150px" />
                <label for="on_label1">PONO</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label" v-model="form.itemName" style="width: 200px"/>
                <label for="on_label">품목명</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.itemCd" style="width: 120px" />
                <label for="on_label1">품목코드</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText id="on_label1" v-model="form.deliveryManagerName" style="width: 120px" />
                <label for="on_label1">담당자명</label>
            </FloatLabel>
            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
    <Button label="삭제" icon="pi pi-plus" severity="secondary" @click="deleteSelectRow"></Button>
</div>
<div>
    <DataTable
        ref="dt"
        v-model:selection="selectItems"
        dataKey="shipmentId"
        :value="shipmentList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="700px"
        scrollable
        showGridlines
        tableStyle="w-full; table-layout: fixed;"
        class="my-table"
        >
        <Column selectionMode="multiple"  headerStyle="width: 3rem" style="text-align: center;"></Column>
        <Column field="shipmentDateSeq" header="등록 No"    :style="{ width: '130px', textAlign: 'center'}" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.shipmentId)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.shipmentDateSeq }}
                </div>
            </template>
        </Column>
        <Column field="shipmentReqDate" header="출고요청일"    :style="{ width: '120px', textAlign: 'center'}" ></Column>
        <Column field="clientName"      header="고객사명"   :style="{ width: '250px'}" />
        <Column field="poNo"            header="PO No"    :style="{ width: '130px'}" ></Column>
        <Column field="deliveryManagerName"     header="담당자명"   :style="{ width: '100px', textAlign: 'center'}" />
        <Column field="itemCd"          header="품목코드" :style="{ width: '160px', textAlign: 'center'}" />
        <Column field="itemName"        header="품목명"   :style="{ width: '420px'}" bodyClass="break-words" >
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.shipmentId)" class="clickable-cell" style="text-decoration: underline; cursor: pointer;">
                    {{ slotProps.data.itemName }}
                </div>
            </template>
        </Column>
        <Column field="qty"             header="수량"       :style="{ width: '100px', textAlign: 'right'}">
            <template #body="slotProps">{{ Number(slotProps.data.qty).toLocaleString() }}</template>
        </Column>
        <Column field="lotNo"           header="LOT"   :style="{ width: '100px', textAlign: 'right'}" />
        <Column field="pallet"              header="파렛트"   :style="{ width: '90px', textAlign: 'center'}" />
        <Column field="deliveryLocation"    header="도착소재지"  :style="{ width: '150px', textAlign:'center'}" />
        <Column field="shipmentTypeName"    header="출고조건"  :style="{ width: '100px', textAlign:'center'}" />
        <Column field="shipmentTime"    header="출고요청시간"  :style="{ width: '100px', textAlign:'center'}" />
        <Column field="printYn"         header="거래명세서"  :style="{ width: '90px', textAlign:'center'}" >
             <template #body="slotProps">
                <span
                    :class="{ 'status-editable': slotProps.data.printYn === 'N' }"
                    style="cursor: pointer;"
                    @click="goPrint(slotProps.data)"
                >

                    {{ slotProps.data.printYn === 'N' ? '미출력' : '출력' }}
                </span>
            </template>
        </Column>
        <Column field="shipmentStatusName"  header="출고유형"  :style="{ width: '90px', textAlign:'center'}" />
        <Column field="shipmentYn"          header="출고상태"  :style="{ width: '90px', textAlign:'center'}" >
            <template #body="slotProps">
                <span
                    :class="{ 'status-editable': slotProps.data.shipmentYn === 'N' }"
                >
                    {{ slotProps.data.shipmentYn === 'Y' ? '진행중' : '출고확정' }}
                </span>
            </template>
        </Column>
    </DataTable>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiOrder } from '@/api/apiOrders';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { isEmpty, minMonth, todayKST } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { onMounted, reactive, ref, shallowRef } from 'vue';
import ShipmentDetailPop from './ShipmentDetailPop.vue';
import ShipmentRegPop from './ShipmentRegPop.vue';

const dialog = useDialog()
const dt = ref(null);
const selectItems = ref([])
const shipmentList = ref([])
const statusTypes = ref([])
const vatTypes = ref([])
const orderTypes = ref([])
const currentComponent = shallowRef(null)
const form = reactive({
  strDate: minMonth(todayKST(), 1),
  endDate:  todayKST(),
  strReqDate: '',
  endReqDate: '',
  poNo: '',
  itemCd: '',
  itemName: '',
  deliveryManagerName: '',
  clientName: '',
})


const deleteSelectRow = () =>{
    if (selectItems.value.length === 0) {
        alert('삭제할 출고지시를 선택해주세요.');
        return;
    }

    if( selectItems.value.map(item => item.shipmentYn).some(status => status === 'Y')) {
        vWarning('출고상태가 진행중인 항목만 삭제할 수 있습니다.');
        return;
    }

    if ( confirm('선택한 출고지시를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.')) {
        const deleteShipmentIds = selectItems.value.map(item => item.shipmentId);
        ApiOrder.deleteShipment(deleteShipmentIds)
            .then(() => {
                alert('선택한 출고지시가 삭제되었습니다.');
                srhList(); // 삭제 후 목록 갱신
            })
            .catch(error => {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    }
}

const selectRowClick = (id) => {
    const isNew = isEmpty(id)

    const title = isNew
        ? '출고지시 등록'
        : '출고지시 상세'

    currentComponent.value = isNew
        ? ShipmentRegPop
        : ShipmentDetailPop

    dialog.open(currentComponent.value, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: false,
            style: {
                width: '90vw',
                maxWidth: '1800px',
                height: '800px',
                overflow: 'hidden'
            },
            pt: {
                root: {
                    style: {
                        overflow: 'hidden'
                    }
                },
                content: {
                    style: {
                        overflow: 'hidden'
                    }
                }
            }
        },
        data: {
            shipmentId : id,
        },
        onClose: (event) => {
            if ( event) {
                srhList()
            }
        }
    })
}

const goPrint = async (row) => {
    try {
        const res = await ApiOrder.printTransactionStatement(row.shipmentId)
        const blob = new Blob([res.data],
            {
                type: 'application/pdf'
            }
        )

        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank' )
        srhList()
    } catch (err) {
        console.error(err)
        vError('거래명세서 출력 중 오류가 발생했습니다.')
    }
}

const handleDateChange = () =>{
}

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    shipmentList.value = await ApiOrder.getShipmentList(params);
}

const handlerSelected = () =>{
    srhList()
}

onMounted( async () => {
    statusTypes.value = await ApiCommon.getCodeList('status_type')
    orderTypes.value = await ApiCommon.getCodeList('order_type')
    vatTypes.value = await ApiCommon.getCodeList('vat_type')
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '영업관리' },
    { label: '출고지시관리' },
    { label: '출고지시목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(shipmentList.value, "출고지시 리스트", cols);
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

</style>
