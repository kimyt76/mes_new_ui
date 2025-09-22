<template>
<v-breadcrumbs
    :items="['MES', '연구관리', '연구처방리스트']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhResearchList">
        <v-col class="d-flex ga-4">
          <v-date-input
            v-model="regDate"
            :display-format="yyyy-mm-dd"
             variant="underlined"
             density="compact"
            />
          <v-text-field
            v-model="form.pordName"
            label="제품명"
            density="compact"
            variant="underlined"
            placeholder="제품명을 입력해주세요"
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
  <v-row>
    <v-col class="d-flex justify-end align-center mr-2" style="gap: 10px; margin-top: 10px;">
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
        :items="researchlList"
        density="compact"
        fixed-header
        :items-per-page="15"
        height="720px"
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
        <template #item.inPrice ="{ item }">
          {{ formatComma(item.inPrice) }}
        </template>
        <template #item.outPrice ="{ item }">
          {{ formatComma(item.outPrice)}}
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
import { ApiLab } from '@/api/apiLab';
import { ApiCommon } from '@/api/apiCommon';
import { useRouter } from 'vue-router';
import { ApiItem } from '@/api/apiItem';


const router = useRouter()
const srhForm = ref(null)
const researchlList = ref([])
const form = reactive({
  regDate: '',
  prodName : '',
})
const headers = [
  { title: 'No.',       key: 'rowNum',       align: 'center', width: '30px' },
  { title: '등록일  ',  key: 'redDate',      align: 'center',  width: '120px' },
  { title: '제품명',    key: 'itemName',     align: 'start', width: '450px' },
  { title: 'Lab No.',   key: 'labNo',        align: 'center',  width: '180px' },
  { title: '담당자',    key: 'managerName',   align: 'center',  width: '100px' },
]

const srhResearchList = async () => {
  //list.value
  const params = {
    ...form
  }

  researchlList.value = await ApiItem.getItemList(params)
}

const selectRowClick = (item, index) => {
    router.push({name: 'ResearchDetail',params: { id: item.itemCd }  })
}

onMounted( async () => {
  srhResearchList()
})

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, researchlList.value, '원료_목록')
}


</script>

<style>
@import '@/assets/css/main.css';
</style>
