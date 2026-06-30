import { createRouter, createWebHistory } from 'vue-router'
//前台
import Home from '../views/front/Home.vue'
import GoodsList from '../views/front/GoodsList.vue'
import GoodsDetail from '../views/front/GoodsDetail.vue'
import Cart from '../views/front/Cart.vue'
import UserLogin from '../views/front/UserLogin.vue'
import UserInfo from '../views/front/UserInfo.vue'
import MessageCenter from '../views/front/MessageCenter.vue'
//后台
import AdminLogin from '../views/admin/AdminLogin.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Category from '../views/admin/Category.vue'
import GoodsManage from '../views/admin/GoodsManage.vue'
import OrderManage from '../views/admin/OrderManage.vue'
import UserManage from '../views/admin/UserManage.vue'
import AdminInfo from '../views/admin/AdminInfo.vue'

const requireAdmin = (to,from,next)=>{
  if(localStorage.getItem("adminToken")) next()
  else next("/admin/login")
}
const requireUser = (to,from,next)=>{
  if(localStorage.getItem("userToken")) next()
  else next("/login")
}

const routes = [
  { path:"/", component:Home },
  { path:"/goods", component:GoodsList },
  { path:"/goods/:id", component:GoodsDetail },
  { path:"/cart", component:Cart, beforeEnter:requireUser },
  { path:"/login", component:UserLogin },
  { path:"/user/info", component:UserInfo, beforeEnter:requireUser },
  { path:"/messages", component:MessageCenter },
  { path:"/admin/login", component:AdminLogin },
  { path:"/admin", component:Dashboard, beforeEnter:requireAdmin },
  { path:"/admin/category", component:Category, beforeEnter:requireAdmin },
  { path:"/admin/goods", component:GoodsManage, beforeEnter:requireAdmin },
  { path:"/admin/orders", component:OrderManage, beforeEnter:requireAdmin },
  { path:"/admin/users", component:UserManage, beforeEnter:requireAdmin },
  { path:"/admin/info", component:AdminInfo, beforeEnter:requireAdmin }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})
export default router