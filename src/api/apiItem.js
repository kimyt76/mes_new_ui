import { API_URL} from '.'


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
    try{
      const msg = await API_URL.post(`/item/saveItemInfo`, params)

      return msg.data

    }catch(err){
      throw err
    }
  },

  updateItemInfo : async(params) => {
    try{
      const msg = await API_URL.post(`/item/updateItemInfo`, params)

      return msg.data

    }catch(err){
      throw err
    }
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
    try{
      const msg = await API_URL.post(`/item/saveItemDetailInfo`, params)

      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
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
