<template>
  <v-breadcrumbs :items="['MES', '기본관리', '품목관리']"></v-breadcrumbs>
  <v-card
    >
    <template v-slot:title>
      <span class="font-weight-black">품목코드 등록</span>
    </template>
    <v-row>
      <v-col>
        <v-select
          v-model="form.itemType"
          label="품목구분"
          :items="itemTypeCds"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          />
        <v-select
          v-model="form.itemType"
          label="품목구분"
          :items="itemTypeCds"
          item-title="codeNm"
          item-value="code"
          variant="underlined"
          />
        <v-text-field
          v-model="form.displayValue"
          dense
          density="compact"
          label="입고단가"
          placeholder="입고단가를 입력해주세요"
          variant="underlined"
          @input="onInput"
          @blur="formatDisplay"
          @focus="removeFormat"
          />
        </v-col>
    </v-row>
  </v-card>
  <v-card
    >
    <template v-slot:title>
      <span class="font-weight-black">품목코드 상세등록</span>
    </template>
    <v-row>
      <v-col>

      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { unformatNumber, formatNumber } from '@/util/common'

//const inPirce = ref('') // 숫자만 저장 (ex. "10000")
const inPriceDisplayValue = ref('') // 표시용 값 (ex. "10,000")

const form = reactive({
  itemTypeCds : '',
  inPrice : '',
})

const onInput = (val) => {
  const digits = unformatNumber(val)
  form.inPirce = digits
  inPriceDisplayValue.value = formatNumber(digits)
}

const formatDisplay = () => {
  inPriceDisplayValue.value = formatNumber(form.inPirce)
}

const removeFormat = () => {
  inPriceDisplayValue.value = form.inPirce
}

</script>

<style scoped>

</style>
