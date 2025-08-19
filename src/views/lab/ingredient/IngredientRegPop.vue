<template>
  <v-card>
    <v-card-item
      :title="props.title"
      ></v-card-item>
    <v-card-text>
      <v-form ref="vform">
        <v-row>
          <v-col class="mt-3">
            - 성분코드 : {{ props.id }}
          </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="mt-2 ml-3" style="padding: 0px;">
            <v-text-field
              v-model="form.krIngredientName"
              density="compact"
              label="국문 성분명"
              placeholder="국문성분명을 입력해주세요"
              variant="underlined"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-text-field
              v-model="form.enIngredientName"
              density="compact"
              label="영문 성분명"
              placeholder="영문성분명을 입력해주세요"
              variant="underlined"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-text-field
              v-model="form.cnIngredientName"
              label="중문 성분명"
              placeholder="중문성분명을 입력해주세요"
              variant="underlined"
              density="compact"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-text-field
              v-model="form.casNo"
              label="CAS No."
              placeholder="CAS No를 입력해주세요"
              variant="underlined"
              density="compact"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-select
                v-model="form.functionCd"
                label="function"
                :items="items"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-text-field
              v-model="form.etc"
              label="비고"
              placeholder="비고를 입력해주세요"
              variant="underlined"
              density="compact"
              />
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-card-text><div>한도 국가</div></v-card-text>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="country in countries"
                  :key="country.code"
                  :label="country.codeNm"
                  :value="country.code"
                  class="ml-1"
                  density="compact"
                  v-model="limitCountry"
                />
              </div>
            </v-col>
        </v-row>
        <v-row class="mr-1">
            <v-col class="ml-3" style="padding: 0px;">
            <v-card-text><div>금지 국가</div></v-card-text>
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-for="country in countries"
                  :key="country.code"
                  :label="country.codeNm"
                  :value="country.code"
                  class="ml-1"
                  density="compact"
                  v-model="banCountry"
                />
              </div>
            </v-col>
        </v-row>
      </v-form>
    </v-card-text>

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
  </v-card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiLab } from '@/api/apiLab'
import { onMounted, reactive, ref } from 'vue'
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';

const { userId } = useAuthStore()
const { vError } = useAlertStore()
const items = ref([])
const countries = ref([])

const limitCountry = ref([])
const banCountry = ref([])

const form = reactive ({
  krIngredientName: '',
  enIngredientName: '',
  cnIngredientName: '',
  casNo: '',
  functionCd: '',
  etc: '',
})

const props = defineProps({
  title: {
    type: String,
  },
  id: {
    type:String,
  },
  mode: {
    type: String,
  },
})

const emit = defineEmits(['saved', 'close-dialog'])

const saveInfo = async ()=> {

  const params = {
    ...form,
    limitCountries : limitCountry.value,
    bannedCountries: banCountry.value,
    userId: userId,
  }

  try{
    const msg = await ApiLab.saveIngredientInfo(params)

    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err.message)
  }
}

onMounted(async () => {
 items.value =  await ApiCommon.getCodeList('fn_Cd')
 countries.value =  await ApiCommon.getCodeList('country_cd')

 if ( props.mode === 'U') {
  const result = await ApiLab.getIngredientInfo(props.id)
  Object.assign(form, result)

  limitCountry.value = result.limitCountries
  banCountry.value = result.bannedCountries
 }

})

</script>

<style scoped>
.v-card-item  {
  background-color:#BCAAA4;
  height: 40px;
}

</style>
