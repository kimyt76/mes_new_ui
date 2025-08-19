import { API_URL} from '.'


export const ApiOrder = {

  getOrderList: async(params) => {
    try{
      const res = await API_URL.post('/order/getOrderList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getOrderInfo: async(id) => {
    try{
      const res = await API_URL.get(`/order/getOrderInfo/${id}`)

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  saveOrderInfo: async(formData) => {
    try{
      const res =  await API_URL.post('/order/saveOrderInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  getSeq : async() => {
    try{
      const seq = await API_URL.get('/order/getSeq')

      return seq.data
    }catch(err){
      throw err.response
    }
  },

  getApprovalInfo : async() => {
    try{
      const res = await API_URL.get('/order/getApprovalInfo')

      return res.data
    }catch(err){
      throw err.response
    }
  },

  updateInfo : async(params) => {
    try{
      const msg= await API_URL.post('/order/updateInfo', params)

      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  getContractList: async(params) => {
    try{
      const res = await API_URL.post('/contract/getContractList', params)

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  getContractInfo: async(id) => {
    try{
      const res = await API_URL.get(`/contract/getContractInfo/${id}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getNextSeq : async(date) => {
    try{
      const seq = await API_URL.get(`/contract/getNextSeq/${date}`)

      return seq.data
    }catch(err){
      throw err.response
    }
  },

  saveContractInfo : async(formData) => {
    try{
      const msg =  await API_URL.post('/contract/saveContractInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return msg.data

    }catch(err) {
      throw new Error(err.response?.data);
    }
  }

}
