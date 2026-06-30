<template>
  <div class="detail">
    <!-- 返回按钮 -->
    <div class="back-section">
      <el-button @click="goBack" icon="el-icon-back" class="back-btn">
        返回列表
      </el-button>
    </div>

    <div class="content">
      <div class="left">
        <div class="product-image">
          <img :src="info.image" :alt="info.name" />
        </div>
      </div>
      <div class="right">
        <h2>{{ info.name }}</h2>
        <p class="price">售价：¥{{ info.price }}</p>
        <p>乐器分类：{{ info.type }}</p>
        <p class="desc">商品介绍：{{ info.desc }}</p>
        <div class="quantity-control">
          <span>数量：</span>
          <el-input-number v-model="num" :min="1" size="large"/>
        </div>
        <div class="btn-group">
          <el-button type="success" @click="addCart">加入购物车</el-button>
          <el-button type="primary" @click="$router.push('/cart')">去购物车结算</el-button>
        </div>
      </div>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const num = ref(1)

// 检查用户是否登录
const isLoggedIn = computed(() => !!localStorage.getItem('userToken'))

// 未读消息数量
const unreadCount = ref(2)

// 处理我的中心点击
const handleUserInfoClick = () => {
  if (isLoggedIn.value) {
    router.push('/user/info')
  } else {
    router.push('/login')
  }
}

const list = [
  // 吉他 - 7个
  { id: 1, name: '41寸原木民谣吉他', price: 699, type: '吉他', desc:"适合新手练习，音色柔和", image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=600&h=600&fit=crop' },
  { id: 6, name: '初学者尤克里里', price: 199, type: '吉他', desc:"小巧便携，儿童成人入门", image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=600&fit=crop' },
  { id: 11, name: '38寸面单吉他', price: 899, type: '吉他', desc:"面单设计，音色温暖饱满", image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&h=600&fit=crop' },
  { id: 12, name: '41寸电箱吉他', price: 1299, type: '吉他', desc:"内置拾音器，支持外接音响", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop' },
  { id: 13, name: '儿童小吉他 23寸', price: 299, type: '吉他', desc:"儿童专用，轻巧便携", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=600&h=600&fit=crop' },
  { id: 14, name: '旅行吉他 34寸', price: 599, type: '吉他', desc:"旅行首选，方便携带", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' },
  { id: 15, name: '全单板民谣吉他', price: 1899, type: '吉他', desc:"全单板设计，专业级音质", image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&h=600&fit=crop' },

  // 钢琴 - 7个
  { id: 2, name: '88键重锤电子钢琴', price: 2199, type: '钢琴', desc:"家用考级，配重仿真钢手感", image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop' },
  { id: 16, name: '61键便携电子琴', price: 899, type: '钢琴', desc:"轻便易携，适合初学者", image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=600&fit=crop' },
  { id: 17, name: '88键三角钢琴', price: 12999, type: '钢琴', desc:"仿真三角钢琴外观，专业演奏", image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=600&fit=crop' },
  { id: 18, name: '立式电钢琴', price: 3499, type: '钢琴', desc:"立式设计，节省空间", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' },
  { id: 19, name: '智能电子钢琴', price: 2599, type: '钢琴', desc:"智能连接APP，互动学习", image: 'https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?w=600&h=600&fit=crop' },
  { id: 20, name: '初学者入门钢琴', price: 1599, type: '钢琴', desc:"入门级配置，性价比高", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' },
  { id: 21, name: '专业演奏电钢琴', price: 4599, type: '钢琴', desc:"专业级手感，演奏首选", image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop' },

  // 民乐 - 7个
  { id: 3, name: '21弦考级实木古筝', price: 1399, type: '民乐', desc:"考级专用，音质通透清脆", image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop' },
  { id: 22, name: '琵琶专业演奏级', price: 1899, type: '民乐', desc:"手工制作，音色优美", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },
  { id: 23, name: '二胡初学者套装', price: 499, type: '民乐', desc:"初学套装，含琴弓松香", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop' },
  { id: 24, name: '竹笛套装 成人', price: 299, type: '民乐', desc:"成人适用，含笛膜配件", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=600&h=600&fit=crop' },
  { id: 25, name: '扬琴专业级', price: 2199, type: '民乐', desc:"专业级配置，音质纯净", image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop' },
  { id: 26, name: '阮咸中阮套装', price: 799, type: '民乐', desc:"中阮套装，含拨片配件", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },
  { id: 27, name: '柳琴初学套装', price: 399, type: '民乐', desc:"初学套装，轻巧便携", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=600&h=600&fit=crop' },

  // 弦乐 - 7个
  { id: 4, name: '4/4手工实木小提琴', price: 989, type: '弦乐', desc:"手工实木，成人初学演奏", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },
  { id: 28, name: '儿童小提琴 1/4', price: 399, type: '弦乐', desc:"儿童专用，尺寸适中", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop' },
  { id: 29, name: '大提琴成人专业', price: 2999, type: '弦乐', desc:"专业级大提琴，音色浑厚", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' },
  { id: 30, name: '电小提琴专业级', price: 1599, type: '弦乐', desc:"电声设计，支持耳机练习", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },
  { id: 31, name: '低音提琴', price: 4999, type: '弦乐', desc:"乐团标配，低音浑厚", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=600&h=600&fit=crop' },
  { id: 32, name: '中提琴演奏级', price: 1899, type: '弦乐', desc:"演奏级别，音色温暖", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop' },
  { id: 33, name: '小提琴初学者套装', price: 699, type: '弦乐', desc:"初学套装，含琴弓松香", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },

  // 打击乐 - 7个
  { id: 5, name: '五鼓三镲成人架子鼓', price: 2699, type: '打击乐', desc:"专业演出全套，静音鼓皮", image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600&h=600&fit=crop' },
  { id: 34, name: '儿童电子鼓套装', price: 999, type: '打击乐', desc:"儿童电子鼓，安全静音", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' },
  { id: 35, name: '专业电爵士鼓', price: 4599, type: '打击乐', desc:"专业电鼓，仿真音色", image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop' },
  { id: 36, name: '卡宏鼓 木质', price: 399, type: '打击乐', desc:"木质卡宏鼓，音色清脆", image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=600&h=600&fit=crop' },
  { id: 37, name: '手碟 印尼进口', price: 1899, type: '打击乐', desc:"印尼原产，音色空灵", image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop' },
  { id: 38, name: '非洲鼓 羊皮', price: 599, type: '打击乐', desc:"羊皮鼓面，音质纯正", image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600&h=600&fit=crop' },
  { id: 39, name: '电子鼓 初学套装', price: 1599, type: '打击乐', desc:"初学套装，含鼓棒配件", image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop' }
]
const info = list.find(item => item.id == route.params.id)

// 返回上一页
const goBack = () => {
  router.back()
}

const addCart = () => {
  cartStore.addCart(info, num.value)
  ElMessage.success(`成功添加${num.value}件商品`)
}
</script>

<style scoped>
.detail {
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

.content {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.left {
  flex-shrink: 0;
}

.product-image {
  width: 400px;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.desc {
  line-height: 1.8;
  color: #666;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.btn-group {
  display: flex;
  gap: 10px;
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
  .detail {
    padding: 15px;
    padding-bottom: 70px;
  }
  
  .back-section {
    margin: 15px 0;
  }
  
  .back-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .content {
    flex-direction: column;
    gap: 20px;
  }
  
  .product-image {
    width: 100%;
    height: 280px;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .el-button {
    width: 100%;
  }
  
  .price {
    font-size: 22px;
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
  .detail {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .product-image {
    height: 220px;
  }
  
  .price {
    font-size: 20px;
  }
  
  .quantity-control {
    flex-wrap: wrap;
  }
}
</style>