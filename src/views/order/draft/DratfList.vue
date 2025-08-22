<template>
<v-breadcrumbs
    :items="['MES', '수주관리', '기안서관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="srhDraftList">
        <v-col class="d-flex ga-4">
          <!-- <v-date-input
            v-model="form.draftDate"
            label="기안일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 150px;"
          /> -->
          <v-text-field
            v-model="form.itemName"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            density="compact"
            style="width: 180px;"
            />
          <v-text-field
              v-model="form.customerName"
              density="compact"
              label="고객사명"
              placeholder="고객사명을 입력해주세요"
              variant="underlined"
              style="width: 180px;"
              />
          <v-text-field
            v-model="form.draftNaem"
            label="기안자"
            placeholder="기안자명을 입력해주세요"
            variant="underlined"
            density="compact"
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
        @click="handleRowClick"
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
        :items="draftList"
        :items-per-page="15"
        no-data-text="데이터가 없습니다."
        loading-text="조회중입니다 잠시만 기다려주세요"
        density="compact"
        fixed-header
        height="690px"
        @click:row="handleRowClick"
        >
        <template v-slot:headers="{ columns }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="custom-header"
              style="height: 40px;"
              :style="{textAlign: 'center'} "
              >
              {{ column.title }}
            </th>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';
import { ApiOrder } from '@/api/apiOrders';
import { useRouter } from 'vue-router';


const router = useRouter()

const loading = ref(false)
const draftList = ref([])
const form = reactive({
  //draftDate: '',
  itemName: '',
  customerName: '',
  draftNaem: '',
})

 const headers = ref([
   { title: '문서번호',  key: 'orderName',     align: 'center', width: '120px'},
   { title: '품목명',    key: 'itemName',    align: 'start', width: '400px'},
   { title: '고객사명',  key: 'customerName',  align: 'start', width: '250px'},
   { title: '기안일자',  key: 'draftDate',   align: 'center', width: '110px'},
   { title: '기안자',   key: 'draftName',     align: 'center', width: '100px'},
])

const handleRowClick = (item, index ) => {
  console.log('item',item)
  console.log('draftId',item.draftId)
  if ( isEmpty(item.draftId)) {
    router.push({ name: 'DraftNew'})
   }

  // router.push({ name: 'DraftDetail', params: { id: item.item.draftId } })
}

const srhDraftList = async () => {
  loading.value = true

  const params = {
    ...form
  }

  draftList.value = await ApiOrder.getDraftList(params)

  loading.value = false
}

onMounted( () => {
  srhDraftList()
})


const excel = () => {
  exportToExcel(headers, draftList.value, '기안서_목록')
}


</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
