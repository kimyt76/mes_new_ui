import axios from "axios";

const API_URL = '/api/auth';

export const login = async (userName, password) => {
  try {
    const response = await axios.post(`${API_URL}/login` , { userName, password });

    return response.data;

  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem('user')
};
