<template>
    <Card style="width: 70rem; height: 27rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.prodMgmtNo" class="w-full" />
                        <label>제품관리번호</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.areaCd"
                                :options="areaCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>공장명</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.clientName" class="w-full" />
                        <label>업체명</label>
                    </FloatLabel>
                </div>

            </div>
            <!-- Row 2 -->
             <div class="grid mb-3">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.formulation" :options="formulationCds"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제형품목</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.formulationCd" class="w-full" />
                        <label>제형</label>
                    </FloatLabel>
                </div>
            </div>
        <!-- Row 3 -->
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <DatePicker v-model="form.reqDate" showIcon fluid iconDisplay="input" inputId="icondisplay"/>
                        <label>의뢰일자</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.businessManagerName" class="w-full" />
                        <label>영업담당자명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.labManagerName" class="w-full" />
                        <label>연구담당자명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.statusType" :options="statusTypes"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>상태유형</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid  mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.countQty" class="w-full" />
                        <label>횟수</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.qty" class="w-full" />
                        <label>수량</label>
                    </FloatLabel>
                </div>

                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.confirmYn" :options="confirmYns"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>확정여부</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.endReason" class="w-full" />
                        <label>종료사유</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- History -->
            <div class="grid mb-2">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.etc" rows="3" class="w-full" style="resize: none" />
                        <label>진행 및 특이사항/비고(사양 및 셋팅값)</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-3">
                <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
                <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
            </div>

        </template>
    </Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common';
import { inject, onMounted, reactive, ref, watch } from 'vue';

const dialogRef = inject('dialogRef');
const { userId } = useAuthStore()
const { vError, vSuccess} = useAlertStore()
const formulationCds = ref([])
const areaCds = ref([])
const statusTypes = ref([
    { codeNm: '신규', code: '신규' },
    { codeNm: '개선', code: '개선' },
    { codeNm: '추가', code: '추가' },
]);

const confirmYns = ref([
    { codeNm: '확정', code: 'Y' },
    { codeNm: '미확정', code: 'N' },
]);
const form = reactive({
  areaCd:'',
  clientName: '',
  itemName: '',
  businessManagerName: '',
  formulation:'',
  formulationCd:'',
  labManagerName: '',
  reqDate: '',
  prodMgmtNo: '',
  countQty: 0,
  qty: 0,
  etc:'',
  confirmYn:'',
  endReason:'',

  sampleId: '',
  userId: userId,
})

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const msg = await ApiLab.saveSampleInfo(params)
    vSuccess(msg.data)
    //closeDialog()
  }catch(err){
    vError(err.massage)
  }
}

watch (() => form.formulation , (newVal) =>{
    if (!isEmpty(newVal)){
    form.formulationCd = newVal
  }
})

onMounted( async () =>{
    formulationCds.value = await ApiCommon.getCodeList('formulation_cd')
    areaCds.value = await ApiCommon.getCodeList('AREA')
    areaCds.value = areaCds.value.filter(i => !['A003'].includes(i.code))
    form.reqDate = todayKST()

    form.sampleId = dialogRef.value.data

    if ( !isEmpty(dialogRef.value) ) {
        const  res = await ApiLab.getSampleInfo(form.sampleId)
        Object.assign(form, res)
        form.formulation = res.formulationCd
    }else{
        form.prodMgmtNo = await ApiLab.getNextProdMgmtNo()
    }
})

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
