<template>
  <div class="goods-list">
    <!-- 搜索栏 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品名称或类型"
        prefix-icon="el-icon-search"
        class="search-input"
        clearable
      >
        <template #append>
          <el-button icon="el-icon-search">搜索</el-button>
        </template>
      </el-input>
    </div>

    <h2 style="margin:20px 0">全部乐器商品</h2>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <span class="filter-label">分类：</span>
      <el-radio-group v-model="selectedCategory" @change="filterByCategory" class="filter-group">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="吉他">吉他</el-radio-button>
        <el-radio-button label="钢琴">钢琴</el-radio-button>
        <el-radio-button label="民乐">民乐</el-radio-button>
        <el-radio-button label="弦乐">弦乐</el-radio-button>
        <el-radio-button label="打击乐">打击乐</el-radio-button>
      </el-radio-group>
    </div>

    <div class="list-box">
      <el-card v-for="item in instrumentList" :key="item.id" shadow="hover" class="goods-card">
        <div class="product-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <template #header>
          <h4>{{ item.name }}</h4>
        </template>
        <p class="price">¥{{ item.price }}</p>
        <p>品类：{{ item.type }}</p>
        <div class="btn-group">
          <el-button type="primary" @click="$router.push(`/goods/${item.id}`)">详情</el-button>
          <el-button type="success" @click="addCart(item)">加入购物车</el-button>
        </div>
      </el-card>
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
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { computed, ref, onMounted } from 'vue'

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const selectedCategory = ref('')
const searchKeyword = ref('')

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

// 从URL获取搜索关键词
onMounted(() => {
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
  }
})

// 所有商品数据
const allInstrumentList = [
  // 吉他 - 7个
  { id: 1, name: '41寸原木民谣吉他', price: 699, type: '吉他', image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=400&h=300&fit=crop' },
  { id: 6, name: '初学者尤克里里', price: 199, type: '吉他', image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=300&fit=crop' },
  { id: 11, name: '38寸面单吉他', price: 899, type: '吉他', image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop' },
  { id: 12, name: '41寸电箱吉他', price: 1299, type: '吉他', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 13, name: '儿童小吉他 23寸', price: 299, type: '吉他', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 14, name: '旅行吉他 34寸', price: 599, type: '吉他', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 15, name: '全单板民谣吉他', price: 1899, type: '吉他', image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&h=300&fit=crop' },

  // 钢琴 - 7个
  { id: 2, name: '88键重锤电子钢琴', price: 2199, type: '钢琴', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
  { id: 16, name: '61键便携电子琴', price: 899, type: '钢琴', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&h=300&fit=crop' },
  { id: 17, name: '88键三角钢琴', price: 12999, type: '钢琴', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&h=300&fit=crop' },
  { id: 18, name: '立式电钢琴', price: 3499, type: '钢琴', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 19, name: '智能电子钢琴', price: 2599, type: '钢琴', image: 'https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?w=400&h=300&fit=crop' },
  { id: 20, name: '初学者入门钢琴', price: 1599, type: '钢琴', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 21, name: '专业演奏电钢琴', price: 4599, type: '钢琴', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },

  // 民乐 - 7个
  { id: 3, name: '21弦考级实木古筝', price: 1399, type: '民乐', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop' },
  { id: 22, name: '琵琶专业演奏级', price: 1899, type: '民乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 23, name: '二胡初学者套装', price: 499, type: '民乐', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 24, name: '竹笛套装 成人', price: 299, type: '民乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 25, name: '扬琴专业级', price: 2199, type: '民乐', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop' },
  { id: 26, name: '阮咸中阮套装', price: 799, type: '民乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 27, name: '柳琴初学套装', price: 399, type: '民乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },

  // 弦乐 - 7个
  { id: 4, name: '4/4手工实木小提琴', price: 989, type: '弦乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 28, name: '儿童小提琴 1/4', price: 399, type: '弦乐', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 29, name: '大提琴成人专业', price: 2999, type: '弦乐', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 30, name: '电小提琴专业级', price: 1599, type: '弦乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 31, name: '低音提琴', price: 4999, type: '弦乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 32, name: '中提琴演奏级', price: 1899, type: '弦乐', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 33, name: '小提琴初学者套装', price: 699, type: '弦乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },

  // 打击乐 - 7个
  { id: 5, name: '五鼓三镲成人架子鼓', price: 2699, type: '打击乐', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=300&fit=crop' },
  { id: 34, name: '儿童电子鼓套装', price: 999, type: '打击乐', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 35, name: '专业电爵士鼓', price: 4599, type: '打击乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 36, name: '卡宏鼓 木质', price: 399, type: '打击乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop' },
  { id: 37, name: '手碟 印尼进口', price: 1899, type: '打击乐', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop' },
  { id: 38, name: '非洲鼓 羊皮', price: 599, type: '打击乐', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=300&fit=crop' },
  { id: 39, name: '电子鼓 初学套装', price: 1599, type: '打击乐', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' }
]

// 根据分类和搜索关键词过滤商品
const instrumentList = computed(() => {
  let filtered = allInstrumentList

  // 先按分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.type === selectedCategory.value)
  }

  // 再按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.type.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 切换分类
const filterByCategory = () => {
  // 分类切换时自动滚动到商品列表顶部
  const listBox = document.querySelector('.list-box')
  if (listBox) {
    listBox.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const addCart = (goods) => {
  cartStore.addCart(goods)
  ElMessage.success("加入购物车成功")
}
</script>

<style scoped>
.goods-list {
  padding: 24px;
  padding-bottom: 70px;
}

/* 搜索栏样式 */
.search-section {
  margin: 20px 0;
}

.search-input {
  max-width: 600px;
}

.category-filter {
  margin: 20px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.list-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.goods-card {
  position: relative;
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin: 12px 0;
  border-radius: 8px;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.goods-card:hover .product-image img {
  transform: scale(1.05);
}

.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 10px;
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
  .goods-list {
    padding: 15px;
    padding-bottom: 70px;
  }

  .search-section {
    margin: 15px 0;
  }

  .search-input {
    max-width: 100%;
  }
  
  .category-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }
  
  .filter-group {
    width: 100%;
    justify-content: flex-start;
  }
  
  .list-box {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .product-image {
    height: 160px;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .el-button {
    width: 100%;
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
  .goods-list {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .category-filter {
    padding: 10px;
  }
  
  .filter-label {
    font-size: 14px;
  }
  
  .list-box {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .product-image {
    height: 140px;
  }
  
  .price {
    font-size: 18px;
  }
}
</style>