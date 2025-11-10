<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumbs"/>

<v-card>
  <v-card-text>
    <v-row class="d-flex" dense >
      <v-col >
        <v-select
          v-model="form.areaCd"
          :items = "areaCds"
          label="공장명"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col >
        <v-text-field
          v-model="form.clientName"
          label="업체명"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col >
        <v-text-field
          v-model="form.itemName"
          label="품목명"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col >
        <v-text-field
          v-model="form.businessManagerName"
          label="영업담당자명"
          variant="underlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col >
        <v-date-input
          v-model="form.reqDate"
          label="의뢰일자"
          :display-format="formatDate"
          variant="underlined"
          density="compact"
          prepend-icon=""
          append-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col class="d-flex" style="gap: 8px;">
        <v-select
          v-model="form.formulation"
          :items = "formulationCds"
          label="제형품목"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
          style="width: 260px;"
        />
        <v-text-field
          v-model="form.formulationCd"
          label="제형"
          variant="underlined"
          density="compact"
          style="width: 60px;"
          readOnly
        />
      </v-col>
      <v-col >
        <v-text-field
          v-model="form.labManagerName"
          label="연구담당자명"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col >
        <v-select
          v-model="form.confirmYn"
          :items="['확정', '미확정']"
          label="확정여부"
          variant="underlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col >
        <v-text-field
          v-model="form.prodMgmtNo"
          label="제품관리번호"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col >
        <v-select
          v-model="form.statusType"
          :items="statusTypes"
          label="상태유형"
          variant="underlined"
          density="compact"
        />
      </v-col>
      <v-col class="d-flex">
        <v-text-field
          v-model="form.countQty"
          label="횟수"
          type="number"
          variant="underlined"
          density="compact"
          class="ea-field"
        />
        <v-text-field
          v-model="form.qty"
          label="수량"
          type="number"
          variant="underlined"
          density="compact"
          class="ea-field"
          style="text-align: right;"
        >
        <template #append-inner>
          <span style="font-size: 14px; color: gray;">ea</span>
        </template>
        </v-text-field>
      </v-col>
      <v-col >
        <v-text-field
          v-model="form.endReason"
          label="종료사유"
          variant="underlined"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="form.etc"
          label="진행 및 특이사항/비고(사양 및 셋팅값)"
          variant="underlined"
          density="compact"
          rows="1"
        />
      </v-col>
    </v-row>
    <v-row >
      <v-col class="d-flex justify-end" >
        <v-btn
          color="brown-lighten-4"
          text="저장"
          class="mr-2"
          @click="saveInfo"
        />
        <v-btn
          text="목록"
          @click="goList"
        />
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script setup>

import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { formatDate, isEmpty, todayKST } from '@/util/common';
import { computed, onMounted, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const { userId } = useAuthStore()
const { vError, vSuccess, vWarning} = useAlertStore()
const route = useRoute()
const sampleId = route.params.id;
const formulationCds = ref([])
const areaCds = ref([])
const confirmYns = ref([])
const breadcrumbs = computed(() => {
    const hasId = !!route.params.id
      return ['MES','연구관리관리', hasId ? '샘플상세' : '샘플등록']
})
const  statusTypes = ref(["신규", "개선", "추가"]);
const form =reactive({
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

  sampleId: sampleId,
  userId: userId,
})

watch (() => form.formulation , (newVal) =>{
  console.log('newVal', newVal)
  if (!isEmpty(newVal)){
    form.formulationCd = newVal
  }
})

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }
    params.reqDate = formatDate(form.reqDate)
    const msg = await ApiLab.saveSampleInfo(params)
    vSuccess("저장되었습니다.")
    goList()
  }catch(e){
    vError('샘플정보 저장 중 오류가 발생했습니다.')
    return
  }
}

onMounted( async () =>{
  formulationCds.value = await ApiCommon.getCodeList('formulation_cd')
  confirmYns.value = await ApiCommon.getCodeList('use_yn')
  areaCds.value = await ApiCommon.getCodeList('AREA')
  areaCds.value = areaCds.value.filter(i => !['A003'].includes(i.code))
  form.reqDate = todayKST()

  if (!isEmpty(sampleId)){
    const  res = await ApiLab.getSampleInfo(sampleId)
    Object.assign(form, res)
    form.formulation = res.formulationCd
  }else{
    form.prodMgmtNo = await ApiLab.getNextProdMgmtNo()
  }
})

const goList = () =>{
  router.push({ name: 'SampleList' })
}
</script>

<style scoped>
.ea-field input {
  text-align: right;
}
.ea-unit {
  color: gray;
  font-size: 13px;
  margin-left: 4px;
}
:deep(.ea-field input) {
  text-align: right;
}
</style>
