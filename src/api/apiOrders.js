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


  /*  주문서  */
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
  saveContractInfo : async(formData) => {
    try{
      // const msg =  await API_URL.post('/contract/saveContractInfo', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      const msg =  await API_URL.post('/contract/saveContractInfo', formData)
      return msg.data

    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  updateContractInfo : async(formData) => {
    try{
      const msg =  await API_URL.post('/contract/updateContractInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return msg.data

    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  getContractItemList : async(ids) => {
    try{
      const res = await API_URL.get(`/sale/getContractItemList/${ids}`)

      return res.data
    }catch(err){
      throw err.response
    }
  },

  /*  판매 관리  */
  getSaleList: async(params) => {
    try{
      const res = await API_URL.post('/sale/getSaleList', params)

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },
  getSaleInfo: async(id) => {
    try{
      const res = await API_URL.get(`/sale/getSaleInfo/${id}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveSaleInfo : async(param) => {
    try{
      const msg =  await API_URL.post('/sale/saveSaleInfo', param)
      return msg.data

    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  getSaleItemList:  async(id) => {
    try{
      const res = await API_URL.get(`/sale/getSaleItemList/${id}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },


  /*  출하시지서 관리  */
  getShipmentList: async(params) => {
    try{
      const res = await API_URL.post('/shipment/getShipmentList', params)

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },
  getShipmentInfo: async(id) => {
    try{
      const res = await API_URL.get(`/shipment/getShipmentInfo/${id}`)

      return res.data

    }catch(err){
      throw new Error(err.response?.data);
    }
  },
  getSalesItemList:  async(ids) => {
    try{
      const res = await API_URL.get(`/shipment/getSalesItemList/${ids}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  saveShipmentInfo : async(param) => {
    try{
      const msg =  await API_URL.post('/shipment/saveShipmentInfo', param)
      return msg.data

    }catch(err) {
      throw new Error(err.response?.data);
    }
  },
  getShipmentItemList: async (id) => {
    try{
      const res = await API_URL.get(`/shipment/getShipmentItemList/${id}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getProgressList: async(prams) => {
    try{
      console.log('prams',prams )
      const res = await API_URL.post('/progress/getProgressList', prams)

      return res.data

    }catch(err){
      throw err.response
    }
  },

}
