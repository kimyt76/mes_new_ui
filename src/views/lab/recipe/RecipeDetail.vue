<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '연구관리', '처방상세']"></v-breadcrumbs>
<v-card>
  <v-card-text>
    <v-form @submit.prevent="saveInfo">
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.clientName"
            label="고객사"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openPop('C')"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.prodName"
            label="제품명"
            variant="underlined"
            density="compact"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.managerName"
            label="담당자명"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openPop('U')"
          />
        </v-col>
        <v-col>
          <v-date-input
            v-model="form.regDate"
            label="등록일"
            :display-format="formatDate"
            variant="underlined"
            density="compact"
            />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.labNo"
            label="Lab No"
            variant="underlined"
            density="compact"
            />
        </v-col>
        <v-col>
          <v-select
            v-model="form.prodType"
            label="제형코드"
            :items="prodTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row class="justify-end mb-3 mr-2" dense>
        <v-col  cols="auto">
          <v-btn
            color="brown-lighten-4"
            class="mt-3 mr-3"
            text="추가+"
            density="compact"
            @click="addRow"
            />
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="brown-lighten-4"
            class="mt-3"
            text="삭제-"
            density="compact"
            @click="removeRow"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <BaseHotTable
            ref="hotTable"
            :data="recipeList"
            :colHeaders="['No.', 'Phase', '품목코드', '품목명', '함량', '원가(원)', '단가(원/g)']"
            :columns="columns"
            :stretchH="'none'"
            :height="430"
            :afterChange="onAfterChange"
            :afterSelection="onAfterSelection"
          />
        </v-col>
      </v-row>
      <!-- 합계 표시 -->
      <v-row class="d-flex justify-end mb-2 mr-3 dense" >
        <v-col cols="auto"><strong>합계</strong></v-col>
        <v-col cols="auto">
          <span>함량 : {{ totalContent }}%</span>
        </v-col>
        <v-col cols="auto">
          <span>원가(원) : {{ totalInPrice.toLocaleString('ko-kr') }}원</span>
        </v-col>
        <v-col cols="auto">
          <span>단가(원/g) : {{ totalUnitPrice }}원</span>
        </v-col>
      </v-row>
      <v-row class="justify-end mb-3 mr-2" dense>
        <v-col cols="auto">
          <v-btn text="BOM연결"
            @click="openPop('B')"
            />
        </v-col>
        <v-col cols="auto">
          <v-btn
            text="저장"
            color="brown-lighten-4"
            type="submit"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn text="전성분(수출)"
            color="#FFE0B2"
            @click="downloadIngredient"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn text="단가"
            @click="downloadRecipe"
            />
        </v-col>
        <v-col cols="auto">
          <v-btn text="중국위생허가"
            @click="downloadIngredientCn"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn text="목록" @click="goList" />
        </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</v-card>

<v-dialog v-model="dialog" width="800px" height="800px" persistent :scrim="false">
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleselect"
      @close-dialog="dialog = false"
    />
</v-dialog>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, computed, shallowRef , watch} from 'vue'
import { todayKST, isEmpty, formatDate } from '@/util/common'
import { ApiLab } from '@/api/apiLab'
import { ApiItem } from '@/api/apiItem'
import { ApiCommon } from '@/api/apiCommon'
import BaseHotTable from '@/components/BaseHotTable.vue'
import Handsontable from 'handsontable'
import { useAlertStore } from '@/stores/alert'
import UserListPop from '@/views/system/user/UserListPop.vue'
import ClientListPop from '@/views/basic/client/ClientListPop.vue'
import { useAuthStore } from '@/stores/auth'
//import { useAuthComposable } from '@/composables/useAuthComposable'

const dialog = ref(false)
const hotTable = ref(null)
//const { writeYn , restoreWriteYn } = useAuthComposable()
const { vError, vSuccess, vInfo, vWarning } = useAlertStore()
const router = useRouter()
const route = useRoute()
const {userId} = useAuthStore()
const lastSelected = ref(null)
const currentComponent = shallowRef(null)
const recipeId = route.params.id
const selectPop = ref('')
const recipeList = ref([
  { phase: '', itemCd: '', itemName: '', content: 0, inPrice: 0, unitPrice: 0 },
])


const prodTypes = ref([])
const form = reactive({
  clientName:'',
  clientId:'',
  prodName:'',
  managerName:'',
  managerId:'',
  regDate:'',
  labNo:'',
  prodType:'',

  recipeId: recipeId,
  userId: userId,
})

const columns = [
  { data: 'sortDist', readOnly: true, className: 'htCenter', width: 60 },
  { data: 'phase', type: Handsontable.cellTypes.text , width: 60, className: 'htCenter'},
  { data: 'itemCd', type: Handsontable.cellTypes.text , width: 180,className: 'htCenter'},
  { data: 'itemName', type: Handsontable.cellTypes.text , width: 720},
  { data: 'content', type: Handsontable.cellTypes.numeric , width: 200,className: 'htRight'},
  { data: 'inPrice', type: Handsontable.cellTypes.numeric , width: 200,className: 'htRight'},
  { data: 'unitPrice', type: Handsontable.cellTypes.numeric , width: 200,className: 'htRight'},
]

const saveInfo = async () => {
  if (isEmpty(form.clientName)) {
    vWarning('고객사 정보를 입력해주세요.')
    return
  }
  if (isEmpty(form.prodName)) {
    vWarning('제품명을 입력해주세요.')
    return
  }
  if (isEmpty(form.prodType)) {
    vWarning('제형코드를 입력해주세요.')
    return
  }
  if (totalContent.value !== 100) {
    vWarning('함량의 합이 100이 아닙니다. 확인해주세요.')
    return
  }

  try{
    const params = {
      recipeInfo: { ...form },
      recipeList: recipeList.value,
    }

    params.recipeInfo.regDate = formatDate(params.recipeInfo.regDate)

    const res = await ApiLab.saveRecipeInfo(params)
    form.recipeId = res.data.recipeId
    vSuccess('저장되었습니다.')
  }catch(err){
    vError(err.message || '저장 중 오류가 발생했습니다.')
  }
}

const openPop = (type) => {
  selectPop.value = type
  if (type === 'C') currentComponent.value = ClientListPop
  else if (type === 'U') currentComponent.value = UserListPop
  dialog.value = true
}

const handleselect = (obj) => {
  if (selectPop.value === 'C') {
    form.clientName = obj.clientName
    form.clientId = obj.clientId
  } else if (selectPop.value === 'U') {
    form.managerId = obj.userId
    form.managerName = obj.memberNm
  }
}

const onAfterChange = async (changes, source) => {
  if (!changes) return

  const hotInstance = hotTable.value?.hotInstance?.hotInstance

  if (!hotInstance) return

  let index = 0
  for (const [row, prop, oldVal, newVal] of changes) {
    // 품목코드(itemCd) 변경 시
    if (prop === 'itemCd' && newVal && newVal !== oldVal) {
      try {

        index = index+1
        hotInstance.setDataAtRowProp(row, 'sortDist', index)

        let res = null

        if ( newVal.charAt(0).toUpperCase() === 'J') {
          res = await ApiItem.getItemInfo(newVal)
        }else{
          res = await ApiLab.getNewMaterialInfo(newVal)
          res = res.getNewMaterialInfo
        }

        if (res) {
          hotInstance.setDataAtRowProp(row, 'inPrice', res.inPrice || 0)
          // content 값이 이미 있다면 단가 계산
          const content = Number(hotInstance.getDataAtRowProp(row, 'content'))
          if (!isNaN(content) && res.inPrice != null) {
            let unitPrice = content * res.inPrice * 0.001 * 0.01
            unitPrice = parseFloat(unitPrice.toFixed(7))
            hotInstance.setDataAtRowProp(row, 'unitPrice', unitPrice)
          }
        } else {
          hotInstance.setDataAtRowProp(row, 'inPrice', 0)
        }
      } catch (err) {
        console.error('품목 조회 오류:', err)
      }
    }
    // 함량(content) 변경 시 단가 재계산
    if (prop === 'content' && newVal !== oldVal) {
      const content = Number(newVal)
      const inPrice = Number(hotInstance.getDataAtRowProp(row, 'inPrice'))
      if (!isNaN(content) && !isNaN(inPrice) && inPrice > 0) {
        const unitPrice = parseFloat((content * inPrice * 0.001 * 0.01).toFixed(7))
        hotInstance.setDataAtRowProp(row, 'unitPrice', unitPrice)
      }
    }
  }
}

// 합계 계산
const totalContent = computed(() => {
  const sum = recipeList.value.reduce((acc, row) => acc + (Number(row.content) || 0), 0)
  return parseFloat(sum.toFixed(7))
})
const totalInPrice = computed(() => {
  return recipeList.value.reduce((sum, row) => sum + (Number(row.inPrice) || 0), 0)
})
const totalUnitPrice = computed(() => {
  return recipeList.value.reduce((sum, row) => sum + (Number(row.unitPrice) || 0), 0).toFixed(7)
})

// const addRow = () => {
//   recipeList.value.push({ phase: '', itemCd: '', itemName: '', content: 0, cost: 0, unitPrice: 0 })
// }
const addRow = () => {
  const hotInstance = hotTable.value?.hotInstance?.hotInstance;
  const data = hotInstance?.getSourceData() || [];

  const nextSort = data.length > 0  ? Math.max(...data.map(row => row.sortDist || 0)) + 1  : 1;

  const newRow = {
    sort_dist: nextSort,
    phase: '',
    itemCd: '',
    itemName: '',
    content: 0,
    inPrice: 0,
    unitPrice: 0,
  };
  if (hotInstance) {
    // 'insert_row_above': 지정한 인덱스 위쪽에 새 행 추가
    // 'insert_row_below': 지정한 인덱스 아래쪽에 새 행 추가
    hotInstance.alter('insert_row_above', data.length);
    hotInstance.setDataAtRowProp(data.length, 'sortDist', nextSort);
    hotInstance.setDataAtRowProp(data.length, 'phase', '');
    hotInstance.setDataAtRowProp(data.length, 'itemCd', '');
    hotInstance.setDataAtRowProp(data.length, 'itemName', '');
    hotInstance.setDataAtRowProp(data.length, 'content', 0);
    hotInstance.setDataAtRowProp(data.length, 'inPrice', 0);
    hotInstance.setDataAtRowProp(data.length, 'unitPrice', 0);
  } else {
    recipeList.value.push(newRow);
  }
};

const onAfterSelection = (row, col, row2, col2) => {
  lastSelected.value = [row, col, row2, col2]
}
const removeRow = () => {
  if (!lastSelected.value) {
    vWarning('삭제할 행을 선택하세요.')
    return
  }
  const [startRow,, endRow] = lastSelected.value
  const hot = hotTable.value?.hotInstance?.hotInstance
  if (!hot) return
  hot.alter('remove_row', startRow, endRow - startRow + 1)
}

onMounted( async() =>{
  // if (isEmpty(writeYn.value)) {
  //   restoreWriteYn();
  // }
  prodTypes.value = await ApiLab.getProdTypeList()
  form.prodType = prodTypes.value[0]?.code ?? null;

  const hot = hotTable.value?.hotInstance
  if (!hot) return

  if ( !isEmpty(form.recipeId)){
    const res = await ApiLab.getRecipeInfo(form.recipeId)
    Object.assign(form, res.recipeInfo)

    recipeList.value.splice(0, recipeList.value.length, ...res.recipeList)
  }else{
    form.regDate = todayKST()
  }
})

const downloadRecipe = async () =>{
  if (isEmpty(form.recipeId)) {
    vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
    return
  }
  if (isEmpty(form.prodType)) {
    vWarning('제형코드를 입력해주세요.')
    return
  }

  try {
    const params = {
      recipeInfo: { ...form },
      recipeList: recipeList.value,
    }
    const blob = await ApiLab.downloadRecipe(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recipe_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)

  } catch (err) {
    vError('엑셀 다운로드 실패', err)
  }
}

const downloadIngredient = async () =>{
  if (isEmpty(form.recipeId)) {
    vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
    return
  }

  if (isEmpty(form.prodType)) {
    vWarning('제형코드를 입력해주세요.')
    return
  }

  try {
    const blob = await ApiLab.downloadIngredient(form.recipeId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `전성분_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    vError('엑셀 다운로드 실패', err)
  }
}

const downloadIngredientCn = async () =>{
  if (isEmpty(form.recipeId)) {
    vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')
    return
  }
  if (isEmpty(form.prodType)) {
    vWarning('제형코드를 입력해주세요.')
    return
  }

  try {
    const blob = await ApiLab.downloadIngredientCn(recipeId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `중국위생허가_${form.prodName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    vError('엑셀 다운로드 실패', err)
  }
}

const goList = () => {
  router.push({ name: 'RecipeList' })
}
</script>

<style scoped>

</style>
