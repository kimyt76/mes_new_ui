<template>
<v-breadcrumbs
    :items="['MES', '기본관리', '품목상세목록']"
    class="custom-breadcrumbs"
    >
  </v-breadcrumbs>
  <v-card class="pa-1" style="height: 60px;">
    <v-row>
        <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhContractList'>
          <div class="d-flex ga-3" > <!-- ga-4 는 Vuetify gap 클래스 -->
            <v-text-field
              v-model="form.itemName"
              dense
              density="compact"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              />
          <v-text-field
              v-model="form.managerName"
              dense
              density="compact"
              label="담당자명"
              placeholder="담당자명을 입력해주세요"
              variant="underlined"
              />
          <v-text-field
              v-model="form.customerName"
              dense
              density="compact"
              label="거래처명"
              placeholder="거래처명을 입력해주세요"
              variant="underlined"
              />
          <v-select
            v-model="form.statusType"
            label="진행상태"
            :items="statusTypes"
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
            text="초기화"
            @click=srhForm.reset()
            />
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
            text="신규"
            @click="goContract()"
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
    :items="contractList"
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
    <!-- 리스트 영역 커스터마이징 -->
    <template #item="{ item }">
      <tr style="height: 30px;">
        <td style="width: 100px; height: 30px; text-align: center; text-decoration: underline; cursor: pointer;" @click="goContract(item.contractId)">{{ item.contractDateSeq }}</td>
        <td style="width: 200px; height: 30px; text-decoration: underline;  cursor: pointer;" @click="goContract(item.contractId)">{{item.itemName}}</td>
        <td style="width: 90px; height: 30px; text-align: center;">{{item.dueDate}}</td>
        <td style="width: 90px; height: 30px; text-align: center;">{{item.managerName}}</td>
        <td style="width: 200px; height: 30px; text-align: center;">{{item.customerName}}</td>
        <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.totQty) }}</td>
        <td style="width: 100px; height: 30px; text-align: right;">{{ formatComma(item.totSupplyPrice) }}</td>
        <td style="width: 60px; height: 30px; text-align: center;">{{item.orderStatus === 'ING'?  '진행중' : '종료'}}</td>
        <td style="width: 50px; height: 30px; text-align: center;">
          <v-chip
            :color="item.printYn === 'Y' ? undefined : red"
            text-color="black"
            size="small"
            variant="elevated"
          >
            인쇄
          </v-chip>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders';
import { useAlertStore } from '@/stores/alert';
import { onMounted, reactive, ref } from 'vue';
import { exportToExcel } from '@/util/exportToExcel';
import { ApiCommon } from '@/api/apiCommon';
import { useRouter } from 'vue-router';
import { isEmpty, formatComma } from '@/util/common';

const router = useRouter()
const { vError } = useAlertStore()
const loading = ref(false)
const contractList = ref([])
const statusTypes = ref([])
const srhForm = ref('')
const form = reactive({
  itemName: '',
  managerName: '',
  customerName: '',
  statusType: '',
})

const headers =ref([
  { title: '일자-No.',          key: 'contractDateSeq',    align: 'center' },
  { title: '품목명',            key: 'itemName',          align: 'center'},
  { title: '납기일자',          key: 'dueDate',       align: 'center' },
  { title: '담당자명',          key: 'managerName',       align: 'center' },
  { title: '거래처명',          key: 'customerName',      align: 'center' },
  { title: '주문수량합계',       key: 'totQty',            align: 'center'},
  { title: '주문공급가액합계',   key: 'totUnitPrice',      align: 'center'},
  { title: '진행상태',          key: 'orderStatusName',   align: 'center' },
  { title: '인쇄',              key: 'printYn',           align: 'center' },
])


onMounted( async () =>{
  statusTypes.value = await ApiCommon.getCodeList('status_type')
  srhContractList()
})

const goContract = (id) => {

  if ( isEmpty(id)) {
    router.push({ name: 'ContractReg' })
  }else{
    router.push({ name: 'ContractDetail', params: { id } })
  }

}

const srhContractList = async () => {
  loading.value = true

  try{
    const params = {
      ...form
    }
    contractList.value = await ApiOrder.getContractList(params)

  }catch(err){
    vError(err.message)
  }finally{
    loading.value = false
  }
}

const excel = () => {
  exportToExcel(headers, contractList.value, '수주_목록')
}

</script>

<style scoped>
@import '@/assets/css/main.css';
.highlight {
  background-color: yellow;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
