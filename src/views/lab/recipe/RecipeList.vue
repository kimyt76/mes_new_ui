<template>
<v-breadcrumbs :items="['MES', '연구관리', '처방리스트']" class="custom-breadcrumbs"/>
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhRecipeList">
        <v-col class="d-flex ga-4">
          <v-text-field
            v-model="form.prodName"
            label="제품명"
            density="compact"
            variant="underlined"
            placeholder="제품명을 입력해주세요"
            style="width: 150px;"
          />
          <v-text-field
            v-model="form.labNo"
            label="Lab No."
            density="compact"
            variant="underlined"
            placeholder="lab No를 입력해주세요"
            style="width: 150px;"
          />
          <v-text-field
            v-model="form.managerName"
            label="담당자"
            density="compact"
            variant="underlined"
            placeholder="담당자을 입력해주세요"
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
        :items="recipeList"
        density="compact"
        fixed-header
        :items-per-page="15"
        height="720px"
        class="custom-table"
        >
        <template #item.prodName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.prodName }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { exportToExcel } from '@/util/exportToExcel';
import { ApiLab } from '@/api/apiLab';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const {writeYn, setCurrentWriteYn} = useAuthStore()

const router = useRouter()
const srhForm = ref('')
const recipeList = ref([])

const form = reactive({
  prodName:'',
  labNo: '',
  managerName: '',
})

const headers = [
  { title: 'No.',       key: 'rowNum',      align: 'center', width: '30px' },
  { title: '제품명',    key: 'prodName',    align: 'start',  width: '400px' },
  { title: '고객사',    key: 'clientName',  align: 'center',  width: '200px' },
  { title: 'Lab No',    key: 'labNo',       align: 'center',  width: '180px' },
  { title: '담당자',    key: 'managerName',  align: 'center',    width: '120px' },
  { title: '제품',      key: 'prodType',      align: 'center',    width: '120px' },
  { title: '등록일자',  key: 'regDate',     align: 'center',    width: '110px' },
]

const srhRecipeList = async () => {
  const params = {
    ...form
  }

  recipeList.value = await ApiLab.getRecipeList(params)
}

const selectRowClick = (item, index) => {
  setCurrentWriteYn(writeYn)  // 리스트 → 상세 권한 세팅
  router.push({name: 'RecipeDetail',params: { id: item.recipeId }  })
}

/**
 * 엑셀 다운로드
 */
const excel = () => {
  exportToExcel(headers, recipeList.value, '처방_목록')
}
</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
