<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '거래처관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhCustomerList">
        <v-col class="d-flex ga-4">
          <v-select
            v-model="form.customerType"
            label="거래처구분"
            :items="custormTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            style="width: 130px;"
            />
          <v-text-field
            v-model="form.customerName"
            density="compact"
            label="거래처명"
            placeholder="거래처명 입력해주세요"
            variant="underlined"
            style="width: 180px;"
            />
          <v-text-field
            v-model="form.customerCd"
            density="compact"
            label="거래처코드"
            placeholder="거래처코드를 입력해주세요"
            variant="underlined"
            style="width: 150px;"
            />
          <v-text-field
            v-model="form.customerManager"
            density="compact"
            label="거래처담당자"
            placeholder="거래처담당자를 입력해주세요"
            variant="underlined"
            style="width: 120px;"
            />
            <v-btn
              color = "#EFEBE9"
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
        @click="goCustomerPop"
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
        :items="customerList"
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
        <template #item.customerName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="goCustomerPop(item, index)"
          >
            {{ item.customerName }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog  v-model="dialog" max-width="900px" max-height="800px" persistent>
    <CustomerDetailPop
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
import { reactive, ref, onMounted } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import CustomerDetailPop from './CustomerDetailPop.vue';
import { isEmpty } from 'lodash';

const { vError, vSuccess } = useAlertStore()

const dialog = ref(false)
const loading = ref(false)
const customerList = ref([])
const custormTypes = ref([])
const srhForm = ref('')
const mode = ref('')
const id = ref('')
const title = ref('')

const form = reactive({
  customerType : '',
  customerCd: '',
  customerName : '',
  customerManager: '',
})

const headers = ref([
  { title: '구분',          key: 'customerTypeName',    align: 'center', width: '60px' },
  { title: '거래처명',      key: 'customerName',        align: 'left' , width: '280px'},
  { title: '주소',          key: 'address',             align: 'left' , width: '250px'},
  { title: '대표자명',      key: 'president',           align: 'center' , width: '70px'},
  { title: '사업자번호',    key: 'businessNo',          align: 'center' , width: '120px'},
  { title: '전화번호',      key: 'tel',                 align: 'center' , width: '120px'},
  { title: '거래처담당자',  key: 'customerManager',      align: 'center' , width: '90px'},
  { title: '이메일',        key: 'email',               align: 'center' , width: '90px'},
  { title: '핸드폰번호',    key: 'customerManagerTel',   align: 'center', width: '120px'},
  { title: '담당자명',      key: 'memberName',          align: 'center' , width: '70px'}
])

onMounted(async () => {
  custormTypes.value = await ApiCommon.getCodeList('CUSTOMER_TYPE')
  srhCustomerList()
})

const srhCustomerList = async () =>{
  loading.value = true
  try{
    const params = {
      ...form
    }
    customerList.value = await ApiBase.getCustomerList(params)
  }catch(err){
    vError("조회 실패 : " + err.message)
  }finally{
    loading.value =false
  }
}

const goCustomerPop = (val) =>{
    if ( isEmpty(val) ) {
      title.value = '거래처 신규'
      mode.value ='N'
      id.value = ''
    }else{
      title.value = '거래처 상세'
      mode.value ='U'
      id.value = val.customerCd
    }
    dialog.value =true
}

const handleSaved = (msg) => {
  vSuccess(msg)
  srhCustomerList()
}

const excel = () => {
  exportToExcel(headers, customerList.value, '거래처_목록')
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
