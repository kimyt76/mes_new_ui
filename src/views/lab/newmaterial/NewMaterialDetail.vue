<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '연구관리', '신 원료상세']"></v-breadcrumbs>
<v-card>
  <v-card-text>
    <v-form>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.newMaterialCd"
            label="임시코드"
            variant="underlined"
            density="compact"
            readonly
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.materialName"
            label="원료명"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            :model-value="formatComma(form.inPrice)"
            label="입고단가"
            variant="underlined"
            density="compact"
            @update:model-value="v => form.inPrice = parseCommaInput(v)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.mtrName"
            label="제조원"
            variant="underlined"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.customerName"
            label="거래처"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            @click:append-inner="openPop('C')"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.itemCd"
            label="품목코드"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            readonly
            @click:append-inner="openPop('P')"
          />
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col class="mt-3">
          <v-card-subtitle>
            - 성분코드
          </v-card-subtitle>
        </v-col>
        <v-col class="d-flex justify-end" style="gap: 8px;">
          <v-btn
            color="brown-lighten-4"
            class="mt-3"
            text="추가+"
            density="compact"
            @click="openPop('I')"
            />
          <v-btn
            color="brown-lighten-4"
            class="mt-3"
            text="신원료"
            density="compact"
            @click="openPop('N')"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-data-table-virtual
            :headers="headers"
            :items="materialMappingList"
            class="custom-table"
          >
          <template #item.inContent="{item, index}">
              <input
                v-model="materialMappingList[index].inContent"
                style="text-align: right; width: 90%; height: 30px;"
                density="compact"
                class="custom-line"
                />
          </template>
          <template #item.outContent="{ item, index }">
            <input
              v-model="materialMappingList[index].outContent"
              style="text-align: right; width: 90%; height: 30px;"
              class="custom-line"
            />
          </template>
          <template #item.actions="{ item }">
            <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item.ingredientCode)"></v-icon>
          </template>

        </v-data-table-virtual>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end mt-3 ga-3">
          <v-btn
            text="원료이관"
            color="brown-lighten-4"
            @click="saveInfo('N')"
            ></v-btn>
          <v-btn
            text="저장"
            color="brown-lighten-4"
            @click="saveInfo('S')"
            ></v-btn>
          <v-btn
            text="목록"
            @click="goList"
          ></v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</v-card>

<v-dialog v-model="dialog" width="800px" height="800px" persistent location="center">
    <component
      :is="currentComponent"
      :id="id"
      :style="{
          position: 'absolute',
          top: `${pos.y}px`,
          left: `${pos.x}px`,
          cursor: dragging ? 'grabbing' : 'grab',
        }"
      @mousedown="startDrag"

      @selected="handleselect"
      @close-dialog="dialog = false"
    />
</v-dialog>

</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { isEmpty ,formatComma, parseCommaInput } from '@/util/common';
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IngredientListPop from '../ingredient/IngredientListPop.vue';
import CustomerListPop from '@/views/basic/customer/CustomerListPop.vue';
import ItemListSinglePop from '@/views/basic/item/ItemListSinglePop.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import NewMaterialListPop from './NewMaterialListPop.vue';

const dialog = ref(false)
const pos = ref({ x: 300, y: 200 })
const dragging = ref(false)
let offsetX = 0
let offsetY = 0

function startDrag(e) {
  dragging.value = true
  offsetX = e.clientX - pos.value.x
  offsetY = e.clientY - pos.value.y

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
}

function onMouseMove(e) {
  if (dragging.value) {
    pos.value.x = e.clientX - offsetX
    pos.value.y = e.clientY - offsetY
  }
}

function stopDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
}


const { userId } = useAuthStore()
const {vError, vSuccess, vInfo} = useAlertStore()
const route = useRoute()
const router = useRouter()
const newMaterialCd = route.params.id

const selectPop = ref('')
const currentComponent = shallowRef(null)
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

const headers = [
    { title: '성분코드',     key: 'ingredientCode',    align: 'center',  width:'90px'},
    { title: '국문성분명',   key: 'krIngredientName',  align: 'start', width: '230px'},
    { title: '영어성분명',   key: 'enIngredientName',  align: 'start', width: '230px'},
    { title: '국내함량',     key: 'inContent',         align: 'center', width: '100px'},
    { title: '수출용함량',   key: 'outContent',        align: 'center', width: '100px'},
    { title: 'CAS No',      key: 'casNo',             align: 'center',width: '90px'} ,
    { title: 'function',    key: 'functionNm',        align: 'center',width: '90px'},
    { title: '한도 국가',    key: 'limitCountry',      align: 'center',width: '90px'},
    { title: '금지 국가',    key: 'banCountry',        align: 'center',width: '90px'},
    { title: '-',           key: 'actions',           align: 'center' ,width : '10px'},
]

const saveInfo = async (type) =>{
  form.userId = userId
  try{
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
      router.push({name:'NewMaterialList'})
    }else{
      const res = await ApiLab.saveNewMaterialInfo(params)
      form.newMaterialCd  = res.data.newMaterialCd
      vSuccess("저장되었습니다.")
    }
  }catch(err){
    vError(err.message)
  }
}

const openPop = (type) =>{
  selectPop.value = type

  if ( type === 'I'  ) {
    currentComponent.value = IngredientListPop
  }else if ( type === 'C'  ) {
    currentComponent.value = CustomerListPop
  }else if ( type === 'P'  ) {
    currentComponent.value = ItemListSinglePop
  }else if ( type === 'N'  ) {
    currentComponent.value = NewMaterialListPop
  }
  dialog.value = true
}

const handleselect = (obj) => {
  if ( selectPop.value === 'C'  ) {
    form.customerCd = obj.customerCd
    form.customerName = obj.customerName
  }else if ( selectPop.value === 'P'  ) {
    form.itemCd = obj.itemCd
    form.itemName = obj.itemName
   }else if ( selectPop.value === 'I' || selectPop.value === 'N'  ) {
    ingredientList(obj)
   }

   dialog.value = false
}

const ingredientList = (obj) =>{
  if (!Array.isArray(obj)) return;
  let nextId = materialMappingList.value.length;

  const selectItem = obj.map((o, index) => ({
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

const removeRow =(id) => {
  const index = materialMappingList.value.findIndex(ingredient => ingredient.ingredientCode === id)
  materialMappingList.value.splice(index, 1)
}

onMounted( async () =>{
  if (!isEmpty( newMaterialCd )) {
    const res = await ApiLab.getNewMaterialInfo(newMaterialCd)

    Object.assign(form, res.newMaterialInfo)
    materialMappingList.value = res.materialMappingList
  }
})

const goList = () =>{
  router.push({name:'NewMaterialList'})
}

</script>

<style scoped>
@import '@/assets/css/main.css';
</style>
