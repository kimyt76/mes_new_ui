import { API_URL } from '.'

export const ApiMat = {
  // 예상제조계획
  getMatPlanList: async(params) => {
    try{
      const res = await API_URL.post('/mat/getMatPlanList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getMatPlanInfo: async(id) => {
    try{
      const res = await API_URL.get(`/mat/getMatPlanInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },

  saveMatPlanList: async(params) => {
    try{
      const msg = await API_URL.post(`/mat/saveMatPlanList`, params)
      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },


}
