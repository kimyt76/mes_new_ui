<template>
<v-card class="pa-3">
  <v-card-item title="품목코드 조회"></v-card-item>
  <v-row>
    <v-col style="height: 20px; padding: 3px;">
      <v-form ref="srhForm" @submit.prevent="srhCustomerList">
        <div class="d-flex ga-4 ml-4">
          <v-select
            v-model="form.customerCategory"
            label="거래유형"
            :items="customerItems"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            />
          <v-select
            v-model="form.workCategory"
            label="업무유형"
            :items="workItems"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
          />
          <v-text-field
            v-model="form.businessCd"
            dense
            label="사업자번호"
            placeholder="사업자번호를 입력해주세요"
            variant="underlined"
            />
          <v-text-field
            v-model="form.customerNm"
            dense
            label="거래처명"
            placeholder="거래처명을 입력해주세요"
            variant="underlined"
            />
        </div>
      </v-form>
    </v-col>
  </v-row>
</v-card>
</template>

<script setup>

</script>

<style scoped>

</style>
