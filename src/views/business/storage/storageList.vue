<template>
<v-breadcrumbs :items="['MES', '영업관리', '창고관리']"></v-breadcrumbs>

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
            label="창고명"
            placeholder="청고명을 입력해주세요"
            variant="underlined"
              />
          <v-text-field
            v-model="form.userId"
            dense
            label="창고명"
            placeholder="청고명을 입력해주세요"
            variant="underlined"
              />
        </div>
      </v-col>
    </v-row>
  </v-form>
</v-card>


</template>

<script setup>

</script>

<style scoped>

</style>
