import { API_URL } from '.'

export const ApiQc = {

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
    saveQcTestTypeMethod: async(list) => {
        return await API_URL.post('/qcTestType/saveQcTestTypeMethod' , list)
    },

    /**
     * 공정검사
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



}
