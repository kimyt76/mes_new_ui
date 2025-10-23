import { API_URL} from '.'

export const ApiLab = {
  // 성분관리
  getIngredientList: async(params) => {
    try{
      const res = await API_URL.post('/ingredient/getIngredientList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getIngredientInfo: async(id) => {
    try{
      const res = await API_URL.get(`/ingredient/getIngredientInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },

  saveIngredientInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/ingredient/saveIngredientInfo`, params)
      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  //원료관리
  getMaterialItemList: async(params) => {
    try{
      const res = await API_URL.post('/material/getMaterialItemList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  getMaterialList: async(id) => {
    try{
      const res = await API_URL.get(`/material/getMaterialList/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  getMaterialInfo: async(id) => {
    try{
      const res = await API_URL.get(`/material/getMaterialInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveMaterialInfo: async(formData) => {
    try{
      const msg =  await API_URL.post('/material/saveMaterialInfo', formData)

      return msg.data
    }catch(err) {
      throw new Error(err.response?.data);
    }
  },

  //연구처방
  getRecipeList: async(params) => {
    try{
      const res = await API_URL.post('/recipe/getRecipeList', params)
      return res.data

    }catch(err){
      throw err.response
    }
  },
   getRecipeInfo: async(id) => {
    try{
      const res = await API_URL.get(`/recipe/getRecipeInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveRecipeInfo: async(params) =>{
    try{
      const res =  await API_URL.post('/recipe/saveRecipeInfo', params)

      return res.data
    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  downloadRecipe: async (params) => {
    try {
      const res = await API_URL.post('/recipe/downloadRecipe',params,{
         responseType: 'blob'
      })

      return res.data
    } catch (err) {
      console.error('Download error:', err)
      throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
    }
  },
  downloadIngredient: async (recipeId) => {
    try {
      const res = await API_URL.get(`/recipe/downloadIngredient/${recipeId}`, {
        responseType: 'blob'
      })

      return res.data
    } catch (err) {
      console.error('Download error:', err)
      throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
    }
  },
  downloadIngredientCn: async (recipeId) => {
    try {
      const res = await API_URL.get(`/recipe/downloadIngredientCn/${recipeId}`, {
        responseType: 'blob'
      })

      return res.data
    } catch (err) {
      console.error('Download error:', err)
      throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
    }
  },

  //신원료
  getNewMaterialList: async(params) => {
    try{
      const res = await API_URL.post('/newMaterial/getNewMaterialList', params)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  getNewMaterialInfo: async(id) => {
    try{
      const res = await API_URL.get(`/newMaterial/getNewMaterialInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveNewMaterialInfo: async(params) =>{
    try{
      const res =  await API_URL.post('/newMaterial/saveNewMaterialInfo', params)

      return res.data
    }catch(err) {
      throw new Error(err.response?.data);
    }
  }
}
