import { API_URL } from '.'

export const ApiQc = {




/**
 * 공정검사
 * @returns
 */
  getProcTestTypeList : async() =>{
    try{
      const res = await API_URL.get('/qc/getProcTestTypeList')

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getProcTestTypeMethod : async(id) => {
    try{
      const res = await API_URL.get(`/qc/getProcTestTypeMethod/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getProcTestTypeMethodInfo : async(id) => {
    try{
      const res = await API_URL.get(`/qc/getProcTestTypeMethodInfo/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  saveProcTestTypeMethod: async(params) => {
    return await API_URL.post('/qc/saveProcTestTypeMethod' , params)
  },


}
