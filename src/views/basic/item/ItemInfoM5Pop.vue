<template>
  <v-card>
    <v-card-item
      title="폼목정보관리(벌크제품)"
      />
      <v-card-text>
        <v-form ref="vform">
          <v-row class="mt-3">
            <v-col>
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
                  v-model="form.matName"
                  label="재료명"
                  variant="underlined"
                  density="compact"
                />
            </v-col>
            <v-col>
              <v-text-field
                  v-model="form.specInfo"
                  label="규격정보"
                  variant="underlined"
                  density="compact"
                />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.exAppearance"
                label="외관"
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
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.woodenPattern"
                label="목형종류"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.sheetSpec"
                label="시트규격(가로x세로)"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.packingSpecValue"
                label="단위별포장규격(값)"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col style="height: 60px;">
              <v-text-field
                v-model="form.packingSpecUnit"
                label="단위별포장규격(단위)"
                variant="underlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.coolingTemp"
                label="냉각온도기준"
                variant="underlined"
                density="compact"
              />
            </v-col>
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
                v-model="form.stdSize"
                label="기준사이즈"
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
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.theoryProdNumber1"
                label="이론생산계수1"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.theoryProdNumber2"
                label="이론생산계수2"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.displayYield"
                label="수율공식(표시용)"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.sheetStacking"
                label="적층 수"
                variant="underlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.workFlow"
                label="코팅 작업공정도"
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
import { onMounted, reactive, ref } from 'vue';

const { vError } = useAlertStore()

const emit = defineEmits('saved', 'close-dialog')
const { userId} = useAuthStore()
const props = defineProps({
  id: {
    type: String,
  },
})

const itemTypeCds = ref([])
const itemConditions = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])

onMounted( async () =>{
    const res = await ApiItem.getItemInfo(props.id)

    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

    Object.assign(form, res)
})

const form = reactive({
  itemTypeCd : '',
  itemCd: '',
  itemName: '',
  itemCategory1: '',
  itemCategory2: '',
  matName: '',
  specInfo: '',
  exAppearance: '',
  prodType:'',
  itemCondition: '',
  woodenPattern: '',
  sheetSpec:'',
  packingSpecValue: '',
  packingSpecUnit: '',
  coolingTemp: '',
  stdWeight: '',
  stdSize: '',
  stdYield: '',
  theoryProdNumber1:'',
  theoryProdNumber2:'',
  displayYield: '',
  sheetStacking: '',
  workFlow: '',
  history: '',

  userId: userId
})


const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

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
