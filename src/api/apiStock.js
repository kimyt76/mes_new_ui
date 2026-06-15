import { API_URL } from '.'

export const ApiStock = {
    /**
     * 재고 조회
     */
    getStockItemList: async(params) => {
        try{
            const res = await API_URL.post('/stock/getStockItemList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     * 품목별 사용량
     */
    getItemUseList: async(params) => {
        try{
            const res = await API_URL.post('/stock/getItemUseList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

/******************자재이동요청************************************************************************** */

    getNextRegSeq:async(params) => {
        try{
            const res = await API_URL.post('/moveReq/getNextRegSeq', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     *  자재이동요청( 공정 별)
     */
    getMoveReqItems : async(params) => {
        try{
            const res = await API_URL.post('/moveReq/getMoveReqItems', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     * 자재이동저장 (공정별)
     */
    saveProcMoveReq: async(params) => {
        return await API_URL.post('/moveReq/saveProcMoveReq', params)
    },

    /**
     * 자재이동 요청 리스트
     */
    getMoveReqList : async(params) => {
        try{
            const res = await API_URL.post('/moveReq/getMoveReqList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getMoveReqInfo : async(id) => {
        try{
            const res = await API_URL.get(`/moveReq/getMoveReqInfo/${id}` )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    getMoveStockList: async(params) => {
        try{
            const res = await API_URL.post('/moveReq/getMoveStockList', params )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveMoveItem: async(params) => {
        return await API_URL.post('/moveReq/saveMoveItem', params)
    },


    /**
     *
     * @param {*} params
     * @returns
     */
    getStockItemHistList: async(params) => {
        try{
            const res = await API_URL.post('/stock/getStockItemHistList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },






}
