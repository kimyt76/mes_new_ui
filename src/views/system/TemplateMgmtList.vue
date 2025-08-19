<template>
<v-breadcrumbs :items="['MES', '시스템관리', 'template목록']"></v-breadcrumbs>
<v-card>
  <v-row>
    <v-col>
      <v-btn
        text="리스트 팝업 호출"
        @click="goListPop"
        />
      <v-btn
        text="리스트 체크박스 팝업 호출"
        @click="goListchkPop"
        />
      <v-btn
        text="리스트 라디오 팝업 호출"
        @click="goListRadioPop"
        />

      <v-btn
        text="리스트 호출"
        @click="goList"
        />
      <v-btn
        text="멀티 체크 리스트 호출"
        @click="goChkList"
        />
    </v-col>
  </v-row>
</v-card>
<MainList  v-if="isMainList"/>
<MainList_checkbox  v-if="isMainChkList"/>


<v-dialog v-model="dialog" width="800px" height="800">
  <ListPop
    @close-dialog="dialog = false"
    />
</v-dialog>

<v-dialog v-model="dialog" width="800px" height="800">
  <ListPop_checkbox
    @close-dialog="dialog = false"
    />
</v-dialog>
</template>

<script setup>
import ListPop from '@/tempVue/ListPop.vue';
import ListPop_checkbox from '@/tempVue/ListPop_checkbox.vue';
import MainList from '@/tempVue/MainList.vue';
import MainList_checkbox from '@/tempVue/MainList_checkbox.vue';
import { ref } from 'vue';


const dialog = ref(false)
const goListPop = () =>{
  dialog.value = true
}
const goListchkPop = () =>{
  dialog.value = true
}
const goListRadioPop = () =>{
  dialog.value = true
}


const isMainList = ref(false)
const isMainChkList = ref(false)

const goChkList = () =>{
  isMainList.value = true
}
const goList = () =>{
  isMainList.value = true
}




</script>

<style lang="scss" scoped>

</style>
