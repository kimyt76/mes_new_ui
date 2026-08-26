import { API_URL } from '.'

export const ApiMonitoring = {

  getEquipOperationInfoList : async(params) =>{
    try{
      const res = await API_URL.get('/monitoring/getEquipOperationInfoList', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getMatMonitoring : async(params) =>{
    try{
      const res = await API_URL.get('/monitoring/getMatMonitoring', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getProdPerformaceStatus : async(params) =>{
    try{
      const res = await API_URL.post('/monitoring/getProdPerformaceStatus', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },

  getContactTagInfo: async(params) =>{
    try{
      const res = await API_URL.post('/monitoring/getContactTagInfo', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },
  getContactTagValue: async(params) =>{
    try{
      const res = await API_URL.post('/monitoring/getContactTagValue', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },

  getChargeMonitoringInfo: async(params) =>{
    try{
      const res = await API_URL.post('/monitoring/getChargeMonitoringInfo', params )

      return res.data
    }catch(err){
      throw err.response
    }
  },



}
