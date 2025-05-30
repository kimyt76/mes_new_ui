<template>
  <input type="file" accept="application/pdf" @change="previewPdf" />
  <iframe v-if="pdfSrc" :src="pdfSrc" width="100%" height="800px"></iframe>
</template>

<script setup>

import { ref } from 'vue'

const pdfSrc = ref('')

const previewPdf = (event) => {
  const file = event.target.files[0]

  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = () => {
      pdfSrc.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

</script>

<style lang="scss" scoped>

</style>
