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
  deleteWorkOrders: async(ids) => {
      return await API_URL.delete(`/workOrder/deleteWorkOrders`, {data: ids})
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
      return await API_URL.post('/workOrder/saveWorkOrderInfo', params)
  },

//   worker
  getWorkerAllList: async(params) =>{
    const res = await API_URL.post('/worker/getWorkerAllList', params)
    return  res.data
  },
  getWorkerList: async(cd) =>{
    const res = await API_URL.get(`/worker/getWorkerList/${cd}`)
    return res.data
  },
  getWorkerInfo: async(id) =>{
    const res = await API_URL.get(`/worker/getWorkerInfo/${id}`)
    return  res.data
  },
  saveWorkerInfo: async(params) =>{
    return await API_URL.post('/worker/saveWorkerInfo', params)
  },




}
