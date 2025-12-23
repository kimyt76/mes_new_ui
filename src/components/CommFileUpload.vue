<template>
  <div class="comm-file-upload justify-start">
    <FileUpload
        ref="uploader"
        mode="basic"
        chooseLabel="파일선택"
        name="files[]"
        :multiple="multiple"
        :accept="accept"
        :maxFileSize="maxFileSize"
        :showUploadButton="false"
        :showCancelButton="false"
        :customUpload="true"
        :disabled="disabled"
        :showFileList="false"
        @select="onFileSelect"
    >
    </FileUpload>
    <!-- 아래: 우리가 따로 만든 파일 리스트 -->
    <DataTable
      :value="displayFiles"
      class="mt-3"
      :showGridlines="true"
      size="small"
    >
      <Column header="파일명" field="fileName">
        <template #body="slotProps">
          <div class="flex align-items-center gap-2">
            <i :class="fileIcon(slotProps.data.fileName)" />
            <span>{{ slotProps.data.fileName }}</span>
            <span v-if="slotProps.data.flag === 'N'" class="text-xs text-primary">(신규)</span>
            <span v-else-if="slotProps.data.flag === 'D'" class="text-xs text-red-500 line-through">(삭제 예정)</span>
          </div>
        </template>
      </Column>

      <Column header="크기" field="fileSize" style="width: 120px">
        <template #body="slotProps">
          <span v-if="slotProps.data.fileSize">
            {{ formatFileSize(slotProps.data.fileSize) }}
          </span>
          <span v-else>-</span>
        </template>
      </Column>

      <Column header="기능" style="width: 180px">
        <template #body="slotProps">
          <div class="flex gap-2 justify-content-center">
            <!-- 다운로드 -->
            <Button
              v-if="slotProps.data.flag !== 'N' && slotProps.data.flag !== 'D'"
              label="다운로드"
              icon="pi pi-download"
              class="p-button-text p-button-sm"
              @click="onDownload(slotProps.data)"
            />
            <Button
              v-else
              label="다운로드"
              icon="pi pi-download"
              class="p-button-text p-button-sm p-button-secondary"
              disabled
            />

            <!-- 삭제 -->
            <Button
              v-if="!disabled"
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              @click="onRemove(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>


<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { useAlertStore } from '@/stores/alert'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FileUpload from 'primevue/fileupload'
import { computed, ref } from 'vue'

const { vError } = useAlertStore()

/**
 * v-model: 파일 배열
 *  - 기존 파일: { attachFileId, seq, fileName, fileSize, flag: 'S' }
 *  - 신규 파일: { fileName, fileSize, flag: 'N', file: File }
 *  - 삭제 예정: flag: 'D'
 */

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 다중 업로드 여부
  multiple: {
    type: Boolean,
    default: true,
  },
  // accept 문자열 예: ".pdf,.xlsx,.xls,.png,.jpg"
  accept: {
    type: String,
    default: '',
  },
  maxFileSize: {
    type: Number,
    default: 1024 * 1024 * 50, // 50MB
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 다운로드 URL (ex: '/api/lab/file/download')
  // 실제로는 `${downloadUrl}?attachFileId=xxx&seq=yyy` 형태로 호출
  downloadUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'error', 'downloaded'])
const uploader = ref(null)
// 화면에 보여줄 파일 목록 (삭제 플래그도 같이 보여주고 싶으면 그대로 사용)
const displayFiles = computed(() => props.modelValue ?? [])

// 파일 선택 시: 신규 파일을 modelValue에 push (flag: 'N')
const onFileSelect = (event) => {
  const files = event.files || []
  const current = props.modelValue ?? []
  const newList = [...current]

  files.forEach((f) => {
    const exists = current.some(
      (e) =>
        e.fileName === f.name &&
        e.fileSize === f.size &&
        e.flag !== 'D'
    )
    if (!exists) {
      newList.push({
        fileName: f.name,
        fileSize: f.size,
        flag: 'N',
        file: f,
      })
    }
  })

  emit('update:modelValue', newList)

  uploader.value?.clear()
}

const onRemove = (file) => {
  const list = [...(props.modelValue ?? [])]
  const idx = list.indexOf(file)
  if (idx === -1) return

  if (file.flag === 'S') {
    list[idx] = { ...file, flag: 'D' }
  } else if (file.flag === 'N') {
    list.splice(idx, 1)
  }

  emit('update:modelValue', list)
}

// 파일 크기 표시
const formatFileSize = (size) => {
  if (!size && size !== 0) return ''
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  )
}

// 파일 아이콘 선택 (단순 예시)
const fileIcon = (fileName = '') => {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pi pi-file-pdf text-red-500'
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls'))
    return 'pi pi-file-excel text-green-500'
  if (lower.endsWith('.doc') || lower.endsWith('.docx'))
    return 'pi pi-file-word text-blue-500'
  if (lower.match(/\.(jpg|jpeg|png|gif)$/)) return 'pi pi-image text-primary'
  return 'pi pi-file'
}

// 다운로드
const onDownload = async (data) => {
  let attachFileId = data.attachFileId
  let seq = data.seq

  try {
    const res = await ApiCommon.download(attachFileId, seq)

    const cd = res.headers?.['content-disposition']
    const ct = res.headers?.['content-type'] || 'application/octet-stream'

    const fileName =
      decodeURIComponent(getFileNameFromHeader(cd) || 'downloaded_file')

    const blob = new Blob([res.data], { type: ct })
    const blobUrl = window.URL.createObjectURL(blob)

    // ✅ PDF는 새 탭
    const isPdf =
      ct.includes('application/pdf') || fileName.toLowerCase().endsWith('.pdf')

    if (isPdf) {
      window.open(blobUrl, '_blank')
      // 새탭은 열릴 시간을 줘야 함
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 30000)
      return
    }

    // ✅ 그 외는 다운로드
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    vError('파일 다운로드 중 오류가 발생했습니다.')
  }
}

const getFileNameFromHeader = (contentDisposition) => {
  if (!contentDisposition) return null

  // RFC 5987: filename*=UTF-8''encodedName
  const m1 = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)
  if (m1?.[1]) return m1[1]

  // filename="name.ext"
  const m2 = contentDisposition.match(/filename\s*=\s*"?([^"]+)"?/i)
  return m2?.[1] || null
}

</script>

<style scoped>
.comm-file-upload :deep(.p-fileupload-buttonbar) {
  padding-block: 0.1rem;
}

.comm-file-upload :deep(.p-datatable) {
  font-size: 0.9rem;
}

.drop-zone {
  height: 15px;                 /* 원하는 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.comm-file-upload :deep(.p-fileupload-content) {
  padding: 0;
}

/* ✅ No file chosen 텍스트 숨기기 (input의 값 부분) */
.comm-file-upload :deep(.p-fileupload input[type="file"]) {
  font-size: 0;  /* 전체 텍스트를 안 보이게 */
}

/* ✅ 버튼 텍스트는 다시 보이게 (Chrome, Edge, 최신 브라우저) */
.comm-file-upload :deep(.p-fileupload input[type="file"]::file-selector-button) {
  font-size: 14px;      /* 버튼 글자 크기 복구 */
  padding: 0.35rem 0.75rem;
}

/* ✅ WebKit 계열에서 파일명 텍스트 강제로 숨기기 (추가 안전장치) */
.comm-file-upload :deep(.p-fileupload input[type="file"]::-webkit-file-upload-text) {
  visibility: hidden;
}
.comm-file-upload :deep(.p-fileupload-choose-button + span) {
  display: none !important;
}
</style>

