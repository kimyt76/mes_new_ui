<template>
  <v-card>
    <v-card-item
      :title="props.title"
      />
      <v-card-text>
        <v-form ref="vform">
          <v-row  class="mt-3">
            <v-col cols="3">
              <v-text-field
                v-model="form.storageCd"
                label="창고코드"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="form.storageName"
                label="창고명"
                variant="underlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <div class="d-flex align-center gap-4">
                <div class="font-weight-medium text-grey-darken-1">구분 &nbsp;&nbsp;&nbsp;</div>
                <v-radio-group
                  v-model="form.storageType"
                  inline
                  class="d-flex"
                  >
                    <v-radio
                      v-for="(item, index) in storageTypes"
                      :key="index"
                      :label="item.codeNm"
                      :value="item.code"
                      class="me-4"
                    />
                </v-radio-group>
                </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="form.prodProcessCd"
                label="생산공정"
                :items="prodProcessCds"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                :disabled="isDisabed1"
                />
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <v-text-field
                v-model="form.outCustomerName"
                label="외주거래처명"
                variant="underlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                @click:append-inner="customerPop"
                :disabled="isDisabed2"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col >
              <v-card-actions>
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
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>


      <v-dialog  v-model="dialog" max-width="800px" height="700px" persistent>
        <CustomerListPop
          @selected="handleSelect"
          @close-dialog="dialog = false"/>
      </v-dialog>
 </v-card>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { onMounted, reactive, ref, watch } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';

const { vError, vInfo } = useAlertStore()
const { userId } = useAuthStore()

const isDisabed1 = ref(true)
const isDisabed2 = ref(true)
const dialog = ref(false)
const props = defineProps({
  title: {
    type: String,
  },
  id: {
    type: String,
  },
  mode: {
    type: String,
  },
})

const emit = defineEmits('saved', 'close-dialog')

const storageTypes = ref([])
const prodProcessCds = ref([])

const form = reactive({
  storageCd: '',
  storageName : '',
  prodProcessCd: '',
  outCustomerName: '',
  outCustomerCd: '',

  userId: userId,
})

watch(() => form.storageType, (newVal) => {
  if (  newVal === 'S'  ){
    isDisabed1.value = true
    isDisabed2.value = true
  }else if ( newVal === 'F' ) {
    isDisabed1.value = false
    isDisabed2.value = true
  }else if ( newVal === 'O' ) {
    vInfo("공장(외주비관리)는 외주비 증빙 수령 시 사용합니다. \n 생산입고에서 외주비 관리를 하지 않을 경우 공장을 선택해 등록하시기 바랍니다.")

    isDisabed1.value = false
    isDisabed2.value = false
  }
})

const handleSelect = (cd, nm) =>{
  form.outCustomerCd = cd
  form.outCustomerName = nm
}

const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

    const msg = await ApiBase.saveStorageInfo(params)

    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err)
  }
}

const customerPop = () =>{
  dialog.value = true
}

onMounted( async () =>{
  storageTypes.value = await ApiCommon.getCodeList('storage_type')
  prodProcessCds.value = await ApiCommon.getCodeList('prod_process')

  if ( props.mode === 'U') {
    const res = await ApiBase.getStorageInfo(props.id)

    Object.assign(form, res)
  }
})



</script>

<style scoped>
@import '@/assets/css/main.css';
.v-card-item  {
  height: 45px;
  background-color:#BCAAA4
}
</style>
