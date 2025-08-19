<template>
  <v-card>
    <v-card-item
      title="폼목정보관리(완제품)"
    />
    <v-card-text>
      <v-form ref="vform">
        <v-row  class="mt-3">
          <v-col cols="3">
            <v-select
              v-model="form.itemTypeCd"
              label="품목구분"
              :items="itemTypeCds"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              readonly
              />
            </v-col>
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.itemCd"
                label="품목코드"
                variant="underlined"
                density="compact"
                readonly
              />
            </v-col>
            <v-col cols="6" style="height: 60px;">
              <v-text-field
                v-model="form.itemName"
                label="품목명"
                variant="underlined"
                density="compact"
              />
            </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                v-model="form.prodType"
                label="제품타입"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-select
              v-model="form.itemCategory1"
              label="제품유형(대분류)"
              :items="itemCategory1s"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              readonly
              />
          </v-col>
          <v-col>
            <v-select
              v-model="form.itemCategory2"
              label="제품유형(중분류)"
              :items="itemCategory2s"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              readonly
              />
          </v-col>
          <v-col>
            <v-select
              v-model="form.functionalTypeCd"
              label="기능성분류"
              :items="functionalTypeCds"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                v-model="form.stdWeight"
                label="기준무게"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
                v-model="form.displayCapacity"
                label="표시용량"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-select
              v-model="form.itemCondition"
              label="보관조건"
              :items="itemConditions"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-select
              v-model="form.qcProcTestType"
              label="QC공정검사구분"
              :items="qcProcTestTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                :model-value="formatComma(form.theoryProdNumber1)"
                label="이론생산계수1"
                variant="underlined"
                density="compact"
                @update:model-value="v => form.theoryProdNumber1 = parseCommaInput(v)"
              />
          </v-col>
          <v-col>
            <v-text-field
                :model-value="formatComma(form.theoryProdNumber2)"
                label="이론생산계수2"
                variant="underlined"
                density="compact"
                @update:model-value="v => form.theoryProdNumber2 = parseCommaInput(v)"
              />
          </v-col>
          <v-col>
            <v-text-field
                v-model="form.chargeResearcher"
                label="담당연구원"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
                v-model="form.labNo"
                label="랩넘버"
                variant="underlined"
                density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                v-model="form.chargeSalesman"
                label="영업담당자"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
                v-model="form.stdYield"
                label="품목기준수율"
                variant="underlined"
                density="compact"
              >
              <template #append-inner>
                <span class="text-grey">% </span>
              </template>
              </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                v-model="form.displayYield"
                label="수율공식(표시용)"
                variant="underlined"
                density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                v-model="form.chargingQtys"
                label="충전지시량"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.chargingCnt"
              label="충전매수"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.cappingRange"
              label="캡핑세기 측정범위"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.essenceStd"
              label="에센스 충전량 기준"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.workFlow"
              label="포장 공정 작업공정도"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.history"
              label="이력관리"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
      </v-form>

    </v-card-text>
    <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="indigo-darken-4"
            text="저장"
            variant="tonal"
            depressed
            @click="saveInfo"
            />
          <v-btn
            text="닫기"
            variant="tonal"
             @click="emit('close-dialog')"
          />
        </v-card-actions>
  </v-card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, reactive } from 'vue';
import { parseCommaInput, formatComma } from '@/util/common';
const { vError } = useAlertStore()

const { userid } = useAuthStore()
const emit = defineEmits(['saved', 'close-dialog'])
const props = defineProps({
  id: {
    type: String,
  },
})

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

  userId: userid,
})


onMounted( async () => {
  const res = await ApiItem.getItemInfo(props.id)

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')
  functionalTypeCds.value = await ApiCommon.getCodeList('FUNCTIONAL_TYPE')
  qcProcTestTypes.value = await ApiCommon.getCodeList('QC_PROC_TEST_TYPE')
  itemCategory1s.value = await ApiItem.getProdLList()
  itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

  Object.assign(form, res)
})


const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const msg = await ApiItem.saveItemDetailInfo(params)

    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err.massage)
  }
}

</script>

<style scoped>
.v-card-item  {
  height: 45px;
  background-color:#BCAAA4
}

</style>
