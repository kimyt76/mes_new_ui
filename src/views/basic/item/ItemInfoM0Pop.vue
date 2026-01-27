<template>
    <Card style="width: 70rem; height: 50rem;">
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
                        <InputText v-model="form.prodType" class="w-full" />
                        <label>제품타입</label>
                    </FloatLabel>
                </div>
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
            <!-- Row 3 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.stdWeight" class="w-full" />
                        <label>기준무게</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.displayAmount" class="w-full" />
                        <label>표시용량</label>
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
                        <Select v-model="form.qcProcTestType" :options="qcProcTestTypes"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>QC공정검사구분</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 4 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.theoryProdNumber1" class="w-full" />
                        <label>이론생산계수1</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.theoryProdNumber2" class="w-full" />
                        <label>이론생산계수2</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.chargeResearcher" class="w-full" />
                        <label>담당연구원</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.labNo" class="w-full" />
                        <label>랩넘버</label>
                    </FloatLabel>
                </div>
            </div>

            <!-- Row 5 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.chargeSalesman" class="w-full" />
                        <label>영업담당자</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.stdYield" suffix=" %" class="w-full" />
                        <label>품목기준수율</label>
                    </FloatLabel>
                </div>

                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.displayYield" class="w-full" />
                        <label>수율공식(표시용)</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 6 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.chargingQtys" class="w-full" />
                        <label>충전지시량</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.chargingCnt" class="w-full" />
                        <label>충전매수</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.cappingRange" class="w-full" />
                        <label>캡핑세기 측정범위</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.essenceStd" class="w-full" />
                        <label>에센스 충전량 기준</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Workflow -->
            <div class="grid mb-5">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.workFlow" rows="3" class="w-full" style="resize: none"/>
                        <label>포장공정 작업공정도</label>
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
const qcProcTestTypes = ref([])
const form = reactive({
  itemCd: '',
  itemName: '',
  prodType: '',
  prodLgType: '',
  prodMdType: '',
  functionalTypeCd: '',
  itemCondition: '',
  qcProcTestType : '',
  stdWeight: '',
  displayCapacity: '',
  theoryProdNumber1: '',
  theoryProdNumber2: '',
  chargeResearcher: '',
  labNo: '',
  chargeSalesman: '',
  stdYield: '',
  displayYield: '',
  chargingQtys: '',
  chargingCnt: '',
  cappingRange: '',
  essenceStd: '',
  workFlow: '',
  history : '',

  userId: userId,
})

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const res = await ApiItem.saveItemDetailInfo(params)
    vSuccess(res.massage)
    closeDialog()
  }catch(err){
    vError(err.massage)
  }
}

onMounted( async () =>{
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')
    functionalTypeCds.value = await ApiCommon.getCodeList('FUNCTIONAL_TYPE')
    qcProcTestTypes.value = await ApiCommon.getCodeList('QC_PROC_TEST_TYPE')
    itemCategory1s.value = await ApiItem.getProdLList()

    const res = await ApiItem.getItemInfo(dialogRef.value.data)
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

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
