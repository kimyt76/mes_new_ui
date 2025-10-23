import { API_URL} from '.'


export const login = async (userId, password) => {
  try{
    let type ='json';
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

export const getMenuList = async (userId) => {
  try {
    const res = await API_URL.get(`/menu/getMenuList/${userId}`, {
      withCredentials: true, // 세션 유지
    });

    return res.data;
  } catch (err) {
    throw err.response || err;
  }
};
