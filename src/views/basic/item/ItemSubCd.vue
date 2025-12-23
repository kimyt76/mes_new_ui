<template>
<div :id="$attrs.id"></div>
  <v-breadcrumbs :items="['MES', '기본관리', '품목코드 신규(S)']"></v-breadcrumbs>
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
                label="제품유형(대)"
                :items="itemCategory1s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                readonly
              />
           </v-col>
           <v-col style="height: 60px;">
              <v-select
                v-model="form.itemCategory2"
                label="제품유형(중)"
                :items="itemCategory2s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                readonly
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

<v-dialog  v-model="dialog" max-width="800px" height="800px" persistent>
    <CustomerListPop
      @selected="handleSelect"
      @close-dialog="dialog = false"/>
  </v-dialog>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiItem } from '@/api/apiItem'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { formatComma, parseCommaInput, replaceString, typeCd } from '@/util/common'
import { omit } from 'lodash'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomerListPop from '../customer/CustomerPop.vue'


const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])

const {vError, vSuccess, vInfo, vWarning} = useAlertStore()
const { userId } = useAuthStore()
const route = useRoute()
const router = useRouter()


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
const dialog = ref(false)
const asItemCd = route.query.id

onMounted( async () => {
  const res = await ApiItem.getItemInfo(asItemCd);

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemTypeCds.value = itemTypeCds.value.filter(i => !['M1','M2', 'M4','M7', ].includes(i.code))

  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')
  itemCategory1s.value = await ApiItem.getProdLList()
  itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

  Object.assign(form, omit(res, ['itemTypeCd']))
})


watch(() => form.itemTypeCd, (newVal) => {
  form.itemCd = asItemCd+typeCd(newVal)
  form.itemName = replaceString(form.itemName, newVal)
})

const saveInfo = async () => {
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

const customerPop = () =>{
  dialog.value = true
}

const itemCdCheck = async () =>{
  const chk = await ApiItem.getItemCdCheck(form.itemCd)

  if ( chk === 'Y' ) {
    vWarning("중복된 품목코드입니다.")
  }else{
    vInfo("사용가능한 품목코드입니다.")
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
