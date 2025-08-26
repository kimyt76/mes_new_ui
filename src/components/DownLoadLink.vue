<!-- components/DownloadLink.vue -->
<template>
    <a
      v-if="fileName"
      href="#"
      :download="fileName"
      @click.prevent="downloadUrl"
      class="text-blue-600 underline"
      >{{ fileName }}
    </a>
</template>

<script setup>
import { download } from '@/util/filedownLoad';
import { defineProps } from 'vue';

const props = defineProps({
  fileName: {
    type: String,
    default: '',
    required: true
  },
  attachFileId: {
    type: [String, Number],
    default: '',
    required: true
  },
  seq: {
    type: [String, Number],
    default: 1,
    required: true
  }
})

console.log('attachFileId', props.attachFileId)
console.log('fileName', props.fileName)
console.log('seq', props.seq)

const downloadUrl = () =>{
  console.log('props.attachFileId', props.attachFileId)
  console.log('props.seq', props.seq)
  download(props.attachFileId, props.seq)
}
// 다운로드 URL 생성
//  const downloadUrl = computed(() => {
//    return `/files/download?filepath=${encodeURIComponent(props.filepath)}`
//  })
</script>

<style scoped>
/* 필요 시 커스텀 스타일 추가 */
</style>
