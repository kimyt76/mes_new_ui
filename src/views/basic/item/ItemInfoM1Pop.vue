<template>
    <Card style="width: 70rem; height: 36rem;">
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
                        <Select v-model="form.weighType" :options="weighTypes"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>칭량구분</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.weighFuncType" :options="weighFuncTypes"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>기능구분</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCondition" :options="itemConditions"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>보관조건</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.useSafeStockYn" :options="useSafeStockYns"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>안전재고여부</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 3 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.safeStockQty" suffix=" kg" class="w-full" />
                        <label>안전재고량</label>
                    </FloatLabel>
                </div>
                <div class="col-9">
                    <div class="flex items-center gap-3">
                        <Checkbox v-model="form.vegan" name="Vegan" binary />
                        <label> Vegan </label>
                        <Checkbox v-model="form.halal" name="Halal" binary />
                        <label> Halal </label>
                        <Checkbox v-model="form.rspo" name="RSPO"  binary />
                        <label> RSPO </label>
                        <Checkbox v-model="form.addtion" name="addtion" binary />
                        <label> 추가 </label>
                    </div>
                </div>
            </div>
            <!-- Workflow -->
            <div class="grid mb-5">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.workFlow" rows="3" class="w-full" style="resize: none"/>
                        <label>발행자 특이사항</label>
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
                <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
                <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
            </div>

        </template>
    </Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef');
const { userId } = useAuthStore()
const { vError, vSuccess} = useAlertStore()

const itemTypeCds = ref([])
const weighTypes = ref([])
const weighFuncTypes = ref([])
const itemConditions = ref([])
/**
 *  사용 유무 초기화
 */
const useSafeStockYns = [
  { codeNm: '사용', code: 'Y' },
  { codeNm: '미사용', code: 'N' },
]

const form = reactive({
  itemTypeCd : '',
  itemCd: '',
  itemName: '',
  weighType: '',
  weighFuncType:'',
  itemCondition:'',
  useSafeStockYn: '',
  safeStockQty: '',
  reminderMemo: '',
  history: '',
  vegan:  false,
  halal: false,
  rspo: false,
  addtion: false,

  userId: userId,
})


const saveInfo = async () =>{
  try{
    const params = {
      ...form,
      vegan: form.vegan ? 'Y' : 'N',
    halal: form.halal ? 'Y' : 'N',
    rspo: form.rspo ? 'Y' : 'N',
    addtion: form.addtion ? 'Y' : 'N',
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
    weighTypes.value = await ApiCommon.getCodeList('WEIGH_TYPE')
    weighFuncTypes.value = await ApiCommon.getCodeList('WEIGH_FUNC_TYPE')
    itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')

    Object.assign(form, {
        ...res,
        // Y/N(또는 값 유무)를 boolean으로 변환
        vegan:  res.vegan === 'Y',
        halal:  res.halal === 'Y',
        rspo:   res.rspo === 'Y',
        addtion: res.addtion === 'Y',
    });
})

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
