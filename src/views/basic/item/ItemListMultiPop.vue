<template>
  <v-breadcrumbs :items="['MES', '기본관리', '품목관리']"></v-breadcrumbs>
  <v-card class="pa-3" style="height: 80px;">
    <v-row>
      <v-col>
        <v-form ref="srhForm" @submit.prevent ='srhItemList'>
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-select
            v-model="form.itemType"
            label="품목구분"
            :items="itemTypeCds"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            />
          <v-text-field
            v-model="form.itemNm"
            dense
            density="compact"
            label="품목명"
            placeholder="품목명을 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.itemCd"
            dense
            density="compact"
            label="품목코드"
            placeholder="품목코드를 입력해주세요"
            variant="underlined"
            />
            <v-btn
            dense
            color = "#EFEBE9"
            class="mt-3"
            type="submit"
            >조회</v-btn>
          <v-btn
            dense
            class="mt-3"
            @click="reset"
            >초기화</v-btn>
          </div>
        </v-form>
        </v-col>
    </v-row>
  </v-card>
<v-sheet border rounded>
<v-data-table
  :headers="headers"
  :items="itemList"
  :loading="loading"
  show-select
  no-data-text="데이터가 없습니다."
  loading-text="조회중입니다 잠시만 기다려주세요"
  :items-per-page="25"
  v-model:selected="itemSelected"
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
</v-sheet>
</template>


<script setup>
import { ref } from 'vue';

const itemSelected = ref([])

</script>

<style lang="scss" scoped>

</style>
