<template>
  <Breadcrumb :home="home" :model="items" />

  <form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
      <template #start>
        <div class="flex flex-wrap items-center gap-2 w-full">

          <!-- 구역(공장) -->
          <FloatLabel variant="on">
            <Select
              v-model="form.areaCd"
              :options="areaCds"
              optionLabel="codeNm"
              optionValue="code"
              style="width: 150px"
            />
            <label for="on_label1">구역(공장)</label>
          </FloatLabel>

          <!-- 창고 -->
          <FloatLabel variant="on">
            <Select
              v-model="form.storageCd"
              :options="storageCds"
              optionLabel="codeNm"
              optionValue="code"
              style="width: 150px"
            />
            <label for="on_label1">창고</label>
          </FloatLabel>

          <!-- 저울별칭 -->
          <FloatLabel variant="on">
            <InputText v-model="form.scaleNickname" style="width: 150px" />
            <label for="on_label">저울별칭</label>
          </FloatLabel>

          <!-- 사용여부 -->
          <FloatLabel variant="on">
            <Select
              v-model="form.useYn"
              :options="useYns"
              optionLabel="codeNm"
              optionValue="code"
              style="width: 150px"
            />
            <label for="on_label1">사용여부</label>
          </FloatLabel>

          <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
        </div>
      </template>
    </Toolbar>
  </form>

  <div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')" />
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
  </div>

  <div>
    <DataTable
      ref="dt"
      :value="scaleList"
      paginator
      :rows="20"
      :rowsPerPageOptions="[20, 30, 40]"
      scrollHeight="650px"
      scrollable
      showGridlines
      class="my-table"
    >
      <Column field="areaName" header="구역(공장)" :style="{ width: '130px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />
      <Column field="storageName" header="작업처" :style="{ width: '180px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />

      <Column field="scaleNickname" header="저울별칭" :style="{ width: '300px', textAlign: 'center' }" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
        <template #body="slotProps">
          <div @click="selectRowClick(slotProps.data.scaleId)" style="text-decoration: underline; cursor: pointer;">
            {{ slotProps.data.scaleNickname }}
          </div>
        </template>
      </Column>

      <Column field="scaleCd" header="저울코드" :style="{ width: '180px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />
      <Column field="scaleName" header="저울명" :style="{ width: '250px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />
      <Column field="etc" header="비고" :style="{ width: '300px', textAlign: 'left' }" :pt="{ columnHeaderContent: 'justify-center' }" />
    </DataTable>
  </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiSystems } from '@/api/apiSystem'
import { isEmpty } from '@/util/common'
import { exportToExcel } from '@/util/exportToExcel'
import { useDialog } from 'primevue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ScalePop from './ScalePop.vue'

const dialog = useDialog()
const dt = ref(null)
const scaleList = ref([])
const areaCds = ref([])
const useYns = ref([])
const storageAllRaw = ref([])

//areaCd에 따라 창고 옵션 자동 변경(computed)
const storageCds = computed(() => {
  const area = form.areaCd
  const list = storageAllRaw.value ?? []

  const filtered = area ? list.filter(x => x.areaCd === area) : list
  // (선택) '전체/선택' 넣고 싶으면 아래 주석 해제
  // return [{ code: '', codeNm: '전체' }, ...filtered.map(...)]
  return filtered.map(x => ({
    code: x.storageCd,
    codeNm: x.storageName
  }))
})

// 검색 폼
const form = reactive({
  areaCd: '',
  storageCd: '',
  scaleNickname: '',
  useYn: '',
})

// ----------------------
// 조회
// ----------------------
const srhList = async () => {
  const params = { ...form }
  scaleList.value = await ApiSystems.getScaleList(params)
}

// ----------------------
// 팝업
// ----------------------
const selectRowClick = (id) => {
  let title = '저울 등록'
  if (!isEmpty(id)) title = '저울 상세'

  dialog.open(ScalePop, {
    props: {
      header: title,
      modal: true,
      maximizable: false,
      draggable: true,
      style: { overflow: 'hidden' },
      pt: {
        root: { style: { overflow: 'hidden' } },
        content: { style: { overflow: 'hidden' } },
      },
    },
    data: id,
    onClose: () => {
      // 필요하면 리스트 재조회 넣기
      // srhList()
    },
  })
}

// ----------------------
// 초기 로딩
// ----------------------
onMounted(async () => {
  // 공장/사용여부 코드
  areaCds.value = await ApiCommon.getCodeList('area')
  useYns.value = await ApiCommon.getCodeList('use_yn')

  //창고 전체 목록 1번만 조회
  storageAllRaw.value = await ApiSystems.getStorageList({})
})

// ----------------------
// areaCd 변경 시 storageCd 초기화 (추천)
// ----------------------
watch(() => form.areaCd,() => {
    form.storageCd = '' // ✅ 구역 바뀌면 창고 선택 초기화
})

// ----------------------
// 브레드크럼
// ----------------------
const home = ref({ icon: 'pi pi-home' })
const items = ref([
  { label: '시스템관리' },
  { label: '저울관리' },
  { label: '저울목록' },
])

// ----------------------
// 엑셀 다운로드
// ----------------------
const downloadExcel = () => {
  const cols = dt.value?.columns ?? []
  if (!cols.length) {
    console.warn('No Columns Found')
    return
  }
  exportToExcel(scaleList.value, '저울 리스트', cols)
}
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
  text-align: left;
}

::v-deep(.my-table .p-datatable-thead > tr > td) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
}
</style>
