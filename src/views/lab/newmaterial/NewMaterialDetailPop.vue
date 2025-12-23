<template>
<Card style="width: 110rem; height: 8rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.newMaterialCd" class="w-full"/>
                    <label>임시코드</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <InputText v-model="form.materialName" class="w-full"/>
                    <label>원료명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputNumber
                        v-model="form.inPrice"
                        class="w-full" />
                    <label>입고단가</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <InputText v-model="form.mtrName" class="w-full" />
                    <label>제조원</label>
                </FloatLabel>
            </div>
            <div class="col-6">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.customerName" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('C')"/>
                    </IconField>
                    <label>거래처명</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                        <InputText v-model="form.itemCd" class="w-full"/>
                        <InputIcon class="pi pi-search"  @click="openPop('I')"/>
                    </IconField>
                    <label>품목코드</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="flex justify-content-between align-items-center ml-2 mb-1 mt-2">
    <h5 class="m-0">- 성분코드</h5>
    <div class="flex justify-end gap-2">
        <Button
            label="추가+"
            @click="openIngredientPop"
            class="p-button-xm"
        />
        <Button
            label="신원료"
            @click="openPop('N')"
            class="p-button-xm"
        />
     </div>
</div>
<div>
    <DataTable
        :value="materialMappingList"
        scrollHeight="600px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="ingredientCode"      header="성분코드"  style="text-align: center;" :style="{ width: '60px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="krIngredientName"    header="구문성분명"  :style="{ width: '270px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="enIngredientName"    header="영어성분명"  :style="{ width: '270px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="inContent"           header="국내함량"   :style="{ width: '60px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
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
        <Column field="outContent"         header="수출용함량"   :style="{ width: '60px'}"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <InputNumber
                    v-model="slotProps.data.outContent"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
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
        <Column field="actions"         header="-"    :style="{ width: '20px'}" style="text-align: center;" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<!-- 🔹 하단 버튼 -->
<div class="flex gap-2 justify-end pt-3">
    <Button label="원료이관"  class="btn-save" @click="saveInfo('N')" />
    <Button label="저장"  class="btn-save" @click="saveInfo('S')" />
    <Button label="닫기" @click="closeDialog" />
</div>

    <Dialog
        v-model:visible="ingredientDialog"
        header="성분 목록"
    >
        <IngredientistPop
            @selected = "addRow"
            @close = "ingredientDialog = false"
            />
    </Dialog>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import { Dialog, useDialog } from 'primevue';
import { inject, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import IngredientistPop from '../ingredient/IngredientistPop.vue';
import NewMaterialListPop from './NewMaterialListPop.vue';

const ingredientDialog = ref(false)
const currentComponent = shallowRef(null)
const { userId } = useAuthStore()
const { vError, vSuccess, vInfo } = useAlertStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef')
const materialMappingList = ref([])

const form = reactive({
    newMaterialCd: '',
    itemCd : '',
    itemName : '',
    materialName: '',
    inPrice: '',
    customerCd: '',
    customerName: '',
    mtrName: '',

    userId: userId,
})

const openIngredientPop = () =>{
    ingredientDialog.value = true
}

const openPop = (type) =>{
    let title = ''
    let popupData = ''

    if ( type === 'N' ) {
        currentComponent.value = NewMaterialListPop
        popupData = ''
        title = '신원료 목록'
    }else if ( type === 'C' ) {
        currentComponent.value = CustomerListPop
        popupData = ''
        title = '거래처 목록'
    }else if ( type === 'I' ) {
        currentComponent.value = ItemListSinglePop
        popupData = 'M1'
        title = '품목 목록'
    }
    dialog.open(currentComponent.value, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
            overflow: 'hidden',
            },
            pt: {
            root: { style: { overflow: 'hidden' } },
            content: { style: { overflow: 'hidden' } },
            },
        },
        data: popupData,
        onClose: (event) => {
            if (!event?.data) return

            if (type === 'C') {
                form.customerCd = event.data.customerCd
                form.customerName = event.data.customerName
            } else if (type === 'I') {
                form.itemCd = event.data.itemCd
            } else if (type === 'N') {
                addRow(event.data)
            }
        },
        })
}

const saveInfo = async (type) =>{
  try {
        const params = {
        newMaterialInfo : form,
        materialMappingList : materialMappingList.value,
        }

        if( type === 'N' ){
            if (isEmpty(form.itemCd) ) {
                vInfo("이관할 품목코드를 선택해주세요.")
                return
            }

            const res = await ApiLab.saveNewMaterialMapping(params)
            vSuccess("이관 되었습니다.")
        }else{
            const res = await ApiLab.saveNewMaterialInfo(params)
            form.newMaterialCd  = res.data.newMaterialCd
            vSuccess("저장되었습니다.")
        }
    } catch (err) {
        vError(err?.response?.data?.message || '저장 중 오류가 발생했습니다.')
    }
}

const addRow = (obj) =>{
    if (!Array.isArray(obj)) return;

    let nextId = materialMappingList.value.length;

    const selectItem = obj.map((o) => ({
      id: nextId++,
      ingredientCode: o.ingredientCode,
      krIngredientName: o.krIngredientName,
      enIngredientName: o.enIngredientName,
      inContent: o.inContent,
      outContent: o.outContent,
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

const removeRow = (index) =>{
    materialMappingList.value.splice(index,1)
}

onMounted( async () =>{
    await nextTick()   // DOM 생성 후 실행
  const dialogEl = document.querySelector('.p-dialog')

  if (dialogEl) {
    console.log('Dialog width:', dialogEl.offsetWidth)
    console.log('Dialog height:', dialogEl.offsetHeight)
  }

    if ( !isEmpty(dialogRef.value.data) ){
        const res = await ApiLab.getNewMaterialInfo(dialogRef.value.data)

        Object.assign(form, res.newMaterialInfo)
        materialMappingList.value = res.materialMappingList
    }
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

</style>
