import { API_URL } from '.'

//공정 API
export const ApiProc = {

  getWorkerList: async(id) => {
      return  await API_URL.get(`/procCommon/getWorkerList/${id}`)
  },

  getEquipmentList: async(id) => {
      return  await API_URL.get(`/procCommon/getEquipmentList/${id}`)
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
    try{
      const msg = await API_URL.post(`/procWeigh/saveWeighInfo`, params)
      return msg.data
    }catch(err){
      throw err
    }
  },





  //제조
 getMatList: async(params) => {
      return await API_URL.post('/procWeigh/getMatList', params)
  },



  //코팅





  //충전









  //포장











}
