import axios from 'axios'
const service = axios.create({
  baseURL:"",
  timeout:5000
})
// 请求拦截
service.interceptors.request.use(config=>{
  return config
})
// 响应拦截
service.interceptors.response.use(res=>{
  return res.data
})
export default service