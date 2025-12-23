<template>
    <Card style="width: 70rem; height: 32rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemTypeCd"
                                :options="itemTypeCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>품목구분</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemCd" class="w-full" />
                        <label>품목코드</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.matName" class="w-full" />
                        <label>재료명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.specInfo" class="w-full" />
                        <label>규격정보</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.exAppearance" class="w-full" />
                        <label>외관</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 3 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.packingSpecValue" class="w-full" />
                        <label>단위별포장규격(값)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.packingSpecUnit" class="w-full" />
                        <label>단위별포장규격(단위)</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <IconField iconPosition="left">
                            <InputText v-model="form.relatedCustomerName" class="w-full"/>
                            <InputIcon class="pi pi-search"  @click="openPop"/>
                        </IconField>
                        <label>관련고객사</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 4 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCondition" :options="itemConditions"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>보관조건</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.safeStockQty" suffix=" ea/kg" class="w-full" />
                        <label>안전재고량</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- History -->
            <div class="grid mb-5">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.history" rows="3" class="w-full" style="resize: none" />
                        <label>이력관리</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-3">
                <Button label="저장" severity="secondary" @click="saveInfo"></Button>
                <Button label="닫기" @click="closeDialog"></Button>
            </div>

        </template>
    </Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { useDialog } from 'primevue/usedialog';
import { inject, onMounted, reactive, ref } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef');
const { userId } = useAuthStore()
const { vError, vSuccess} = useAlertStore()

const itemTypeCds = ref([])
const itemConditions = ref([])
/**
 *  사용 유무 초기화
 */
const useSafeStockYns = [
  { codeNm: '사용', code: 'Y' },
  { codeNm: '미사용', code: 'N' },
]

const form = reactive({
  itemTypeCd: '',
  itemCd: '',
  itemName: '',
  matName: '',
  specInfo: '',
  exAppearance:'',
  packingSpecValue: '',
  packingSpecUnit: '',
  relatedCustomerName: '',
  itemCondition: '',
  unitWeight: '',
  history: '',

  relatedCustomer: '',
  userId: userId
})

const openPop = () => {
    dialog.open( CustomerListPop, {
        props: {
            header: '거래처 조회',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
            // 기타 PrimeVue Dialog props 설정
        },
        // 팝업 B에 전달할 데이터
        onClose:(event) => {
      // event.data에 자식 컴포넌트에서 close()로 보낸 데이터가 담겨 있습니다.
            if (event.data) {
                //receivedData.value = event.data;
                form.relatedCustomerName = event.data.customerName;
                form.relatedCustomer = event.data.customerCd;
            }
        },
    })
}


const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const msg = await ApiItem.saveItemDetailInfo(params)
    vSuccess(msg)
    closeDialog()
  }catch(err){
    vError(err.response.data.message)
  }
}


onMounted( async () =>{
  const res = await ApiItem.getItemInfo(dialogRef.value.data)

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')

  Object.assign(form, res)
})

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
