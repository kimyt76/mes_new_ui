<template>
  <v-card class="pa-3">
  <v-card-item title="거래처 조회"></v-card-item>
  <v-row>
    <v-col style="height: 30px; padding: 3px;">
      <v-form ref="srhForm" @submit.prevent="srhCustomerList">
        <div class="d-flex ga-4 mt-6 ml-4">
          <v-select
            v-model="form.customerGrp1"
            label="거래유형"
            :items="customerGrp1s"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            />
          <v-select
              v-model="form.customerGrp2"
              label="업무유형"
              :items="customerGrp2s"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
            />
          <v-text-field
            v-model="form.businessCd"
            label="사업자번호"
            placeholder="사업자번호를 입력해주세요"
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
          <v-btn
            color = "#EFEBE9"
            text="조회"
            type="submit"
            />
          <v-btn
            class="mr-3"
            text="초기화"
            @click="reset"
            />
        </div>
      </v-form>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="customerList"
        :loading="loading"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        :items-per-page="15"
        style="height: 400px"
        @click:row="handleRowClick"
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
      </v-data-table>
    </v-col>
  </v-row>
  <v-row class="mt-1" style="height: 70px;">
    <v-col>
      <div class="d-flex ga-4 justify-end">
        <v-btn
          dense
          text="선택"
          color = "brown-lighten-4"
          />
        <v-btn
          text="닫기"
          variant="tonal"
          @click="emit('close-dialog')"
          />
      </div>
    </v-col>
  </v-row>
</v-card>

</template>


<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { onMounted, reactive, ref } from 'vue';

const { vError } = useAlertStore()

const emit = defineEmits(['selected', 'close-dialog'])

const srhForm = ref('')
const loading = ref(false)
const form = reactive({
  customerGrp1: '',
  customerGrp2: '',
  businessCd:'',
  customerName: '',
})

const customerList = ref([])
const customerGrp1s = ref([])
const customerGrp2s = ref([])
const headers = ref([
  { title: '거래처코드',  key: 'customerCd',        align: 'center' },
  { title: '거래처명',    key: 'customerName',      align: 'center' },
  { title: '담당자',      key: 'customerManager',   align: 'center' },
  { title: '전화번호',    key: 'tel',               align: 'center' },
])

onMounted( async () => {
  customerGrp1s.value = await ApiCommon.getCodeList('CUSTOMER_GRP1')
  customerGrp2s.value = await ApiCommon.getCodeList('CUSTOMER_GRP2')
})

const srhCustomerList = async () =>{
  loading.value =true

  try{
    const params = {
      ...form
    }

    customerList.value = await ApiBase.getCustomerList(params)

  }catch(err){
    vError("조회에 실패했습니다."+ err)
  }finally{
    loading.value = false
  }
}

const handleRowClick = (event, item) => {
  emit('selected', item.item.customerCd, item.item.customerName )
  emit('close-dialog')
}

const reset = () =>{
  srhForm.value.remove()
}
</script>

<style scoped>
@import '@/assets/css/main.css';

.v-card-item  {
  height: 30px;
  background-color:#BCAAA4
}
</style>
