<!-- components/DownloadLink.vue -->
<template>
    <a :href="downloadUrl" :download="fileName" class="text-blue-600 underline" target="_blank" rel="noopener">
      {{ fileName }}
    </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filepath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
})

// 다운로드 URL 생성
const downloadUrl = computed(() => {
  return `/files/download?filepath=${encodeURIComponent(props.filepath)}`
})
</script>

<style scoped>
/* 필요 시 커스텀 스타일 추가 */
</style>
