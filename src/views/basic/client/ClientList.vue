<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '고객사관리']"
    class="custom-breadcrumbs"
    />

  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
        <v-col class="d-flex ga-4">
          <v-date-input
            v-model="form.strDate"
            label="등록일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-date-input
            v-model="form.toDate"
            label="등록일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.clientName"
            label="고객사명"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.businessNo"
            label="사업자번호"
            density="compact"
            variant="underlined"
            style="width: 200px;"
          />
          <v-text-field
            v-model="form.saleManagerName"
            label="영업담당자"
            density="compact"
            variant="underlined"
            style="width: 200px;"
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
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
      <v-btn
        color="brown-lighten-4"
        text="신규"
        @click="selectRowClick"
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
        :items="clientList"
        density="compact"
        fixed-header
        height="700px"
        class="custom-table"
        return-object
        >
        <template #item.clientName="{ item }">
          <div
            style="cursor: pointer; text-decoration: underline;  width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.clientName }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';
import { ApiBase } from '@/api/apiBase';
import { useRouter } from 'vue-router';

const router = useRouter()

const srhForm = ref(null)
const clientList = ref([])

const form = reactive({
  strDate: '',
  toDate: '',
  clientName : '',
  saleManagerName: '',
  businessNo: '',
})

const headers = ref([
  { title: 'No.',         key: 'rowNum',           align: 'center', width: '20px' },
  { title: '고객사코드.',  key: 'businessNo',       align: 'center', width: '120px' },
  { title: '고객사명',     key: 'clientName',       align: 'start',  width: '350px' },
  { title: '대표자명',     key: 'president',        align: 'center',  width: '100px' },
  { title: '영업담당자명', key: 'saleManagerName',  align: 'center',  width: '100px' },
  { title: '결제조건',     key: 'paymentCondition', align: 'center',  width: '120px' },
  { title: '최초거래일자', key: 'firstDelaDate',     align: 'center',  width: '100px' },
  { title: '거래구분',     key: 'tradeType',        align: 'center',  width: '100px' },
])

const searchList = async () => {
  //list.value

  const params = {
    ...form
  }
  params.strDate = formatDate(form.strDate)
  params.toDate = formatDate(form.toDate)

  clientList.value = await ApiBase.getClientList(params)
}

const selectRowClick = (item, index) =>{
  router.push({ name: 'ClientDetail', params: { id: item.clientId } })
}

onMounted(() => {
  form.strDate = todayKST()
  form.toDate = todayKST()
})


/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, clientList.value, '정보_목록')
}
</script>

<style>
@import '@/assets/css/main.css';
</style>


