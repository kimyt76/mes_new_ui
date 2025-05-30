<!-- src/components/DateRangePicker.vue -->
<template>
  <div class="d-flex align-center date-picker-wrapper mt-2">
    <!-- 텍스트 필드 (메뉴 트리거 아님) -->
    <v-text-field
      v-model="formattedFromDate"
      label="시작일"
      density="compact"
      width="120px"
      height="40px"
      @click="onFromTextFieldClick"
      style="max-width: 120px;"
    />
    <!-- 메뉴 트리거는 아이콘만 -->
    <v-menu
      v-model="fromMenu"
      :close-on-content-click="false"
      location="bottom start"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          class="calendar-icon-btn"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>

      <v-date-picker
        v-model="fromDateVal"
        :hide-header="true"
        @update:model-value="onFromDateSelected"
      />
    </v-menu>

    <span class="mr-2 mb-3">~</span>

<!-- 종료일 -->
    <v-text-field
      v-model="formattedToDate"
      label="종료일"
      density="compact"
      width="120px"
      @click="onToTextFieldClick"
      style="max-width: 200px;"
    />
    <!-- 메뉴 트리거는 아이콘만 -->
    <v-menu
      v-model="toMenu"
      :close-on-content-click="false"
      location="bottom start"
      offset-y
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          class="calendar-icon-btn"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>

      <v-date-picker
        v-model="toDateVal"
        :hide-header="true"
        @update:model-value="onToDateSelected"
      />
    </v-menu>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { format } from 'date-fns'

const fromDate = defineModel('fromDate')
const toDate = defineModel('toDate')

// 시작일 관련
const fromDateVal = ref(fromDate.value || '')
const formattedFromDate = ref(format(new Date(), 'yyyy-MM-dd'))
const fromMenu = ref(false)

// 종료일 관련
const toDateVal = ref(toDate.value || '')
const formattedToDate = ref(format(new Date(), 'yyyy-MM-dd'))
const toMenu = ref(false)

// 시작일 - 텍스트필드 클릭
const onFromTextFieldClick = () => {
  formattedFromDate.value = ''
}

// 종료일 - 텍스트필드 클릭
const onToTextFieldClick = () => {
  formattedToDate.value = ''
}

// 시작일 - 날짜 선택
const onFromDateSelected = value => {
  fromDateVal.value = value
  formattedFromDate.value = format(new Date(value), 'yyyy-MM-dd')
  fromMenu.value = false
  fromDate.value = formattedFromDate.value
}

// 종료일 - 날짜 선택
const onToDateSelected = (value) => {
  toDateVal.value = value
  formattedToDate.value = format(new Date(value), 'yyyy-MM-dd')
  toMenu.value = false
  toDate.value = formattedToDate.value
}

// 시작일 변경 감지
watch(fromDateVal, (newVal) => {
  //console.log('aa' , formattedFromDate.value = format(new Date(newVal), 'yyyy-MM-dd') )
  if (newVal) {
    formattedFromDate.value = format(new Date(newVal), 'yyyy-MM-dd')
  }
})

// 종료일 변경 감지
watch(toDateVal, (newVal) => {
  if (newVal) {
    formattedToDate.value = format(new Date(newVal), 'yyyy-MM-dd')
  }
})

watchEffect(() => {
  if (fromDate.value) {
    fromDateVal.value = fromDate.value
    formattedFromDate.value = format(new Date(fromDate.value), 'yyyy-MM-dd')
    fromDate.value = formattedFromDate.value
  }

  if (toDate.value) {
    toDateVal.value = toDate.value
    formattedToDate.value = format(new Date(toDate.value), 'yyyy-MM-dd')
    toDate.value = formattedToDate.value
  }
})
</script>

<style>
.date-picker-wrapper {
  border-radius: 6px;
  overflow: hidden;
  max-width: fit-content;
  display: flex;
  align-items: flex-end; /* 언더라인 기준 정렬 */
}
.no-right-border .v-field__outline__end {
  display: none;
}
.calendar-icon-btn {
  margin-bottom: 15px;
  height: 40px; /* 원하는 높이 */
  width: 40px;  /* 너비도 같이 맞춰야 정사각형 아이콘 유지 */
  min-width: 40px; /* Vuetify 기본값 무시 */
  border-radius: 0;
  /* background-color: #f5f5f5; */

}
.calendar-icon-btn .v-icon {
  font-size: 25px;
}
</style>
