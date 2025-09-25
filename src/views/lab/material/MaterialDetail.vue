<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '연구관리', '원료상세']"></v-breadcrumbs>
<v-card>
  <v-card-text>
    <v-form @submit.prevent="saveInfo">
      <v-row>
        <v-col>
          <v-text-field
          v-model="form.itemCd"
          label="품목코드"
          variant="underlined"
          density="compact"
          readonly
          /></v-col>
        <v-col cols="6">
          <v-text-field
          v-model="form.itemName"
          label="품목명"
          variant="underlined"
          density="compact"
          readonly
        />
        </v-col>
        <v-col>
          <v-text-field
          v-model="form.unit"
          label="단위"
          variant="underlined"
          density="compact"
          readonly
        />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
            <v-text-field
              v-model="form.customerName"
              label="거래처명"
              variant="underlined"
              density="compact"
              readonly
            />
          </v-col>
          <v-col class="d-flex">
            <v-checkbox
              v-model="form.vegan"
              label="Vegan"
              density="compact"
              hide-details
              readonly
            />
            <v-checkbox
              v-model="form.halal"
              label="Halal"
              density="compact"
              hide-details
              readonly
            />
            <v-checkbox
              v-model="form.rspo"
              label="RSPO"
              density="compact"
              hide-details
              readonly
            />
            <v-checkbox
              v-model="form.addtion"
              label="RSPO"
              density="compact"
              hide-details
              readonly
            />
        </v-col>
        <v-col>
          <v-select
            v-model="form.itemGrp1"
            :items="itemGrp1s"
            label="거래유형"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
            <v-text-field
              :model-value="formatComma(form.inPrice)"
              label="입고단가"
              variant="underlined"
              density="compact"
              readonly
            />
          </v-col>
        <v-col>
            <v-text-field
              :model-value="formatComma(form.outPrice)"
              label="출고단가"
              variant="underlined"
              density="compact"
              readonly
            />
          </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</v-card>
<v-row class="mt-4">
  <v-col class="mt-3">
    <v-card-subtitle>
      - 성분코드
    </v-card-subtitle>
  </v-col>
  <v-col class="d-flex justify-end">
    <v-btn
      color="brown-lighten-4"
      class="mt-3"
      text="추가+"
      density="compact"
      @click="openPop"
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
  <v-col  class="mt-5">
    <MultiFileUpload
      v-model="attachFile"
      />
  </v-col>
</v-row>

<v-row>
  <v-col class="mt-3">
    <v-card-subtitle>
      - 변경이력
    </v-card-subtitle>
  </v-col>
  <v-col class="d-flex justify-end">
    <v-btn
      color="brown-lighten-4"
      class="mt-3"
      text="추가+"
      density="compact"
      @click="addRow"
      />
  </v-col>
</v-row>
<v-row>
  <v-col>
    <v-data-table-virtual
      :headers="historyHeaders"
      :items="historyList"
       class="custom-table"
      >
     <template #item.historyId="{item}">
        <input
          v-model="item.historyId"
          style="text-align: right; width: 90%; height: 30px;"
          density="compact"
          readonly
          />
    </template>
     <template #item.historyComment="{item}">
        <input
          v-model="item.historyComment"
          style="text-align: right; width: 90%; height: 30px;"
          density="compact"
          class="custom-line"
          />
    </template>
     <template #item.updName="{item}">
        <input
          v-model="item.updName"
          style="text-align: right; width: 90%; height: 30px;"
          density="compact"
          class="custom-line"
          />
    </template>
     <template #item.updDate="{item}">
        <input
          v-model="item.updDate"
          style="text-align: right; width: 90%; height: 30px;"
          density="compact"
          class="custom-line"
          />
    </template>
      <template #item.actions="{ item }">
        <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow1(item.historyId)"></v-icon>
      </template>
    </v-data-table-virtual>
  </v-col>
</v-row>
<v-row>
  <v-col class="d-flex justify-end mt-3 ga-3">
    <v-btn
      text="저장"
      color="brown-lighten-4"
      @click="saveInfo"
      ></v-btn>
    <v-btn
      text="목록"
      @click="goList"
    ></v-btn>
  </v-col>
</v-row>


  <v-dialog  v-model="dialog" width="900px" persistent>
    <IngredientListPop
      @selected="handleSelected"
      @close-dialog="dialog = false"/>
  </v-dialog>
</template>

<script setup>
import { ApiLab } from '@/api/apiLab';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatComma, isEmpty } from '@/util/common';
import IngredientListPop from '../ingredient/IngredientListPop.vue';
import MultiFileUpload from '@/components/MultiFileUpload.vue';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';

const {userId} = useAuthStore()
const { vError, vSuccess} = useAlertStore()
const router = useRouter()
const route = useRoute()
const itemCd = route.params.id
const dialog = ref(false)
const historyId = ref('')
const attachFileId = ref('')
const materialMappingList = ref([])
const attachFile = ref([])
const historyList = ref([])
const itemGrp1s = ref([])

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

const historyHeaders = [
    { title: 'No.',      key: 'historyId',        align: 'center',     width: '50px'},
    { title: '변경사유',  key: 'historyComment',  align: 'start',     width: '500px'},
    { title: '수정자',    key: 'updName',         align: 'center',  width: '100px'},
    { title: '수정일',    key: 'updDate',         align: 'center',  width: '100px'},
    { title: '-',        key: 'actions',          align: 'center' ,  width : '10px'},
]

const form = reactive({
  itemCd:'',
  itemName : '',
  unit:'',
  customerName: '',
  inPrice:'',
  outPrice: '',
  itemGrp1: '',
  vegan:  false,
  halal: false,
  rspo: false,
  addtion: false,
})

const saveInfo = async () =>{
  const formData = new FormData();
  try{
    const materialInfo = {
      itemCd: itemCd,
      historyId : historyId.value,
      attachFileId : attachFileId.value,
      userId: userId,
    }

    formData.append('materialInfo', JSON.stringify(materialInfo))
    formData.append('materialList', JSON.stringify(materialMappingList.value))
    formData.append('historyList', JSON.stringify(historyList.value))

    const deleteFiles = []

    attachFile.value.forEach(file => {
      if (file.flag === 'N') {
        formData.append('newFiles', file.file)
      } else if (file.flag === 'D') {
        deleteFiles.push({
          attachFileId: file.attachFileId,
          seq: file.seq
        });
      }
    })

    formData.append('keptFiles', JSON.stringify(attachFile.value.filter(f => f.flag === 'S')))
    if (deleteFiles.length > 0) {
      formData.append('deleteFiles', new Blob(
        [JSON.stringify(deleteFiles)],
        { type: 'application/json' }
      ));
    }

    const msg = await ApiLab.saveMaterialInfo(formData)
    vSuccess(msg)
  }catch(err) {
    vError(err.respose)
  }
}

const openPop = () =>{
  dialog.value = true
}

const addRow = () => {
  const nextId = historyList.value.length;

  const newItem = {
    historyComment: '',
    updName: '',
    updDate: '',
    orderDist: nextId,
    historyId: '',
  };

  // 기존 리스트 뒤에 추가
  historyList.value.push({ ...newItem });
};

const handleSelected = (obj) =>{
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

const removeRow =(id) => {
  const index = materialMappingList.value.findIndex(ingredient => ingredient.ingredientCode === id)
  materialMappingList.value.splice(index, 1)
}
const removeRow1 =(id) => {
  const index = historyList.value.findIndex(history => history.historyId === id)
  historyList.value.splice(index, 1)
}

onMounted( async() =>{
  const res = await ApiLab.getMaterialInfo(itemCd)
  Object.assign(form, res.itemInfo)

  if ( !isEmpty(res.fileList) ){
    attachFile.value = res.fileList
    attachFileId.value =res.materialInfo.attachFileId
  }
  if ( !isEmpty(res.materialList) ) {
    materialMappingList.value = res.materialList
  }
  if ( !isEmpty(res.historyList) ) {
    historyId.value = res.materialInfo.historyId
    historyList.value = res.historyList
  }
})

const goList = () =>{
  router.push({name:'MaterialList'})
}

</script>

<style scoped>
@import '@/assets/css/main.css';

.v-col{
  padding: 2px;
}

.custom-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 1px;
}
.custom-line {
  border: 0.5px solid;
  background: #f1f3f4;
  padding: 2px;
}
.summary-row {
  background-color: #f4f4f4;
  height: 30px;
}
.custom-cell-input {
  padding: 0 !important;
  margin: 0 !important;
}

.custom-cell-input .v-field {
  padding: 0 !important;
  min-height: 25px; /* 원하는 높이 (테이블 row 높이에 맞춤) */
}
</style>
