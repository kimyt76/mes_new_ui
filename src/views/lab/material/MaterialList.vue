<template>
<v-breadcrumbs
    :items="['MES', '연구관리', '원료정보']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhMaterialList">
        <v-col class="d-flex ga-4">
          <v-text-field
            v-model="form.itemName"
            label="품목명"
            density="compact"
            variant="underlined"
            placeholder="품목명을 입력해주세요"
            style="width: 150px;"
          />
          <v-text-field
            v-model="form.itemCd"
            label="품목코드"
            density="compact"
            variant="underlined"
            placeholder="품목명를 입력해주세요"
            style="width: 150px;"
          />
          <v-text-field
            v-model="form.customerName"
            label="거래처명"
            density="compact"
            variant="underlined"
            placeholder="거래처명을 입력해주세요"
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
        :items="materialList"
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
const materialList = ref([])
const useYns = ref([])

const form = reactive({
  itemTypeCd : 'M1',
  itemName : '',
  itemCd: '',
  ingredientName: '',
  customerName: '',
})
const headers = [
  { title: 'No.',       key: 'rowNum',       align: 'center', width: '30px' },
  { title: '품목코드',  key: 'itemCd',       align: 'center', width: '120px' },
  { title: '품목명',    key: 'itemName',     align: 'start', width: '400px' },
  { title: '거래처',    key: 'customerName', align: 'start', width: '200px' },
  { title: '제조원',    key: 'qty',          align: 'center',  width: '100px' },
  { title: '입고단가',  key: 'inPrice',      align: 'end',  width: '100px' },
  { title: '출고단가',  key: 'outPrice',     align: 'end',  width: '100px' },
  { title: 'Vegan',    key: 'vegan',        align: 'center',  width: '60px' },
  { title: 'Halal',    key: 'halal',        align: 'center',  width: '60px' },
  { title: 'RSPO',     key: 'rspo',         align: 'center',  width: '60px' },
]

const srhMaterialList = async () => {
  //list.value
  const params = {
    ...form
  }

  materialList.value = await ApiItem.getItemList(params)
}

const selectRowClick = (item, index) => {
    router.push({name: 'MaterialDetail',params: { id: item.itemCd }  })
}

onMounted( async () => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  srhMaterialList()
})


/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, materialList.value, '원료_목록')
}


</script>

<style>
@import '@/assets/css/main.css';
</style>
