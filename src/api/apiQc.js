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
    updateQcTestInfo: async(params) =>{
        return await API_URL.post('/qcTest/updateQcTestInfo', params)
    },

    /**
     * 시험일지 pdf
     * @param {*} ids
     * @returns
     */
    getPrintTest: async(ids) => {
        try{
            const res = await API_URL.post('/qcTest/getPrintTest', ids,{
                responseType: 'blob'
            })
            return res
        }catch(err){
            throw err.response
        }
    },

    /**
     * 성적서 pdf
     * @param {*} ids
     * @returns
     */
    getPrintCertificate: async(ids) => {
        try{
            const res = await API_URL.post('/qcTest/getPrintCertificate', ids,{
                responseType: 'blob'
            })
            return res
        }catch(err){
            throw err.response
        }
    },

    /**
     * 성적서, 시험일지 전부 pdf
     * @param {*} ids
     * @returns
     */
    getPrintAll: async(ids) => {
        try{
            const res = await API_URL.post('/qcTest/getPrintAll', ids,{
                responseType: 'blob'
            })
            return res
        }catch(err){
            throw err.response
        }
    },

    certificateDownloadExcel: async (id) => {
        try {
            const res = await API_URL.get(`/qcTest/certificateDownloadExcel/${id}`, {
                responseType: 'blob'
            })

            return res.data
        } catch (err) {
            console.error('Download error:', err)
            throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
        }
    },

    tesetDownloadExcel: async (id) => {
        try {
            const res = await API_URL.get(`/qcTest/tesetDownloadExcel/${id}`, {
                responseType: 'blob'
            })

            return res.data
        } catch (err) {
            console.error('Download error:', err)
            throw new Error(err.response?.data || '파일 다운로드 중 오류가 발생했습니다.')
        }
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
    getQcTestTypeMethodComp : async(params) => {
        try{
            const res = await API_URL.post('/qcTestType/getQcTestTypeMethodComp', params)
            return res.data
        }catch(err){
            throw err.response
        }
    },
    saveQcTestTypeMethod: async(params) => {
        return await API_URL.post('/qcTestType/saveQcTestTypeMethod' , params)
    },



    /**
     * 공정검사
     * @returns
     */
    getQcProcTestList: async(params) =>{
        try{
            const res = await API_URL.post('/qcProcTest/getQcProcTestList', params)

            return res.data
        }catch(err){
            throw err.response
        }
    },

    /**
     * 공정검사 등록
     */
    createQcProcTestInfo: async(params) =>{
        return await API_URL.post('/qcProcTest/createQcProcTestInfo', params)
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



    // 시험번호별 내역조회
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

    getItemTestNoInfoList: async(id) =>{
        try{
            const res = await API_URL.get(`/itemTest/getItemTestNoInfoList/${id}`)

            return res.data
        }catch(err){
            throw err.response
        }
    },


    updateItemTestNoInfo: async(params) =>{
        return await API_URL.post('/itemTest/updateItemTestNoInfo', params)
    },







}
