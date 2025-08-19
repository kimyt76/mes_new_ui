<template>
  <v-breadcrumbs
    :items="['MES', '기본관리', '품목관리']"
    class="custom-breadcrumbs"
    >
  </v-breadcrumbs>
  <v-card class="pa-1" style="height: 60px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhItemList'>
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
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
          <v-text-field
            v-model="form.customerName"
            density="compact"
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            />
          <v-select
            v-model="form.useYn"
            label="사용여부"
            :items="items"
            item-title="text"
            item-value="value"
            variant="underlined"
            density="compact"
            />
            <v-btn

            color = "#EFEBE9"
            type="submit"
            >조회</v-btn>
          <v-btn
            class="mr-2"
            @click="reset"
            >초기화</v-btn>
          </div>
        </v-form>
        </v-col>
    </v-row>
  </v-card>
  <v-row class="mb-1">
    <v-col>
      <div class="d-flex ga-4 justify-end">
    <v-btn
        color = "brown-lighten-4"
        class="mt-3"
        text="신규"
        @click="goItemNew()"
        />
      <v-btn
        class="mt-3 mr-3 excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
     </div>
  </v-col>
</v-row>
<v-data-table
  :headers="headers"
  :items="itemList"
  :loading="loading"
  no-data-text="데이터가 없습니다."
  loading-text="조회중입니다 잠시만 기다려주세요"
  :items-per-page="25"
  show-select
  style="height: 700px"
  >

  <template v-slot:headers="{ columns }">
    <tr>
      <th
        v-for="column in columns"
        :key="column.key"
        class="custom-header"
        style="height: 30px;"
        :style="{textAlign: 'center'} "
        >
        {{ column.title }}
      </th>
    </tr>
  </template>
  <!-- 리스트 영역 커스터마이징 -->
  <template #item="{ item }">
    <tr style="height: 30px;">
      <td style="width: 40px; height: 30px;">
        <v-checkbox
          style="width: 30px; height: 50px; vertical-align: middle;"
          :model-value="selected === item.itemCd"
          @update:model-value="(checked) => toggleSelection(checked, item.itemCd, item.itemTypeCd)"
          />
      </td>
      <td style="width: 90px; height: 30px; text-align: center; cursor: pointer;" @click="goDetail(item.itemCd)">{{ item.itemCd }}</td>
      <td style="width: 300px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="goDetail(item.itemCd)">{{item.itemName}}</td>
      <td style="width: 90px; height: 30px; text-align: center;">{{item.itemTypeName}}</td>
      <td style="width: 100px; height: 30px; text-align: center;">{{item.unit}}</td>
      <td style="width: 100px; height: 30px; text-align: center;">{{item.spec}}</td>
      <td style="width: 200px; height: 30px; text-align: left;">{{item.customerName}}</td>
      <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.inPrice) }}</td>
      <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.outPrice) }}</td>
      <td style="width: 150px; height: 30px; text-align: center;">{{item.itemGrp2Name}}</td>
    </tr>
  </template>

</v-data-table>


</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { exportToExcel } from '@/util/exportToExcel';
import { isEmpty, formatComma } from '@/util/common';

const { vError } = useAlertStore()
const { userId } = useAuthStore()

const srhForm = ref(null)
const itemList = ref([])
const loading = ref(false)
const itemTypeCds = ref([])

const form = reactive({
  itemTypeCd : '',
  itemNm: null,
  itemCd: null,
  customerName: null,
  useYn : 'Y',
  userId: userId,
})

const selected = ref([])
const asItemCd = ref('')
const asItemTypeCd = ref('')

// 체크 상태 토글 함수
const toggleSelection = (checked, id, type) => {
  if (checked) {
    selected.value = id
    asItemCd.value = id
    asItemTypeCd.value = type
  } else {
    // 같은 항목이면 해제, 아니면 유지
    if (selected.value === id) {
      selected.value = null
      asItemCd.value = ''
      asItemTypeCd.value = ''
    }
  }
}

/**
 *  사용 유무 초기화
 */
const items = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

/**
 *  테이블 헤더
 */
 const headers = ref([
    { title: '품목코드',  key: 'itemCd',      align: 'center' },
    { title: '품목명',    key: 'itemName',    align: 'center' },
    { title: '품목구분',  key: 'itemTypeCd',  align: 'center' },
    { title: '단위',      key: 'unit',        align: 'center' },
    { title: '규격',      key: 'spec',        align: 'center'},
    { title: '구매처',    key: 'customerName',  align: 'center'},
    { title: '입고단가',  key: 'inPrice',     align: 'center' },
    { title: '출고단가',  key: 'outPrice',    align: 'center' },
    { title: '제품유형',  key: 'itemGrp2Name',    align: 'center' },
])

const router = useRouter()

//완제품, 반제품, 벌크 , 부자재, 소모품
const goItemNew = () => {
  if ( isEmpty(asItemCd.value) ){
    router.push({name: 'ItemNewCd' })
  }else if ( asItemTypeCd.value === 'M4' ) {
    router.push({ name: 'ItemSubCd', query: { id: asItemCd.value, type:asItemTypeCd.value } })
  }else if ( ['M0', 'M3', 'M5','M6'].includes(asItemTypeCd.value)  ) {
    router.push({ name: 'ItemThird', query: { id: asItemCd.value, type:asItemTypeCd.value } })
  }
}

const goDetail = (id) => {
  //상세
  router.push({name: 'ItemDetail',params: { id: id }  })
}

/**
 *  검색창 초기화
 */
 const reset = () =>{
  srhForm.value.reset()
}

onMounted(async () => {
  itemTypeCds.value =  await ApiCommon.getCodeList('ITEM_TYPE_CD')
  srhItemList()
})

const srhItemList = async () =>{
  loading.value = true
  try{
    const params = {
      ...form
    }

    itemList.value = await ApiItem.getItemList(params)

  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, itemList.value, '폼목정보_목록')
}

</script>

<style scoped>
@import '@/assets/css/main.css';


</style>
