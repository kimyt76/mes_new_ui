<template>
  <!-- 다이얼로그 -->
      <v-card>
        <v-card-title>패스워드 초기화</v-card-title>
            <v-text-field
              v-model="userNm"
              label="사용자Id(명)"
            ></v-text-field>
            <v-btn
              class="me-4"
              block
              @click="passInit"
            >초기화</v-btn>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            variant="text"
            style="height: 25px"
           @click="$emit('close-dialog')"
            >닫기</v-btn>
        </v-card-actions>
      </v-card>

</template>


<script setup>
import { ref } from 'vue';

defineEmits(['close-dialog']); //부모에게 이벤트 전달

const userNm = ref('');
const pass = ref('1234');


const passInit = () =>{
  const param ={
    id : userNm.value,
    password : pass.value,
  }

  console.log('param',param.id)
  console.log('param',param.password)
}




</script>

<style lang="scss" scoped>

</style>

