import { API_URL } from '.'


export const  ApiPurchase = {

    /* 발주 조회 */
    getPurchaseOrderList: async(params)  =>{
        try{
            const res = await API_URL.post('/purchaseOrder/getPurchaseOrderList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
     /* 발주 상세 */
    getPurchaseOrderInfo: async(params) =>{
        try{
            const res = await API_URL.post(`/purchaseOrder/getPurchaseOrderInfo`, params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
     /* 발주 저장 */
    savePurchaseOrder: async(params) =>{
        return await API_URL.post('/purchaseOrder/savePurchaseOrder', params)
    },

     /* 발주 업데이트 */
    updatePurchaseOrder: async(params) =>{
        return await API_URL.post('/purchaseOrder/updatePurchaseOrder', params)
    },

    /* 메일발송 */
    orderMail: async(params) =>{
        return API_URL.post('/purchaseOrder/orderMail', params)
    },

    /**
     * 발주 인쇄
     * @param {*} params
     * @returns
     */
    printOut: async(params) =>{
        try{
            const res = await API_URL.post(`/purchaseOrder/printOut`, params,{
                 responseType: "blob"
            })
            return res.data
        }catch(err){
            throw err.response
        }
    },

     /* 발주 조회(구매 팝업용 ) */
    getSubItemList: async(params)  =>{
        try{
            const res = await API_URL.post('/purchaseOrder/getSubItemList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

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

    /* 바코드 */
    /* 인쇄 */
}
