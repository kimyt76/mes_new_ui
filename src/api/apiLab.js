import { API_URL} from '.'

export const ApiLab = {

  getIngredientList: async(params) => {
    try{
      const res = await API_URL.post('/lab/getIngredientList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

  getIngredientInfo: async(id) => {
    try{
      const res = await API_URL.get(`/lab/getIngredientInfo/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },

  saveIngredientInfo: async(params) => {
    try{
      const msg = await API_URL.post(`/lab/saveIngredientInfo`, params)
      return msg.data
    }catch(err){
      throw new Error(err.response?.data);
    }
  },



}
