<template>
  <v-card>
    <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>폼목정보관리(제품)</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
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
            <v-col cols="3" style="height: 60px;">
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
            <v-col cols="3">
              <v-select
                v-model="form.itemCategory1"
                label="제품유형(대분류)"
                :items="itemCategory1s"
                item-title="codeNm"
                item-value="code"
                variant="underlined"
                density="compact"
                readonly
                />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="form.itemCategory2"
                label="제품유형(중분류)"
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

const emit = defineEmits(['saved', 'close-dialog'])
const { userId} = useAuthStore()
const props = defineProps({
  id: {
    type: String,
  },
})

const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])

const form = reactive({
  itemTypeCd : '',
  itemCd: '',
  itemName: '',
  itemCategory1: '',
  itemCategory2: '',

  userId: userId
})


onMounted( async () =>{
    const res = await ApiItem.getItemInfo(props.id)

    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

    Object.assign(form, res)
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
