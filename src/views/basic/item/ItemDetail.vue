<template>
<div :id="$attrs.id"></div>
  <v-breadcrumbs :items="['MES', '기본관리', '품목관리']"></v-breadcrumbs>
    <v-card>
      <v-card-item
        :title="`품목코드 : ${route.params.id}`"
      />
      <v-card-text>
        <v-form @submit.prevent="saveInfo">
          <v-row>
            <v-col cols="9" style="height: 60px;" class="mt-5">
              <v-text-field
                v-model="form.itemName"
                label="품목명"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col style="height: 60px;" class="mt-5">
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
            <v-col style="height: 60px;" class="mt-5" >
              <v-select
                  v-if="isItemType"
                  v-model="form.useCate"
                  label="사용구분"
                  :items="useCates"
                  item-title="codeNm"
                  item-value="code"
                  variant="underlined"
                  density="compact"
                  readonly
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

<v-dialog  v-model="dialog" max-width="800px" height="900px" persistent>
    <CustomerListPop
      @selected="handleSelect"
      @close-dialog="dialog = false"/>
  </v-dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatComma, parseCommaInput } from '@/util/common';
import { useAlertStore } from '@/stores/alert';
import CustomerListPop from '../customer/CustomerListPop.vue';

const { vError, vSuccess } =useAlertStore()

const dialog = ref(false)
const isItemType = ref(false)
const route = useRoute()
const router = useRouter()

const itemTypeCds = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])
const useCates = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])

/**
 *  사용 유무 초기화
 */
const items = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

const itemCd = route.params.id

const form = reactive({
  itemCd : itemCd,
  itemTypeCd: '',
  itemName: '',
  customerName: '',
  customerCd: '',
  itemGrp1: '',
  itemGrp2: '',
  useCate: '',
  inPrice: '',
  outPrice: '',
  itemCategory1: '',
  itemCategory2: '',
  etc:'',
  useYn : '',
})

onMounted( async () => {
  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')

  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')

  const res = await ApiItem.getItemInfo(route.params.id);

  if ( ['M2', 'M7'].includes(res.itemTypeCd) ){
    useCates.value = await ApiCommon.getCodeList('use_Cate')
    itemCategory1s.value = await ApiCommon.getCodeList('order_cate')
    itemCategory2s.value = await ApiCommon.getCodeList('sub_item')
    isItemType.value = true
  }else{
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)
  }

  //console.log('res', res)
  Object.assign( form, res)
})

const handleSelect = (obj) =>{
  console.log('obj', obj)
  form.customerCd = obj.customerCd
  form.customerName = obj.customerName
}

const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

     const msg = await ApiItem.updateItemInfo(params)
     vSuccess(msg)
     goList()

  }catch(err){
    vError('저장에 실패했습니다.')
  }
}

watch(() => form.itemCategory1, async (newVal) => {
  itemCategory2s.value = await ApiItem.getProdMList(form.itemCategory1)
})

const customerPop = () =>{
  dialog.value = true
}

const goList = () =>{
  router.push({name:'ItemList'})
}


</script>

<style scoped>

</style>
