<template>
<Card style="width: 110rem; height: 11rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemCd" class="w-full" readonly/>
                    <label>품목코드</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.itemName" class="w-full" readonly/>
                    <label>품목명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.unit" class="w-full"  readonly/>
                    <label>단위</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.itemGrp1" :options="itemGrp1s"
                            optionLabel="codeNm" optionValue="code" class="w-full" />
                    <label>거래유형</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.customerName" class="w-full" readonly/>
                    <label>거래처명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <Checkbox v-model="form.vegan" name="Vegan"  binary  readonly/>
                <label> Vegan </label>
                <Checkbox v-model="form.strDatel" name="halal" binary readonly />
                <label> Halal </label>
                <Checkbox v-model="form.rspo" name="RSPO"  binary readonly/>
                <label> RSPO </label>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.inPrice" class="w-full" />
                    <label>입고단가</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber v-model="form.outPrice" class="w-full" />
                    <label>출고단가</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 성분코드</h5>
    <Button
        label="추가+"
        @click="openPop"
        class="p-button-xm"
    />
</div>
<div>
    <DataTable
        :value="materialMappingList"
        scroll-height="400px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="ingredientCode"      header="성분코드"  style="text-align: center;" :style="{ width: '70px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="krIngredientName"    header="구문성분명"  :style="{ width: '280px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="enIngredientName"    header="영어성분명"  :style="{ width: '280px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="inContent"           header="국내함량"   :style="{ width: '70px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.inContent"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="7"
                    :useGrouping="false"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="outContent"         header="수출용함량"   :style="{ width: '90px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.outContent"
                    class="w-full"
                    :min="0"
                    ::minFractionDigits="0"
                    :maxFractionDigits="7"
                    :useGrouping="false"
                    :inputStyle="{ width: '50px', 'text-align': 'right' }"
                />
            </template>
        </Column>
        <Column field="casNo"           header="CAS No."  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="functionNm"      header="funciton"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="limitCountry"    header="한도국가"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="banCountry"      header="금지국가"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="actions"         header="-"    :style="{ width: '10px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.data.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>

<div class="w-full align-items-center mt-3">
    <CommFileUpload
        v-model="attachFile"
        :download-url="`/api/lab/material/file/download`"
        :accept="'.pdf,.xlsx,.xls,.png,.jpg,.jpeg'"
        :multiple="true"
        @error="(msg) => console.error(msg)"
    />
</div>

<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 변경이력</h5>
    <Button
        label="추가+"
        @click="addRow"
        class="p-button-xm"
    />
</div>
<div>
    <DataTable
        :value="historyList"
        scroll-height="200px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="orderDist"    header="No."   style="text-align: center;" :style="{ width: '20px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="historyComment"       header="변경이력"  style="text-align: left;" :style="{ width: '300px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.historyComment"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="updName"    header="담당자"  style="text-align: center;"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputText
                    v-model="slotProps.data.updName"
                    class="w-full"
                />
            </template>
        </Column>
        <Column field="updDate"    header="수정일"  style="text-align: center;"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <DatePicker
                    v-model="slotProps.data.updDate"
                    :showIcon="false"
                    class="w-full"
                />
            </template>
        </Column>
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

<Dialog
    v-model:visible="ingredientDialog"
    header="성분 목록"
  >
    <IngredientistPop
        @selected = "selectedRow"
        @close = "ingredientDialog = false"
        />
</Dialog>

</template>


<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import CommFileUpload from '@/components/CommFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, todayKST } from '@/util/common';
import { inject, onMounted, reactive, ref } from 'vue';
import IngredientistPop from '../ingredient/IngredientistPop.vue';

const { userId } = useAuthStore()
const { vError, vSuccess, vWarning } = useAlertStore()
const attachFile = ref([])
const ingredientDialog = ref(false)
const dialogRef = inject('dialogRef')
const materialMappingList = ref([])
const historyList = ref([])
const itemGrp1s = ref([])
const attachFileId = ref('')
const historyId = ref('')

const form = reactive({
    itemCd: '',
    itemName: '',
    unit: '',
    spec: '',
    customerName: '',
    customerCd: '',
    vegan: '',
    halal: '',
    rspo: '',
    inPrice: 0,
    outPrice: 0,

    userId: userId,
})

const saveInfo = async () =>{
    const formData = new FormData()
  try {
    const materialInfo = {
      itemCd: form.itemCd,
      historyId : historyId.value,
      attachFileId : attachFileId.value,
      userId: userId,
    }

    formData.append('materialInfo', JSON.stringify(materialInfo))
    formData.append('materialList', JSON.stringify(materialMappingList.value))
    formData.append('historyList', JSON.stringify(historyList.value))

    const deleteFiles = []

    attachFile.value.forEach((file) => {
      if (file.flag === 'N') {
        formData.append('newFiles', file.file)
      } else if (file.flag === 'D') {
        deleteFiles.push({
          attachFileId: file.attachFileId,
          seq: file.seq,
        })
      }
    })

    formData.append(
      'keptFiles',
      JSON.stringify(attachFile.value.filter((f) => f.flag === 'S')),
    )

    if (deleteFiles.length > 0) {
      formData.append(
        'deleteFiles',
        new Blob([JSON.stringify(deleteFiles)], { type: 'application/json' }),
      )
    }

    const msg = await ApiLab.saveMaterialInfo(formData)
    vSuccess(msg)
  } catch (err) {
    vError(err?.response?.data?.message || '저장 중 오류가 발생했습니다.')
  }
}

const selectedRow = (obj) =>{
    if (!Array.isArray(obj)) return;

    let nextId = materialMappingList.value.length;

    const selectItem = obj.map((o, index) => ({
      id: nextId++,
      ingredientCode: o.ingredientCode,
      krIngredientName: o.krIngredientName,
      enIngredientName: o.enIngredientName,
      inContent: '',
      outContent: '',
      casNo: o.casNo,
      functionNm: o.functionNm,
      limitCountry: o.limitCountry,
      banCountry: o.banCountry,
  }));

  if (materialMappingList.value.length > 0) {
    materialMappingList.value.push(...selectItem);
  } else {
    materialMappingList.value = [...selectItem];
  }
}

const addRow = () => {
    historyList.value.push({
        orderDist: historyList.value.length + 1,
        historyComment: '',
        updName: '',
        updDate: todayKST(),
        orderDist: historyList.value.length + 1,
    })
}

const removeRow = (index) =>{
    materialMappingList.value.splice(index,1)
}

const openPop = () =>{
    ingredientDialog.value = true
}

onMounted( async () =>{
    itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')

    const res = await ApiLab.getMaterialInfo(dialogRef.value.data)
    Object.assign(form,{
        ...res.itemInfo,
        vegan : res.itemInfo.vegan === 'Y',
        halal : res.itemInfo.halal === 'Y',
        rspo  :  res.itemInfo.rspo === 'Y',
        //addtion : res.itemInfo.addtion === 'Y',
    })
    historyList.value = res.historyList

    if (!isEmpty(res.fileList)) {
        attachFile.value = initServerFiles(res.fileList)
        attachFileId.value = res.materialInfo.attachFileId
    }
    if ( !isEmpty(res.materialList) ) {
        materialMappingList.value = res.materialList
    }

})

const initServerFiles = (list) =>
  (list || []).map(f => ({ ...f, flag: 'S' }))

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
</style>
