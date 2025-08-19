<!-- components/DownloadLink.vue -->
<template>
    <a :href="downloadUrl" :download="fileName" class="text-blue-600 underline" target="_blank" rel="noopener">
      {{ fileName }}
    </a>
</template>

<script setup>
import { computed } from 'vue'
import { download } from '@/util/filedownLoad';

const props = defineProps({
  filepath: {
    type: String,
    default: '',
    required: true
  },
  fileName: {
    type: String,
    default: '',
    required: true
  },
  attachFileId: {
    type: String,
    default: '',
    required: true
  },
  seq: {
    type: Number,
    default: 1,
    required: true
  }
})

download(props.attachFileId, props.seq)
// 다운로드 URL 생성
// const downloadUrl = computed(() => {
//   //return `/files/download?filepath=${encodeURIComponent(props.filepath)}`

// })
</script>

<style scoped>
/* 필요 시 커스텀 스타일 추가 */
</style>
