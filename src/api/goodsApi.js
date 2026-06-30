import request from './request'
export function getGoodsList(){
  return request.get('/api/goods/list')
}
export function getGoodsDetail(id){
  return request.get(`/api/goods/${id}`)
}
export function getCategoryList(){
  return request.get('/api/category/list')
}
export function addGoods(data){
  return request.post('/api/goods/add',data)
}
export function editGoods(data){
  return request.post('/api/goods/edit',data)
}
export function delGoods(data){
  return request.post('/api/goods/del',data)
}