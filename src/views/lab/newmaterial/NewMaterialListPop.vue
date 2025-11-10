<template>
<v-card>
  <v-toolbar height="40" class="d-flex align-center justify-space-between px-2 toolbar-Head">
    <v-toolbar-title>신원료 성분조회</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="emit('close-dialog')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
  <v-spacer></v-spacer>
  <v-card-text >
    <v-row>
      <v-form ref="srhForm" @submit.prevent="srhNewMaterialList">
      <v-col class="d-flex flex-row ga-3">
        <v-text-field
          v-model="form.newMaterialCd"
          label="신원료코드"
          placeholder="신원료코드를 입력해주세요"
          density="compact"
          style="width: 150px;"
        />
        <v-text-field
          v-model="form.materialName"
          label="신원료명"
          placeholder="신원료명을 입력해주세요"
          density="compact"
          style="width: 180px;"
        />
        <v-text-field
          v-model="form.regName"
          label="등록자명"
          placeholder="등록자명을 입력해주세요"
          density="compact"
          style="width: 180px;"
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
          :items="newMaterialList"
          item-value="newMaterialCd"
          density="compact"
          fixed-header
          height="520px"
          class="custom-table"
          return-object
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
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { reactive, ref } from 'vue';

const { vWarning} = useAlertStore()
const emit = defineEmits(['selected', 'close-dialog'])

const srhForm = ref('')
const newMaterialList = ref([])
const ingrediantList = ref([])

const form = reactive({
  newMaterialCd: '',
  materialName: '',
  managerName: '',
})

const headers = [
    { title: '신원료코드',  key: 'newMaterialCd', width: 100},
    { title: '신원료명',    key: 'materialName', width: 200},
    { title: '품목코드',    key: 'itemCd',      width: 120},
    { title: '담당자',      key: 'regName', width:100},
]

const srhNewMaterialList = async () =>{
  try{
    const params = {
      ...form
    }

    newMaterialList.value = await ApiLab.getNewMaterialList(params)

  }catch(err){
    vError(err)
  }finally{
  }
}

const handleRowClick = async (event, item) =>{
  ingrediantList.value = await ApiLab.getNewMaterialListMapping(item.item.newMaterialCd)
  emit('selected', ingrediantList.value)
}
</script>

<style >
/* .custom-table table {
  table-layout: fixed !important;
} */

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
