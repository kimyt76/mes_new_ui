import { API_URL } from '.'

//공정 API
export const ApiProc = {
    /**  공통 */
    getWorkerList: async(params) => {
        return  await API_URL.post('/procCommon/getWorkerList',params)
    },
    getBagWeightList: async() => {
        return  await API_URL.get(`/procCommon/getBagWeightList`)
    },
    getEquipmentList: async(id) => {
        return  await API_URL.get(`/procCommon/getEquipmentList/${id}`)
    },
    updateProcStatus: async(params) => {
        return await API_URL.post(`/procCommon/updateProcStatus`, params)
    },

    /**
     *  작업수행정보 저장
     * @param {*} params
     * @returns
     */
    saveWorkRecordInfo: async(params) => {
        return await API_URL.post(`/procCommon/saveWorkRecordInfo`, params)
    },
    getProcTranList: async(params) => {
        try{
            const res = await API_URL.post('/procCommon/getProcTranList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getProcProdInfo: async(params) => {
        try{
            const res = await API_URL.post('/procCommon/getProcProdInfo', params)

            return res.data

        }catch(err){
            throw err.response
        }
    },
    downloadRecord: async (params) => {
        try {
            const res = await API_URL.post('/procCommon/downloadRecord',params,{
                responseType: 'blob'
            })

            return res.data
        } catch (err) {
            console.error('Download error:', err)
            throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
        }
    },
    /**
     * 사용량이 있을 경우 조회
     * @param {} id
     * @returns
     */
    getProdUseList: async(id) => {
        try{
            const res = await API_URL.get(`/procCommon/getProdUseList/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    /**
     * 시험번호로 예상 사용량  조회
     * @param {*} params
     * @returns
     */
    getProdUseTestNo: async(params) => {
        try{
            const res = await API_URL.post('/procCommon/getProdUseId', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    /**
     * 사용량 입력
     * @param {} params
     * @returns
     */
    saveProdInfo: async(params) => {
        return await API_URL.post(`/procCommon/saveProdInfo`, params)
    },




    // 칭량
    getWeighList: async(params) => {
        try{
            const res = await API_URL.post('/procWeigh/getWeighList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getWeighInfo: async (params) => {
        try {
            const res = await API_URL.post('/procWeigh/getWeighInfo', params)
            return res.data
        } catch (err) {
            throw err.response
        }
    },
    saveWeighInfo: async(params) => {
        return await API_URL.post(`/procWeigh/saveWeighInfo`, params)
    },
    printWeighLabel: async(params) =>{
        try{
            const res = await API_URL.post(`/procWeigh/printWeighLabel`, params,{
                    responseType: "blob"
            })
            return res.data
        }catch(err){
            throw err.response
        }
    },
    startProcWeigh: async(params) => {
        return await API_URL.post(`/procWeigh/startProcWeigh`, params)
    },
    saveWeighList: async(params) => {
        return await API_URL.post(`/procWeigh/saveWeighList`, params)
    },
    getStockTestNoList: async(params) => {
        try{
            const res = await API_URL.post('/procWeigh/getStockTestNoList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    completeWeight: async(params) => {
        return await API_URL.post(`/procWeigh/completeWeight`, params)
    },


    //제조
    getMatList: async(params) => {
        try{
            const res = await API_URL.post('/procMat/getMatList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getMakeInfo: async (params) => {
        try {
            const res = await API_URL.post('/procMat/getMakeInfo', params)
            return res.data
        } catch (err) {
            throw err.response
        }
    },
    startProcMake: async(params) => {
        return await API_URL.post('/procMat/startProcMake', params)
    },
    getWeighQty: async(id) => {
        try{
            const res = await API_URL.get(`/procMat/getWeighQty/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveMakeInfo: async(params) => {
        return await API_URL.post('/procMat/saveMakeInfo', params)
    },

    insertRowMake: async(params) => {
        return await API_URL.post('/procMat/insertRowMake', params)
    },

    downloadMatProc: async (params) => {
        try {
            const res = await API_URL.post('/procMat/downloadMatProc',params,{
                responseType: 'blob'
            })
            console.log('download response:', res)
        console.log('content-type:', res.headers['content-type'])

            return res.data
        } catch (err) {
            // blob 에러 메시지 읽기
            if (err.response?.data instanceof Blob) {
                const text = await err.response.data.text()
                throw new Error(text)
            }

            throw new Error('파일 다운로드 중 오류가 발생했습니다.')
        }
    },


    //코팅
    getCoatingList: async(params) => {
        try{
            const res = await API_URL.post('/procCoating/getCoatingList', params)
            return res.data

        }catch(err){
            throw err.response
        }
    },
    startProcCoating: async(params) => {
        return await API_URL.post('/procCoating/startProcCoating', params)
    },
    completeCoating: async(params) => {
        return await API_URL.post(`/procCoating/completeCoating`, params)
    },





    //충전
    getChargeList: async(params) => {
        try{
            const res = await API_URL.post('/procCharge/getChargeList', params)

            return res.data

        }catch(err){
            throw err.response
        }
    },
    startProcCharge: async(params) => {
        return await API_URL.post(`/procCharge/startProcCharge`, params)
    },
    completeCharge: async(params) => {
        return await API_URL.post(`/procCharge/completeCharge`, params)
    },




    //포장
    getPackingList: async(params) => {
        try{
            const res = await API_URL.post('/procPacking/getPackingList', params)
            return res.data
        }catch(err){
        throw err.response
        }
    },
    startProcPacking: async(params) => {
        return await API_URL.post(`/procPacking/startProcPacking`, params)
    },
    completePacking: async(params) => {
        return await API_URL.post(`/procPacking/completePacking`, params)
    },








}
