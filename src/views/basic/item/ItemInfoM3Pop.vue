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
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCondition" :options="itemConditions"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>보관조건</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.prodType" class="w-full" />
                        <label>제품타입</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory1" :options="itemCategory1s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제품유형(대분류)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory2" :options="itemCategory2s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제품유형(중분류)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.functionalTypeCd" :options="functionalTypeCds"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>기능성분류</label>
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
import { onMounted, reactive, ref } from 'vue';

const { userId } = useAuthStore()
const { vError, vSuccess} = useAlertStore()
const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const functionalTypeCds = ref([])
const itemConditions = ref([])
const form = reactive({
  itemCd: '',
    itemTypeCd : '',
  itemCd: '',
  itemName: '',
  matName: '',
  specInfo:'',
  exAppearance:'',
  prodType: '',
  safeStockQty: '',
  packingSpecValue: '',
  packingSpecUnit: '',
  itemCondition: '',
  itemCategory1: '',
  itemCategory2: '',
  functionalTypeCd: '',
  history: '',

  userId: userId
})

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const res = await ApiItem.saveItemDetailInfo(params)
    vSuccess(res.message)
    closeDialog()
  }catch(err){
    vError(err.massage)
  }
}

onMounted( async () =>{
    const res = await ApiItem.getItemInfo(dialogRef.value.data)

    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)
    functionalTypeCds.value = await ApiCommon.getCodeList('FUNCTIONAL_TYPE')
    itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')

    Object.assign(form, res)
})

import { inject } from 'vue';

const dialogRef = inject('dialogRef');

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
