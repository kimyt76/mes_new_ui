<template>
  <v-breadcrumbs :items="['MES', '발주관리', '발주목록']"></v-breadcrumbs>
  <v-card class="pa-3" style="height: 80px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhOrderList'>
        <div class="d-flex ga-3" > <!-- ga-4 는 Vuetify gap 클래스 -->
            <DateRangePicker
              v-model:fromDate="startDate"
              v-model:toDate="endDate"
              class="input-align"/>
            <v-text-field
              v-model="form.customerNm"
              dense
              density="compact"
              label="고객사명"
              placeholder="고객사명을 입력해주세요"
              variant="underlined"
              />
            <v-text-field
              v-model="form.itemNm"
              dense
              density="compact"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              />
            <v-text-field
              v-model="form.draftNm"
              dense
              density="compact"
              label="기안자"
              placeholder="기안자명을 입력해주세요"
              variant="underlined"
              />
              <v-btn
                color = "#EFEBE9"
                class="mt-3"
                type="submit"
              >조회</v-btn>
              <v-btn
                class="mt-3"
                @click="reset"
              >초기화</v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
  </v-card>
  <v-row class="mb-1" style="height: 70px;">
  <v-col>
    <div class="d-flex ga-4 justify-end">
    <v-btn
        dense
        color = "brown-lighten-4"
        class="mt-3"
        @click="goOrderNew"
        >신규</v-btn>
      <v-btn
        class="mt-3 mr-3"
        @click="excel"
        >엑셀</v-btn>
     </div>
  </v-col>
</v-row>
  <v-data-table
    :headers="headers"
    :items="orderList"
    :loading="loading"
    no-data-text="데이터가 없습니다."
    loading-text="조회중입니다 잠시만 기다려주세요"
    :items-per-page="25"
     @click:row="handleRowClick"
    >
    <template v-slot:headers="{ columns }">
      <tr style="height: 20px;">
        <th
          v-for="column in columns"
          :key="column.key"
          class="custom-header"
          style="height: 40px; text-align: center;"
        >
          {{ column.title }}
        </th>
      </tr>
    </template>

  </v-data-table>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import DateRangePicker from '@/components/DateRangePicker.vue';
import { useAlertStore } from '@/stores/alert';
import { toDate, firstDateDay } from '@/util/common'

const {vError} = useAlertStore()

const router = useRouter()
const startDate = ref(firstDateDay())
const endDate = ref(toDate())

const form = reactive({
  fromDate : '',
  toDate : '',
  customerNm : null,
  itemNm: null,
  draftNm: null,
})

const loading = ref(false)
const srhForm = ref(null)
const orderList = ref([])

/**
 * 발주 정보 조회
 */
const srhOrderList = async () => {
  loading.value =true

  form.fromDate = startDate.value
  form.toDate = endDate.value

  try{
    const params = {
      ...form,
    }

    orderList.value = await ApiOrder.getOrderList(params)

  }catch(err){
    vError("조회중 오류가 발생하였습니다. ")
  }finally{
    loading.value =false
  }
}

/**
 *  테이블 헤더
 */
 const headers = ref([
    { title: '기안일자',  key: 'draftDate',   align: 'center'},
    { title: '문서번호',  key: 'orderNm',     align: 'center'},
    { title: '고객사명',  key: 'customerNm',  align: 'center'},
    { title: '품목명',    key: 'itemNm',      align: 'center'},
    { title: '기안자',    key: 'draftNm',     align: 'center'},
])

// const visibleHeaders = computed(() =>
//   headers.value.filter(header => !header.hidden)
// );

const goOrderNew = ()=>{
  router.push('/order/orderNew')
}

const handleRowClick = (event, item) => {
  router.push({ name: 'OrderDetail', params: { id: item.item.orderId } })
}

/**
 * 초기화
 */
const reset = ()=> {
  srhForm.value.reset()
}

const excel = () => {
  exportToExcel(headers, orderList.value, '발주_목록')
}

onMounted(srhOrderList)

</script>

<style scoped>
@import '@/assets/css/main.css';
v-btn {
  height: 50px;
}
</style>
