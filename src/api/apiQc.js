import { API_URL } from '.'

export const ApiQc = {

    /**
     * 품질검사 요청
     */
    getQcTestList: async(params) =>{
        try{
            const res = await API_URL.post('/qcTest/getQcTestList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    /**
     * 품질검사 상세
     */
    getQcTestDetailInfo: async(id) =>{
        try{
            const res = await API_URL.get(`/qcTest/getQcTestDetailInfo/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    /**
     * 품질검사 등록 및 수정 정보 조회
     */
    getQcTestInfo: async(id) =>{
        try{
            const res = await API_URL.get(`/qcTest/getQcTestInfo/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     * 품질검사 상세정보 저장
     */
    updateQcTestDetailInfo: async(params) =>{
        return await API_URL.post('/qcTest/updateQcTestDetailInfo', params)
    },

    /**
     * 품질검사 재검사 저장
     */
    insertRetestInfo: async(params) =>{
        return await API_URL.post('/qcTest/insertRetestInfo', params)
    },

    /**
     * 품질검사 검사정보 저장
     */
    updateQcTestInfo: async(id) =>{
        return await API_URL.get(`/qcTest/updateQcTestInfo/${id}`)
    },













    /**
     * 품질검사유형
     * @returns
     */
    getQcTestTypeList : async(params) =>{
        try{
            const res = await API_URL.post('/qcTestType/getQcTestTypeList', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    getQcTestTypeMethod : async(id) => {
        try{
            const res = await API_URL.get(`/qcTestType/getQcTestTypeMethod/${id}` )
            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveQcTestTypeMethod: async(params) => {
        return await API_URL.post('/qcTestType/saveQcTestTypeMethod' , params)
    },

    /**
     * 공정검사 유형
     * @returns
     */
    getProcTestTypeList : async() =>{
        try{
        const res = await API_URL.get('/procTestType/getProcTestTypeList')

        return res.data
        }catch(err){
        throw err.response
        }
    },
    getProcTestTypeMethod : async(id) => {
        try{
        const res = await API_URL.get(`/procTestType/getProcTestTypeMethod/${id}` )

        return res.data
        }catch(err){
            throw err.response
        }
    },
    getProcTestTypeMethodInfo : async(id) => {
        try{
        const res = await API_URL.get(`/procTestType/getProcTestTypeMethodInfo/${id}` )

        return res.data
        }catch(err){
        throw err.response
        }
    },
    saveProcTestTypeMethod: async(params) => {
        return await API_URL.post('/procTestType/saveProcTestTypeMethod' , params)
    },



    // 시험번호별 내욕조회
    getItemTestNoList: async(params) =>{
        try{
            const res = await API_URL.post('/itemTest/getItemTestNoList', params)

            return res.data
        }catch(err){
            throw err.response
        }
    },

    getItemTestNoInfo: async(id) =>{
        try{
            const res = await API_URL.get(`/itemTest/getItemTestNoInfo/${id}`)

            return res.data
        }catch(err){
            throw err.response
        }
    },

    updateItemTestNoInfo: async(params) =>{
        return await API_URL.post('/itemTest/updateItemTestNoInfo', params)
    },







}
