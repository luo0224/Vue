import request from './request'
export function userLogin(data){
  return request.post('/api/user/login',data)
}
export function adminLogin(data){
  return request.post('/api/admin/login',data)
}