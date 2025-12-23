<template>
<Card style="width: 95rem; height: 20rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.itemCd" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('I')" />
                    </IconField>
                    <label>품목코드</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-full" />
                    <label>품목명</label>
                </FloatLabel>
            </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.managerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('U')" />
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
                <FloatLabel variant="on">
                <IconField iconPosition="left">
                <InputText v-model="form.clientName" class="w-full" />
                <InputIcon class="pi pi-search" @click="openPop('C')" />
                </IconField>
                <label>고객사</label>
            </FloatLabel>
            </div>
            <div class="col-3">
            <FloatLabel variant="on">
                <InputText v-model="form.labNo" class="w-full" />
                <label>Lab No.</label>
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
            <div class="col-3">
            <FloatLabel variant="on">
                <Select
                v-model="form.approvalState"
                :options="approvalStates"
                optionLabel="codeNm"
                optionValue="code"
                class="w-full"
                />
                <label>결재상태</label>
            </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-3">
            <FloatLabel variant="on">
                <InputText v-model="form.bomVer" class="w-full"  readonly/>
                <label>BOM 버전</label>
            </FloatLabel>
            </div>
            <div class="col-9">
            <FloatLabel variant="on">
                <Textarea v-model="form.etc" rows="1" class="w-full" style="resize: none"/>
                <label>비고</label>
            </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-6">
            <FloatLabel variant="on">
                <Textarea v-model="form.usage" rows="2" class="w-full" style="resize: none" />
                <label>용법용량</label>
            </FloatLabel>
            </div>
            <div class="col-6">
            <FloatLabel variant="on">
                <Textarea v-model="form.caution" rows="2" class="w-full" style="resize: none" />
                <label>사용시주의사항</label>
            </FloatLabel>
            </div>
        </div>
        <div class="grid mb-1">
            <div class="col-6">
            <FloatLabel variant="on">
                <Textarea v-model="form.significant" rows="2" class="w-full" style="resize: none"/>
                <label>특이사항</label>
            </FloatLabel>
            </div>
            <div class="col-6">
            <FloatLabel variant="on">
                <Textarea v-model="form.note" rows="2"  class="w-full" style="resize: none"/>
                <label>수정사항</label>
            </FloatLabel>
            </div>
        </div>
    </template>
</Card>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 원료구성정보</h5>
    <div class="flex justify-end gap-2">
    <Button
        label="BOM정보"
        @click="openPop('B')"
        class="p-button-xm"
    />
    <Button
        label="연구처방"
        @click="openPop('R')"
        class="p-button-xm"
    />
    <Button
        label="추가+"
        @click="addRowR"
        class="p-button-xm"
    />
    <Button
        label="전체삭제"
        @click="removeAll"
        class="p-button-xm"
    />
    </div>
</div>
<div class="w-full" ref="tableWrapper">
    <DataTable
        v-model:selection="selectedRow"
        :value="recipeList"
        dataKey="orderDist"
        scrollHeight="300px"
        show-gridlines
        scrollable
        selectionMode="single"
        class="my-table fixed-datatable"
        @rowSelect="onRowSelect"
    >
    <ColumnGroup type="header">
        <Row>
            <Column header="No."    :rowspan="2"  :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="Phase"  :rowspan="2"  :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="실생"    :colspan="3" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="표준"    :colspan="3" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="적요"    :rowspan="2" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="-"      :rowspan="2" :pt="{ columnHeaderContent: 'justify-center' }"/>
        </Row>
        <Row>
            <!-- 실생 -->
            <Column header="품목코드"   field="realItemCd"   :style="{ width: '130px' }" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="품목명"     field="realItemName" :style="{ width: '500px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
            <Column header="함량"       field="realContens" :style="{ width: '80px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
            <!-- 표준 -->
            <Column header="품목코드"   field="stdItemCd"   :style="{ width: '130px' }" :pt="{ columnHeaderContent: 'justify-center' }"/>
            <Column header="품목명"     field="stdItemName" :style="{ width: '500px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
            <Column header="함량"       field="stdContens" :style="{ width: '80px' }" :pt="{ columnHeaderContent: 'justify-center' }" />
        </Row>
    </ColumnGroup>
        <Column field="orderDist"       header="No."        :style="{ width: '40px'}" :pt="{ columnHeaderContent: 'justify-center' }">
        </Column>
        <Column field="phase"           header="Phase"   style="text-align: center;"  :style="{ width: '30px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.phase"
                    class="w-full"
                    style="text-align: center !important;"
                    />
            </template>
        </Column>
        <Column field="realItemCd"      header="품목코드"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.realItemCd"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
            <template #footer>
                <div style="text-align: center; font-weight: bold;" class="footer-cell">합계</div>
            </template>
        </Column>
        <Column field="realItemName"    header="품목명"    :style="{ width: '500px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.realItemName"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="realContent"     header="함량"    :style="{ width: '50px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.realContent"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="8"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                    />
            </template>
            <!-- 👇 여기 합계 footer -->
            <template #footer>
                <div style="text-align: right; width: 50px; padding-right: 4px;" class="footer-cell">
                {{ totalRealContent.toFixed(2) }}
                </div>
            </template>
        </Column>
        <Column field="stdItemCd"       header="품목코드"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.stdItemCd"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="stdItemName"     header="품목명"    :style="{ width: '500px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.stdItemName"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="stdContent"      header="함량"    :style="{ width: '50px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.stdContent"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="8"
                    :useGrouping="true"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                    />
            </template>
            <!-- 👇 여기 합계 footer -->
                <template #footer>
                    <div style="text-align: right; width: 50px; padding-right: 4px;" class="footer-cell">
                        {{ totalStdContent.toFixed(2) }}
                    </div>
                </template>
        </Column>
        <Column field="etc" header="적요"    :style="{ width: '240px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.etc"
                    class="w-full"
                    style="text-align: left;"
                    />
            </template>
        </Column>
        <Column field="actions" header="-"    :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowR(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-4">
    <h5 class="m-0">- 제조공정도</h5>
    <Button
        label="추가+"
        @click="addRowP"
        class="p-button-xm"
    />
</div>
<div class="w-full">
    <DataTable
        :value="bomProcList"
        scrollable
        scrollHeight="300px"
        show-gridlines
        class="my-table fixed-datatable"
    >
        <Column field="orderDist"   header="No."        :style="{ width: '20px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="phase"       header="공정구분"  style="text-align: center;" :style="{ width: '70px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.phase"
                    class="w-full"
                    style="text-align: center;"
                    />
            </template>
        </Column>
        <Column field="procGb"        header="제조부"      :style="{ width: '90px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.procGb"
                    :options="procGbs"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
            </template>
        </Column>
        <Column field="procType"       header="제조구분"      :style="{ width: '90px'}" bodyClass="break-words" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <Select
                    v-model="slotProps.data.procType"
                    :options="procTypes"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
            </template>
        </Column>
        <Column field="matProc"  header="제조공정"    :style="{ width: '470px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <Textarea
                    v-model="slotProps.data.matProc" rows="2" style="resize: none;"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="ho"  header="HO"    :style="{ width: '70px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.ho"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="pd"  header="PD"    :style="{ width: '70px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.pd"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="d1"  header="D1"    :style="{ width: '70px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.d1"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="d2"  header="D2"    :style="{ width: '70px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.d2"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="t"  header="T"    :style="{ width: '70px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.t"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="m"  header="M"    :style="{ width: '70px'}" bodyClass="break-words" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.m"
                    class="w-full"
                    :min="0"
                    :maxFractionDigits="0"
                    :useGrouping="true"
                    :inputStyle="{ width: '70px', 'text-align': 'right' }"
                    />
            </template>
        </Column>
        <Column field="etc"         header="적요"        :style="{ width: '180px'}" bodyClass="break-words" style="text-align: left;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.etc"
                    class="w-full"
                    />
            </template>
        </Column>
        <Column field="actions"     header="-"          :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer" @click="removeRowP(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장" severity="secondary" @click="saveInfo"></Button>
    <Button label="닫기" @click="closeDialog"></Button>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import ClientListPop from '@/views/order/client/ClientListPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import RecipeListPop from '../recipe/RecipeListPop.vue';
import BomListPop from './BomListPop.vue';

const totalRealContent = computed(() =>
  recipeList.value.reduce(
    (sum, row) => sum + (Number(row.realContent) || 0),
    0,
  ),
)

const totalStdContent = computed(() =>
  recipeList.value.reduce(
    (sum, row) => sum + (Number(row.stdContent) || 0),
    0,
  ),
)

const  { userId } = useAuthStore()
const {   vSuccess, vInfo} = useAlertStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const currentComponet = shallowRef(null)
const prodTypes = ref([])
const procGbs = ref([])
const procTypes = ref([])
const approvalStates = ref([])
const recipeList = ref([])
const bomProcList = ref([])
const form = reactive({
    itemCd:'',
    itemName: '',
    clientName:'',
    clientId: '',
    labNo: '',
    managerName: '',
    managerId: '',
    prodType: '',
    usage: '',
    caution: '',
    significant: '',
    note: '',
    etc: '',
    approvalState: '',
    bomVer: '',

    bomId : '',
    userId: userId,
})

const removeAll = () =>{
    recipeList.value = []
}

const saveInfo = async () =>{
    try{
        const params = {
            bomInfo : form,
            bomRecipeList : recipeList.value,
            bomProcList : bomProcList.value,
        }

        const msg = await ApiLab.saveBomInfo(params)
        vSuccess(msg.data.message)
        closeDialog()
    }catch(err){
        handleApiError(err)
    }
}

const openPop = (type) =>{
    let title = ''

    if ( type === 'C' ) {
        title = '고객사 목록'
        currentComponet.value = ClientListPop
    }else if (type === 'U') {
        title = '담당자 목록'
        currentComponet.value = UserListPop
    }else if ( type === 'R') {
        title = '연구처방 목록'
        currentComponet.value = RecipeListPop
    }else if ( type === 'B') {
        title = 'BOM 목록'
        currentComponet.value = BomListPop
    }else if ( type === 'I') {
        currentComponet.value = ItemListSinglePop
    }

    dialog.open( currentComponet.value, {
        props: {
            header: title,
            modal: true,
            draggable: true,
            maximizable: false,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
         onClose:(event) => {
            if (!event || !event.data) return;

            if ( type === 'C' ) {
                form.clientId = event.data.clientId
                form.clientName = event.data.clientName
            }else if (type === 'U') {
                form.managerId = event.data.userId
                form.managerName = event.data.memberNm
            }else if ( type === 'R') {
                addRowR(event.data)
            }else if ( type === 'B') {
                addRowPop(event.data)
            }else if ( type === 'B') {
                form.itemCd = event.data.itemCd
                form.itemName = event.data.itemName
            }
        },
    })
}

watch(() => form.prodType,  async (newVal) => {
    if (!newVal) return; // 빈값이면 종료

    try {
      const res = await ApiLab.getProductTypeInfo(newVal);

      form.usage = res?.usage || '';
      form.caution = res?.caution || '';
    } catch (err) {
       handleApiError(err)
    }
  }
);

// 선택된 row index (없으면 null)
const selectedRowIndex = ref(null)
const selectedRow = ref(null)
const tableWrapper = ref(null);

const handleDocumentClick = (e) => {
  // table 영역 밖을 클릭했는지 체크
  if (tableWrapper.value && !tableWrapper.value.contains(e.target)) {
    selectedRow.value = null; // ← 선택 초기화 (radio 체크도 해제)
    selectedRowIndex.value= null
  }
};

const onRowSelect = (event) => {
  selectedRow.value = event.data;

  const rowKey = event.data.orderDist;
  const idx = recipeList.value.findIndex(r => r.orderDist === rowKey);
  selectedRowIndex.value = idx >= 0 ? idx : null;
}

const recipeSort = () =>{
     // 5) orderDist 재정렬 (1부터)
  recipeList.value.forEach((row, idx) => {
    row.orderDist = idx + 1
  })
}

const addRowPop = (obj) =>{
     const rowsToInsert = []
  // 1) obj로부터 row 생성 (붙여넣기 케이스)
  if (obj && Array.isArray(obj) && obj.length > 0) {
    rowsToInsert.push(
      ...obj.map(o => ({
        orderDist: 0,                 // 나중에 재정렬
        phase: o.phase || '',
        realItemCd: o.realItemCd || '',
        realItemName: o.realItemName || '',
        realContent: o.realContent || 0,
        stdItemCd: o.stdItemCd || '',
        stdItemName: o.stdItemName || '',
        stdContent: o.stdContent || 0,
      }))
    )
  }

  // 3) 삽입 위치 계산
  let insertIndex
  if (selectedRowIndex.value !== null && selectedRowIndex.value >= 0) {
    // 선택된 row 바로 아래
    insertIndex = selectedRowIndex.value + 1
  } else {
    // 선택된 row가 없으면 맨 밑
    insertIndex = recipeList.value.length
  }
  // 4) 해당 위치에 rows 삽입
  recipeList.value.splice(insertIndex, 0, ...rowsToInsert)
  recipeSort()
}

const addRowR = (obj)=>{
    const rowsToInsert = []
  // 1) obj로부터 row 생성 (붙여넣기 케이스)
  if (obj && Array.isArray(obj) && obj.length > 0) {
    rowsToInsert.push(
      ...obj.map(o => ({
        orderDist: 0,                 // 나중에 재정렬
        phase: o.phase || '',
        realItemCd: o.itemCd || '',
        realItemName: o.itemName || '',
        realContent: o.content || 0,
        stdItemCd: o.itemCd || '',
        stdItemName: o.itemName || '',
        stdContent: o.content || 0,
      }))
    )

  }else {
      // 2) obj가 없거나 빈 배열이면 → 빈 행 하나 추가
    rowsToInsert.push({
      orderDist: 0,
      phase: '',
      realItemCd: '',
      realItemName: '',
      realContent: '',
      stdItemCd: '',
      stdItemName: '',
      stdContent: '',
    })
  }

  // 3) 삽입 위치 계산
  let insertIndex
  if (selectedRowIndex.value !== null && selectedRowIndex.value >= 0) {
    // 선택된 row 바로 아래
    insertIndex = selectedRowIndex.value + 1
  } else {
    // 선택된 row가 없으면 맨 밑
    insertIndex = recipeList.value.length
  }
  // 4) 해당 위치에 rows 삽입
  recipeList.value.splice(insertIndex, 0, ...rowsToInsert)
  // 5) orderDist 재정렬 (1부터)
  recipeSort()
}

const addRowP = ()=>{
    let nextNo = bomProcList.value.length

    bomProcList.value.push({
      orderDist: nextNo++,
      phase: '',
      krIngredientName: '',
      enIngredientName: '',
      mat_proc: '',
      ho: 0,
      pd: 0,
      d1: 0,
      d2: 0,
      t: 0,
      m: 0,
      etc: '',
  });
   // 5) orderDist 재정렬 (1부터)
  bomProcList.value.forEach((row, idx) => {
    row.orderDist = idx + 1
  })
}

const removeRowR = (index) =>{
    recipeList.value.splice(index,1)
    // 5) orderDist 재정렬 (1부터)
    recipeList.value.forEach((row, idx) => {
        row.orderDist = idx + 1
    })
}
const removeRowP = (index) =>{
    bomProcList.value.splice(index,1)
    // 5) orderDist 재정렬 (1부터)
    bomProcList.value.forEach((row, idx) => {
        row.orderDist = idx + 1
    })
}
onMounted( async () =>{
    prodTypes.value = await ApiLab.getProdTypeList()
    approvalStates.value = await ApiCommon.getCodeList('approval_state')
    procGbs.value = await ApiCommon.getCodeList('proc_gb')
    procTypes.value = await ApiCommon.getCodeList('proc_type')
    form.bomId = dialogRef.value.data

    if ( !isEmpty(form.bomId)){
        const res = await ApiLab.getBomInfo(form.bomId)

        Object.assign(form, res.bomInfo)
        recipeList.value = res.bomRecipeList
        recipeSort()
        bomProcList.value =res.bomProcList
    }

    document.addEventListener('click', handleDocumentClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
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
::v-deep(.my-table .p-datatable-tbody > tr > td) {
  padding: 8px 6px 0.2rem 0.1rem;
  font-size: 16px;
  text-align: center;
  font-family: monaco, Consolas;
}
.fixed-datatable {
  height: 300px;
}

.fixed-datatable .p-datatable-wrapper {
  height: calc(300px - 42px) !important; /* 헤더 높이 42px 정도 */
}

.footer-cell {
  color: black;                 /* 글자색 */
  height: 15px;                /* ★ 높이 조절 */
  line-height: 15px;           /* 가운데 정렬 */
  font-weight: bold;
  font-size: medium;
  text-align: right;
  padding-right: 1px;
}
.p-datatable-tfoot > tr > td {
  background-color: gray !important;
  color: white !important;
  font-weight: bold;
  height: 35px;
}

</style>
