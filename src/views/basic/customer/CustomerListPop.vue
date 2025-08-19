<template>
<v-card >
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>거래처 조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srcForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
        <v-select
          v-model="form.customerGrp1"
          label="거래유형"
          :items="customerGrp1s"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
          style="width: 120px;"
          />
        <v-select
          v-model="form.customerGrp2"
          label="업무유형"
          :items="customerGrp2s"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
          style="width: 120px;"
        />
        <v-text-field
          v-model="form.businessCd"
          label="사업자번호"
          density="compact"
          style="width: 180px;"
          placeholder="사업자번호를 입력해주세요"
        />
        <v-text-field
          v-model="form.customerName"
          label="거래처명"
          density="compact"
          style="width: 220px;"
          placeholder="거래처명을 입력해주세요"
        />
        <v-btn
          text="조회"
          color="brown-lighten-4"
          type="submit"
          />
        <v-btn
          text="초기화"
          @click="srcForm.reset()"
          />
      </v-col>
      </v-form>
    </v-row>
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          :headers="headers"
          :items="customerList"
          :loading="loading"
          :items-per-page="15"
          density="compact"
          fixed-header
          height="520px"
          class="custom-table"
          @click:row="handleRowClick"
        >
      </v-data-table>
      </div>
  </v-card-text>
  <v-card-actions>
    <v-btn
      text="닫기"
      variant="tonal"
      class="mb-4 mr-3"
      @click="emit('close-dialog')"
      />
  </v-card-actions>
</v-card>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits(['selected','close-dialog'])
const srcForm = ref('')
const loading = ref(false)
const customerList = ref([])
const customerGrp1s = ref([])
const customerGrp2s = ref([])
const form = reactive({
  customerGrp1: '',
  customerGrp2: '',
  businessCd:'',
  customerName: '',
})

const headers = [
  { title: '거래처코드',  key: 'customerCd',        align: 'center' , width:'120px'},
  { title: '거래처명',    key: 'customerName',      align: 'left' , width:'250px'},
  { title: '담당자',      key: 'customerManager',   align: 'center' , width:'100px'},
  { title: '전화번호',    key: 'tel',               align: 'center' , width:'100px'},
]

const searchList = async () =>{

  const params = {
    ...form
  }
  customerList.value = await ApiBase.getCustomerList(params)

}

const handleRowClick = (event, item) =>{
  //emit('selected', item.item.customerCd, item.item.customerName )
  emit('selected', item.item)
  emit('close-dialog')
}

onMounted( async () => {
  customerGrp1s.value = await ApiCommon.getCodeList('CUSTOMER_GRP1')
  customerGrp2s.value = await ApiCommon.getCodeList('CUSTOMER_GRP2')
})

</script>

<style >
.custom-table thead th {
  height: 32px !important;
  background-color: #BCAAA4 !important;
}

.wrap-cell {
  word-break: break-word;
  white-space: normal;
  line-height: 1.4;
}
.toolbar-Head {
  color: white;
  background-color:#546E7A;

}
</style>
