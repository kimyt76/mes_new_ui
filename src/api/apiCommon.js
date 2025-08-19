import { API_URL} from '.'


export const ApiCommon = {

  getCodeList : async(type) =>{
    try{
      const res = await API_URL.get(`/common/getCodeList/${type}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },

  getCommonList : async(params) => {
    try{
      const res = await API_URL.post(`/common/getCommonList`, params )

      return res.data
    }catch(err){
      throw err.response
    }
  },

  saveCommonInfo : async(params) => {
    try{
      const msg = await API_URL.post(`/common/saveCommonInfo`, params )

      return msg.data
    }catch(err){
      throw err.response
    }
  },

  getCommonInfo : async(id) => {
    try{
      const res = await API_URL.get(`/common/getCommonInfo/${id}` )

      return res.data
    }catch(err){
      throw err.response
    }
  },

  uploadFile : async(formData) => {
    try{
      const res = await API_URL.post(`/uploadFile/saveFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('res',res)
      return res
    }catch(err){
      throw err.response
    }
  },

  deleteFile : async(fileId) => {
    try{
      const msg = await API_URL.delete(`/uploadFile/deleteFile/${fileId}`)
      return msg.data
    }catch(err){
      throw err.response
    }
  },

  newSeq : async(itemTypeCd, cd, seqLen) => {
    try{
      const code = await API_URL.get(`/common/newSeq`, {
        params: {
          itemTypeCd: itemTypeCd,
          cd: cd,
          seqLen: seqLen,
        }
      })

      return code.data
    }catch(err){
      throw err.response
    }
  },


}
