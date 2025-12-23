<template>
    <v-file-input
      v-model="selectedFile"
      label="파일 선택"
      prepend-icon="mdi-upload"
      density="compact"
    />
</template>
<script setup>
const selectedFile = defineModel()

</script>
<!-- <template>
  <v-container>
    <v-file-input
      v-model="selectedFile"
      label="파일 선택"
      prepend-icon="mdi-upload"
      show-size
      accept="*"
    />

    <v-btn
      :disabled="!selectedFile"
      @click="uploadFile"
      color="primary"
      class="mt-3"
    >
      업로드
    </v-btn>

    <p v-if="uploadResult" class="mt-3">{{ uploadResult }}</p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { ApiCommon } from '@/api/apiCommon'

// Emits (필요 시 부모에게 결과 전달)
const emit = defineEmits(['uploaded'])

const selectedFile = ref(null)
const uploadResult = ref('')

const uploadFile = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)


  try {
    ApiCommon.uploadFile(formData).then(res => {
      emit('uploaded', res.data) // 부모에게 성공 알림
      uploadResult.value = res.data
    })

  } catch (err) {
    uploadResult.value = '업로드 실패'
    console.error(err)
  }
}
</script> -->
