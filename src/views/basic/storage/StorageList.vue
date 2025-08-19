<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '창고관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhStorageList">
        <v-col class="d-flex ga-4">
          <v-text-field
              v-model="form.storageName"
              density="compact"
              label="창고명"
              placeholder="창고명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
            <v-text-field
              v-model="form.outCustomerName"
              density="compact"
              label="외주거래처명"
              placeholder="외주거래처명을 입력해주세요"
              variant="underlined"
              style="width: 150px;"
              />
            <v-select
              v-model="form.storageType"
              label="창고구분"
              :items="storageTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              style="width: 150px;"
              />
            <v-select
              v-model="form.prodProcessCd"
              label="생산공정"
              :items="prodProcessCds"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              style="width: 150px;"
              />
            <v-btn
              color="#EFEBE9"
              type="submit"
              text="조회"
              />
            <v-btn
              class="mr-2"
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
        @click="goDetail"
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
        :headers="headers"
        :items="storageList"
        :loading="loading"
        :items-per-page="15"
        density="compact"
        fixed-header
        height="650px"
        return-object
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header pa-1"
              >
              {{ column.title }}
            </th>
          </tr>
        </template>
        <template #item.storageName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="goDetail(item, index)"
          >
            {{ item.storageName }}
          </div>
        </template>
        <template #item.useYn ="{ item }">
          {{ item.useYn === 'Y' ? '사용' : '미사용' }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>

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
const mode = ref('N')
const title = ref('')
const id = ref('')

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
  { title: '창고코드',    key: 'storageCd',         align: 'center' , width: '60px' },
  { title: '창고명',      key: 'storageName',       align: 'start' , width: '250px' },
  { title: '구분',        key: 'storageTypeName',   align: 'center' , width: '120px' },
  { title: '생산공정명',    key: 'prodProcessName',  align: 'center' , width: '150px' },
  { title: '외주거래처명',  key: 'outCustomerName',  align: 'start' , width: '250px' },
  { title: '사용',          key: 'useYn',           align: 'center' , width: '60px' },
  { title: '추가사업장명',  key: 'companyName',      align: 'center' , width: '120px' },
])
const goDetail = (val) =>{
console.log('val',val.storageCd)
  if (val === 'N') {
    title.value ="창고등록"
    id.value = ''
  }else{
    mode.value = 'U'
    title.value ="창고상세정보"
    id.value = val.storageCd
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
  exportToExcel(headers, storageList.value, '창고정보_목록')
}


</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
