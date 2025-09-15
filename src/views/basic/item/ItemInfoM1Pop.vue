<template>
  <v-card>
    <v-card-item
      title="폼목정보관리(원재료)"
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
            <v-col >
            <v-select
              v-model="form.weighType"
              label="칭량구분"
              :items="weighTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
            </v-col>
            <v-col>
            <v-select
              v-model="form.weighFuncType"
              label="기능구분"
              :items="weighFuncTypes"
              item-title="codeNm"
              item-value="code"
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
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="form.useSafeStockYn"
                label="안전재고여부"
                :items="useSafeStockYns"
                item-title="text"
                item-value="value"
                variant="underlined"
                density="compact"
                />
            </v-col>
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.safeStockQty"
                label="안전재고량"
                variant="underlined"
                density="compact"
              >
              <template #append-inner>
                <span>kg</span>
              </template>
              </v-text-field>
            </v-col>
            <v-col class="d-flex ">
              <v-checkbox
                v-model="form.vegan"
                label="Vegan"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="form.halal"
                label="Halal"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="form.rspo"
                label="RSPO"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="form.addtion"
                label="RSPO"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="9" style="height: 60px;">
              <v-text-field
                v-model="form.reminderMemo"
                label="발행자 특이사항"
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
import { isEmpty } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';

const { vError } = useAlertStore()
const emit = defineEmits(['saved', 'close-dialog'])

const itemTypeCds = ref([])
const weighTypes = ref([])
const weighFuncTypes = ref([])
const itemConditions = ref([])

/**
 *  사용 유무 초기화
 */
const useSafeStockYns = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

onMounted( async () =>{
    const res = await ApiItem.getItemInfo(props.id)

    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    weighTypes.value = await ApiCommon.getCodeList('WEIGH_TYPE')
    weighFuncTypes.value = await ApiCommon.getCodeList('WEIGH_FUNC_TYPE')
    itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')

    Object.assign(form, res)

    if ( !isEmpty(res.vegan) ){
      form.vegan = true
    }
    if ( !isEmpty(res.halal) ){
      form.halal = true
    }
    if ( !isEmpty(res.rspo) ){
      form.rspo = true
    }
    if ( !isEmpty(res.addtion) ){
      form.addtion = true
    }
})

const { userId} = useAuthStore()

const props = defineProps({
  id: {
    type: String,
  },
})

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

  userId: userId
})


const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    params.vegan = params.vegan === true ? 1 : 0
    params.halal = params.halal === true ? 1 : 0
    params.rspo = params.rspo === true ? 1 : 0
    params.addtion = params.addtion === true ? 1 : 0
    //console.log('params', params)
    const msg = await ApiItem.saveItemDetailInfo(params)
    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err.message)
  }
}

</script>

<style scoped>
.v-card-item  {
  height: 45px;
  background-color:#BCAAA4
}

</style>
