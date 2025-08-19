<template>
  <!-- 커스텀 파일 선택 버튼 -->
  <v-btn @click="selectFiles"
    style="background-color: #CFD8DC ; width: 150px;"
    >
    <v-icon start>mdi-paperclip</v-icon>
    파일 선택
  </v-btn>

  <!-- 숨겨진 input -->
  <input
    ref="fileInput"
    type="file"
    multiple
    style="display: none"
    @change="handleFileChange"
  />

  <!-- 파일 목록 표시 -->
  <v-list lines="one" v-if="fileList.length > 0">
    <v-list-item
      v-for="(file, index) in fileList.filter( f => f.flag !== 'D')"
      :key="index"
      :title="`${file.name || file.fileName} (${((file.size || file.fileSize) / 1024).toFixed(1)} KB)`"
      style="min-height: 18px"
    >
      <template #append>
        <!-- 다운로드 -->
        <v-btn
          v-if="file.url || isRealFile(file) || file.filePath"
          icon="mdi-download"
          size="x-small"
          variant="text"
          @click="downloadFile(file)"
        />
        <!-- 삭제 -->
        <v-btn
          icon="mdi-delete"
          size="x-small"
          variant="text"
          @click="removeFile(index)"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { download } from '@/util/filedownLoad';

// ==========================
// Props / Emits
// ==========================
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const isRealFile = (file) => typeof File !== 'undefined' && file instanceof File

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (val) => {
    if (val && val.length > 0 && !val.some(f => f.flag)) {
      // 최초 세팅: flag가 없는 경우에만 'S'로 초기화
      val.forEach(f => f.flag = 'S')
    }
  },
  { immediate: true }
)

// ==========================
// Refs & Computed
// ==========================
const fileInput = ref(null)

const fileList = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// ==========================
// Methods
// ==========================

// 파일 선택 버튼 클릭 시 input 클릭
const selectFiles = () => {
  fileInput.value?.click()
}

// 파일 선택 후 변경 처리
const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files)

  newFiles.forEach((file) => {
    const isDuplicate = fileList.value.some(
      (f) =>
        (f.name || f.fileName) === file.name &&
        (f.size || f.fileSize) === file.size
    )
    if (!isDuplicate) {
      fileList.value.push({
        file,
        fileName: file.name,
        fileSize: file.size,
        flag: 'N'  // 신규 파일 표시
      })
    }
  })

  emit('update:modelValue', fileList.value)
  event.target.value = '' // 같은 파일 다시 선택 가능하도록 초기화
}

// 파일 제거
const removeFile = (index) => {
  const file = fileList.value[index]
  if (file.flag !== 'N') {
    // 기존 파일이면 삭제 플래그만 설정 (유지)
    fileList.value[index].flag = 'D'
  } else {
    // 새로 추가한 파일은 그냥 리스트에서 제거
    fileList.value.splice(index, 1)
  }
}

// 다운로드 처리
const downloadFile = async (file) => {

  console.log('file', file)
  if ( file.filePath) {
    download(file.attachFileId, file.seq)

  } else if (typeof File !== 'undefined' && file instanceof File) {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }
}
</script>
