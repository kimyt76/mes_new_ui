import { API_URL } from '.'

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
  getProdTypeList: async() => {
    try{
      const res = await API_URL.get('/recipe/getProdTypeList')
      return res.data

    }catch(err){
      throw err.response
    }
  },
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
     return  await API_URL.post('/recipe/saveRecipeInfo', params)
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
  },
  getNewMaterialListMapping: async(id) => {
    try{
      const res = await API_URL.get(`/newMaterial/getNewMaterialListMapping/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveNewMaterialMapping: async(params) =>{
    try{
      const res =  await API_URL.post('/newMaterial/saveNewMaterialMapping', params)

      return res.data
    }catch(err) {
      const message = err.response?.data?.message
      throw new Error(message);
    }
  },

  //샘플 리스트
  getSampleList: async(params) => {
    try{
      const res = await API_URL.post('/sample/getSampleList', params)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  getSampleInfo: async(id) => {
    try{
      const res = await API_URL.get(`/sample/getSampleInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveSampleInfo: async(params) =>{
    try{
      const res =  await API_URL.post('/sample/saveSampleInfo', params)

      return res.data
    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  getNextProdMgmtNo: async() => {
    try{
      const res = await API_URL.get('/sample/getNextProdMgmtNo')
      return res.data

    }catch(err){
      throw err.response
    }
  },

  getProductTypeInfo: async(id) => {
    try{
      const res = await API_URL.get(`/bom/getProductTypeInfo/${id}`)
      return res.data
    }catch(err){
      throw err
    }
  },
  getBomList: async(params) => {
    try{
      const res = await API_URL.post('/bom/getBomList', params)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  getBomMatList: async(params) => {
    try{
      const res = await API_URL.post('/bom/getBomMatList', params)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  getBomInfo: async(id) => {
    try{
      const res = await API_URL.get(`/bom/getBomInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveBomInfo: async(params) =>{
    try{
      const res =  await API_URL.post('/bom/saveBomInfo', params)

      return res.data
    }catch(err) {
      throw err
    }
  },
  saveBomVerInfo: async(params) =>{
    try{
      const res =  await API_URL.post('/bom/saveBomVerInfo', params)

      return res.data
    }catch(err) {
      throw err
    }
  },
  getItemBomStockList: async(params) => {
    try{
      const res = await API_URL.post('/bom/getItemBomStockList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  /**
   *
   */
  getItemBomList: async(id) => {
    try{
      const res = await API_URL.get(`/bom/getItemBomList/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },

  getItemsBomList: async(parms) => {
    try{
      const res = await API_URL.post(`/bom/getItemsBomList`, parms)
      return res.data

    }catch(err){
      throw err.response
    }
  },




}
