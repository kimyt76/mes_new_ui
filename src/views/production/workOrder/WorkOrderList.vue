<template>
<v-breadcrumbs :items="['MES', '작업지시', '작업지시조회']" class="custom-breadcrumbs" />
<v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srcWorkOrderList">
        <v-col class="d-flex flex-row ga-3">
          <v-date-input
             v-model="form.fromDate"
            label="시작일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
            style="width: 150px;"
            />
          <v-date-input
            label="종료일자"
            v-model="form.toDate"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            prepend-icon=""
            append-inner-icon="mdi-calendar"
             style="width: 150px;"
            />
          <v-select
            v-model="form.areaCd"
            label="생산처(공장)"
            density="compact"
            :items="areaCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            style="width: 150px;"
          />

          <v-text-field
              v-model="form.itemName"
              density="compact"
              label="품목명"
              placeholder="품목명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.itemCd"
              density="compact"
              label="품목코드"
              placeholder="품목코드를 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
              v-model="form.cutomerName"
              density="compact"
              label="납품처명"
              placeholder="납품처명을 입력해주세요"
              variant="underlined"
              style="width: 150px;"
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
        color="brown-lighten-4"
        text="신규"
        @click="handleRowClick"
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
        :items="workOrderList"
        density="compact"
        fixed-header
        height="690px"
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

        <template #item.workOrderDateSeq="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.workOrderDateSeq }}
          </div>
        </template>
        <template #item.itemName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline; width: 95%;"
            @click="selectRowClick(item, index)"
          >
            {{ item.workOrderDateSeq }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import { isEmpty, formatDate, todayKST, addMonth } from '@/util/common';
import { ApiCommon } from '@/api/apiCommon';
import { exportToExcel } from '@/util/exportToExcel';
import { ApiWorkOrder } from '@/api/apiWorkOrder';
import { useRouter } from 'vue-router';

const {userId} = useAuthStore()
const router = useRouter()
const srhForm = ref('')
const workOrderList = ref([])
const areaCds = ref([])
const form = reactive({
  fromDate: '',
  toDate: '',
  areaCd: '',
  itemName: '',
  itemCd: '',
  cutomerName: '',

  userId : userId,
})

const headers = ref([
  { title: '일자-No',       key: 'workOrderDateSeq',   align: 'center' , width: '100px'},
  { title: '구역',          key: 'areaName',              align: 'center' , width: '120px'},
  { title: '품목명',        key: 'itemName',          align: 'start',   width: '380px'},
  { title: '제조일자',      key: 'itemCd',            align: 'center',   width: '120px'},
  { title: '주문량',        key: 'expectedDueDate',   align: 'center' , width: '90px'},
  { title: '등록배치수',    key: 'orderType',         align: 'center' , width: '80px'},
  { title: '납품처명',      key: 'clientName',        align: 'center',   width: '200px'},
  { title: '담당자명',      key: 'managerName',       align: 'center' , width: '100px'},
  { title: '비고',          key: 'etc',               align: 'center',  width: '80px'},
])

const srcWorkOrderList = async () =>{
  const params = {
    ...form,
  }

  params.fromDate = formatDate(form.fromDate)
  params.toDate = formatDate(form.toDate)

  workOrderList.value = await ApiWorkOrder.getWorkOrderList(params)
}

const handleRowClick = (item, index) =>{
  router.push({name:'WorkOrderDetail',params: { id: item.workOrderId } })
}

onMounted( async () =>{
  areaCds.value = await ApiCommon.getCodeList('area')

  form.fromDate = todayKST()
  form.toDate = addMonth(form.fromDate)

  srcWorkOrderList()
})















/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, WorkOrderList.value, '작업지시_목록')
}






</script>

<style  scoped>
@import '@/assets/css/main.css';

</style>
