<template>
  <div class="admin-wrap">
    <div class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
      <i class="el-icon-menu"></i>
    </div>

    <el-menu mode="horizontal" router class="desktop-menu">
      <el-menu-item index="/admin">首页看板</el-menu-item>
      <el-menu-item index="/admin/category">乐器分类</el-menu-item>
      <el-menu-item index="/admin/goods">商品管理</el-menu-item>
      <el-menu-item index="/admin/orders">订单管理</el-menu-item>
      <el-menu-item index="/admin/users">用户管理</el-menu-item>
      <el-menu-item index="/admin/info">个人中心</el-menu-item>
      <el-menu-item index="/" style="color:red">返回商城前台</el-menu-item>
    </el-menu>

    <transition name="slide">
      <el-menu v-if="showMobileMenu" mode="vertical" router class="mobile-menu">
        <el-menu-item index="/admin" @click="showMobileMenu = false">首页看板</el-menu-item>
        <el-menu-item index="/admin/category" @click="showMobileMenu = false">乐器分类</el-menu-item>
        <el-menu-item index="/admin/goods" @click="showMobileMenu = false">商品管理</el-menu-item>
        <el-menu-item index="/admin/orders" @click="showMobileMenu = false">订单管理</el-menu-item>
        <el-menu-item index="/admin/users" @click="showMobileMenu = false">用户管理</el-menu-item>
        <el-menu-item index="/admin/info" @click="showMobileMenu = false">个人中心</el-menu-item>
        <el-menu-item index="/" @click="showMobileMenu = false">返回商城前台</el-menu-item>
      </el-menu>
    </transition>

    <div class="board">
      <el-card class="stat-card">
        <div class="stat-icon primary">
          <i class="el-icon-goods"></i>
        </div>
        <h3>商品总数量</h3>
        <p class="stat-value primary">{{ stats.totalGoods }}</p>
        <p class="stat-change positive">+12 本月</p>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon success">
          <i class="el-icon-menu"></i>
        </div>
        <h3>商品分类数</h3>
        <p class="stat-value success">{{ stats.totalCategories }}</p>
        <p class="stat-change positive">+2 本月</p>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon warning">
          <i class="el-icon-s-custom"></i>
        </div>
        <h3>注册用户数</h3>
        <p class="stat-value warning">{{ stats.totalUsers }}</p>
        <p class="stat-change positive">+28 本周</p>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon danger">
          <i class="el-icon-shopping-cart-2"></i>
        </div>
        <h3>订单总数</h3>
        <p class="stat-value danger">{{ stats.totalOrders }}</p>
        <p class="stat-change positive">+15 今日</p>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon info">
          <i class="el-icon-wallet"></i>
        </div>
        <h3>销售额</h3>
        <p class="stat-value info">¥{{ stats.totalSales }}</p>
        <p class="stat-change positive">+15.6% 本周</p>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-icon purple">
          <i class="el-icon-view"></i>
        </div>
        <h3>今日访问量</h3>
        <p class="stat-value purple">{{ stats.todayViews }}</p>
        <p class="stat-change positive">+32 较昨日</p>
      </el-card>
    </div>

    <div class="charts-row">
      <el-card class="chart-card">
        <h3>近7日订单趋势</h3>
        <div class="bar-chart">
          <div 
            v-for="(item, index) in orderTrend" 
            :key="index" 
            class="bar-item"
          >
            <div class="bar-wrapper">
              <div 
                class="bar-fill" 
                :style="{ height: (item.count / maxOrderCount * 100) + '%' }"
              ></div>
            </div>
            <span class="bar-label">{{ item.day }}</span>
            <span class="bar-value">{{ item.count }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <h3>商品分类占比</h3>
        <div class="pie-chart">
          <div class="pie-container">
            <div 
              class="pie-slice" 
              v-for="(item, index) in categoryRatio" 
              :key="index"
              :style="{ 
                background: `conic-gradient(${item.color} 0deg, ${item.color} ${item.degrees}deg, transparent ${item.degrees}deg)` 
              }"
            ></div>
            <div class="pie-center">
              <span class="pie-total">{{ stats.totalGoods }}</span>
              <span class="pie-label">总商品</span>
            </div>
          </div>
          <div class="pie-legend">
            <div v-for="(item, index) in categoryRatio" :key="index" class="legend-item">
              <span class="legend-color" :style="{ background: item.color }"></span>
              <span class="legend-text">{{ item.name }}</span>
              <span class="legend-value">{{ item.percent }}%</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="charts-row">
      <el-card class="chart-card">
        <h3>热门商品排行榜</h3>
        <div class="hot-list">
          <div v-for="(item, index) in hotGoods" :key="item.id" class="hot-item">
            <span class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <img :src="item.image" :alt="item.name" class="hot-image" />
            <div class="hot-info">
              <h4>{{ item.name }}</h4>
              <p>销量: {{ item.sales }}</p>
            </div>
            <span class="hot-price">¥{{ item.price }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <h3>订单状态分布</h3>
        <div class="status-list">
          <div v-for="item in orderStatus" :key="item.name" class="status-item">
            <div class="status-bar-wrap">
              <div 
                class="status-bar-fill" 
                :style="{ width: item.percent + '%', background: item.color }"
              ></div>
            </div>
            <div class="status-info">
              <span class="status-name">{{ item.name }}</span>
              <span class="status-count">{{ item.count }}单 ({{ item.percent }}%)</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showMobileMenu = ref(false)

const stats = ref({
  totalGoods: 35,
  totalCategories: 5,
  totalUsers: 128,
  totalOrders: 256,
  totalSales: 186500,
  todayViews: 520
})

const orderTrend = ref([
  { day: '周一', count: 12 },
  { day: '周二', count: 18 },
  { day: '周三', count: 15 },
  { day: '周四', count: 22 },
  { day: '周五', count: 28 },
  { day: '周六', count: 35 },
  { day: '周日', count: 30 }
])

const maxOrderCount = computed(() => {
  return Math.max(...orderTrend.value.map(item => item.count))
})

const categoryRatio = ref([
  { name: '吉他', percent: 35, color: '#667eea', degrees: 126 },
  { name: '钢琴', percent: 25, color: '#f5a623', degrees: 90 },
  { name: '民乐', percent: 20, color: '#722ed1', degrees: 72 },
  { name: '弦乐', percent: 12, color: '#13c2c2', degrees: 43.2 },
  { name: '打击乐', percent: 8, color: '#eb2f96', degrees: 28.8 }
])

const hotGoods = ref([
  { id: 1, name: '41寸原木民谣吉他', price: 699, sales: 2847, image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=100&h=100&fit=crop' },
  { id: 6, name: '初学者尤克里里', price: 199, sales: 2356, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=100&h=100&fit=crop' },
  { id: 2, name: '88键重锤电子钢琴', price: 2199, sales: 1892, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100&h=100&fit=crop' },
  { id: 3, name: '21弦考级实木古筝', price: 1399, sales: 1567, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
  { id: 4, name: '4/4手工实木小提琴', price: 989, sales: 1234, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' }
])

const orderStatus = ref([
  { name: '待付款', count: 35, percent: 14, color: '#e6a23c' },
  { name: '待发货', count: 48, percent: 19, color: '#409eff' },
  { name: '待收货', count: 68, percent: 27, color: '#67c23a' },
  { name: '已完成', count: 85, percent: 33, color: '#909399' },
  { name: '已取消', count: 20, percent: 8, color: '#f56c6c' }
])
</script>

<style scoped>
.admin-wrap {
  padding: 24px;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 1000;
  font-size: 28px;
  cursor: pointer;
  color: #667eea;
}

.desktop-menu {
  display: flex;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  background: white;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.board {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 24px;
  color: #fff;
}

.stat-icon.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.success { background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%); }
.stat-icon.warning { background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%); }
.stat-icon.danger { background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%); }
.stat-icon.info { background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%); }
.stat-icon.purple { background: linear-gradient(135deg, #909399 0%, #b4b6b8 100%); }

.stat-card h3 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.stat-value.primary { color: #667eea; }
.stat-value.success { color: #67c23a; }
.stat-value.warning { color: #e6a23c; }
.stat-value.danger { color: #f56c6c; }
.stat-value.info { color: #409eff; }
.stat-value.purple { color: #909399; }

.stat-change {
  font-size: 12px;
  margin-top: 8px;
}

.stat-change.positive { color: #67c23a; }
.stat-change.negative { color: #f56c6c; }

.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.chart-card {
  padding: 20px;
}

.chart-card h3 {
  margin: 0 0 20px;
  font-size: 16px;
  color: #303133;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  padding-top: 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  width: 30px;
  height: 150px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}

.bar-value {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-top: 4px;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 30px;
}

.pie-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: relative;
}

.pie-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.pie-label {
  font-size: 12px;
  color: #909399;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-text {
  flex: 1;
  font-size: 14px;
  color: #606266;
}

.legend-value {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
}

.hot-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.hot-rank.rank-1 { background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%); color: #fff; }
.hot-rank.rank-2 { background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%); color: #fff; }
.hot-rank.rank-3 { background: linear-gradient(135deg, #67c23a 0%, #95d475 100%); color: #fff; }

.hot-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.hot-info {
  flex: 1;
  min-width: 0;
}

.hot-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.hot-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-bar-wrap {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.status-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.status-info {
  display: flex;
  justify-content: space-between;
}

.status-name {
  font-size: 14px;
  color: #606266;
}

.status-count {
  font-size: 14px;
  color: #303133;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .admin-wrap {
    padding: 15px;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .board {
    margin-top: 20px;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .charts-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .bar-wrapper {
    width: 20px;
  }
  
  .pie-chart {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .admin-wrap {
    padding: 10px;
  }
  
  .board {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-icon {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .bar-chart {
    height: 150px;
  }
  
  .bar-wrapper {
    width: 15px;
    height: 100px;
  }
}
</style>