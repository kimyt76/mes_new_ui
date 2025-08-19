<template>
  <v-breadcrumbs
    :items="['MES', '기본관리', '품목관리']"
    class="custom-breadcrumbs"
    />

  <v-card
    class="pa-1"
    variant="outlined"
    style="height: 70px;"
    >
    <v-form ref="srhForm" @submit.prevent ='srhItemList'>
    <v-row class="mt-2">
      <v-col
        class="ml-2 mr-2"
        >
        <div class="d-flex ga-5"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-select
            v-model="form.itemTypeCd"
            label="품목구분"
            :items="itemTypeCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            />
            <v-text-field
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-text-field
            v-model="form.itemCd"
            label="품목코드"
            placeholder="품목코드를 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-text-field
            v-model="form.customerName"
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            density="compact"
            />
          <v-select
            v-model="form.useYn"
            label="사용여부"
            :items="useYns"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            style="width: 40px;"
            />
          <v-btn
            text="저장"
            color = "#EFEBE9"
            type="submit"
            />
          <v-btn
            text="초기화"
            type="submit"
            @click="srhForm.reset()"
            />
        </div>
      </v-col>
    </v-row>
    </v-form>
  </v-card>
  <v-row>
    <v-col
      class="mt-2"
      >
      <div class="d-flex ga-4 justify-end">
        <v-btn
          text="신규"
          color = "brown-lighten-4"
          @click="goItemNew()"
          />
        <v-btn
          text="엑셀"
          prepend-icon="mdi-microsoft-excel"
          @click="goItemNew()"
          />
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="itemList"
        :loading="loading"
        :item-value="item => `${item.itemCd}`"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        :items-per-page="15"
        fixed-header
        show-select
        class="custom-header"

        >
      </v-data-table>

    </v-col>
  </v-row>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref, watch } from 'vue';

/*=======================초기화=========================================*/
const { userId } = useAuthStore()
const itemTypeCds = ref([])
const itemList = ref([])
const useYns = ref([])
const loading = ref(false)

const form = reactive({
  itemName: '',
  itemTypeCd: '',
  itemCd: '',
  customerName: '',
  customerCd:'',
  useYn:'',

  userId: userId,
})

const headers = ref([
    { title: '품목코드',  key: 'itemCd',        align: 'center', width: 150},
    { title: '품목명',    key: 'itemName',      align: 'left' },
    { title: '품목구분',  key: 'itemTypeName',  align: 'center' },
    { title: '단위',      key: 'unit',          align: 'center' },
    { title: '규격',      key: 'spec',          align: 'center'},
    { title: '구매처',    key: 'customerName',  align: 'left'},
    { title: '입고단가',  key: 'inPrice',       align: 'right' },
    { title: '출고단가',  key: 'outPrice',      align: 'right' },
    { title: '제품유형',  key: 'itemGrp2Name',  align: 'center' },
    { title: '사용여부',  key: 'useYn',         align: 'center' },
])

onMounted( async() => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')

  srhItemList()
})
/*=======================methoed=========================================*/

/**
 *  조회
 */
const srhItemList = async () => {
  loading.value = true

  const params = {
    ...form
  }

  itemList.value = await ApiItem.getItemList(params)
  loading.value = false
}

const goItemNew = () => {

}


watch(() => form.itemTypeCd, async (newVal) => {
  srhItemList()
})

</script>

<style scoped>
.custom-header thead:first-child  {
  background-color: #BCAAA4;
  height: 30px;
}
</style>
