<template>
<v-breadcrumbs
    :items="['MES', '수주관리', '기안서관리']"
    class="custom-breadcrumbs"
    />
  <v-card class="pa-1" style="height: 60px;">
    <v-card-text >
      <v-row>
      <v-form ref="srhForm" @submit.prevent="searchList">
        <v-col class="d-flex ga-4">
          <v-date-input
            v-model="form.draftDate"
            label="기안일자"
            :display-format="formatDate"
            density="compact"
            variant="underlined"
            style="width: 150px;"
          />
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
        @click="go"
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
import { VDateInput } from 'vuetify/labs/VDateInput'
import { isEmpty, formatComma, todayKST, formatDate } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';
import { ApiOrder } from '@/api/apiOrders';

const loading = ref(false)
const draftList = ref([])
const form = reactive({
  draftDate: '',
  itemName: '',
  customerName: '',
  draftNaem: '',
})

 const headers = ref([
    { title: '기안일자',  key: 'draftDate',   align: 'center'},
    { title: '문서번호',  key: 'orderName',     align: 'center'},
    { title: '고객사명',  key: 'customerName',  align: 'center'},
    { title: '품목명',    key: 'itemName',    align: 'center'},
    { title: '기안자',    key: 'draftName',     align: 'center'},
])

onMounted( () => {
  form.draftDate = todayKST()
  searchList()


})

const searchList = async () => {
  loading.value = true

  const params = {
    ...form
  }

  draftList.value = await ApiOrder.getDraftList(params)

  loading.value = false
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
