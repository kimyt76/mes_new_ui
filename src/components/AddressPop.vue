<template>
  <v-card class="pa-4" max-width="600">
    <v-text-field
      v-model="searchKeyword"
      label="주소 검색"
      append-inner-icon="mdi-magnify"
      @keyup.enter="searchAddress"
      @click:append-inner="searchAddress"
    />

    <v-list v-if="addressList.length">
      <v-list-item
        v-for="(item, index) in addressList"
        :key="index"
        @click="selectAddress(item)"
        class="cursor-pointer"
      >
        <v-list-item-title>{{ item.roadAddr }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.jibunAddr }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-alert v-if="!addressList.length && searchDone" type="info" class="mt-4">
      검색 결과가 없습니다.
    </v-alert>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const searchKeyword = ref('')
const addressList = ref([])
const searchDone = ref(false)

// 실제 발급받은 키로 바꿔야 함
const CONFIRM_KEY = 'YOUR_API_KEY'

const searchAddress = async () => {
  if (!searchKeyword.value) return

  const url = 'https://api.vworld.kr/req/data'
  const params = {
    confmKey: CONFIRM_KEY,
    currentPage: 1,
    countPerPage: 10,
    keyword: searchKeyword.value,
    resultType: 'json',
  }

  try {
    const { data } = await axios.get(url, { params })

    if (data.results) {
      addressList.value = data.results.juso || []
    } else {
      addressList.value = []
    }
  } catch (err) {
    console.error('주소 검색 실패:', err)
    addressList.value = []
  }

  searchDone.value = true
}

const selectAddress = (item) => {
  console.log('선택된 주소:', item.roadAddr)
  alert(`선택된 주소: ${item.roadAddr}`)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
