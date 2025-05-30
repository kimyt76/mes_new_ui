import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common', () => {
    const result = ref([])

    const commonList = async (type) =>{
      try{
        const res =  await commonList(type) ;
        console.log('res' , res)

        result.value = res
      }catch(err){
        throw err;
      }
    }

    return { result }
})

