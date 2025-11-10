<template>
<v-breadcrumbs  :items="['MES', '연구관리', '샘플 리스트']"  class="custom-breadcrumbs"/>
<v-card class="pa-1" style="height: 60px;">
  <v-card-text >
    <v-row>
    <v-form ref="srhForm" @submit.prevent="srhSampleList">
      <v-col class="d-flex ga-4">
        <v-select
          v-model="form.areaCd"
          :items = "areaCds"
          label="공장명"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          density="compact"
          style="width: 150px;"
        />
        <v-text-field
          v-model="form.clientName"
          label="업체명"
          variant="underlined"
          density="compact"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.itemName"
          label="품목명"
          variant="underlined"
          density="compact"
          style="width: 200px;"
        />
        <v-text-field
          v-model="form.businessManagerName"
          label="영업담당자명"
          variant="underlined"
          density="compact"
          style="width: 100px;"
        />
        <v-text-field
          v-model="form.labManagerName"
          label="연구담당자명"
          variant="underlined"
          density="compact"
          style="width: 100px;"
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
        :items="sampleList"
        density="compact"
        fixed-header
        :items-per-page="15"
        height="680px"
        class="custom-table"
        >
        <template #item.itemName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.itemName }}
          </div>
        </template>
        <template #item.qty="{ item, index }">
            {{ item.qty }} ea
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAuthStore } from '@/stores/auth';
import { exportToExcel } from '@/util/exportToExcel';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const { userId } = useAuthStore()
const router = useRouter()
const srhForm = ref(null)
const sampleList = ref([])
const areaCds = ref([])
const form =reactive({
  areaCd:'',
  clientName: '',
  itemName: '',
  busisnessManagerName: '',
  labManagerName: '',

  sampleId: '',
  userId: userId,
})

const headers = ref([
  { title: '공장명', key: 'areaName', align: 'center' },
  { title: '업체명', key: 'clientName', align: 'start' },
  { title: '품목명', key: 'itemName', align: 'start' },
  { title: '제형', key: 'formulationCd', align: 'center' },
  { title: '영업담당자명', key: 'businessManagerName', align: 'center' },
  { title: '연구담당자명', key: 'labManagerName', align: 'center' },
  { title: '의뢰일자', key: 'reqDate', align: 'center' },
  { title: '제품관리번호', key: 'prodMgmtNo', align: 'center' },
  { title: '횟수', key: 'countQty', align: 'center' },
  { title: '수량', key: 'qty', align: 'center' },
  { title: '특이사항', key: 'etc', align: 'start' },
])

const srhSampleList = async () =>{
  const params = {
    ...form
  }

  sampleList.value = await ApiLab.getSampleList(params)
}

const selectRowClick = (item, index) => {
    router.push({name: 'SampleDetail',params: { id: item.sampleId }  })
}

onMounted(async () =>{
  areaCds.value = await ApiCommon.getCodeList('AREA')
  areaCds.value = areaCds.value.filter(i => !['A003'].includes(i.code))
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, sampleList.value, '원료_목록')
}
</script>

<style  scoped>
@import '@/assets/css/main.css';
</style>
