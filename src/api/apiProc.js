import { API_URL } from '.'

//공정 API
export const ApiProc = {

    /**  공통 */
  getWorkerList: async(params) => {
      return  await API_URL.post('/procCommon/getWorkerList',params)
  },
  getBagWeightList: async() => {
      return  await API_URL.get(`/procCommon/getBagWeightList`)
  },

  getEquipmentList: async(id) => {
      return  await API_URL.get(`/procCommon/getEquipmentList/${id}`)
  },

  updateProcStatus: async(params) => {
    return await API_URL.post(`/procCommon/updateProcStatus`, params)
  },



  // 칭량
  getWeighList: async(params) => {
    try{
      const res = await API_URL.post('/procWeigh/getWeighList', params)
      return res.data
    }catch(err){
      throw err.response
    }
  },
  getWeighInfo: async (params) => {
    try {
        const res = await API_URL.post('/procWeigh/getWeighInfo', params)
        return res.data
    } catch (err) {
        throw err.response
    }
  },
  saveWeighInfo: async(params) => {
    return await API_URL.post(`/procWeigh/saveWeighInfo`, params)
  },
  printWeighLabel: async(params) =>{
        try{
            const res = await API_URL.post(`/procWeigh/printWeighLabel`, params,{
                 responseType: "blob"
            })
            return res.data
        }catch(err){
            throw err.response
        }
  },
  startProcWeigh: async(params) => {
    return await API_URL.post(`/procWeigh/startProcWeigh`, params)
  },
  saveWeighList: async(params) => {
    return await API_URL.post(`/procWeigh/saveWeighList`, params)
  },
  getStockTestNoList: async(params) => {
    try{
      const res = await API_URL.post('/procWeigh/getStockTestNoList', params)
      return res.data
    }catch(err){
      throw err.response
    }
  },
  completeWeight: async(params) => {
    return await API_URL.post(`/procWeigh/completeWeight`, params)
  },



  //제조
  getMatList: async(params) => {
    try{
      const res = await API_URL.post('/procMat/getMatList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  getMakeInfo: async (params) => {
    try {
        const res = await API_URL.post('/procMat/getMakeInfo', params)
        return res.data
    } catch (err) {
        throw err.response
    }
  },




  //코팅
  getCoatingList: async(params) => {
    try{
      const res = await API_URL.post('/procCoating/getCoatingList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },


  //충전
  getChargeList: async(params) => {
    try{
      const res = await API_URL.post('/procCharge/getChargeList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },








  //포장
  getPackingList: async(params) => {
    try{
      const res = await API_URL.post('/procPacking/getPackingList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },










}
