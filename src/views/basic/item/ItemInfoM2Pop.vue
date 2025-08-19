<template>
<v-card>
    <v-card-item
      title="폼목정보관리(부자재)"
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
                v-model="form.packingSpecValue"
                label="단위별포장규격(값)"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.packingSpecUnit"
                label="단위별포장규격(단위)"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.relatedCustomer"
                label="관련고객사"
                variant="underlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                @click:append-inner="customerPop"
              />
            </v-col>
          </v-row>
          <v-row>
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
            <v-col >
              <v-text-field
                v-model="form.unitWeight"
                label="단위중량"
                variant="underlined"
                density="compact"
                >
                <template #append-inner>
                  <span>ea/kg</span>
                </template>
              </v-text-field>
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

      <v-dialog  v-model="dialog" max-width="800px" height="700px" persistent>
          <CustomerListPop
            @selected="handleSelect"
            @close-dialog="dialog = false"/>
        </v-dialog>
  </v-card>
</template>

<script setup>
import { ApiItem } from '@/api/apiItem'
import { useAlertStore } from '@/stores/alert'
import { onMounted, reactive, ref } from 'vue'
import CustomerListPop from '../customer/CustomerListPop.vue';
import { ApiCommon } from '@/api/apiCommon';

const { userId } = useAlertStore()
const { vError } = useAlertStore()

const emit = defineEmits('saved','close-dialog')

const props = defineProps({
  id: {
    type: String,
  },
})

const dialog = ref(false)
const itemTypeCds = ref([])
const itemConditions = ref([])

const form = reactive({
  itemTypeCd: '',
  itemCd: '',
  itemName: '',
  matName: '',
  specInfo: '',
  exAppearance:'',
  packingSpecValue: '',
  packingSpecUnit: '',
  relatedCustomer: '',
  itemCondition: '',
  unitWeight: '',
  history: '',

  relatedCustomerCd: '',
  userId: userId
})

onMounted( async () =>{
  const res = await ApiItem.getItemInfo(props.id)

  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
  itemConditions.value = await ApiCommon.getCodeList('CONDITION_CD')

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
    vError(err.message)
  }
}

const customerPop = () => {
  dialog.value =true
}

const handleSelect = (cd, nm) =>{
  form.relatedCustomerCd = cd
  form.relatedCustomer = nm
}

</script>

<style scoped>
.v-card-item  {
  height: 45px;
  background-color:#BCAAA4
}
</style>
