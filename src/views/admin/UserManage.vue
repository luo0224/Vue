<template>
  <div class="users-admin">
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
      <el-input v-model="searchKeyword" placeholder="搜索用户名/手机号" clearable @keyup.enter="handleSearch">
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <el-select v-model="filterRole" placeholder="筛选角色" clearable>
        <el-option label="普通用户" value="user"/>
        <el-option label="VIP用户" value="vip"/>
        <el-option label="管理员" value="admin"/>
      </el-select>
      <el-select v-model="filterStatus" placeholder="筛选状态" clearable>
        <el-option label="正常" value="正常"/>
        <el-option label="冻结" value="冻结"/>
      </el-select>
    </div>

    <div class="users-grid">
      <el-card 
        v-for="user in filteredUsers" 
        :key="user.id" 
        class="user-card"
      >
        <div class="user-header">
          <el-avatar :size="60" :src="user.avatar">{{ user.name.charAt(0) }}</el-avatar>
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p class="user-phone">{{ user.phone }}</p>
            <div class="user-tags">
              <el-tag :type="getRoleType(user.role)" size="small">{{ user.role === 'vip' ? 'VIP用户' : user.role === 'admin' ? '管理员' : '普通用户' }}</el-tag>
              <el-tag :type="user.status === '正常' ? 'success' : 'danger'" size="small">{{ user.status }}</el-tag>
            </div>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-num">{{ user.orderCount }}</span>
            <span class="stat-label">订单数</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">¥{{ user.totalSpent }}</span>
            <span class="stat-label">消费额</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ user.points }}</span>
            <span class="stat-label">积分</span>
          </div>
        </div>

        <div class="user-footer">
          <p class="join-time">注册时间: {{ user.joinTime }}</p>
          <div class="user-actions">
            <el-button 
              v-if="user.status === '正常'" 
              type="warning" 
              size="small" 
              @click="toggleStatus(user)"
            >
              冻结
            </el-button>
            <el-button 
              v-if="user.status === '冻结'" 
              type="success" 
              size="small" 
              @click="toggleStatus(user)"
            >
              解冻
            </el-button>
            <el-button type="info" size="small" @click="viewDetail(user)">查看详情</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-state">
      <i class="el-icon-user"></i>
      <p>暂无用户数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const showMobileMenu = ref(false)
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('')

const users = ref([
  { id: 1, name: '张三', phone: '138****1234', role: 'vip', status: '正常', orderCount: 12, totalSpent: 8650, points: 2580, joinTime: '2026-01-15', avatar: '' },
  { id: 2, name: '李四', phone: '139****5678', role: 'user', status: '正常', orderCount: 5, totalSpent: 2340, points: 720, joinTime: '2026-03-20', avatar: '' },
  { id: 3, name: '王五', phone: '137****9012', role: 'vip', status: '正常', orderCount: 28, totalSpent: 15680, points: 4800, joinTime: '2025-12-08', avatar: '' },
  { id: 4, name: '赵六', phone: '136****3456', role: 'user', status: '冻结', orderCount: 3, totalSpent: 1290, points: 360, joinTime: '2026-05-10', avatar: '' },
  { id: 5, name: '钱七', phone: '135****7890', role: 'admin', status: '正常', orderCount: 0, totalSpent: 0, points: 0, joinTime: '2025-10-01', avatar: '' },
  { id: 6, name: '孙八', phone: '134****2345', role: 'user', status: '正常', orderCount: 8, totalSpent: 4580, points: 1380, joinTime: '2026-02-28', avatar: '' },
  { id: 7, name: '周九', phone: '133****6789', role: 'vip', status: '正常', orderCount: 15, totalSpent: 9860, points: 2980, joinTime: '2026-01-25', avatar: '' },
  { id: 8, name: '吴十', phone: '132****0123', role: 'user', status: '正常', orderCount: 2, totalSpent: 899, points: 240, joinTime: '2026-06-15', avatar: '' },
  { id: 9, name: '郑十一', phone: '131****4567', role: 'user', status: '正常', orderCount: 6, totalSpent: 3200, points: 960, joinTime: '2026-04-05', avatar: '' },
  { id: 10, name: '王小明', phone: '130****8901', role: 'vip', status: '正常', orderCount: 35, totalSpent: 22500, points: 6800, joinTime: '2025-11-12', avatar: '' },
  { id: 11, name: '李小红', phone: '189****2345', role: 'user', status: '冻结', orderCount: 1, totalSpent: 399, points: 100, joinTime: '2026-06-20', avatar: '' },
  { id: 12, name: '张小华', phone: '188****6789', role: 'user', status: '正常', orderCount: 4, totalSpent: 1899, points: 540, joinTime: '2026-05-28', avatar: '' }
])

const filteredUsers = computed(() => {
  let result = users.value
  if (searchKeyword.value) {
    result = result.filter(item => item.name.includes(searchKeyword.value) || item.phone.includes(searchKeyword.value))
  }
  if (filterRole.value) {
    result = result.filter(item => item.role === filterRole.value)
  }
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }
  return result
})

const handleSearch = () => {}

const getRoleType = (role) => {
  const types = {
    'vip': 'warning',
    'admin': 'danger',
    'user': 'info'
  }
  return types[role] || 'info'
}

const toggleStatus = (user) => {
  user.status = user.status === '正常' ? '冻结' : '正常'
  ElMessage.success(user.status === '正常' ? `${user.name} 已解冻` : `${user.name} 已冻结`)
}

const viewDetail = (user) => {
  ElMessage.info(`查看用户 ${user.name} 详情`)
}
</script>

<style scoped>
.users-admin {
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  padding: 20px;
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.user-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.user-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.user-phone {
  margin: 0 0 8px;
  font-size: 13px;
  color: #909399;
}

.user-tags {
  display: flex;
  gap: 8px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 22px;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.user-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.join-time {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.user-actions {
  display: flex;
  gap: 8px;
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
  .users-admin {
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
  
  .users-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .user-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .user-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .user-actions .el-button {
    flex: 1;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .users-admin {
    padding: 10px;
  }
  
  .user-card {
    padding: 15px;
  }
  
  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-tags {
    justify-content: center;
  }
}
</style>