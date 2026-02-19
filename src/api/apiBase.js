import { API_URL } from '.'

export const ApiBase = {

  getCustomerList : async(params) =>{
    try{
      const res = await API_URL.post('/customer/getCustomerList', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getCustomerInfo : async(id) => {
    try{
      const res = await API_URL.get(`/customer/getCustomerInfo/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getCheckCustomerCd : async(id) => {
    try{
      const chk = await API_URL.get(`/customer/getCheckCustomerCd/${id}` )

      return chk.data
    }catch(err){
      throw err.response
    }
  },

  saveCustomerInfo: async(params) => {
    return await API_URL.post('/customer/saveCustomerInfo' , params)
  },
  getStorageList: async(params) =>{
    try{
      const res = await API_URL.post('/storage/getStorageList', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getStorageInfo: async(id) => {
    try{
      const res = await API_URL.get(`/storage/getStorageInfo/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  saveStorageInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/storage/saveStorageInfo`, params)

      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },
  getClientList : async(params) =>{
    try{
      const res = await API_URL.post('/client/getClientList', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getClientInfo: async(id) => {
    try{
      const res = await API_URL.get(`/client/getClientInfo/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },
   saveClientInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/client/saveClientInfo`, params)

      return msg.data
    }catch(err){
      throw err
    }
  },
  getBusinessNoChecked: async(id) => {
    try{
      const res = await API_URL.get(`/client/getBusinessNoChecked/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },


}
