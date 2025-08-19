<template>
<v-card class="pa-3">
  <v-card-item title="품목코드 조회"></v-card-item>
  <v-row>
    <v-col style="height: 20px; padding: 3px;">
      <v-form ref="srhForm" @submit.prevent="srhItemList">
      <div class="d-flex ga-4 ml-4">
        <v-select
          v-model="form.itemTypeCd"
          label="품목구분"
          :items="itemTypeCds"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          />
        <v-text-field
          v-model="form.itemNm"
          density="compact"
          label="품목명"
          placeholder="품목명을 입력해주세요"
          variant="underlined"
          />
        <v-text-field
          v-model="form.itemCd"
          density="compact"
          label="품목코드"
          placeholder="품목코드를 입력해주세요"
          variant="underlined"
          />
        <v-btn
          color = "#EFEBE9"
          text="조회"
          class="mt-3"
          type="submit"
          />
        <v-btn
          class="mt-3 mr-3"
          text="초기화"
          @click="srhForm.reset()"
          />
      </div>
      </v-form>
    </v-col>
  </v-row>
  <v-row>
    <v-col
      style="height: 500px;"
      >
      <v-radio-group v-model="selectedItem" color="primary">
      <v-data-table
        :headers="headers"
        :items="itemList"
        :loading="loading"
        select-strategy="single"
        show-select
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        :items-per-page="15"
        v-model:selected="itemSelected"
        style="height: 550px;"
        >
        <template v-slot:headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            style="background-color: #BCAAA4; height: 40px;"
          >
            {{ column.title }}
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
      <tr
        @click="selectRow(item)"
        :class="{ 'selected-row': itemSelected[0] === item }"
        style="cursor: pointer;"
        >
        <td>
          <v-radio :value="item" />
        </td>
        <td>{{ item.itemTypeNm }}</td>
        <td>{{ item.itemCd }}</td>
        <td>{{ item.itemName }}</td>
        <td>{{ item.spec }}</td>
        <td>{{ item.customerNm }}</td>
      </tr>
    </template>
    </v-data-table>
    </v-radio-group>
    </v-col>
  </v-row>
  <v-row class="mt-10" style="height: 70px;">
    <v-col>
      <div class="d-flex ga-4 justify-end">
        <v-btn
          dense
          text="선택"
          color = "brown-lighten-4"
          />
        <v-btn
          text="닫기"
          variant="tonal"
          @click="emit('close-dialog')"
          />
      </div>
    </v-col>
  </v-row>
</v-card>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { reactive, ref, onMounted } from 'vue';

const selectedItem = ref(null)
const { vError } = useAlertStore()
const loading = ref(false)
const form = reactive ({
  itemTypeCd: '',
  itemCd: '',
  itemNm: '',
})
const emit = defineEmits(['selected', 'close-dialog'])
const headers = [
  { title: '품목구분',  key: 'itemTypeNm',  align: 'center', style: 'width: 50px;' },
  { title: '품목번호',  key: 'itemCd',      align: 'center', style: 'width: 100px'  },
  { title: '품목명',    key: 'itemName',      align: 'center', style: 'width: 200px;align:center;' },
  { title: '규격',      key: 'spec',        align: 'center', style: 'width: 80px'},
  { title: '거래처',    key: 'customerNm', align: 'center', style: 'width: 100px'},
]

const itemList = ref([])
const srhItemList = async () =>{
  loading.value = true

  try{
    const params = {
      ...form,
    }
    itemList.value = await ApiItem.getItemList(params)
  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

/**
 * 품목타입 select
 */
const itemTypeCds = ref([])
onMounted(async () => {
    itemTypeCds.value =  await ApiCommon.getCodeList('item_Type_Cd')
})

/**
 *  리스트 선택
 */
const itemSelected = () => {

}

const selectRow = (item) => {
  itemSelected.value = [item]
  emit('selected', item.itemCd, item.itemName )
  emit('close-dialog')
}

/**
 * 조회조건 초기화
 */
const srhForm = ref('')
const reset = () => {
  srhForm.value.reset()
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
