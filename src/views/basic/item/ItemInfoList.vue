<template>
  <v-breadcrumbs
    :items="['MES', '기본관리', '품목상세목록']"
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
            v-model="form.itemName"
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
            text="조회"
            type="submit"
            />
          <v-btn
            class="mr-2"
            text="초기화"
            @click="reset"
            />
          </div>
        </v-form>
        </v-col>
    </v-row>
  </v-card>
  <v-row class="mb-1">
    <v-col>
      <div class="d-flex ga-4 justify-end">
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
      <td style="width: 70px; height: 30px; text-align: center; ">{{ item.itemCd }}</td>
      <td style="width: 300px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="goDetail(item.itemCd, item.itemTypeCd)">{{item.itemName}}</td>
      <td style="width: 70px; height: 30px; text-align: center;">{{item.itemTypeName}}</td>
      <td style="width: 90px; height: 30px; text-align: center;">{{item.unit}}</td>
      <td style="width: 90px; height: 30px; text-align: center;">{{item.spec}}</td>
      <td style="width: 180px; height: 30px; text-align: left;">{{item.customerName}}</td>
      <td style="width: 80px; height: 30px; text-align: center;">{{item.chargeSalesman}}</td>
      <td style="width: 80px; height: 30px; text-align: center;">{{ item.chargeResearcher }}</td>
      <td style="width: 150px; height: 30px; text-align: center;">{{ item.itemCategory1Name }}</td>
      <td style="width: 100px; height: 30px; text-align: center;">{{item.itemCategory2Name}}</td>
    </tr>
  </template>

</v-data-table>

<v-dialog  v-model="dialog" max-width="900px" max-height="800px" persistent>
      <component
        :is="currentComponent"
        :id="id"
        @saved="handleSaved"
        @close-dialog="dialog = false"
      />
</v-dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { reactive, ref, onMounted,shallowRef } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import ItemInfoM0Pop from './ItemInfoM0Pop.vue';
import ItemInfoM1Pop from './ItemInfoM1Pop.vue';
import ItemInfoM2Pop from './ItemInfoM2Pop.vue';
import ItemInfoM3Pop from './ItemInfoM3Pop.vue';
import ItemInfoM4Pop from './ItemInfoM4Pop.vue';
import ItemInfoM5Pop from './ItemInfoM5Pop.vue';
import ItemInfoM6Pop from './ItemInfoM6Pop.vue';
import ItemInfoM7Pop from './ItemInfoM7Pop.vue';

const { vError, vSuccess } = useAlertStore()
const { userId } = useAuthStore()

const currentComponent = shallowRef(null)
const dialog = ref(false)
const srhForm = ref(null)
const itemList = ref([])
const loading = ref(false)
const itemTypeCds = ref([])

const form = reactive({
  itemTypeCd : '',
  itemName: null,
  itemCd: null,
  customerName: null,
  useYn : 'Y',
  userId: userId,
})


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
    { title: '품목코드',    key: 'itemCd',      align: 'center' , sortable: true},
    { title: '품목명',      key: 'itemName',    align: 'center' },
    { title: '품목구분',    key: 'itemTypeCd',  align: 'center' },
    { title: '단위',        key: 'unit',        align: 'center' },
    { title: '규격',        key: 'spec',        align: 'center'},
    { title: '구매처',      key: 'customerName',        align: 'center'},
    { title: '영업담당자',  key: 'chargeSalesman',  align: 'center'},
    { title: '담당연구원',  key: 'chargeResearcher',     align: 'center' },
    { title: '품목분류(대)',  key: 'prodLgType',    align: 'center' },
    { title: '품목분류(중)',  key: 'prodMlType',    align: 'center' },
])

const id = ref('')
const goDetail = (cd, type) => {

  id.value = cd

  switch (type) {
    case 'M0':
      currentComponent.value = ItemInfoM0Pop
      break
    case 'M1':
      currentComponent.value = ItemInfoM1Pop
      break
    case 'M2':
      currentComponent.value = ItemInfoM2Pop
      break
    case 'M3':
      currentComponent.value = ItemInfoM3Pop
      break
    case 'M4':
      currentComponent.value = ItemInfoM4Pop
      break
    case 'M5':
      currentComponent.value = ItemInfoM5Pop
      break
    case 'M6':
      currentComponent.value = ItemInfoM6Pop
      break
    case 'M7':
      currentComponent.value = ItemInfoM7Pop
      break
  }
  dialog.value = true
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

const handleSaved = (msg) =>{
  vSuccess(msg)
  srhItemList()
}

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, itemList.value, '폼목정보_목록')
}

/**
 *  검색창 초기화
 */
 const reset = () =>{
  srhForm.value.reset()
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
