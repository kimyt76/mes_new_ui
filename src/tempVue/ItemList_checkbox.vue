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
            text="조회"
            variant="tonal"
            type="submit"
            />
          <v-btn
            text="초기화"
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
          class="excel-btn"
          prepend-icon="mdi-microsoft-excel"
          @click="excel"
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
        fixed-header
        height="650"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        :items-per-page="15"
        density="compact"
        show-select
        class="my-data-table"
        return-object
      >
      <template #item.itemCd="{ item }">
        <span class="cell fixed" style="cursor: pointer;"> {{ item.itemCd }} </span>
      </template>
      <template #item.itemName="{ item }">
        <span class="cell wrap" style="text-decoration: underline;"> {{ item.itemName }} </span>
      </template>
      <template #item.itemTypeName="{ item }">
        <span class="cell fixed"> {{ item.itemTypeName }} </span>
      </template>
      <template #item.unit="{ item }">
        <span class="cell fixed"> {{ item.unit }} </span>
      </template>
      <template #item.spec="{ item }">
        <span class="cell fixed"> {{ item.spec }} </span>
      </template>
      <template #item.customerName="{ item }">
        <span class="cell wrap"> {{ item.customerName }} </span>
      </template>
      <template #item.inPrice="{ item }">
        <span class="cell fixed text-end"> {{ formatComma(item.inPrice) }}</span>
      </template>
      <template #item.outPrice="{ item }">
        <span class="cell fixed text-end"> {{ formatComma(item.outPrice) }} </span>
      </template>
      <template #item.useYn="{ item }">
        <span class="cell fixed text-center"> {{ item.useYn === 'Y' ? '사용' : '미사용' }} </span>
      </template>
    </v-data-table>

    </v-col>
  </v-row>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref, watch } from 'vue';
import { isEmpty, formatComma } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useRouter } from 'vue-router';
/*=======================초기화=========================================*/
const router = useRouter()
const { userId } = useAuthStore()
const itemTypeCds = ref([])
const itemList = ref([])
const useYns = ref([])
const loading = ref(false)
const selectedItem = ref(null)

const form = reactive({
  itemName: '',
  itemTypeCd: '',
  itemCd: '',
  customerName: '',
  customerCd:'',
  useYn:'',

  userId: userId,
})

const headers = [
  { title: '', key: 'radio', sortable: false, width: '30px', align: 'center' },
  { title: '품목코드', key: 'itemCd', width: '110px', align: 'center' },
  { title: '품명명', key: 'itemName', width: '250px', align: 'start' },
  { title: '품목구분', key: 'itemTypeName', width: '80px', align: 'center' },
  { title: '단위', key: 'unit', width: '50px', align: 'center' },
  { title: '규격', key: 'spec', width: '90px', align: 'center' },
  { title: '거래처', key: 'customerName', width: '160px', align: 'start' },
  { title: '입고가', key: 'inPrice', width: '100px', align: 'end' },
  { title: '출고가', key: 'outPrice', width: '100px', align: 'end' },
  { title: '사용여부', key: 'useYn', width: '50px', align: 'center' },
]

onMounted( async() => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')

  srhItemList()
})
/*=======================methoed=========================================*/
//완제품, 반제품, 벌크 , 부자재, 소모품
const asItemCd = ref('')
const asItemTypeCd = ref('')

const goItemNew = () => {
  if ( isEmpty(asItemCd.value) ){
    router.push({name: 'ItemNewCd' })
  }else if ( asItemTypeCd.value === 'M4' ) {
    router.push({ name: 'ItemSubCd', query: { id: asItemCd.value, type:asItemTypeCd.value } })
  }else if ( ['M0', 'M3', 'M5','M6'].includes(asItemTypeCd.value)  ) {
    router.push({ name: 'ItemThird', query: { id: asItemCd.value, type:asItemTypeCd.value } })
  }
}


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

watch(() => form.itemTypeCd, (newVal) => {
  srhItemList()
})

watch(selectedItem, (newVal) => {
  console.log('newVal:', newVal)
  if (newVal) {
    const selected = itemList.value.find(item => item.itemCd === newVal)
    console.log('Selected Item:', selected)
    console.log('selectedItem :', selectedItem.value)
    console.log('selectedRow :', selected.itemTypeCd)
    asItemCd.value = selectedItem.value
    asItemTypeCd.value = selected.itemTypeCd
  }
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, itemList.value, '폼목정보_목록')
}


</script>

<style scoped>
@import '@/assets/css/main.css';
.my-data-table td,
.my-data-table th {
  max-width: 100px;        /* 제한 너비 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #BCAAA4;
}

::v-deep(.my-data-table thead th) {
  height: 32px !important;
  background-color: #BCAAA4 !important;
}

::v-deep(.my-data-table tr) {
  height: 32px !important;
}

.cell.fixed {
  display: block;
  width: 100%;           /* 부모 칼럼 너비에 맞춤 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cell.wrap {
  display: block;
  width: 250px; /* 원하는 고정 너비 */
  white-space: normal;   /* <-- 줄바꿈 허용 */
  word-break: break-word; /* 단어도 줄바꿈 가능하게 */
}

::v-deep(.my-data-table th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* ::v-deep(.my-data-table td) {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  padding: 4px 8px !important;
} */

/*
::v-deep(.my-data-table th),
::v-deep(.my-data-table td) {
  white-space: normal;
  overflow-wrap: break-word;
  padding: 4px 8px;
}

::v-deep(.my-data-table th[data-key="radio"]),
::v-deep(.my-data-table td[data-key="radio"]) {
  width: 10px !important;
  text-align: center;
}

::v-deep(.my-data-table th[data-key="itemCd"]),
::v-deep(.my-data-table td[data-key="itemCd"]) {
  width: 110px !important;
  text-align: center;
}

::v-deep(.my-data-table th[data-key="itemName"]),
::v-deep(.my-data-table td[data-key="itemName"]) {
  width: 250px !important;
  text-align: left;
}

::v-deep(.my-data-table th[data-key="itemTypeName"]),
::v-deep(.my-data-table td[data-key="itemTypeName"]) {
  width: 80px !important;
  text-align: center;
}

::v-deep(.my-data-table th[data-key="unit"]),
::v-deep(.my-data-table td[data-key="unit"]) {
  width: 50px !important;
  text-align: center;
}

::v-deep(.my-data-table th[data-key="spec"]),
::v-deep(.my-data-table td[data-key="spec"]) {
  width: 90px !important;
  text-align: center;
}

::v-deep(.my-data-table th[data-key="customerName"]),
::v-deep(.my-data-table td[data-key="customerName"]) {
  width: 160px !important;
  text-align: left;
}

::v-deep(.my-data-table th[data-key="inPrice"]),
::v-deep(.my-data-table td[data-key="inPrice"]) {
  width: 100px !important;
  text-align: right;
}

::v-deep(.my-data-table th[data-key="outPrice"]),
::v-deep(.my-data-table td[data-key="outPrice"]) {
  width: 100px !important;
  text-align: right;
}

::v-deep(.my-data-table th[data-key="useYn"]),
::v-deep(.my-data-table td[data-key="useYn"]) {
  width: 50px !important;
  text-align: center;
} */
</style>
