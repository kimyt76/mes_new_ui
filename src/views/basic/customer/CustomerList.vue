<template>
<v-breadcrumbs :items="['MES', '기본관리', '거래처 관리']"></v-breadcrumbs>

<v-card class="pa-1" style="height: 60px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhCustomerList'>
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-select
            v-model="form.customerType"
            label="거래처구분"
            :items="custormTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            />
          <v-text-field
            v-model="form.customerName"
            density="compact"
            label="거래처명"
            placeholder="거래처명 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.customerCd"
            density="compact"
            label="거래처코드"
            placeholder="거래처코드를 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.customerManager"
            density="compact"
            label="거래처담당자"
            placeholder="거래처담당자를 입력해주세요"
            variant="underlined"
            />
            <v-btn
              color = "#EFEBE9"
              type="submit"
              text="조회"
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
          color = "brown-lighten-4"
          class="mt-3"
          text="신규"
          @click="goCustomerPop()"
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
      :items="customerList"
      :loading="loading"
      no-data-text="데이터가 없습니다."
      loading-text="조회중입니다 잠시만 기다려주세요"
      :items-per-page="15"
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
    <template #item="{ item }">
    <tr style="height: 30px;">
      <td style="width: 50px; height: 30px; text-align: center; cursor: pointer;">{{ item.customerTypeName }}</td>
      <td style="width: 80px; height: 30px; text-align: center;">{{item.businessNo}}</td>
      <td style="width: 200px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="goCustomerPop(item.customerCd)" >{{item.customerName}}</td>
      <td style="width: 210px; height: 30px; text-align: left;">{{item.address}}</td>
      <td style="width: 70px; height: 30px; text-align: center;">{{item.president}}</td>
      <td style="width: 110px; height: 30px; text-align: center;">{{item.tel}}</td>
      <td style="width: 110px; height: 30px; text-align: center;">{{ item.fax }}</td>
      <td style="width: 90px; height: 30px; text-align: center;">{{ item.customerManager }}</td>
      <td style="width: 120px; height: 30px; text-align: center;">{{item.email}}</td>
      <td style="width: 110px; height: 30px; text-align: center;">{{item.customerManagerTel}}</td>
      <td style="width: 80px; height: 30px; text-align: center;">{{item.memberName}}</td>
    </tr>
  </template>
  </v-data-table>


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

const dialog = ref(false)
const { vError, vSuccess } = useAlertStore()

const loading = ref(false)
const customerList = ref([])
const custormTypes = ref([])
const srhForm = ref('')
const form = reactive({
  customerType : '',
  customerCd: '',
  customerName : '',
  customerManager: '',
})

const headers = ref([
  { title: '구분',          key: 'customerTypeName',    align: 'center' },
  { title: '사업자번호',    key: 'businessNo',          align: 'center' },
  { title: '거래처명',      key: 'customerName',        align: 'center' },
  { title: '주소',          key: 'address',             align: 'center' },
  { title: '대표자명',      key: 'president',           align: 'center' },
  { title: '전화번호',      key: 'tel',                 align: 'center' },
  { title: 'FAX',           key: 'fax',                 align: 'center' },
  { title: '거래처담당자',  key: 'customerManager',      align: 'center' },
  { title: '이메일',        key: 'email',               align: 'center' },
  { title: '핸드폰번호',    key: 'customerManagerTel',   align: 'center' },
  { title: '담당자명',      key: 'memberName',          align: 'center' }
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

const mode = ref('')
const id = ref('')
const title = ref('')

const goCustomerPop = (val) =>{
    if ( isEmpty(val) ) {
      title.value = '거래처 신규'
      mode.value ='N'
      id.value = ''
    }else{
      title.value = '거래처 상세'
      mode.value ='U'
      id.value = val
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

const reset = () => {
  srhForm.value.reset()
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
