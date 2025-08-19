<template>
<div :id="$attrs.id"></div>
  <v-breadcrumbs :items="['MES', '기본관리', '품목코드 신규']"></v-breadcrumbs>

  <v-card>
      <v-card-item
        :title="route.query.id"
      />
    <v-card-text>
      <v-form @submit.prevent="saveInfo">
        <v-row>
          <v-col style="height: 60px;" >
            <v-select
                v-model="form.itemTypeCd"
                label="품목구분"
                :items="itemTypeCds"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col style="height: 60px;" >
            <v-select
                v-if="isItemType"
                v-model="form.useCate"
                label="사용구분"
                :items="useCates"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col style="height: 60px;">
              <v-btn
                text="중복확인"
                density="compact"
                @click="itemCdCheck"
                />
           </v-col>
        </v-row>
        <v-row>
          <v-col style="height: 60px;">
              <v-select
                v-model="form.itemCategory1"
                label="대분류"
                :items="itemCategory1s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
           </v-col>
           <v-col style="height: 60px;">
              <v-select
                v-model="form.itemCategory2"
                label="중분류"
                :items="itemCategory2s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
            </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" style="height: 60px;">
              <v-text-field
                v-model="form.itemCd"
                label="품목코드"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col cols="9" style="height: 60px;">
                <v-text-field
                  v-model="form.itemName"
                  label="품목명"
                  variant="underlined"
                  density="compact"
                />
          </v-col>
        </v-row>
        <v-row>
          <v-col style="height: 60px;">
            <v-text-field
              v-model="form.customerName"
              label="거래처명"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-magnify"
              @click:append-inner="customerPop"
            />
          </v-col>
          <v-col style="height: 60px;">
              <v-select
                v-model="form.itemGrp1"
                label="거래유형"
                :items="itemGrp1s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col style="height: 60px;">
              <v-select
                v-model="form.itemGrp2"
                label="제품유형"
                :items="itemGrp2s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col style="height: 60px;">
              <v-text-field
                v-model="form.unit"
                label="단위"
                variant="underlined"
                density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col style="height: 60px;">
              <v-text-field
                v-model="form.spec"
                label="SPEC"
                variant="underlined"
                density="compact"
              />
          </v-col>
          <v-col style="height: 60px;">
              <v-text-field
                :model-value="formatComma(form.inPrice)"
                label="입고단가"
                variant="underlined"
                density="compact"
                @update:model-value="v => form.inPrice = parseCommaInput(v)"
                />
          </v-col>
          <v-col style="height: 60px;">
              <v-text-field
                :model-value="formatComma(form.outPrice)"
                label="출고단가"
                variant="underlined"
                density="compact"
                @update:model-value="v => form.outPrice = parseCommaInput(v)"
                />
          </v-col>
          <v-col style="height: 60px;">
              <v-select
                v-model="form.useYn"
                label="사용유무"
                :items="items"
                item-title="text"
                item-value="value"
                variant="underlined"
                density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col style="height: 60px;">
            <v-text-field
              v-model="form.etc"
              label="비고"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="d-flex ga-4 justify-end">
              <v-btn
                color="indigo-darken-4"
                text="저장"
                variant="tonal"
                type="submit"
                />
              <v-btn
                text="목록"
                variant="tonal"
                @click="goList"
              />
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>

<v-dialog  v-model="dialog" max-width="800px" height="700px" persistent>
    <CustomerListPop
      @selected="handleSelect"
      @close-dialog="dialog = false"/>
  </v-dialog>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { reactive, ref, onMounted, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CustomerListPop from '../customer/CustomerListPop.vue';
import { incrementAlpabet, parseCommaInput, formatComma , incrementNumber, typeNm } from '@/util/common';
import { useAuthStore } from '@/stores/auth';
import { omit } from 'lodash';

const {vError, vSuccess, vInfo, vWarning} = useAlertStore()
const { userId } = useAuthStore()

const isDisabled = ref(false)
const dialog = ref(false)
const isItemType = ref(false)
const route = useRoute()
const router = useRouter()
const asItemCd = route.query.id
const asItemTypeCd = route.query.type

const itemTypeCds = ref([])
const useCates = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])

/**
 *  사용 유무 초기화
 */
const items = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

const form = reactive({
  itemCd: '',
  itemName: '',
  itemTypeCd : '',
  useCate: '',
  itemCategory1: '',
  itemCategory2: '',
  customerCd: '',
  customerName: '',
  unit: '',
  spec: '',
  inPrice: '',
  outPrice: '',
  itemGrp1: '',
  itemGrp2: '',
  etc: '',
  useYn : 'Y',

  userId : userId,

})

const customerPop = () =>{
  dialog.value = true
}

onMounted( async () => {
  const res = await ApiItem.getItemInfo(asItemCd);

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemTypeCds.value = itemTypeCds.value.filter(i => !['M1','M4'].includes(i.code))

  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')

  form.itemCd = res.itemCd
  form.itemName = res.itemName

  itemCategory1s.value = await ApiItem.getProdLList()
  itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

  Object.assign(form, omit(res, ['itemTypeCd']))
})

watch(() => form.itemTypeCd, (newVal) => {
  useCates.value = []
  isItemType.value = false;

  if ( !['M2', 'M7'].includes(newVal) && newVal !== asItemTypeCd) {
    vInfo("품목구분이 틀립니다.")
    return
  }

  if ( ['M2', 'M7'].includes(newVal) ) {    //부자재, 소모품
    subInit()

  }else if ( ['M0', 'M6'].includes(newVal)  ){
    mainInit()
  }else {
    mainSubInit()
  }
})

const subInit = async () => {
  isDisabled.value = false
  isItemType.value = true

  itemCategory1s.value = []
  itemCategory2s.value = []

  form.itemCategory1 = null
  form.itemCategory2 = null

  form.itemCd = null
  form.itemName = null

  useCates.value = await ApiCommon.getCodeList('use_Cate')
  itemCategory1s.value = await ApiCommon.getCodeList('order_cate')
  itemCategory2s.value = await ApiCommon.getCodeList('sub_item')
}

const mainInit = async () =>{
  isDisabled.value = true
  isItemType.value = false

  itemCategory1s.value = []
  itemCategory2s.value = []

  form.itemCategory1 = null
  form.itemCategory2 = null

  form.itemCd = null
  form.itemName = null

  const res = await ApiItem.getItemInfo(asItemCd);

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemTypeCds.value = itemTypeCds.value.filter(i => !['M1','M4'].includes(i.code))

  itemCategory1s.value = await ApiItem.getProdLList()
  itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')



  Object.assign(form, omit(res, ['itemTypeCd']))

  form.itemCd = incrementAlpabet(res.itemCd)
  form.itemName = res.itemName
}

const mainSubInit = async () =>{
  isDisabled.value = true
  isItemType.value = false

  itemCategory1s.value = []
  itemCategory2s.value = []

  form.itemCategory1 = null
  form.itemCategory2 = null

  form.itemCd = null
  form.itemName = null

  const res = await ApiItem.getItemInfo(asItemCd);

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemTypeCds.value = itemTypeCds.value.filter(i => !['M1','M4'].includes(i.code))

  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')

  itemCategory1s.value = await ApiItem.getProdLList()
  itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

  Object.assign(form, omit(res, ['itemTypeCd']))

  form.itemCd = incrementNumber(form.itemCd)
  form.itemName = res.itemName
}

watchEffect( async () => {
  if (form.itemCategory1 && form.itemCategory2) {
    if ( ['M2', 'M7'].includes(form.itemTypeCd)) {
      if ( asItemTypeCd !== 'M0') {
        vInfo('부자재 및 소모품은 완제품 품목으로 호출하셔야 합니다.')
        return
      }
      form.itemCd = 'JP'+form.useCate+form.itemCategory1+form.itemCategory2+asItemCd.slice(-5)
      form.itemName = typeNm(form.itemTypeCd)
    }
  }
})

const itemCdCheck = async () =>{
  const chk =  await ApiItem.getItemCdCheck(form.itemCd)

  if ( chk === 'Y' ) {
    vWarning("중복된 품목코드입니다.")
  }else{
    vInfo("사용가능한 품목코드입니다.")
  }
}

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const msg = await ApiItem.saveItemInfo(params)
    vSuccess(msg)
    goList()

  }catch(err){
    vError('저장에 실패했습니다.')
  }
}

const handleSelect = (obj) =>{
  form.customerCd = obj.customerCd
  form.customerName = obj.customerName
}

const goList = () =>{
  router.push({name:'ItemList'})
}

</script>

<style scoped>

</style>
