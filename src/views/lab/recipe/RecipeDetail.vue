<template>
<div :id="$attrs.id"></div>
<v-breadcrumbs :items="['MES', '연구관리', '처방상세']"></v-breadcrumbs>
<v-card>
  <v-card-text>
    <v-form  @submit.prevent="saveInfo">
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
            label="제품코드"
            :items="prodTypes"
            item-title="codeNm"
            item-value="code"
            variant="underlined"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col class="mt-3">
          <v-card-subtitle>
            - 품목코드
          </v-card-subtitle>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn
            color="brown-lighten-4"
            class="mt-3"
            text="추가+"
            density="compact"
            @click="openPop('I')"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table-virtual
            :headers="headers"
            :items="recipeList"
            style="height: 500px;"
            class="custom-table no-padding-table"
            >
            <template #item.phase="{ item, index }">
              <input
                v-model="recipeList[index].phase"
                style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                class="custom-line"
              />
            </template>
            <template #item.content="{ item, index }">
              <input
                v-model="recipeList[index].content"
                style="text-align: right; width: 90%;"
                class="custom-line"
                @blur="onBlur(index)"
              />
            </template>
            <template #item.inPrice="{ item, index }">
              <input
                v-model="recipeList[index].inPrice"
                style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                class="custom-line"
                readonly
              />
            </template>
            <template #item.unitPrice="{ item, index }">
              <input
                v-model="recipeList[index].unitPrice"
                type="number"
                style="text-align: right; width: 90%; min-width: 90%; max-width: 90%;"
                readonly
              />
            </template>
            <template #item.actions="{ item }">
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeRow(item.ingredientCode)"></v-icon>
            </template>
            <!-- 총합 -->
          <template v-slot:body.append>
            <tr class="summary-row">
              <td style="width: 10px; height: 30px; text-align: center;" >합계 : </td>
              <td></td>
              <!-- itemName -->
              <td style="width: 480px; height: 30px;"></td>
              <!-- 함량 -->
              <td style="width: 110px; height: 30px; text-align: right; font-weight: bold;">
                {{ totalContent.toLocaleString() }}
              </td>
              <!-- totInPrice -->
              <td style="width: 110px;  height: 30px; text-align: right; font-weight: bold;">
                {{ totInPrice.toLocaleString() }}
              </td>
              <!-- vatPrice 합계 -->
              <td style="width: 100px; height: 30px; text-align: right; font-weight: bold;">
                {{ totUnitPrice.toLocaleString() }}
              </td>
              <td></td>
            </tr>
          </template>
          </v-data-table-virtual>
        </v-col>
      </v-row>
      <v-row class="justify-end mb-3 mr-2" dense>
      <v-col cols="auto">
        <v-btn text="BOM연결"
          @click="openPop('B')"
          />
      </v-col>
      <v-col cols="auto">
        <v-btn text="저장"
          color="brown-lighten-4"
          type="submit"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn text="전성분(수출)"
          color="#FFE0B2"
          @click="openPop('J')"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn text="단가"

          />
      </v-col>
      <v-col cols="auto">
        <v-btn text="중국위행허가"
          @click="openPop('G')"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn text="목록" @click="goList" />
      </v-col>
    </v-row>
    </v-form>
  </v-card-text>

</v-card>

<v-dialog v-model="dialog" width="800px" height="800px" persistent>
    <component
      :is="currentComponent"
      :id="id"
      @selected="handleselect"
      @close-dialog="dialog = false"
    />
</v-dialog>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { useAlertStore } from '@/stores/alert';
import { todayKST, isEmpty, formatDate } from '@/util/common';
import { onMounted, reactive, ref, shallowRef, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserListPop from '@/views/system/user/UserListPop.vue';
import ClientListPop from '@/views/basic/client/ClientListPop.vue';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import { useAuthStore } from '@/stores/auth';

const { vError, vSuccess, vInfo, vWarning} = useAlertStore()
const { userId } = useAuthStore()
const router = useRouter()
const route = useRoute()
const currentComponent = shallowRef(null)
const recipeId = route.params.id
const recipeList = ref([])
const prodTypes = ref([])
const dialog = ref(false)
const selectPop = ref('')
const form = reactive({
  clientName: '',
  clientId: '',
  prodName:'',
  managerName: '',
  managerId: '',
  regDate : '',
  labNo: '',
  prodType: '',

  userId: userId,
})

const headers = [
  { title: 'Phase ',     key: 'phase',     align: 'center'  ,width : '50px'},
  { title: '품목코드',   key: 'itemCd',     align: 'center', width : '150px'},
  { title: '품목명',     key: 'itemName',   align: 'start', width : '480px'},
  { title: '함량',       key: 'content',    align: 'center' ,width : '140px'},
  { title: '원가(원)',   key: 'costPrice',  align: 'center' ,width : '140px'},
  { title: '단가(원/g)', key: 'unitPrice',  align: 'center' ,width : '140px'},
  { title: '-', key: 'actions',  align: 'center' ,width : '10px'},
]

// 1. 함량 합계
const totalContent = computed(() => {
  // .value로 실제 배열에 접근합니다.
  return recipeList.value.reduce((sum, item) => sum + Number(item.content || 0), 0);
});

// 2. 원가 합계
const totInPrice = computed(() => {
  return recipeList.value.reduce((sum, item) => sum + Number(item.inPrice || 0), 0);
});
// 3. 단가 합계
const totUnitPrice = computed(() => {
  return recipeList.value.reduce((sum, item) => sum + Number(item.unitPrice || 0), 0);
});

const onBlur = (index) => {
  const content = Number(recipeList.value[index].content);
  const inPrice = Number(recipeList.value[index].inPrice);

  if (!isNaN(content) && !isNaN(inPrice)) {
    recipeList.value[index].unitPrice = content * inPrice*0.001*0.01;
  } else {
    recipeList.value[index].unitPrice = 0;
  }

  if(totalContent.value > 100 ) {
    vWarning("함량이 100보다 큽니다. ")
    recipeList.value[index].content = 0
  }
};

const openPop = type =>{
  selectPop.value = type

  if (  type === 'C' ) {
    currentComponent.value = ClientListPop
  }else if( type === 'U' ){
    currentComponent.value = UserListPop
  }else if( type === 'I' ) {
    currentComponent.value = ItemListMultiPop
  }else if( type === 'B' ) {
    //currentComponent.value = bomListPop
  }
  dialog.value = true
}

const saveInfo = async () =>{
  try{
    const params = {
      recipeInfo : form,
      recipeList : recipeList.value
    }
    params.recipeInfo.regDate = formatDate(params.recipeInfo.regDate)

    const res = await ApiLab.saveRecipeInfo(params)
    form.recipeId = res.recipeId
    vSuccess("저장되었습니다.")
  }catch(err){
    vError(err)
  }
}

const handleselect = (obj) =>{
  if ( selectPop.value === 'C') {
    form.clientName = obj.clientName
    form.clientId = obj.clientId
  }else if ( selectPop.value === 'U' ){
    form.managerId = obj.userId
    form.managerName = obj.memberNm
  }else if ( selectPop.value === 'I' ){
    addRecipeList(obj)
  }
}

const addRecipeList = (obj) => {
  if (!Array.isArray(obj)) return;

  let nextId = recipeList.value.length;

  const selectItem = obj.map((o, index) => ({
      id: nextId++,
      Phase: '',
      itemCd: o.itemCd,
      itemName: o.itemName,
      content: '',
      inPrice: obj.inPrice,
      unitPrice: '',
  }));

  if (recipeList.value.length > 0) {
    recipeList.value.push(...selectItem);
  } else {
    recipeList.value = [...selectItem];
  }
}

const removeRow =(id) => {
  const index = recipeList.value.findIndex(item => item.itemCd === id)
  recipeList.value.splice(index, 1)
}

onMounted( async () =>{
  prodTypes.value = await ApiCommon.getCodeList('prod_type')

  if ( isEmpty(recipeId)  ){
    form.redDate = todayKST()
  }else{
    const res = await ApiLab.getRecipeInfo(recipeId)

    Object.assign(form, res.recipeInfo)
    recipeList.value = res.recipeList
  }

})

const goList = () =>{
  router.push({name:'RecipeList'})
}
</script>

<style scoped>
@import '@/assets/css/main.css';

.custom-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 2px;
}

.custom-line {
  border: 0.5px solid;
  background: #f1f3f4;
  padding: 2px;
}
.summary-row {
  background-color: #f4f4f4;
  height: 40px;
}
.custom-cell-input {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
