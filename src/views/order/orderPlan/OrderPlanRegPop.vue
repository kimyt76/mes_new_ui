<template>
<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">{{ title }}</h5>
    <Button label="추가+" class="p-button-xm" @click="addRow" />
</div>
<div>
    <DataTable
            :value="planList"
            scrollable
            showGridlines
            class="my-table"
            tableStyle="table-layout: fixed; "
        >
        <Column field="seq"         header="No."       :style="{ width: '30px', textAlign:'center'}" :bodyStyle="{ padding: '0'}" >
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.seq"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'center' }"
                />
            </template>
        </Column>
        <Column field="deliveryReqDate" header="계획일자"  :style="{ width: '100px', textAlign:'center'}" :bodyStyle="{ padding: '0'}" >
            <template #body="slotProps">
                <DatePicker v-model="slotProps.data.planDate" show-icon :inputStyle="{ width: '100px', textAlign:'center'}"/>
            </template>
        </Column>
        <Column field="itemType"         header="구분"       :style="{ width: '100px', textAlign:'center'}"  >
            <template #body="slotProps">
                <InputText v-model="slotProps.data.itemType" class="w-full" />
            </template>
        </Column>
        <Column field="qty"         header="수량"       :style="{ width: '100px'}" :bodyStyle="{ padding: '0'}" >
                <template #body="slotProps">
                    <InputNumber
                        v-model="slotProps.data.qty"
                        class="w-full"
                        :min="0"
                        :maxFractionDigits="0"
                        :useGrouping="true"
                        :inputStyle="{ width: '110px', 'text-align': 'right' }"
                    />
                </template>
        </Column>
        <Column field="actions"     header="-"    :style="{ width: '30px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>


</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { useAlertStore } from '@/stores/alert';
import { todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive, ref } from 'vue';

const {vSuccess, vWarning, vError} = useAlertStore()
const dialogRef = inject('dialogRef')
const title = ref(null)
const planList = ref([])
const deleteOrderPlanIds = ref([])
const form = reactive({
    typeCd : '',
    poNo: '',
})

const addRow = () =>{
    planList.value.push({
        orderPlanId: null,       // 신규 데이터
        seq: null,
        planDate: todayKST(),
        itemType: '',
        qty: 0,
    })
}

const removeRow = (index) =>{
    const row = planList.value[index]

    if (!row) return

    // DB에 저장되어 있는 기존 행인 경우만 삭제 ID 보관
    if ( row.orderPlanId !== null && row.orderPlanId !== undefined && row.orderPlanId !== '' ) {
        if (!deleteOrderPlanIds.value.includes(row.orderPlanId)) {
            deleteOrderPlanIds.value.push(row.orderPlanId)
        }
    }

    // 화면 리스트에서 제거
    planList.value.splice(index, 1)
}

const saveInfo = async () =>{
    try{
console.log('planList.value', planList.value)
        const saveList = planList.value.map(item => ({
            ...item,
            planDate: formatDate(item.planDate)

        }))
console.log('saveList', saveList)
        const params = {
            orderPlanTypeList : saveList,
            deleteOrderPlanIds: deleteOrderPlanIds.value,
            orderPlanTypeInfo : form,
        }
console.log('params', params)
        const res = await ApiOrder.saveOrderPlan(params)
        vSuccess("저장되었습니다.")

        closeDialog()
    }catch(err){
        handleApiError(err)
    }

}

onMounted( async () =>{
    form.typeCd =  dialogRef.value.data.typeCd
    form.poNo =  dialogRef.value.data.poNo

    const params = {
        ...form
    }

    const res = await ApiOrder.getOrderPlanType(params)

    planList.value = res

})

const closeDialog = () => {
    // 다이얼로그 닫기 로직
    // 예: emit 이벤트를 통해 부모 컴포넌트에 알리거나, 상태를 변경하여 다이얼로그를 숨김
    dialogRef.value.close();
};

const formatDate = (date) => {

    if (!date) {
        return null
    }

    // 이미 yyyy-MM-dd 문자열이면 그대로
    if (typeof date === 'string') {
        return date.substring(0, 10)
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
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
