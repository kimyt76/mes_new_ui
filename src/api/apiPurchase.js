import { API_URL } from '.'


export const  ApiPurchase = {
    /* 구매조회 */
    getPurchaseList: async(params)  =>{
        try{
            const res = await API_URL.post('/purchase/getPurchaseList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
     /* 구매 상세 */
    getPurchaseInfo: async(id) =>{
        try{
            const res = await API_URL.get(`/purchase/getPurchaseInfo/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    /* 구매 저장 */
    savePurchaseInfo: async(params) =>{
        return await API_URL.post('/purchase/savePurchaseInfo', params)
    },

    /* 구매 수정 */
    updatePurchaseInfo: async(params) =>{
        return await API_URL.post('/purchase/updatePurchaseInfo', params)
    },

    /* 구매 삭제 */
    deletePurchase: async(id) =>{
        return await API_URL.get(`/purchase/deletePurchase/${id}`)
    },

    getPurchaseDetailList :  async(params)  =>{
        try{
            const res = await API_URL.post('/purchase/getPurchaseDetailList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },


    /* 바코드 */

    /* 인쇄 */
    printOut: async(params) =>{
        try{
            const res = await API_URL.post(`/purchase/printOut`, params,{
                 responseType: "blob"
            })
            return res.data
        }catch(err){
            throw err.response
        }
    },


}
