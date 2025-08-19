<template>
  <v-card>
    <v-card-item
      :title="props.title"
      style="height: 30px;"
      />
      <v-row
        class="mt-3">
        <v-col
          cols="12"
          md="4"
          sm="6"
          class="ml-4"
          >
          <v-text-field
            v-model="form.comTypeCd"
            density="compact"
            label="공통타입"
            placeholder="공통타입을 입력해주세요"
            variant="underlined"
            />
        </v-col>
        <v-col
            cols="4"
            md="4"
            sm="6"
            >
            <v-text-field
              v-model="form.comTypeNm"
              density="compact"
              label="공통타입명"
              placeholder="공통타입 이름 입력해주세요"
              variant="underlined"
              />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          md="4"
          sm="6"
          class="ml-4"
          >
          <v-text-field
            v-model="form.code"
            density="compact"
            label="코드"
            placeholder="코드를 입력해주세요"
            variant="underlined"
            />
        </v-col>
        <v-col
            cols="6"
            md="4"
            sm="6"
            >
            <v-text-field
              v-model="form.codeNm"
              density="compact"
              label="코드명"
              placeholder="코드명을 입력해주세요"
              variant="underlined"
              />
            </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          md="4"
          sm="6"
          class="ml-4"
          >
          <v-text-field
              v-model="form.dispOrder"
              density="compact"
              label="순서"
              type="number"
              placeholder="순서를 입력해주세요"
              variant="underlined"
              />
        </v-col>
        <v-col
            cols="12"
            md="4"
            sm="6"
            >
            <v-select
              v-model="form.useYn"
              :items="items"
              item-title="text"
              item-value="value"
              density="compact"
              label="사용유무"
              placeholder="사용유무를 선택해주세요"
              variant="underlined"
              >
              ></v-select>
            </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          md="4"
          sm="6"
          class="ml-4"
          >
          <v-text-field
              v-model="form.discription"
              density="compact"
              label="비고"
              placeholder="비고를 입력해주세요"
              variant="underlined"
              />
        </v-col>
      </v-row>
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
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive } from 'vue';

const {userId} = useAuthStore()

const { vError } = useAlertStore()
const emit = defineEmits(['saved', 'close-dialog'])

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

const form = reactive({
  comTypeCd: '',
  comTypeNm: '',
  code: '',
  codeNm: '',
  dispOrder: '',
  useYn : '',
  discription: '',

  userId : userId,
})

/**
 *  재직 유무 초기화
 */
const items = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

onMounted( async () => {
  if ( props.mode === 'U'){
    const res =  await ApiCommon.getCommonInfo(props.id)
    Object.assign(form, res)
  }
})

const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

    const msg = await ApiCommon.saveCommonInfo(params)
    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err.message)
  }
}

</script>

<style scoped>
.v-card-item {
  background-color:#BCAAA4;

}
</style>
