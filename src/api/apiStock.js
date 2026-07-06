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

    /**
     * 사용기한 원재료
     * @param {*} params
     * @returns
     */
    getUseByM1List: async(params) => {
        try{
            const res = await API_URL.post('/stock/getUseByM1List', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     * 사용기한 부자재
     * @param {*} params
     * @returns
     */
    getUseByM2List: async(params) => {
        try{
            const res = await API_URL.post('/stock/getUseByM2List', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     *  원재료, 부자재 수불부
     * @param {*} params
     * @returns
     */
    getTranLedger: async(params) => {
        try{
            const res = await API_URL.post('/stock/getTranLedger', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     *  시험번호별 사용현황
     * @param {*} params
     * @returns
     */
    getTestUseList: async(params) => {
        try{
            const res = await API_URL.post('/stock/getTestUseList', params)
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
    getMoveReqStockList: async(params) => {
        try{
            const res = await API_URL.post('/moveReq/getMoveReqStockList', params )

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

/********************자재이동******************************************************** */
    getMoveStockList: async(params) => {
        try{
            const res = await API_URL.post('/moveStock/getMoveStockList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getMoveStockInfo : async(id) => {
        try{
            const res = await API_URL.get(`/moveStock/getMoveStockInfo/${id}` )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveMoveStockInfo: async(params) => {
        return await API_URL.post('/moveStock/saveMoveStockInfo', params)
    },

    saveMoveStockComfirm: async(params) => {
        return await API_URL.post('/moveStock/saveMoveStockComfirm', params)
    },

    /***************자재조정**************************************************************************** */

    getAdjustList: async(params) => {
        try{
            const res = await API_URL.post('/adjust/getAdjustList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getAdjustInfo : async(id) => {
        try{
            const res = await API_URL.get(`/adjust/getAdjustInfo/${id}` )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveAdjust: async(params) => {
        return await API_URL.post('/adjust/saveAdjust', params)
    },

    /***************제품출고**************************************************************************** */
    getProdOutList: async(params) => {
        try{
            const res = await API_URL.post('/prodOut/getProdOutList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getProdOutInfo : async(id) => {
        try{
            const res = await API_URL.get(`/prodOut/getProdOutInfo/${id}` )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveProdOut: async(params) => {
        return await API_URL.post('/prodOut/saveProdOut', params)
    },

    /***************자재불출**************************************************************************** */
    getItemOutList: async(params) => {
        try{
            const res = await API_URL.post('/invTran/getItemOutList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getItemOutInfo : async(id) => {
        try{
            const res = await API_URL.get(`/invTran/getItemOutInfo/${id}` )

            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveItemOutInfo: async(params) => {
        return await API_URL.post('/invTran/saveItemOutInfo', params)
    },


}
