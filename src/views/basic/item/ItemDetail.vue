<template>
<div :id="$attrs.id"></div>
  <v-breadcrumbs :items="['MES', '기본관리', '품목관리']"></v-breadcrumbs>
    <v-card>
      <v-card-item :title="`품목코드 : ${route.params.id}`"/>
      <v-form @submit.prevent="saveInfo">
      <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.itemName"
                label="품목명"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col class="d-flex ga-6">
              <v-select
                v-model="form.itemTypeCd"
                label="품목구분"
                :items="itemTypeCds"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                readonly
                style="width: 80px;"
                />
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
                  style="width: 80px;"
                />
            </v-col>
            <v-col >
              <v-text-field
                  v-model="form.category"
                  label="용도"
                  variant="underlined"
                  density="compact"
                />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
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
           <v-col>
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
            <v-col>
              <v-text-field
                v-model="form.safeStock"
                label="안전재고"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.avgDeliveryDate"
                label="평균납품소요일"
                variant="underlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col >
              <v-text-field
                v-model="form.customerName"
                label="거래처명"
                variant="underlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                @click:append-inner="customerPop"
              />
            </v-col>
            <v-col>
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
            <v-col >
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
            <v-col>
                <v-text-field
                  v-model="form.unit"
                  label="단위"
                  variant="underlined"
                  density="compact"
                />
            </v-col>
          </v-row>
          <v-row>
            <v-col >
                <v-text-field
                  v-model="form.spec"
                  label="SPEC"
                  variant="underlined"
                  density="compact"
                />
            </v-col>
            <v-col >
                <v-text-field
                  :model-value="formatComma(form.inPrice)"
                  label="입고단가"
                  variant="underlined"
                  density="compact"
                  @update:model-value="v => form.inPrice = parseCommaInput(v)"
                  @blur="handlePriceBlur"
                  />
            </v-col>
            <!-- Tooltip 아이콘 -->
            <v-col cols="auto" class="pl-0">
              <v-menu
                v-model="inPriceMenu"
                activator="parent"
                offset-y
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    color="grey"
                    size="small"
                    class="mt-2"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>

                <v-card min-width="250">
                  <v-card-title class="text-subtitle-2 font-weight-bold">
                    입고단가 변경 이력
                  </v-card-title>
                  <v-divider></v-divider>

                  <v-list density="compact">
                    <v-list-item
                      v-for="(item, i) in inPriceHistory"
                      :key="i"
                    >
                      <div class="d-flex justify-space-between w-100">
                        <span>{{ item.historyDate }}</span>
                        <span>{{ formatComma(item.price) }} 원</span>
                      </div>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>
                  <v-card-actions class="justify-end">
                    <v-btn text="닫기" size="small" @click="inPriceMenu = false" />
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>

            <v-col >
              <v-text-field
                :model-value="formatComma(form.outPrice)"
                label="출고단가"
                variant="underlined"
                density="compact"
                @update:model-value="v => form.outPrice = parseCommaInput(v)"
                @blur="handlePriceBlur"
                />
            </v-col>
            <!-- Tooltip 아이콘 -->
            <v-col cols="auto" class="pl-0">
              <v-menu
                v-model="outPriceMenu"
                activator="parent"
                offset-y
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    color="grey"
                    size="small"
                    class="mt-2"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>

                <v-card min-width="250">
                  <v-card-title class="text-subtitle-2 font-weight-bold">
                    출고단가 변경 이력
                  </v-card-title>
                  <v-divider></v-divider>

                  <v-list density="compact">
                    <v-list-item
                      v-for="(item, i) in outPriceHistory"
                      :key="i"
                    >
                      <div class="d-flex justify-space-between w-100">
                        <span>{{ item.historyDate }}</span>
                        <span>{{ formatComma(item.price) }} 원</span>
                      </div>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>
                  <v-card-actions class="justify-end">
                    <v-btn text="닫기" size="small" @click="outPriceMenu = false" />
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>

            <v-col>
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
            <v-col>
              <v-textarea
                v-model="form.etc"
                label="비고"
                row-height="15"
                rows="2"
                variant="outlined"
                auto-grow
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex ga-4 justify-end mt-1">
                <v-btn
                  color="indigo-darken-4"
                  text="단가저장"
                  variant="tonal"
                  @click="savePrice"
                  depressed
                  />
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
            </v-col>
          </v-row>
          </v-card-text>
      </v-form>
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
import { useAuthStore } from '@/stores/auth';

const {userId} = useAuthStore()
const { vError, vSuccess, vWarning } =useAlertStore()
const changePrice = ref('')
const inPriceMenu = ref(false)
const inPriceHistory = ref([])
const outPriceMenu = ref(false)
const outPriceHistory = ref([])

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
  safeStock: '',
  avgDeliveryDate: '',
  unit: '',
  spec: '',
  category: '',

  userId: userId,
})

onMounted( async () => {
  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')

  const res = await ApiItem.getItemInfo(route.params.id);
  console.log('res', res)
  Object.assign( form, res)

  inPriceHistory.value =  res.priceHistory.filter(h => h.priceType === 'I')
  outPriceHistory.value = res.priceHistory.filter(h => h.priceType === 'O')

  oldPrices.inPrice = form.inPrice
  oldPrices.outPrice = form.outPrice

  if ( ['M2', 'M7'].includes(res.itemTypeCd) ){
    useCates.value = await ApiCommon.getCodeList('use_Cate')
    itemCategory1s.value = await ApiCommon.getCodeList('order_cate')
    itemCategory2s.value = await ApiCommon.getCodeList('sub_item')
    isItemType.value = true
  }else{
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)
  }

})

const handleSelect = (obj) =>{
  //console.log('obj', obj)
  form.customerCd = obj.customerCd
  form.customerName = obj.customerName
}

const savePrice = async () =>{
  if (!changePrice.value) {
    vWarning('변경된 단가가 없습니다.')
    return
  }

  const params = {
    type: changePrice.value,  /*타입구분 */
    itemCd: form.itemCd,
    inPrice: form.inPrice,
    outPrice: form.outPrice,
    userId: userId,
  }
  try {
    const msg = await ApiItem.updatePriceInfo(params)
    vSuccess(msg)

    // 변경 후 이전값 갱신
    oldPrices.inPrice = form.inPrice
    oldPrices.outPrice = form.outPrice

    changePrice.value = '' // 초기화
  } catch (err) {
    console.error(err)
    vError(err.response?.data || '단가 변경 중 오류가 발생했습니다.')
  }
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

// 이전 단가 저장
const oldPrices = reactive({
  inPrice: null,
  outPrice: null
})

const handlePriceBlur = () => {
  //  console.log(' 전 입고단가 :', oldPrices.inPrice)
  //  console.log(' 후 입고단가 :', form.inPrice)
  //  console.log(' 전 출고단가 :', oldPrices.outPrice)
  //  console.log(' 전 출고단가 :', form.outPrice)

  const inChanged = form.inPrice !== oldPrices.inPrice
  const outChanged = form.outPrice !== oldPrices.outPrice

  if (inChanged && !outChanged) {
    changePrice.value = 'I'
    console.log('입고단가만 변경됨:', form.inPrice)
  } else if (!inChanged && outChanged) {
    changePrice.value = 'O'
    console.log('출고단가만 변경됨:', form.outPrice)
  } else if (inChanged && outChanged) {
    changePrice.value = 'A'
    console.log('입고단가와 출고단가 모두 변경됨:', form.inPrice, form.outPrice)
  }
  //console.log('changePrice:', changePrice.value)
}

const customerPop = () =>{
  dialog.value = true
}

const goList = () =>{
  router.push({name:'ItemList'})
}


</script>

<style scoped>

</style>
