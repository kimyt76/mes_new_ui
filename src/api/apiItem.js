import { API_URL } from '.'


export const ApiItem = {

  getProdLList: async() => {
    try{
      const res = await API_URL.get('/item/getProdLList')

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getProdMList: async(code) => {
    try{
      const res = await API_URL.get(`/item/getProdMList/${code}`)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  saveItemInfo : async(params) => {
      return await API_URL.post(`/item/saveItemInfo`, params)
  },
  updateItemInfo : async(params) => {
     return await API_URL.post(`/item/updateItemInfo`, params)
  },

  getItemList : async(params) => {
    try{
      const res = await API_URL.post(`/item/getItemList`, params)

      return res.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  getItemInfo: async(id) => {
    try{
      const res = await API_URL.get(`/item/getItemInfo/${id}`)

      return res.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },

  getItemCdCheck: async(id) => {
    const res = await API_URL.get(`/item/getItemCdCheck/${id}`)
    return res.data
  },

  saveItemDetailInfo: async(params) => {
    return await API_URL.post(`/item/saveItemDetailInfo`, params)
  },

  saveItemAddInfo: async(params) => {
    return await API_URL.post(`/item/saveItemAddInfo`, params)
  },

  updatePriceInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/item/updatePriceInfo`, params)

      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },

}
