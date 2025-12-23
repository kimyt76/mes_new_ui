import { API_URL} from '.'

export const  ApiSystems = {

  getUserList:  async (params) =>{
    try {
      const res =  await API_URL.post(`/systemMgmt/getUserList`, params)
      return res.data;

    } catch (error) {
      throw error.response;
    }
  },

  updateUserInfo: async (params) => {
    try{
      const res = await API_URL.patch('systemMgmt/updateUserInfo', params)
      return res
    }catch(err){
      throw err.response
    }
  },

  getUserInfo : async (id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/getUserInfo/${id}`)
      //console.log('res', res)
      return res.data
    }catch(err){
      throw err.response
    }
  },

  passwordInit: async(id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/passwordInit/${id}`)
      console.log('res', res)
      return res
    }catch(err){
      throw err.response
    }
  },

  userCheck: async(id) => {
    try{
      const res =  await API_URL.get(`/systemMgmt/userCheck/${id}`)
      console.log('res', res)
      return res
    }catch(err){
      throw err.response
    }
  },

}
