<template>
  <v-breadcrumbs :items="['MES', '기본관리', '창고관리']"></v-breadcrumbs>
  <v-card class="pa-3" style="height: 80px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhStorageList'>
          <div class="d-flex ga-3" > <!-- ga-4 는 Vuetify gap 클래스 -->
            <v-text-field
              v-model="form.storageName"
              density="compact"
              label="창고명"
              placeholder="창고명을 입력해주세요"
              variant="underlined"
              />
            <v-text-field
              v-model="form.outCustomerName"
              density="compact"
              label="외주거래처명"
              placeholder="외주거래처명을 입력해주세요"
              variant="underlined"
              />
            <v-select
              v-model="form.storageType"
              label="창고구분"
              :items="storageTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
            <v-select
              v-model="form.prodProcessCd"
              label="생산공정"
              :items="prodProcessCds"
              item-title="codeNm"
              item-value="code"
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
              @click="srhForm.reset()"
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
        color = "brown-lighten-4"
        class="mt-3"
        text="신규"
        @click="goDetail('N')"
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
  :items="storageList"
  :loading="loading"
  no-data-text="데이터가 없습니다."
  loading-text="조회중입니다 잠시만 기다려주세요"
  :items-per-page="25"
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
  <template #item="{ item }">
    <tr style="height: 30px;">
      <td style="width: 80px; height: 30px; text-align: center; text-decoration: underline;  cursor: pointer;" @click="goDetail(item.storageCd)">{{item.storageCd}}</td>
      <td style="width: 200px; height: 30px;text-align: left;  text-decoration: underline;  cursor: pointer;" @click="goDetail(item.storageCd)">{{item.storageName}}</td>
      <td style="width: 150px; height: 30px; text-align: center;">{{item.storageTypeName}}</td>
      <td style="width: 100px; height: 30px; text-align: center;">{{item.prodProcessName}}</td>
      <td style="width: 200px; height: 30px; text-align: center;">{{item.outCustomerName}}</td>
      <td style="width: 40px; height: 30px; text-align: center;">{{item.useYn ==='Y' ? '사용' : '미사용'}}</td>
      <td style="width: 100px; height: 30px; text-align: center;">{{item.companyName}}</td>
    </tr>
  </template>
 </v-data-table>

<v-dialog  v-model="dialog" height="450" width="700" persistent>
    <StorageRegPop
      :id="id"
      :mode="mode"
      :title="title"
      @saved="handleSaved"
      @close-dialog="dialog = false"
      />
</v-dialog>

</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import StorageRegPop from './StorageRegPop.vue';

const { vError } = useAlertStore()
const { userId } = useAuthStore()

const dialog = ref(false)
const loading = ref(false)
const srhForm = ref('')
const storageList = ref([])
const storageTypes = ref([])
const prodProcessCds = ref([])

const form = reactive({
  storageName:'',
  outCustomerName:'',
  storageType:'',
  prodProcessCd:'',

  userId: userId,
})

const headers = ref([
  { title: '창고코드',    key: 'storageCd',         align: 'center' },
  { title: '창고명',      key: 'storageName',       align: 'center' },
  { title: '구분',        key: 'storageTypeName',   align: 'center' },
  { title: '생산공정명',    key: 'prodProcessName',  align: 'center' },
  { title: '외주거래처명',  key: 'outCustomerName',  align: 'center' },
  { title: '사용',          key: 'useYn',           align: 'center' },
  { title: '추가사업장명',  key: 'companyName',      align: 'center' },
])

const mode = ref('N')
const title = ref('')
const id = ref('')


const goDetail = (val) =>{

  if (val === 'N') {
    title.value ="창고등록"
    id.value = ''
  }else{
    mode.value = 'U'
    title.value ="창고상세정보"
    id.value = val
  }

  dialog.value = true
}


onMounted( async () => {
  storageTypes.value = await ApiCommon.getCodeList('storage_type')
  prodProcessCds.value = await ApiCommon.getCodeList('prod_process')

  srhStorageList()
})

const srhStorageList = async () => {
  loading.value = true

  try {
    const params = {
      ...form
    }

    storageList.value = await ApiBase.getStorageList(params)

  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

const { vSuccess } = useAlertStore()

const handleSaved = (msg) =>{
  vSuccess(msg)
  srhStorageList()
}

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, storageList.value, '폼목정보_목록')
}

</script>

<style  scoped>
@import '@/assets/css/main.css';

</style>
