<template>
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

          <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
        </div>
      </template>
    </Toolbar>
  </form>
  <div>
    <DataTable
      :value="scaleList"
      scrollHeight="450px"
      scrollable
      showGridlines
      class="my-table"
    >
      <Column field="areaName" header="구역(공장)" :style="{ width: '130px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />
      <Column field="storageName" header="작업처" :style="{ width: '180px', textAlign: 'center' }" :pt="{ columnHeaderContent: 'justify-center' }" />
      <Column field="scaleNickname" header="저울별칭" :style="{ width: '300px', textAlign: 'center' }" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
        <template #body="slotProps">
          <div @click="selectRowClick(slotProps.data)" style="text-decoration: underline; cursor: pointer;">
            {{ slotProps.data.scaleNickname }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
<!-- =============================================================
         버튼
         ============================================================= -->
    <div class="flex justify-end gap-2 mt-3">
        <Button label="닫기" icon="pi pi-times" severity="secondary" @click="closeDialog"/>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiSystem } from '@/api/apiSystem'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'

const dialogRef = inject('dialogRef')
const scaleList = ref([])
const areaCds = ref([])
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
  useYn: 'Y',
})

// ----------------------
// 조회
// ----------------------
const srhList = async () => {
  const params = { ...form }
  scaleList.value = await ApiSystem.getScaleList(params)
}

// ----------------------
// areaCd 변경 시 storageCd 초기화 (추천)
// ----------------------
watch(() => form.areaCd,() => {
    form.storageCd = '' // ✅ 구역 바뀌면 창고 선택 초기화
})

const selectRowClick = (row) =>{
    dialogRef.value.close({
        scaleCd: row.scaleCd,
        scaleNickname: row.scaleNickname
    })
}

onMounted(async () => {
  // 공장/사용여부 코드
  areaCds.value = await ApiCommon.getCodeList('area')
  //창고 전체 목록 1번만 조회
  storageAllRaw.value = await ApiSystem.getStorageList({})
})


const closeDialog = () =>{
    dialogRef.value.close()
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
