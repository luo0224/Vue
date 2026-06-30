<template>
  <div class="orders-admin">
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
      <el-menu-item index="/">返回商城前台</el-menu-item>
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

    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索订单号" clearable @keyup.enter="handleSearch">
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <el-select v-model="filterStatus" placeholder="筛选状态" clearable>
        <el-option label="待付款" value="待付款"/>
        <el-option label="待发货" value="待发货"/>
        <el-option label="待收货" value="待收货"/>
        <el-option label="已完成" value="已完成"/>
        <el-option label="已取消" value="已取消"/>
      </el-select>
    </div>

    <div class="orders-list">
      <el-card 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-card"
      >
        <div class="order-header">
          <div class="order-info">
            <span class="order-no">订单号: {{ order.orderNo }}</span>
            <span class="order-time">{{ order.time }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)" size="medium">{{ order.status }}</el-tag>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-spec">{{ item.spec }}</p>
              <div class="item-footer">
                <span class="item-price">¥{{ item.price }}</span>
                <span class="item-count">x{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>共 {{ order.totalCount }} 件商品</span>
            <span class="total-price">实付: <strong>¥{{ order.totalPrice }}</strong></span>
          </div>
          <div class="order-actions">
            <el-button 
              v-if="order.status === '待付款'" 
              type="primary" 
              size="small" 
              @click="handleOrderAction(order, '取消')"
            >
              取消订单
            </el-button>
            <el-button 
              v-if="order.status === '待发货'" 
              type="primary" 
              size="small" 
              @click="handleOrderAction(order, '发货')"
            >
              确认发货
            </el-button>
            <el-button 
              v-if="order.status === '待收货'" 
              type="success" 
              size="small" 
              @click="handleOrderAction(order, '完成')"
            >
              确认完成
            </el-button>
            <el-button 
              v-if="order.status === '已完成'" 
              type="info" 
              size="small" 
              @click="handleOrderAction(order, '查看')"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div v-if="filteredOrders.length === 0" class="empty-state">
      <i class="el-icon-empty"></i>
      <p>暂无订单数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const showMobileMenu = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')

const orders = ref([
  {
    id: 1,
    orderNo: 'ORD20260630001',
    time: '2026-06-30 14:30:25',
    status: '待发货',
    totalCount: 2,
    totalPrice: 898,
    items: [
      { id: 1, name: '41寸原木民谣吉他', spec: '原木色', price: 699, count: 1, image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?w=100&h=100&fit=crop' },
      { id: 6, name: '初学者尤克里里', spec: '原木色', price: 199, count: 1, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 2,
    orderNo: 'ORD20260630002',
    time: '2026-06-30 11:20:15',
    status: '待收货',
    totalCount: 1,
    totalPrice: 2199,
    items: [
      { id: 2, name: '88键重锤电子钢琴', spec: '黑色', price: 2199, count: 1, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 3,
    orderNo: 'ORD20260629003',
    time: '2026-06-29 16:45:30',
    status: '已完成',
    totalCount: 3,
    totalPrice: 1697,
    items: [
      { id: 3, name: '21弦考级实木古筝', spec: '红木色', price: 1399, count: 1, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
      { id: 6, name: '初学者尤克里里', spec: '粉色', price: 199, count: 2, image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 4,
    orderNo: 'ORD20260629004',
    time: '2026-06-29 09:15:42',
    status: '待付款',
    totalCount: 1,
    totalPrice: 989,
    items: [
      { id: 4, name: '4/4手工实木小提琴', spec: '4/4尺寸', price: 989, count: 1, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 5,
    orderNo: 'ORD20260628005',
    time: '2026-06-28 20:30:55',
    status: '已完成',
    totalCount: 1,
    totalPrice: 2699,
    items: [
      { id: 5, name: '五鼓三镲成人架子鼓', spec: '黑色', price: 2699, count: 1, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 6,
    orderNo: 'ORD20260628006',
    time: '2026-06-28 15:20:10',
    status: '已取消',
    totalCount: 1,
    totalPrice: 1899,
    items: [
      { id: 11, name: '全单板民谣吉他', spec: '原木色', price: 1899, count: 1, image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 7,
    orderNo: 'ORD20260627007',
    time: '2026-06-27 18:45:33',
    status: '待发货',
    totalCount: 2,
    totalPrice: 2698,
    items: [
      { id: 17, name: '大提琴成人专业', spec: '4/4尺寸', price: 2999, count: 1, image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=100&h=100&fit=crop' },
      { id: 16, name: '儿童小提琴 1/4', spec: '1/4尺寸', price: 399, count: 1, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=100&h=100&fit=crop' }
    ]
  },
  {
    id: 8,
    orderNo: 'ORD20260627008',
    time: '2026-06-27 12:10:28',
    status: '待收货',
    totalCount: 1,
    totalPrice: 4599,
    items: [
      { id: 18, name: '专业电爵士鼓', spec: '标准配置', price: 4599, count: 1, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' }
    ]
  }
])

const filteredOrders = computed(() => {
  let result = orders.value
  if (searchKeyword.value) {
    result = result.filter(item => item.orderNo.includes(searchKeyword.value))
  }
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }
  return result
})

const handleSearch = () => {}

const getStatusType = (status) => {
  const types = {
    '待付款': 'warning',
    '待发货': 'primary',
    '待收货': 'success',
    '已完成': 'info',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

const handleOrderAction = (order, action) => {
  if (action === '取消') {
    order.status = '已取消'
    ElMessage.success('订单已取消')
  } else if (action === '发货') {
    order.status = '待收货'
    ElMessage.success('已确认发货')
  } else if (action === '完成') {
    order.status = '已完成'
    ElMessage.success('订单已完成')
  } else if (action === '查看') {
    ElMessage.info(`查看订单 ${order.orderNo} 详情`)
  }
}
</script>

<style scoped>
.orders-admin {
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

.search-bar {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.search-bar .el-input {
  flex: 1;
  min-width: 200px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-no {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.order-time {
  font-size: 12px;
  color: #909399;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  gap: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  margin: 0 0 8px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-spec {
  margin: 0 0 8px;
  font-size: 12px;
  color: #909399;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.item-count {
  font-size: 14px;
  color: #606266;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

.total-price {
  font-size: 18px;
  color: #f56c6c;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 16px;
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
  .orders-admin {
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
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar .el-input {
    min-width: 100%;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .order-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .order-actions .el-button {
    flex: 1;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .orders-admin {
    padding: 10px;
  }
  
  .order-card {
    padding: 15px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .order-total {
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>