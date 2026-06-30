<template>
  <div class="cart">
    <!-- 返回按钮 -->
    <div class="back-section">
      <el-button @click="goBack" icon="el-icon-back" class="back-btn">
        返回商品列表
      </el-button>
    </div>

    <h2 style="margin:20px 0">我的乐器购物车</h2>
    
    <!-- 购物车列表（移动端卡片式布局） -->
    <div class="cart-items">
      <el-card 
        v-for="item in cartStore.cartList" 
        :key="item.id" 
        shadow="hover" 
        class="cart-item-card"
      >
        <div class="cart-item-content">
          <div class="cart-item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="cart-item-info">
            <h4>{{ item.name }}</h4>
            <p class="cart-item-price">¥{{ item.price }}</p>
            <div class="cart-item-controls">
              <div class="quantity-control">
                <span>数量：</span>
                <el-input-number v-model="item.num" @change="cartStore.changeNum(item.id, item.num)" :min="1" size="small"/>
              </div>
              <p class="cart-item-subtotal">小计：<span>¥{{ item.price * item.num }}</span></p>
            </div>
          </div>
          <div class="cart-item-actions">
            <el-button type="danger" size="small" @click="cartStore.delCart(item.id)">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="total">
      <div class="total-info">
        <span>商品总数：{{ cartStore.totalNum }}</span>
        <span>合计总价：<span class="total-price">¥{{ cartStore.totalPrice }}</span></span>
      </div>
      <el-button type="danger" @click="cartStore.clearCart">清空购物车</el-button>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item" :class="{ active: route.path === '/' }" @click="$router.push('/')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <div class="nav-item" :class="{ active: route.path === '/goods' }" @click="$router.push('/goods')">
        <i class="el-icon-goods"></i>
        <span>分类</span>
      </div>
      <div class="nav-item" :class="{ active: route.path === '/messages' }" @click="$router.push('/messages')">
        <i class="el-icon-bell"></i>
        <span>消息</span>
        <el-badge v-if="unreadCount > 0" :value="unreadCount" class="nav-badge" />
      </div>
      <div class="nav-item" :class="{ active: route.path === '/cart' }" @click="$router.push('/cart')">
        <i class="el-icon-shopping-cart-2"></i>
        <span>购物车</span>
        <el-badge v-if="cartStore.totalNum > 0" :value="cartStore.totalNum" class="nav-badge" />
      </div>
      <div class="nav-item" :class="{ active: route.path === '/user/info' }" @click="handleUserInfoClick">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop :right="20" :bottom="80" />
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

// 检查用户是否登录
const isLoggedIn = computed(() => !!localStorage.getItem('userToken'))

// 未读消息数量
const unreadCount = ref(2)

// 用户退出登录
const userLogout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 处理我的中心点击
const handleUserInfoClick = () => {
  if (isLoggedIn.value) {
    router.push('/user/info')
  } else {
    router.push('/login')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.cart {
  padding: 24px;
  padding-bottom: 70px;
}

.back-section {
  margin: 20px 0;
}

.back-btn {
  padding: 10px 20px;
  font-size: 14px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item-card {
  margin-bottom: 0;
}

.cart-item-content {
  display: flex;
  gap: 15px;
  align-items: stretch;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f5f5;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
}

.cart-item-price {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

.cart-item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.cart-item-subtotal {
  margin: 0;
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
}

.cart-item-subtotal span {
  font-size: 18px;
}

.cart-item-actions {
  display: flex;
  align-items: flex-start;
}

.total {
  margin-top: 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  display: flex;
  gap: 20px;
}

.total-price {
  color: #f56c6c;
  font-weight: bold;
}

/* 底部导航栏样式 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  cursor: pointer;
  color: #909399;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item.active {
  color: #667eea;
}

.nav-item:hover {
  background: #f5f7fa;
}

.nav-item i {
  font-size: 22px;
  margin-bottom: 2px;
}

.nav-item span {
  font-size: 12px;
}

.nav-badge {
  position: absolute;
  top: 4px;
  right: 25%;
  transform: translateX(50%);
}

@media (max-width: 768px) {
  .cart {
    padding: 15px;
    padding-bottom: 70px;
  }
  
  .back-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .cart-item-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .cart-item-image {
    width: 100%;
    height: 150px;
  }
  
  .cart-item-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .cart-item-actions {
    justify-content: flex-end;
  }
  
  .total {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .total-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .total-info span {
    font-size: 18px;
  }
  
  .bottom-nav {
    height: 55px;
  }
  
  .nav-item i {
    font-size: 20px;
  }
  
  .nav-item span {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .cart {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .total-info span {
    font-size: 16px;
  }
}
</style>