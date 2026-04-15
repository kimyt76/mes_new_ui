import { API_URL } from '.'

export const ApiTran = {

    getTranInfo: async(id) => {
        try{
            const res = await API_URL.get(`/invTran/getTranInfo/${id}`)
            return res.data
        }catch(err){
            throw err.response
        }
    },






}
