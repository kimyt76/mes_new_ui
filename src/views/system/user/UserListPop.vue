<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>사용자 조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
      <v-col class="d-flex flex-row ga-3">
        <v-text-field
          v-model="form.memberNm"
          label="사용자명"
          density="compact"
          style="width: 200px;"
          placeholder="사용자명을 입력해주세요"
        />
        <v-text-field
          v-model="form.userId"
          label="사용자 ID"
          density="compact"
          style="width: 200px;"
          placeholder="사용자 ID를 입력해주세요"
        />
        <v-text-field
          v-model="form.deptNm"
          label="부서"
          density="compact"
          style="width: 200px;"
          placeholder="부서를 입력해주세요"
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
      <!-- 스크롤 가능한 테이블 컨테이너 -->
      <div style="overflow-y: auto; height: calc(100% - 40px);">
        <v-data-table
          :headers="headers"
          :items="userList"
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
import { ApiSystems } from '@/api/apiSystem';
import { reactive, ref } from 'vue';

const emit = defineEmits(['selected','close-dialog'])

const loading = ref(false)
const userList = ref([])
const srhForm = ref('null')
const form = reactive({
  userId : '',
  memberNm : '',
  deptNm: '',
  useYn : 'Y',
})

const headers = [
  { title: 'No.',       key: 'id',     align: 'center', width: '40px' },
  { title: '사용자ID',  key: 'userId',      align: 'center', width: '120px' },
  { title: '사용자명',  key: 'memberNm',    align: 'center', width: '120px' },
  { title: '부서',      key: 'deptNm',      align: 'center',  width: '100px' },
  { title: '직급',      key: 'jobPosition', align: 'center',  width: '100px' },
]

const searchList = async () =>{
   const params = {
    ...form
  }
  userList.value = await ApiSystems.getUserList(params)
}

const handleRowClick = (event, item) => {
  //emit('selected', item.item.userId, item.item.memberNm )
  emit('selected', item.item)
  emit('close-dialog')
}

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
