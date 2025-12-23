import { API_URL } from '.'


export const ApiWorkOrder = {
  getWorkOrderList: async(params) => {
    try{
      const res = await API_URL.post('/workOrder/getWorkOrderList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  getWorkOrderInfo: async(id) => {
    try{
      const res = await API_URL.get(`/workOrder/getWorkOrderInfo/${id}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveWorkOrderInfo: async(params) => {
    try{
      const res = await API_URL.post('/workOrder/saveWorkOrderInfo', params)

      return res.data

    }catch(err){
      throw err
    }
  },



}
