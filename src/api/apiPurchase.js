import { API_URL } from '.'


export const  ApiPurchase = {






  orderMail: async(params) =>{
    return API_URL.post('/purchaseOrder/orderMail', params)
  },

}
