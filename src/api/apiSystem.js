import { API_URL } from '.';

export const  ApiSystem = {

    /**사용자 관리 */
  getUserList:  async (params) =>{
    try {
      const res =  await API_URL.post(`/systemMgmt/getUserList`, params)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },

  updateUserInfo: async (params) => {
    try{
      const res = await API_URL.patch('/systemMgmt/updateUserInfo', params)
      return res
    }catch(err){
      throw err.response
    }
  },

  getUserInfo : async (id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/getUserInfo/${id}`)
      //console.log('res', res)
      return res.data
    }catch(err){
      throw err.response
    }
  },

  passwordInit: async(id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/passwordInit/${id}`)
      console.log('res', res)
      return res
    }catch(err){
      throw err.response
    }
  },

  userCheck: async(id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/userCheck/${id}`)
      console.log('res', res)
      return res
    }catch(err){
      throw err.response
    }
  },


/* 메뉴관리 */
  getMenuList: async (id) =>{
        try {
            const res =  await API_URL.get('/systemMgmt/getMenuList')
            return res.data;

        } catch (error) {
            throw error.response;
        }
  },

  getMenuMgmtList: async (params) =>{
        try {
            const res =  await API_URL.post('/systemMgmt/getMenuMgmtList', params)
            return res.data;

        } catch (error) {
            throw error.response;
        }
  },
  getMenuDetail: async (id) =>{
        try {
            const res =  await API_URL.get(`/systemMgmt/getMenuDetail/${id}`)
            return res.data;

        } catch (error) {
            throw error.response;
        }
  },
  saveMenu: async(params) => {
        return await API_URL.post('/systemMgmt/saveMenu', params)
  },
  updateMenuUseYn: async(params) =>{
        return  await API_URL.post('/systemMgmt/updateMenuUseYn', params)
  },

/* 권한관리 */
  getAuthMenuInfo: async (params) =>{
        try {
            const res =  await API_URL.post('/systemMgmt/getAuthMenuInfo', params)
            return res.data;

        } catch (error) {
            throw error.response;
        }
  },

 getUserMenuAuthList: async (params) =>{
        try {
            const res =  await API_URL.post('/systemMgmt/getUserMenuAuthList', params)
            return res.data;

        } catch (error) {
            throw error.response;
        }
  },

  saveMenuAuth: async(params) => {
        return await API_URL.post('/systemMgmt/saveMenuAuth', params)
  },

  copyMenuAuthInfo: async(params) => {
        return await API_URL.post('/systemMgmt/copyMenuAuthInfo', params)
  },


//  전자저울
  getScaleList:  async (params) =>{
    try {
      const res =  await API_URL.post(`/scale/getScaleList`, params)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  getScaleInfo:  async (id) =>{
    try {
      const res =  await API_URL.get(`/scale/getScaleInfo/${id}`)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  saveScaleInfo: async (params) => {
    try{
      const res = await API_URL.patch('/scale/saveScaleInfo', params)
      return res
    }catch(err){
      throw err
    }
  },

  /* 창고관리 */
  getStorageList: async (params) =>{
    try {
      const res =  await API_URL.post(`/storage/getStorageList`, params)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  getStorageInfo: async (id) =>{
    try {
      const res =  await API_URL.get(`/storage/getStorageInfo/${id}`)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  saveStorageInfo: async (params) => {
    return await API_URL.post('/storage/saveStorageInfo', params)
  },

  getStorageCodeList: async () =>{
    try {
      const res =  await API_URL.get(`/storage/getStorageCodeList`)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  getAreaStorageList: async (cd) =>{
    try {
      const res =  await API_URL.get(`/storage/getAreaStorageList/${cd}`)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },
  useCheck: async (id) =>{
    try {
      const res =  await API_URL.get(`/storage/useCheck/${id}`)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },




}
