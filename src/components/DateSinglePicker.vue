<template>
  <v-row>
    <v-col>
      <div class="d-flex ga-2">
        <!-- 날짜 입력창 -->
        <v-text-field
          v-model="formattedDate"
          :label="title"
          density="compact"
          style="max-width: 200px;"
          @click="onTextFieldClick"
        />
        <!-- 캘린더 아이콘 메뉴 -->
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          location="bottom start"
        >
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="calendar-icon-btn" >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>

          <v-date-picker
            v-model="modelValue"
            :hide-header="true"
            @update:model-value="onDateSelected"
          />
        </v-menu>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'

// Props
const props = defineProps({
  title: String
})

// 오늘 날짜 (초기값)
const today = new Date()

// defineModel로 부모와 양방향 바인딩
const modelValue = defineModel()

// 내부 상태
const menu = ref(false)

// 포맷된 날짜 (문자열)
const formattedDate = computed(() =>
  modelValue.value ? format(new Date(modelValue.value), 'yyyy-MM-dd') : ''
)

// 클릭 시 빈 문자열로 (선택)
const onTextFieldClick = () => {
  formattedDate.value = ''
}

// 날짜 선택 시
const onDateSelected = (value) => {
  const formatted = format(new Date(value), 'yyyy-MM-dd')
  modelValue.value = formatted
  menu.value = false
}

// 초기값이 없으면 오늘 날짜로
onMounted(() => {
  if (!modelValue.value) {
    modelValue.value = today.toISOString().slice(0, 10) // yyyy-MM-dd 형식
  }
})
</script>

<style scoped>

</style>
