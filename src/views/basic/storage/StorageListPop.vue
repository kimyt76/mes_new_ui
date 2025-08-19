<template>
<v-card class="pa-3">
  <v-card-item title="창고정보 조회"></v-card-item>
  <v-row>
    <v-col style="height: 20px; padding: 3px;">
      <v-form ref="srhForm" @submit.prevent="srhStorageList">
      <div class="d-flex ga-4 ml-4">
        <v-select
          v-model="form.storageType"
          label="창고구분"
          :items="storageTypes"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          />
        <v-text-field
          v-model="form.storageName"
          label="창고명"
          variant="underlined"
          density="compact"
          placeholder="창고명을 입력해주세요"
          />
        <v-btn
          color = "#EFEBE9"
          text="조회"
          class="mt-3"
          type="submit"
          />
        <v-btn
          class="mt-3 mr-3"
          text="초기화"
          @click="srhForm.reset()"
          />
      </div>
      </v-form>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="storageList"
        :loading="loading"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        :items-per-page="25"
        style="height: 500px;"
        >
  <template v-slot:headers="{ columns }">
    <tr>
      <th
        v-for="column in columns"
        :key="column.key"
        class="custom-header"
        style="height: 30px;"
        :style="{textAlign: 'center'} "
        >
        {{ column.title }}
      </th>
    </tr>
  </template>
  <template #item="{ item }">
    <tr style="height: 30px;">
      <td style="width: 80px; height: 30px; text-align: center; text-decoration: underline;  cursor: pointer;" @click="rowSelect(item.storageCd, item.storageName )" >{{item.storageCd}}</td>
      <td style="width: 200px; height: 30px;text-align: left;  text-decoration: underline;  cursor: pointer;" @click="rowSelect(item.storageCd, item.storageName )" >{{item.storageName}}</td>
      <td style="width: 150px; height: 30px; text-align: center;">{{item.storageTypeName}}</td>
    </tr>
  </template>
</v-data-table>
    </v-col>
  </v-row>
  <v-row class="mt-10" style="height: 70px;">
    <v-col>
      <div class="d-flex ga-4 justify-end">
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
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { onMounted, reactive, ref } from 'vue';

const { vError } = useAlertStore()
const emit = defineEmits(['selected', 'close-dialog'])

const loading = ref(false)
const storageList = ref([])
const storageTypes = ref([])

const form = reactive({
  storageType: '',
  storageName : '',
})

const headers = ref([
  { title: '기안일자',  key: 'draftDate',   align: 'center'},
  { title: '문서번호',  key: 'orderNm',     align: 'center'},
  { title: '고객사명',  key: 'customerNm',  align: 'center'},
])


const rowSelect = (cd, nm) =>{
  emit('selected', cd, nm)
  emit('close-dialog')
}

onMounted( async () => {
  storageTypes.value = await ApiCommon.getCodeList('storage_type')

})

const srhStorageList = async () =>{
  loading.value = true

  try {
    const params = {
      ...form
    }

    storageList.value = await ApiBase.getStorageList(params)

  }catch(err){
    vError(err)
  }finally{
    loading.value = false
  }
}

</script>

<style  scoped>
@import '@/assets/css/main.css';
</style>
