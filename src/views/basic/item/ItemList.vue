<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '품목관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-row>
      <v-form ref="srhForm" @submit.prevent ='searchList'>
      <v-col class="d-flex flex-row ga-3 ml-2 mr-2">
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
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 150px;"
            />
          <v-text-field
            v-model="form.managerName"
            label="담당자명"
            placeholder="담당자을 입력해주세요"
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
          <v-btn
            text="조회"
            variant="tonal"
            type="submit"
            />
          <v-btn
            text="초기화"
            @click="srhForm.reset()"
            />
          </v-col>
        </v-form>
    </v-row>
  </v-card>
  <v-spacer></v-spacer>
  <v-row style="height: 70px;">
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 8px; margin-top: 8px;">
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
    <v-col>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="itemList"
        :items-per-page="20"
        :loading="loading"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        item-value="itemCd"
        fixed-header
        height="620px"
        select-strategy="single"
        show-select
        density="compact"
        return-object
        class="my-table"
        >

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
  useYn : 'Y',

  userId: userId,
})

const headers = ref([
  { title: '품목코드',  key: 'itemCd',        align: 'center', width: '100px' },
  { title: '품목명',    key: 'itemName',      align: 'start',   width: '250px' },
  { title: '단위',      key: 'unit',          align: 'center', width: '70px' },
  { title: '규격',      key: 'spec',          align: 'center', width: '100px' },
  { title: '구매처',    key: 'customerName',  align: 'left',   width: '200px' },
  { title: '입고단가',  key: 'inPrice',       align: 'end',   width: '100px' },
  { title: '출고단가',  key: 'outPrice',      align: 'end',   width: '100px' },
  { title: '제품유형',  key: 'itemGrp2Name',  align: 'center', width: '110px' },
  { title: '사용',      key: 'useYn',        align: 'center', width: '70px' },
])

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

const selectRowClick = (item, index) => {
  router.push({name: 'ItemDetail',params: { id: item.itemCd }  })
}

// const itemProps = (item) => {
//   return {
//     class: 'my-checkbox-cell',
//     style: {
//       width: '30px',
//     },
//   }
// }

onMounted( async() => {
  itemTypeCds.value = await ApiCommon.getCodeList('item_Type_Cd')
  useYns.value = await ApiCommon.getCodeList('use_yn')

  searchList()
})

/**
 * 엑셀 다운로드
 */
const excel = async () => {
  exportToExcel(headers, itemList.value, '품목정보_목록')
}


</script>

<style scoped>
@import '@/assets/css/main.css';
.my-table :deep(th) {
  background-color: #BCAAA4 !important; /* Vuetify blue-darken-2 */
  color: white !important;
  font-weight: bold;
}
</style>
