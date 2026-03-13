
export const ApiStock = {

    /**
     * 자재이동요청
     * @returns
     */
    getMoveReqList : async(params) =>{
        try{
            const res = await API_URL.post('/moveReq/getQcTestTypeList', params)
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
    getMoveReqInfo: async(list) => {
        return await API_URL.post('/moveReq/getMoveReqInfo' , list)
    },




}
