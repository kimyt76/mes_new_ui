<template>
<v-breadcrumbs :items="['MES', '시스템관리', '사용자 관리']"></v-breadcrumbs>

<v-card
  class="pa-3"
  color="blue-grey-lighten-5"
  >
  <v-form ref="srhForm" @submit.prevent="srhUserList">
    <v-row
      >
      <v-col
        style="background-color: #ECEFF1"
        >
        <div class="d-flex ga-4"> <!-- ga-4 는 Vuetify gap 클래스 -->
          <v-text-field
            v-model="form.userId"
            dense
            label="사용자 이름"
            placeholder="사용자 이름 입력해주세요"
            variant="underlined"
              />
          <v-text-field
            v-model="form.jobPosition"
            dense
            label="직급"
            placeholder="직급을 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.deptNm"
            dense
            label="부서"
            placeholder="부서를 입력해주세요"
            variant="underlined"
            />
          <v-select
            v-model="form.useYn"
            label="재직여부"
            :items="items"
            item-title="text"
            item-value="value"
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
            >초기화</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</v-card>
  <v-row
    class="mb-1"
    >
  <v-col>
    <div class="d-flex ga-4 justify-end">
    <v-btn
        dense
        color = "brown-lighten-4"
        class="mt-3"

        >신규</v-btn>
      <v-btn
        dense
        class="mt-3 mr-3"

        >엑셀</v-btn>
     </div>
  </v-col>
</v-row>
<v-sheet border rounded>
<v-data-table
  no-data-text="데이터가 없습니다."
  loading-text="조회중입니다 잠시만 기다려주세요"
  :items-per-page="25"
  >
  <!-- <template v-slot:headers="{ columns }">
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
  <template v-slot:item="{ item }">
    <tr>
      <td  @click="openPop(item.userId)">{{ item.userId}}</td>
      <td>{{ item.memberNm}}</td>
      <td>{{ item.deptNm}}</td>
      <td>{{ item.jobPosition}}</td>
      <td>{{ item.phone}}</td>
      <td>{{ item.email}}</td>
      <td>{{ item.useYn === 'Y' ? '재직' : '퇴직'}}</td>
      <td>{{ item.etc }}</td>
    </tr>
  </template> -->

</v-data-table>
</v-sheet>

<v-dialog  v-model="dialog" max-width="800px" persistent>
    <!-- <UserDtlPop
      :mode="mode"
      :id="id"
      :title="title"
      @saved="handleSaved"
      @close-dialog="dialog = false" /> -->
  </v-dialog>

</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
