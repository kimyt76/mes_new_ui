
import { API_URL } from '.';

/**
 * 로그인
 */
export const login = async (userId, password) => {
  try {
    const res = await API_URL.post('/auth/login', {
      userId,
      password
    })

    return res.data ?? res

  } catch (err) {
    throw err
  }
}

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    await API_URL.post('/auth/logout')
  } finally {
    localStorage.removeItem('user')
  }
}

/**
 * 로그인 사용자 정보 조회
 */
export const fetchUser = async () => {
  try {
    const res = await API_URL.get('/auth/registe')

    return res.data ?? res

  } catch (err) {
    throw err
  }
}

/**
 * 사용자 메뉴 조회
 */
export const getMenuList = async (userId) => {
  try {
    const res = await API_URL.get(`/menu/getMenuList/${userId}`)

    return res.data ?? res

  } catch (err) {
    throw err
  }
}
