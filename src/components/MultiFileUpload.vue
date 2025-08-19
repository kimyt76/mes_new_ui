<template>
  <!-- 커스텀 파일 선택 버튼 -->
  <v-btn @click="selectFiles">
    <v-icon start>mdi-paperclip</v-icon>
    파일 선택
  </v-btn>
  <input
    ref="fileInput"
    type="file"
    multiple
    style="display: none"
    @change="handleFileChange"
    accept="image/*,.pdf,.doc,.docx"
  />

  <!-- 파일 목록 표시 -->
  <v-list lines="one" density="compact" v-if="fileList.length > 0">
    <v-list-item
      v-for="(file, index) in fileList"
      :key="file.name + file.size"
      :title="`${file.name} (${(file.size / 1024).toFixed(1)} KB)`"
      inline
      >
      <template #append>
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
import { ref } from 'vue';

const fileInput = ref(null);
const fileList = ref([]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

// 사용자 클릭 시 input 엘리먼트 클릭
const selectFiles = () => {
  fileInput.value?.click();
}

// 파일 변경 핸들링 (기존 파일 유지 + 중복 제거)
const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files);

  newFiles.forEach((file) => {
    const isDuplicate = fileList.value.some(
      (f) => f.name === file.name && f.size === file.size
    );
    if (!isDuplicate) {
      fileList.value.push(file);
    }
  });

  emit('update:modelValue', fileList.value);
  // 같은 파일 다시 선택할 수 있도록 input 초기화
  event.target.value = '';

}

// 파일 제거
const removeFile = (index) => {
  fileList.value.splice(index, 1);
  emit('update:modelValue', fileList.value);
}

// 다운로드
const downloadFile = (file) => {
  if (file.url) {
    // 서버에서 기존 파일일 경우
    window.open(file.url, '_blank')
  } else {
    // 새로 추가된 File 객체일 경우
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }
}

</script>
