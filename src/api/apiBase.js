import { API_URL} from '.'

export const ApiBase = {

  getItemList : async(params) =>{
    try{
      const res = await API_URL.post('/base/getItemList', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },


}
