import authHeader from "@/service/auth_header";
import { API_URL} from '.'


export const login = async (userId, password) => {
  try{
    let type ='json';
    //const res = await API_URL.post(`/auth/login`, { userId, password }, authHeader(type))
    const res = await API_URL.post(`/auth/login`, { userId, password })

    return res.data;
  }catch( err ){
    throw err
  }
}


export const logout = () =>{
  API_URL.post(`/auth/logout`);
  localStorage.removeItem('user');
}

export const fetchUser = async() =>{
  try{
    const res = await API_URL.get(`/auth/registe`, {})

    return res.data;
  }catch( err ){
    throw err.res
  }
}
