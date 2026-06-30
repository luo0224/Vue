<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品名称或类型"
        prefix-icon="el-icon-search"
        class="search-input"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #append>
          <el-button icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 乐器宣传轮播 -->
    <el-carousel :height="carouselHeight" style="margin: 25px 0;">
      <el-carousel-item>
        <div class="banner banner1">专业民谣吉他 初学入门特惠</div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="banner banner2">电子钢琴、古筝 考级专用乐器</div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="banner banner3">小提琴、架子鼓 专业演奏款上新</div>
      </el-carousel-item>
    </el-carousel>

    <!-- 分类导航图标区 -->
    <div class="category-nav">
      <div 
        v-for="cat in categoryList" 
        :key="cat.name" 
        class="category-item"
        @click="goToCategory(cat.name)"
      >
        <div class="category-icon" :style="{ background: cat.color }">
          <i :class="cat.icon"></i>
        </div>
        <span class="category-name">{{ cat.name }}</span>
      </div>
    </div>

    <!-- 限时秒杀模块 -->
    <div class="flash-sale-section">
      <div class="flash-sale-header">
        <h2 class="flash-sale-title">
          <i class="el-icon-timer"></i>
          限时秒杀
        </h2>
        <div class="countdown">
          <span class="countdown-label">距结束</span>
          <div class="countdown-item">{{ countdown.hours }}</div>
          <span class="countdown-separator">:</span>
          <div class="countdown-item">{{ countdown.minutes }}</div>
          <span class="countdown-separator">:</span>
          <div class="countdown-item">{{ countdown.seconds }}</div>
        </div>
      </div>
      <div class="flash-sale-grid">
        <el-card 
          v-for="item in flashSaleList" 
          :key="item.id" 
          shadow="hover" 
          class="flash-sale-card"
        >
          <div class="sale-badge">秒杀</div>
          <div class="product-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <h4>{{ item.name }}</h4>
          <div class="price-row">
            <span class="sale-price">¥{{ item.salePrice }}</span>
            <span class="sale-original">¥{{ item.price }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: item.soldPercent + '%' }"
            ></div>
          </div>
          <span class="sold-text">已售{{ item.soldPercent }}%</span>
          <el-button type="danger" class="sale-btn" @click="addCart(item)">立即抢购</el-button>
        </el-card>
      </div>
    </div>

    <!-- 新品上架模块 -->
    <div class="new-arrival-section">
      <h2 class="section-title">
        <i class="el-icon-sunny"></i>
        新品上架
      </h2>
      <div class="new-arrival-scroll">
        <div class="new-arrival-list">
          <el-card 
            v-for="item in newArrivalList" 
            :key="item.id" 
            shadow="hover" 
            class="new-arrival-card"
          >
            <div class="new-badge">新品</div>
            <div class="product-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <h4>{{ item.name }}</h4>
            <p class="price">¥{{ item.price }}</p>
            <p class="type">{{ item.type }}</p>
            <el-button type="primary" @click="$router.push(`/goods/${item.id}`)">查看详情</el-button>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 热销排行榜模块 -->
    <div class="hot-rank-section">
      <h2 class="section-title">
        <i class="el-icon-fire"></i>
        热销排行榜
      </h2>
      <div class="hot-rank-list">
        <div 
          v-for="(item, index) in hotRankList" 
          :key="item.id" 
          class="hot-rank-item"
          :class="{ 'top-three': index < 3 }"
        >
          <div class="rank-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
          <div class="rank-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="rank-info">
            <h4>{{ item.name }}</h4>
            <p class="rank-sales">销量：{{ item.sales }}件</p>
          </div>
          <div class="rank-price">¥{{ item.price }}</div>
        </div>
      </div>
    </div>

    <!-- 服务保障栏 -->
    <div class="service-section">
      <div v-for="service in serviceList" :key="service.name" class="service-item">
        <div class="service-icon" :style="{ color: service.color }">
          <i :class="service.icon"></i>
        </div>
        <span class="service-name">{{ service.name }}</span>
      </div>
    </div>

    <!-- 商品促销模块 -->
    <div class="promotion-section">
      <h2 class="promotion-title">
        <i class="el-icon-goods"></i>
        限时特惠
      </h2>
      <div class="promotion-grid">
        <el-card 
          v-for="item in promotionList" 
          :key="item.id" 
          shadow="hover" 
          class="promotion-card"
        >
          <div class="promotion-badge">{{ item.discount }}折</div>
          <template #header>
            <h4>{{ item.name }}</h4>
          </template>
          <div class="product-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="price-info">
            <p class="current-price">¥{{ item.price }}</p>
            <p class="original-price">原价：¥{{ item.originalPrice }}</p>
          </div>
          <p class="type">品类：{{ item.type }}</p>
          <div class="promotion-info">
            <el-tag type="danger" size="small">{{ item.tag }}</el-tag>
          </div>
          <div class="btn-group">
            <el-button type="primary" @click="$router.push(`/goods/${item.id}`)">查看详情</el-button>
            <el-button type="danger" @click="addCart(item)">加入购物车</el-button>
          </div>
        </el-card>
      </div>
    </div>

    <h2>热门乐器推荐</h2>

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

    <div class="goods-wrap">
      <el-card v-for="item in instrumentList" :key="item.id" shadow="hover">
        <div class="product-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <template #header>
          <h4>{{ item.name }}</h4>
        </template>
        <p class="price">售价：¥{{ item.price }}</p>
        <p class="type">品类：{{ item.type }}</p>
        <div class="btn-group">
          <el-button type="primary" @click="$router.push(`/goods/${item.id}`)">查看详情</el-button>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
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

// 处理搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({
    path: '/goods',
    query: { keyword: searchKeyword.value.trim() }
  })
}

// 轮播高度响应式
const carouselHeight = computed(() => {
  if (window.innerWidth <= 480) return '180px'
  if (window.innerWidth <= 768) return '240px'
  return '320px'
})

// 更新轮播高度
const updateCarouselHeight = () => {
  carouselHeight.value = window.innerWidth <= 480 ? '180px' : window.innerWidth <= 768 ? '240px' : '320px'
}

// 分类导航数据
const categoryList = [
  { name: '吉他', icon: 'el-icon-guitar', color: '#667eea' },
  { name: '钢琴', icon: 'el-icon-music', color: '#f5a623' },
  { name: '民乐', icon: 'el-icon-document', color: '#722ed1' },
  { name: '弦乐', icon: 'el-icon-headset', color: '#13c2c2' },
  { name: '打击乐', icon: 'el-icon-drum', color: '#eb2f96' }
]

// 跳转到分类页面
const goToCategory = (category) => {
  router.push({
    path: '/goods',
    query: { category: category }
  })
}

// 秒杀倒计时
const countdown = ref({
  hours: '02',
  minutes: '35',
  seconds: '48'
})

let countdownTimer = null

const updateCountdown = () => {
  let h = parseInt(countdown.value.hours)
  let m = parseInt(countdown.value.minutes)
  let s = parseInt(countdown.value.seconds)
  
  s--
  if (s < 0) {
    s = 59
    m--
    if (m < 0) {
      m = 59
      h--
      if (h < 0) {
        h = 23
        m = 59
        s = 59
      }
    }
  }
  
  countdown.value.hours = h.toString().padStart(2, '0')
  countdown.value.minutes = m.toString().padStart(2, '0')
  countdown.value.seconds = s.toString().padStart(2, '0')
}

// 秒杀商品数据
const flashSaleList = [
  { id: 6, name: '初学者尤克里里', price: 199, salePrice: 99, type: '吉他', image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=300&fit=crop', soldPercent: 85 },
  { id: 24, name: '竹笛套装 成人', price: 299, salePrice: 149, type: '民乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop', soldPercent: 72 },
  { id: 36, name: '卡宏鼓 木质', price: 399, salePrice: 199, type: '打击乐', image: 'https://images.unsplash.com/photo-1528900403520-42d5c7d214a6?w=400&h=300&fit=crop', soldPercent: 58 },
  { id: 28, name: '儿童小提琴 1/4', price: 399, salePrice: 199, type: '弦乐', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop', soldPercent: 91 }
]

// 新品上架数据
const newArrivalList = [
  { id: 15, name: '全单板民谣吉他', price: 1899, type: '吉他', image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&h=300&fit=crop' },
  { id: 21, name: '专业演奏电钢琴', price: 4599, type: '钢琴', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
  { id: 29, name: '大提琴成人专业', price: 2999, type: '弦乐', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop' },
  { id: 35, name: '专业电爵士鼓', price: 4599, type: '打击乐', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop' },
  { id: 25, name: '扬琴专业级', price: 2199, type: '民乐', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop' }
]

// 热销排行榜数据
const hotRankList = [
  { id: 1, name: '41寸原木民谣吉他', price: 699, sales: 2847, image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=150&h=150&fit=crop' },
  { id: 6, name: '初学者尤克里里', price: 199, sales: 2356, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=150&h=150&fit=crop' },
  { id: 2, name: '88键重锤电子钢琴', price: 2199, sales: 1892, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=150&h=150&fit=crop' },
  { id: 3, name: '21弦考级实木古筝', price: 1399, sales: 1567, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=150&h=150&fit=crop' },
  { id: 4, name: '4/4手工实木小提琴', price: 989, sales: 1234, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop' }
]

// 服务保障数据
const serviceList = [
  { name: '正品保障', icon: 'el-icon-shield', color: '#67c23a' },
  { name: '包邮到家', icon: 'el-icon-truck', color: '#409eff' },
  { name: '7天退换', icon: 'el-icon-refresh', color: '#f56c6c' },
  { name: '售后无忧', icon: 'el-icon-headset', color: '#909399' },
  { name: '极速发货', icon: 'el-icon-clock', color: '#e6a23c' }
]

onMounted(() => {
  window.addEventListener('resize', updateCarouselHeight)
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCarouselHeight)
  if (countdownTimer) clearInterval(countdownTimer)
})

// 所有乐器商品数据（吉他、钢琴、古筝、小提琴、架子鼓）
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

// 根据分类过滤商品
const instrumentList = computed(() => {
  if (!selectedCategory.value) {
    return allInstrumentList
  }
  return allInstrumentList.filter(item => item.type === selectedCategory.value)
})

// 切换分类
const filterByCategory = () => {
  // 分类切换时自动滚动到商品列表顶部
  const goodsWrap = document.querySelector('.goods-wrap')
  if (goodsWrap) {
    goodsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 促销商品数据
const promotionList = [
  { 
    id: 15, 
    name: '全单板民谣吉他', 
    price: 1599, 
    originalPrice: 1899,
    discount: 8.4,
    type: '吉他',
    tag: '限时特惠',
    image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&h=300&fit=crop'
  },
  { 
    id: 21, 
    name: '专业演奏电钢琴', 
    price: 3999, 
    originalPrice: 4599,
    discount: 8.7,
    type: '钢琴',
    tag: '新品尝鲜',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop'
  },
  { 
    id: 25, 
    name: '扬琴专业级', 
    price: 1799, 
    originalPrice: 2199,
    discount: 8.2,
    type: '民乐',
    tag: '爆款热卖',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop'
  },
  { 
    id: 29, 
    name: '大提琴成人专业', 
    price: 2599, 
    originalPrice: 2999,
    discount: 8.7,
    type: '弦乐',
    tag: '清仓特价',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop'
  },
  { 
    id: 35, 
    name: '专业电爵士鼓', 
    price: 3999, 
    originalPrice: 4599,
    discount: 8.7,
    type: '打击乐',
    tag: '热卖推荐',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop'
  }
]

// 添加乐器到购物车
const addCart = (goods) => {
  cartStore.addCart(goods)
  ElMessage.success(`${goods.name} 已加入购物车！`)
}
</script>

<style scoped>
.home {
  padding: 24px;
  padding-bottom: 70px;
}

.banner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
}

.banner1 {
  background: #36a3f7;
}

.banner2 {
  background: #722ed1;
}

.banner3 {
  background: #f5a623;
}

/* 分类导航图标区样式 */
.category-nav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin: 30px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px;
}

.category-item:hover {
  transform: scale(1.05);
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #fff;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.category-name {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

/* 限时秒杀模块样式 */
.flash-sale-section {
  margin: 40px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f56c6c 0%, #e6a23c 100%);
  border-radius: 12px;
}

.flash-sale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.flash-sale-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  color: #fff;
  margin: 0;
}

.flash-sale-title i {
  font-size: 28px;
}

.countdown {
  display: flex;
  align-items: center;
  gap: 5px;
}

.countdown-label {
  color: #fff;
  font-size: 14px;
  margin-right: 10px;
}

.countdown-item {
  background: rgba(0,0,0,0.3);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 6px;
  min-width: 35px;
  text-align: center;
}

.countdown-separator {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.flash-sale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.flash-sale-card {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.sale-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 10;
}

.flash-sale-card .product-image {
  height: 160px;
}

.flash-sale-card h4 {
  margin: 10px 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.sale-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.sale-original {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f56c6c 0%, #e6a23c 100%);
  transition: width 0.5s ease;
}

.sold-text {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 10px;
}

.sale-btn {
  width: 100%;
}

/* 新品上架模块样式 */
.new-arrival-section {
  margin: 40px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

.section-title i {
  font-size: 28px;
  color: #667eea;
}

.new-arrival-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.new-arrival-list {
  display: flex;
  gap: 20px;
  padding-bottom: 10px;
}

.new-arrival-card {
  flex-shrink: 0;
  width: 220px;
  position: relative;
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #667eea;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 10;
}

.new-arrival-card .product-image {
  height: 160px;
}

.new-arrival-card h4 {
  margin: 10px 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.new-arrival-card .price {
  margin: 5px 0;
}

.new-arrival-card .type {
  margin: 5px 0 10px 0;
}

/* 热销排行榜模块样式 */
.hot-rank-section {
  margin: 40px 0;
}

.hot-rank-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hot-rank-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.hot-rank-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.rank-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 15px;
}

.rank-1 {
  background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
  color: #fff;
}

.rank-2 {
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
  color: #fff;
}

.rank-3 {
  background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
  color: #fff;
}

.rank-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.rank-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-sales {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.rank-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 15px;
}

/* 服务保障栏样式 */
.service-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.service-icon {
  font-size: 28px;
}

.service-name {
  font-size: 14px;
  color: #606266;
}

/* 促销模块样式 */
.promotion-section {
  margin: 40px 0;
}

.promotion-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  color: #e6a23c;
  margin-bottom: 20px;
}

.promotion-title i {
  font-size: 28px;
}

.promotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.promotion-card {
  position: relative;
  border: 2px solid #e6a23c;
  transition: all 0.3s ease;
}

.promotion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(230, 162, 60, 0.3);
}

.promotion-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.price-info {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.current-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin: 0;
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

.product-image:hover img {
  transform: scale(1.05);
}

.promotion-card .product-image {
  height: 180px;
}

.promotion-info {
  margin: 8px 0;
}

/* 分类筛选样式 */
.category-filter {
  margin: 20px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
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
  gap: 8px;
}

.goods-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.type {
  color: #666;
  margin: 8px 0;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

/* 搜索栏样式 */
.search-section {
  margin: 20px 0;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
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
  .home {
    padding: 15px;
    padding-bottom: 70px;
  }

  .search-section {
    margin: 15px 0;
  }

  .search-input {
    max-width: 100%;
  }
  
  .banner {
    font-size: 20px;
  }
  
  .promotion-section {
    margin: 30px 0;
  }
  
  .promotion-title {
    font-size: 20px;
  }
  
  .promotion-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .promotion-badge {
    width: 50px;
    height: 50px;
    font-size: 14px;
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
  
  .product-image {
    height: 160px;
  }
  
  .promotion-card .product-image {
    height: 140px;
  }
  
  .goods-wrap {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
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

  .category-nav {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 15px;
  }

  .category-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .category-name {
    font-size: 12px;
  }

  .flash-sale-section {
    margin: 20px 0;
    padding: 15px;
  }

  .flash-sale-title {
    font-size: 20px;
  }

  .flash-sale-title i {
    font-size: 24px;
  }

  .countdown-item {
    font-size: 16px;
    padding: 4px 8px;
    min-width: 30px;
  }

  .flash-sale-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .flash-sale-card .product-image {
    height: 120px;
  }

  .sale-price {
    font-size: 20px;
  }

  .new-arrival-card {
    width: 180px;
  }

  .new-arrival-card .product-image {
    height: 120px;
  }

  .hot-rank-item {
    padding: 10px;
  }

  .rank-number {
    width: 30px;
    height: 30px;
    font-size: 14px;
    margin-right: 10px;
  }

  .rank-image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }

  .rank-price {
    font-size: 16px;
  }

  .service-section {
    margin: 20px 0;
    padding: 15px;
  }

  .service-icon {
    font-size: 22px;
  }

  .service-name {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .banner {
    font-size: 16px;
  }
  
  .promotion-section {
    margin: 20px 0;
  }
  
  .promotion-title {
    font-size: 18px;
  }
  
  .promotion-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .promotion-badge {
    width: 45px;
    height: 45px;
    font-size: 12px;
  }
  
  .category-filter {
    padding: 10px;
  }
  
  .filter-label {
    font-size: 14px;
  }
  
  .product-image {
    height: 140px;
  }
  
  .promotion-card .product-image {
    height: 120px;
  }
  
  .goods-wrap {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .price {
    font-size: 18px;
  }
  
  .current-price {
    font-size: 20px;
  }
  
  .original-price {
    font-size: 12px;
  }
}
</style>