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
          <v-select
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
            v-model="form.ingredientNm"
            label="성분명"
            density="compact"
            variant="underlined"
            placeholder="성분명을 입력해주세요"
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
        :items="materialList"
        density="compact"
        fixed-header
        height="720px"
        class="custom-table"
        >
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


const router = useRouter()

const srhForm = ref(null)
const materialList = ref([])
const useYns = ref([])

const form = reactive({
  itemName : '',
  itemCd: '',
  ingredientName: '',
  customerName: '',
})
const headers = [
  { title: '품목코드.',  key: 'itemCd', align: 'center', width: '120px' },
  { title: '품목명.',    key: 'name',   align: 'start', width: '200px' },
  { title: '수량.',      key: 'qty',    align: 'end',  width: '100px' },
]

const srhMaterialList = () => {
  //list.value
  console.log('date', form.strDate)

}

const selectRowClick = (item, index) => {
  if(isEmpty(item.itemCd) ){
    router.push({name: 'MaterialNew',params: { id: item.itemCd }  })
  }else{
    router.push({name: 'MaterialDetail',params: { id: item.itemCd }  })
  }
}

onMounted( async () => {
  useYns.value = await ApiCommon.getCodeList('use_yn')
  materialList.value = await ApiLab.getMaterialList
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
