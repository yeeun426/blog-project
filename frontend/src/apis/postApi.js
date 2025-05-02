import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

export const createPost = async postData => {
  const responce = await axios.post(`${API_URL}/postWrite`, postData)
  return responce.data
}

export const getPostList = async () => {
  const responce = await axios.get(`${API_URL}/postList`)
  return responce.data
}

export const getPostDetiail = async postId => {
  const responce = await axios.get(`${API_URL}/postDetail/${postId}`)
  return responce.data
}
