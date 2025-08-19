<template>
<v-card class="pa-3">
  <v-card-item title="사용자 조회"></v-card-item>
  <v-row>
    <v-col style="height: 20px; padding: 3px;">
      <v-form ref="srhForm" @submit.prevent="srhUserList">
        <div class="d-flex ga-4 ml-4">
          <v-text-field
            v-model="form.memberNm"
            density="compact"
            label="사용자명"
            placeholder="사용자명을 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.userId"
            density="compact"
            label="사용자 ID"
            placeholder="사용자 ID를 입력해주세요"
            variant="underlined"
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
        :items="userList"
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
  <v-row class="mt-10" style="height: 70px;">
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
import { reactive, ref } from 'vue'
import { useAlertStore } from '@/stores/alert';
import { ApiSystems } from '@/api/apiSystem';


const { vError } = useAlertStore()
const emit = defineEmits(['selected', 'close-dialog'])
const srhForm = ref(null)
const userList = ref([])
const loading = ref(false)


const headers = ref([
    { title: 'No.',      key: 'id'},
    { title: '사용자ID',  key: 'userId'},
    { title: '사용자명',  key: 'memberNm'},
    { title: '부서',      key: 'deptNm'},
    { title: '직급',      key: 'jobPosition'},
])

const form = reactive({
  userId : '',
  memberNm : '',
  useYn : 'Y',
})


const srhUserList = async ()=> {
  loading.value = true

  const params = {
    ...form
  }

  try {
    userList.value = await ApiSystems.getUserList(params)
  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

const handleRowClick = (event, item) => {
  emit('selected', item.item.userId, item.item.memberNm )
  emit('close-dialog')
}

const reset = () => {
  srhForm.value.reset()
}
</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
