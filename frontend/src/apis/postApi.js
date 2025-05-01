import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

export const createPost = async postData => {
  const responce = await axios.post(`${API_URL}/postWrite`, postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return responce.data
}
