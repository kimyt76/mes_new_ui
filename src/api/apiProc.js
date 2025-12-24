import { API_URL } from '.'

//공정 API
export const ApiProc = {
  // 칭량
  getWeighList: async(params) => {
    try{
      const res = await API_URL.post('/proc/getMatPlanList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  getWeighInfo: async(id) => {
    try{
      const res = await API_URL.get(`/proc/getWeighInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveWeighInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/proc/saveWeighInfo`, params)
      return msg.data
    }catch(err){
      throw err
    }
  },





  //제조




  //코팅





  //충전









  //포장











}
