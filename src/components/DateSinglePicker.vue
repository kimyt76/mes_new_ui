<template>
  <v-row>
    <v-col>
      <div class="d-flex ga-2 mt-2">
         <!-- 텍스트 필드 (메뉴 트리거 아님) -->
    <v-text-field
      v-model="formattedToDate"
      :label= "props.title"
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
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  title: String,
})

const toDate = defineModel('toDate')

// 종료일 관련
const toDateVal = ref(toDate.value || '')
const formattedToDate = ref(format(new Date(), 'yyyy-MM-dd'))
const toMenu = ref(false)

// 종료일 - 텍스트필드 클릭
const onToTextFieldClick = () => {
  formattedToDate.value = ''
}

// 종료일 - 날짜 선택
const onToDateSelected = (value) => {
  toDateVal.value = value
  formattedToDate.value = format(new Date(value), 'yyyy-MM-dd')
  toMenu.value = false
  toDate.value = formattedToDate.value
}

watch(toDateVal, (newVal) => {
  if (newVal) {
    formattedToDate.value = format(new Date(newVal), 'yyyy-MM-dd')
  }
})

watchEffect(() => {
  if (toDate.value) {
    toDateVal.value = toDate.value
    formattedToDate.value = format(new Date(toDate.value), 'yyyy-MM-dd')
    toDate.value = formattedToDate.value
  }
})
</script>

<style scoped>

</style>
