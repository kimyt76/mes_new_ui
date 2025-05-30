<template>
  <v-file-input
    v-model="file"
    multiple
    label="첨부파일"
    prepend-icon="mdi-paperclip"
    show-size
  ></v-file-input>
</template>

<script setup>
const file = defineModel()
// defineProps(['modelValue'])
// defineEmits(['update:modelValue'])

</script>

<!-- <template>
  <v-container>
    <v-form @submit.prevent="submitFiles">
      <v-file-input
        v-model="files"
        multiple
        label="파일 선택"
        prepend-icon="mdi-paperclip"
        show-size
      ></v-file-input>
      <v-btn type="submit" color="primary">업로드</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { ApiCommon } from '@/api/apiCommon'

const files = ref([])
const attachFileId = ref('')

const submitFiles = async () => {
  const formData = new FormData()
  files.value.forEach(file => {
    formData.append('files', file)  // name은 Spring의 파라미터 이름과 일치해야 함
  })

  try {
    attachFileId.value = ApiCommon.uploadFile(formData)
    alert('업로드 성공!')
  } catch (err) {
    console.error(err)
    alert('업로드 실패')
  }
}
</script> -->
