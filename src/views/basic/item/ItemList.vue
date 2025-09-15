<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '품목관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
        <v-col class="d-flex ga-4">
          <v-select
            v-model="form.itemTypeCd"
            label="품목구분"
            density="compact"
            :items="itemTypeCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            style="width: 150px;"
          />
          <v-text-field
            v-model="form.itemCd"
            label="품목코드"
            placeholder="품목코드를 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 180px;"
            />
          <v-text-field
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-text-field
            v-model="form.customerName"
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-select
            v-model="form.useYn"
            label="사용여부"
            density="compact"
            :items="useYns"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            style="width: 150px;"
          />
          <v-btn
            text="조회"
            color="brown-lighten-4"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srhForm.reset()"
            />
        </v-col>
      </v-form>
    </v-row>
    </v-card-text>
  </v-card>
  <v-spacer></v-spacer>
  <v-row >
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
      <v-btn
        color="brown-lighten-4"
        text="신규"
        @click="goNew"
        />
      <v-btn
        class="excel-btn"
        text="엑셀"
        prepend-icon="mdi-microsoft-excel"
        @click="excel"
        />
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="itemList"
        :loading="loading"
        :items-per-page="15"
        density="compact"
        select-strategy="single"
        show-select
        fixed-header
        height="650px"
        return-object
        class="my-table"
        tableStyle="table-layout: fixed; width: 100%"
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header"
              >
              {{ column.title }}
            </th>
          </tr>
        </template>
        <template #item.itemName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.itemName }}
          </div>
        </template>
        <template #item.inPrice ="{ item }">
          {{ formatComma(item.inPrice) }}
        </template>
        <template #item.outPrice ="{ item }">
          {{ formatComma(item.outPrice)}}
        </template>
        <template #item.useYn ="{ item }">
          {{ item.useYn === 'Y' ? '사용' : '미사용' }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { ApiItem } from '@/api/apiItem';
import { ApiCommon } from '@/api/apiCommon';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { isEmpty, formatComma } from '@/util/common';

const { userId } = useAuthStore()
const router = useRouter()

const loading = ref(false)
const srhForm = ref(null)
const itemList = ref([])
const selected = ref(null)
const itemTypeCds = ref([])
const useYns = ref([])

const form = reactive({
  itemTypeCd : '',
  itemName: '',
  itemCd: '',
  customerName: '',
  useYn : '',

  userId: userId,
})

const headers = ref([
  { title: '품목',     key: 'itemTypeName',   align: 'start', width: '80px' },
  { title: '품목코드',  key: 'itemCd',        align: 'center', width: '100px' },
  { title: '품목명',    key: 'itemName',      align: 'start',   width: '250px' },
  { title: '단위',      key: 'unit',          align: 'center', width: '70px' },
  { title: '규격',      key: 'spec',          align: 'center', width: '100px' },
  { title: '구매처',    key: 'customerName',  align: 'left',   width: '200px' },
  { title: '입고단가',  key: 'inPrice',       align: 'end',   width: '100px' },
  { title: '출고단가',  key: 'outPrice',      align: 'end',   width: '100px' },
  { title: '제품유형',  key: 'itemGrp2Name',  align: 'center', width: '110px' },
  { title: '사용',      key: 'useYn',         align: 'center', width: '70px' },
])

/**
 * 신규 등록 화면으로 이동
 */
const goNew = () => {
  if ( isEmpty(selected.value) ){
    router.push({name: 'ItemNewCd' })
  }else{
    const asItemCd = selected.value[0].itemCd
    const type = selected.value[0].itemTypeCd

    if (type === 'M4') {
      router.push({ name: 'ItemSubCd', query: { id: asItemCd, type:type } })
    }else if ( ['M0', 'M3', 'M5','M6'].includes(type) ) {
      router.push({ name: 'ItemThird', query: { id: asItemCd, type:type } })
    }
  }
}

/**
 * 상세화면
 * @param item
 * @param index
 */
const selectRowClick = (item, index) => {
  router.push({name: 'ItemDetail',params: { id: item.itemCd }  })
}

/**
 *  품목 조회
 */
const searchList = async () => {
  try{
    loading.value = true
    const params = {
      ...form
    }

    itemList.value = await ApiItem.getItemList(params)
  }catch(err){

  }finally{
    loading.value = false
  }
}

/**
 * 초기화
 */
onMounted( async() => {
  itemTypeCds.value = await ApiCommon.getCodeList('item_Type_Cd')
  useYns.value = await ApiCommon.getCodeList('use_yn')

  searchList()
})


/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, itemList.value, '품목정보_목록')
}


</script>

<style scoped>
@import '@/assets/css/main.css';
.my-table .v-data-table__td--select {
  width: 30px !important;   /* 원하는 값으로 변경 */
  min-width: 30px !important;
  max-width: 30px !important;
  text-align: center;       /* 정렬도 변경 가능 */
  padding: 0;               /* 여백 줄이기 */
}
</style>
