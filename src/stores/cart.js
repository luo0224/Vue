import { defineStore } from 'pinia'

// 默认商品图片映射
const defaultImages = {
  1: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=100&h=100&fit=crop',
  2: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100&h=100&fit=crop',
  3: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop',
  4: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop',
  5: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100&h=100&fit=crop',
  6: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=100&h=100&fit=crop',
  7: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=100&h=100&fit=crop',
  8: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100&h=100&fit=crop',
  9: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop',
  10: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop'
}

export const useCartStore = defineStore('cart',{
  state:()=>({
    cartList: JSON.parse(localStorage.getItem('cart')) || []
  }),
  actions:{
    addCart(goods, num=1){
      const item = this.cartList.find(v=>v.id === goods.id)
      if(item) item.num += num
      else this.cartList.push({...goods, num, image: goods.image || defaultImages[goods.id] || 'https://via.placeholder.com/100x100?text=No+Image'})
      localStorage.setItem('cart',JSON.stringify(this.cartList))
    },
    changeNum(id,num){
      const item = this.cartList.find(v=>v.id==id)
      if(item) item.num = num
      localStorage.setItem('cart',JSON.stringify(this.cartList))
    },
    delCart(id){
      this.cartList = this.cartList.filter(v=>v.id != id)
      localStorage.setItem('cart',JSON.stringify(this.cartList))
    },
    clearCart(){
      this.cartList = []
      localStorage.removeItem('cart')
    }
  },
  getters:{
    totalNum:state=>state.cartList.reduce((sum,i)=>sum+i.num,0),
    totalPrice:state=>state.cartList.reduce((sum,i)=>sum+i.price*i.num,0).toFixed(2)
  }
})