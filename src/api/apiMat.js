import { API_URL } from '.'

export const ApiMat = {
  // 원료제조계획
  getMatPlanList: async(params) => {
    try{
      const res = await API_URL.post('/mat/getMatPlanList', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },
  /**
   * 원료계획 상세 리스트
   * @param {*} id
   * @returns
   */
  getMatPlanDetailList: async(id) => {
    try{
      const res = await API_URL.get(`/mat/getMatPlanDetailList/${id}`)
      return res.data

    }catch(err){
      throw err.response
    }
  },

  /**
   * 원료계획 저장
   * @param {*} params
   * @returns
   */
  saveMatPlanList: async(params) => {
    return await API_URL.post(`/mat/saveMatPlanList`, params)
  },

  /**
   * 소요량계산
   * @param {*} params
   * @returns
   */
  getItemStockList: async(params) => {
    try{
      const res = await API_URL.post('/matCommon/getItemStockList', params)
      return res.data
    }catch(err){
      throw err.response
    }
  },


  /**
   *  부자재 BOM 자동조회
   * @param {*} params
   * @returns
   */
  getRequiredAmount: async(params) => {
    try{
      const res = await API_URL.post('/matCommon/getRequiredAmount', params)

      return res.data

    }catch(err){
      throw err.response
    }
  },

}
