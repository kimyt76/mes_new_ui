<template>
  <Card style="width: 95rem; height: 9rem;">
    <template #content>
      <!-- Row 1 -->
      <div class="grid mb-1">
        <div class="col-6">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.clientName" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('C')" />
            </IconField>
            <label>고객사</label>
          </FloatLabel>
        </div>
        <div class="col-6">
          <FloatLabel variant="on">
            <InputText v-model="form.prodName" class="w-full" />
            <label>제품명</label>
          </FloatLabel>
        </div>
      </div>
      <!-- Row 2 -->
      <div class="grid mb-2">
        <div class="col-3">
          <FloatLabel variant="on">
            <IconField iconPosition="left">
              <InputText v-model="form.managerName" class="w-full" />
              <InputIcon class="pi pi-search" @click="openPop('U')" />
            </IconField>
            <label>담당자명</label>
          </FloatLabel>
        </div>
        <div class="col-3">
          <FloatLabel variant="on">
            <DatePicker v-model="form.regDate" class="w-full" />
            <label>등록일</label>
          </FloatLabel>
        </div>
        <div class="col-3">
          <FloatLabel variant="on">
            <InputText v-model="form.labNo" class="w-full" />
            <label>Lab No</label>
          </FloatLabel>
        </div>
        <div class="col-3">
          <FloatLabel variant="on">
            <Select
              v-model="form.prodType"
              :options="prodTypes"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
            />
            <label>제형코드</label>
          </FloatLabel>
        </div>
      </div>
    </template>
  </Card>

  <!-- 행 추가 버튼 -->
  <div class="flex justify-end mb-1 mt-3 mr-3">
    <Button label="추가+" @click="addRow" class="p-button-xm" />
  </div>

  <!-- ✅ Handsontable 공통 컴포넌트 -->
  <div class="w-full">
    <BaseHotTable
      ref="hotTable"
      :data="recipeList"
      :colHeaders="colHeaders"
      :columns="columns"
      :rowHeaders="false"
      :height="430"
      :afterChange="onAfterChange"
      :afterSelection="onAfterSelection"
    />
  </div>

  <!-- 합계 표시 -->
  <div class="flex justify-content-end gap-4 mt-4 mr-2">
    <div><strong>합계</strong></div>
    <div>함량 : {{ totalContent }}%</div>
    <div>단가(원/g) : {{ totalUnitPrice }}원</div>
  </div>

  <!-- 하단 버튼 -->
  <div class="flex gap-2 justify-end mt-1 pt-3">
    <Button label="BOM연결" class="btn-save" @click="openPop('N')" />
    <Button label="저장" class="p-button-secondary" @click="saveInfo('S')" />
    <Button label="전성분(수출)" class="btn-save" @click="downloadIngredient('S')" />
    <Button label="단가" class="btn-save" @click="downloadRecipe('S')" />
    <Button label="중국위생허가" class="btn-save" @click="downloadIngredientCn('S')" />
    <Button label="닫기"  outlined class="ml-2"  @click="closeDialog" />
  </div>
</template>

<script setup>
import { ApiItem } from '@/api/apiItem'
import { ApiLab } from '@/api/apiLab'
import BaseHotTable from '@/components/BaseHotTable.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { isEmpty } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'

import ClientListPop from '@/views/order/client/ClientListPop.vue'
import UserListPop from '@/views/system/user/UserListPop.vue'

import { DatePicker, useDialog } from 'primevue'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'

const { userId } = useAuthStore()
const { vError, vSuccess, vInfo, vWarning } = useAlertStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef')

const hotTable = ref(null)
const alive = ref(true) // ✅ 닫힘/언마운트 이후 비동기 반영 차단

const nextRowId = ref(1)
const currentComponent = shallowRef(null)
const lastSelected = ref(null)
const prodTypes = ref([])

const colHeaders = ['No.', 'Phase', '품목코드', '품목명', '함량', '원가(원)', '단가(원/g)']

const recipeList = ref([
  { sortDist: 1, phase: '', itemCd: '', itemName: '', content: 0, inPrice: 0, unitPrice: 0 },
])

const form = reactive({
  clientName: '',
  clientId: '',
  prodName: '',
  managerName: '',
  managerId: '',
  regDate: '',
  labNo: '',
  prodType: '',

  recipeId: '',
  userId: userId,
})

// ✅ Handsontable 컬럼 정의
const columns = [
  { data: 'sortDist', readOnly: true, className: 'htCenter', width: 60 },
  { data: 'phase', type: 'text', className: 'htCenter', width: 60 },
  { data: 'itemCd', type: 'text', className: 'htCenter', width: 180 },
  { data: 'itemName', type: 'text', width: 500 },
  { data: 'content', type: 'numeric', className: 'htRight', width: 150 },
  { data: 'inPrice', type: 'numeric', className: 'htRight', width: 150 },
  { data: 'unitPrice', type: 'numeric', className: 'htRight', width: 150 },
]

// ✅ 합계 계산
const totalContent = computed(() => {
  const sum = recipeList.value.reduce((acc, row) => acc + (Number(row.content) || 0), 0)
  return parseFloat(sum.toFixed(7))
})
const totalUnitPrice = computed(() =>
  recipeList.value.reduce((sum, row) => sum + (Number(row.unitPrice) || 0), 0).toFixed(7)
)

// ✅ afterSelection (삭제용)
const onAfterSelection = (row, col, row2, col2) => {
  lastSelected.value = [row, col, row2, col2]
}

// ✅ afterChange: 품목코드/함량/원가 변경 처리
const onAfterChange = async (changes, source) => {
  if (!alive.value) return
  if (!changes || source === 'loadData') return

  for (const [row, prop, oldVal, newVal] of changes) {
    if (!alive.value) return
    const rowData = recipeList.value[row]
    if (!rowData) continue

    // 품목코드 변경
    if (prop === 'itemCd' && newVal && newVal !== oldVal) {
      try {
        let res = null

        if (newVal.charAt(0).toUpperCase() === 'J') {
          res = await ApiItem.getItemInfo(newVal)
        } else {
          const tmp = await ApiLab.getNewMaterialInfo(newVal)
          res = tmp?.getNewMaterialInfo
        }

        // ✅ await 이후 닫힘 방지 체크
        if (!alive.value) return

        if (res) {
          rowData.inPrice = res.inPrice || 0
          const content = Number(rowData.content)
          if (!isNaN(content) && res.inPrice != null) {
            const unitPrice = content * res.inPrice * 0.001 * 0.01
            rowData.unitPrice = parseFloat(unitPrice.toFixed(7))
          } else {
            rowData.unitPrice = 0
          }
        } else {
          rowData.inPrice = 0
          rowData.unitPrice = 0
        }
      } catch (err) {
        console.error('품목 조회 오류:', err)
      }
    }

    // 함량 변경 시 단가 재계산
    if (prop === 'content' && newVal !== oldVal) {
      const content = Number(newVal)
      const inPrice = Number(rowData.inPrice)
      if (!isNaN(content) && !isNaN(inPrice) && inPrice > 0) {
        rowData.unitPrice = parseFloat((content * inPrice * 0.001 * 0.01).toFixed(7))
      } else {
        rowData.unitPrice = 0
      }
    }

    // 원가 변경 시 단가 재계산
    if (prop === 'inPrice' && newVal !== oldVal) {
      const inPrice = Number(newVal)
      const content = Number(rowData.content)
      if (!isNaN(content) && !isNaN(inPrice) && inPrice > 0) {
        rowData.unitPrice = parseFloat((content * inPrice * 0.001 * 0.01).toFixed(7))
      } else {
        rowData.unitPrice = 0
      }
    }
  }
}

// ✅ 행 추가
const addRow = () => {
  const nextSort =
    recipeList.value.length > 0
      ? Math.max(...recipeList.value.map(r => r.sortDist || 0)) + 1
      : 1

  recipeList.value.push({
    id: nextRowId.value++,
    sortDist: nextSort,
    phase: '',
    itemCd: '',
    itemName: '',
    content: 0,
    inPrice: 0,
    unitPrice: 0,
  })
}

// ✅ 선택 영역 삭제(필요하면 사용)
const removeRow = () => {
  if (!lastSelected.value) {
    vWarning('삭제할 행을 선택하세요.')
    return
  }
  const [startRow, , endRow] = lastSelected.value
  recipeList.value.splice(startRow, endRow - startRow + 1)
}

// ✅ 팝업 오픈
const openPop = (type) => {
  let title = ''
  if (type === 'U') {
    currentComponent.value = UserListPop
    title = '사용자 목록'
  } else if (type === 'C') {
    currentComponent.value = ClientListPop
    title = '고객사 목록'
  } else {
    // 'N' 같은 다른 타입은 여기에서 처리하거나 return
    return
  }

  dialog.open(currentComponent.value, {
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
    data: type,
    onClose: (event) => {
      if (!event?.data) return
      if (!alive.value) return

      if (type === 'C') {
        form.clientId = event.data.clientId
        form.clientName = event.data.clientName
      } else if (type === 'U') {
        form.managerId = event.data.userId
        form.managerName = event.data.memberNm
      }
    },
  })
}

// ✅ 저장
const saveInfo = async () => {
  try {
    const params = { recipeInfo: form, recipeList: recipeList.value }
    const res = await ApiLab.saveRecipeInfo(params)

    vSuccess(res.message)
    form.recipeId = res.data.recipeId
  } catch (err) {
    handleApiError(err)
  }
}

// ✅ 엑셀 다운로드
const downloadRecipe = async () => {
  if (isEmpty(form.recipeId)) return vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
  if (isEmpty(form.prodType)) return vWarning('제형코드를 입력해주세요.')

  try {
    const params = { recipeInfo: { ...form }, recipeList: recipeList.value }
    const blob = await ApiLab.downloadRecipe(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recipe_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch {
    vError('엑셀 다운로드 실패')
  }
}

const downloadIngredient = async () => {
  if (isEmpty(form.recipeId)) return vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
  if (isEmpty(form.prodType)) return vWarning('제형코드를 입력해주세요.')

  try {
    const blob = await ApiLab.downloadIngredient(form.recipeId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `전성분_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch {
    vError('엑셀 다운로드 실패')
  }
}

const downloadIngredientCn = async () => {
  if (isEmpty(form.recipeId)) return vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
  if (isEmpty(form.prodType)) return vWarning('제형코드를 입력해주세요.')

  try {
    const blob = await ApiLab.downloadIngredientCn(form.recipeId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `중국위생허가_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch {
    vError('엑셀 다운로드 실패')
  }
}

// ✅ 닫기 (핵심: 선제 cleanup)
const closeDialog = async () => {
  hotTable.value?.destroyHot?.()   // ✅ 먼저 cleanup+지연destroy 예약
  await nextTick()                // ✅ 한 틱 쉬고
  dialogRef.value.close()
}
onBeforeUnmount(() => {
  alive.value = false
  hotTable.value?.destroyHot?.()
})

onMounted(async () => {
  prodTypes.value = await ApiLab.getProdTypeList()
  form.prodType = prodTypes.value[0]?.code ?? null

  if (!isEmpty(dialogRef.value.data)) {
    form.recipeId = dialogRef.value.data
    const res = await ApiLab.getRecipeInfo(form.recipeId)
    if (!alive.value) return
    Object.assign(form, res.recipeInfo)
    recipeList.value = res.recipeList || []
  }
})
</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 1px 5px !important;
}
</style>
