<template>
<v-breadcrumbs :items="['MES', '연구관리', '신원료리스트']" class="custom-breadcrumbs"/>
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
        <v-form ref="srhForm" @submit.prevent="srhNewMaterialList">
          <v-col class="d-flex ga-4">
            <v-text-field
              v-model="form.materialName"
              label="품목명"
              density="compact"
              variant="underlined"
              placeholder="품목명을 입력해주세요"
              style="width: 200px;"
            />
            <v-text-field
              v-model="form.regName"
              label="등록자."
              density="compact"
              variant="underlined"
              placeholder="등록자를 입력해주세요"
              style="width: 150px;"
            />
            <v-btn
              text="조회"
              color="brown-lighten-4"
              type="submit"
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
    </v-col>
  </v-row>
  <v-row>
    <v-col class="pa-0">
      <v-data-table
        :headers="headers"
        :items="newMaterialList"
        density="compact"
        fixed-header
        :items-per-page="15"
        height="720px"
        class="custom-table"
        >
        <template #item.materialName="{ item, index }">
          <div
            style="cursor: pointer; text-decoration: underline;"
            @click="selectRowClick(item, index)"
          >
            {{ item.materialName }}
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const srhForm = ref('')
const newMaterialList = ref([])
const form = reactive({
  materialName: '',
  regName: '',
})

const headers = [
  { title: 'No.',       key: 'rowNum',        align: 'center',  width: '30px' },
  { title: '임시코드',  key: 'newMaterialCd',  align: 'center',  width: '150px' },
  { title: '품목명',    key: 'materialName',   align: 'start',   width: '480px' },
  { title: '등록자',    key: 'regName',        align: 'center',  width: '120px' },
  { title: '등록일자',  key: 'regDate',        align: 'center',  width: '110px' },
  { title: '품목코드',  key: 'itemCd',         align: 'center',  width: '150px' },
]

const srhNewMaterialList = async ()=>{
  const params = {
    ...form
  }

  newMaterialList.value = await ApiLab.getNewMaterialList(params)
}

const selectRowClick = (item, index) =>{
  router.push({name: 'NewMaterialDetail',params: { id: item.newMaterialCd }  })
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
