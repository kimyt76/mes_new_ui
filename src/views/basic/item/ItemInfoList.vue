<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '품목상세목록']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhItemList">
        <v-col class="d-flex ga-4">
          <v-select
            v-model="form.itemTypeCd"
            label="품목구분"
            density="compact"
            :items="itemTypeCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            style="width: 120px;"
          />
          <v-text-field
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 180px;"
            />
          <v-text-field
            v-model="form.customerName"
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 180px;"
            />
          <v-select
            v-model="form.useYn"
            label="사용여부"
            density="compact"
            :items="useYns"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            style="width: 90px;"
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
        :headers="headers"
        :items="itemList"
        :loading="loading"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        style="height: 730px"
        return-object
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
            @click="selectRowClick(item.itemCd, item.itemTypeCd)"
          >
            {{ item.itemName }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

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

const { vError, vSuccess, vInfo } = useAlertStore()
const { userId } = useAuthStore()

const currentComponent = shallowRef(null)
const dialog = ref(false)
const srhForm = ref(null)
const loading = ref(false)
const id = ref('')
const itemTypeCds = ref([])
const itemList = ref([])
const useYns = ref([])

const form = reactive({
  itemTypeCd : '',
  itemName: null,
  itemCd: null,
  customerName: null,
  useYn : '',

  userId: userId,
})

const headers = ref([
    { title: '품목구분',    key: 'itemTypeName',  align: 'center', width: '80px' },
    { title: '품목코드',    key: 'itemCd',        align: 'center', width: '120px'},
    { title: '품목명',      key: 'itemName',      align: 'start' , width: '250px'},
    { title: '단위',        key: 'unit',          align: 'center', width: '60px' },
    { title: '규격',        key: 'spec',           align: 'center', width: '80px'},
    { title: '구매처',      key: 'customerName',    align: 'start', width: '200px'},
    { title: '영업담당자',  key: 'chargeSalesman',  align: 'center', width: '90px'},
    { title: '담당연구원',  key: 'chargeResearcher',  align: 'center', width: '90px'},
    { title: '품목분류(대)',  key: 'prodLgType',    align: 'center' , width: '100px'},
    { title: '품목분류(중)',  key: 'prodMlType',    align: 'center' , width: '100px'},
])

/**
 * 팝업창 호출
 */
const selectRowClick = (cd, type) => {
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
    default :
      vInfo("품목구분이 없는 품목정보입니다.")
      return false
  }

  dialog.value = true
}

/**
 *  품목 조회
 */
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
 * 초기화
 */
onMounted( async() => {
  itemTypeCds.value =  await ApiCommon.getCodeList('ITEM_TYPE_CD')
  useYns.value = await ApiCommon.getCodeList('use_yn')

  srhItemList()
})

const handleSaved = (msg) =>{
  vSuccess(msg)
  srhItemList()
}

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
