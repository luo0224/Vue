<template>
  <div class="message-center">
    <div class="content">
      <h2>消息中心</h2>
      
      <el-tabs v-model="activeTab" class="message-tabs">
        <!-- 活动通知 -->
        <el-tab-pane label="活动通知" name="activity">
          <div class="message-list">
            <div 
              v-for="item in activityMessages" 
              :key="item.id" 
              class="message-item"
              :class="{ 'unread': !item.read }"
              @click="markAsRead(item)"
            >
              <div class="msg-icon activity-icon">
                <i class="el-icon-bell"></i>
              </div>
              <div class="msg-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
                <span class="msg-time">{{ item.time }}</span>
              </div>
              <el-tag v-if="item.tag" type="primary" size="small">{{ item.tag }}</el-tag>
            </div>
          </div>
        </el-tab-pane>

        <!-- 商家消息 -->
        <el-tab-pane label="商家消息" name="merchant">
          <div class="message-list">
            <div 
              v-for="item in merchantMessages" 
              :key="item.id" 
              class="message-item"
              :class="{ 'unread': !item.read }"
              @click="markAsRead(item)"
            >
              <div class="msg-icon merchant-icon">
                <i class="el-icon-user"></i>
              </div>
              <div class="msg-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
                <span class="msg-time">{{ item.time }}</span>
              </div>
              <el-tag v-if="item.tag" type="success" size="small">{{ item.tag }}</el-tag>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const activeTab = ref('activity')

const isLoggedIn = computed(() => !!localStorage.getItem('userToken'))

// 处理我的中心点击
const handleUserInfoClick = () => {
  if (isLoggedIn.value) {
    router.push('/user/info')
  } else {
    router.push('/login')
  }
}

// 活动通知消息
const activityMessages = ref([
  { id: 1, title: '暑期乐器特惠活动开始啦！', content: '全场吉他、尤克里里8折起，钢琴最高立减500元，活动时间有限，快来选购吧！', time: '2026-06-30 10:30', tag: '限时特惠', read: false },
  { id: 2, title: '新用户专享优惠券', content: '恭喜您获得满500减100元优惠券，有效期至7月15日，快去使用吧！', time: '2026-06-29 15:20', tag: '优惠券', read: false },
  { id: 3, title: '新品上架通知', content: '全新款4/4手工实木小提琴已上架，采用进口云杉木面板，音色优美，欢迎品鉴！', time: '2026-06-28 09:10', tag: '新品', read: true },
  { id: 4, title: '乐器保养知识讲座', content: '本周六下午2点，我们邀请专业乐器维修师举办免费保养知识讲座，名额有限，速来报名！', time: '2026-06-27 14:30', tag: '活动', read: true },
  { id: 5, title: '会员积分兑换活动', content: '积分兑换活动火热进行中，500积分可兑换吉他琴弦套装，1000积分可兑换调音器！', time: '2026-06-26 11:00', tag: '积分', read: true }
])

// 商家消息
const merchantMessages = ref([
  { id: 101, title: '乐器商城官方客服', content: '您好！感谢您购买我们的产品，如有任何问题，请随时联系我们的客服热线：400-888-9999', time: '2026-06-30 09:00', tag: '客服', read: false },
  { id: 102, title: '发货通知', content: '您购买的41寸原木民谣吉他已发货，快递单号：SF1234567890，请及时查收！', time: '2026-06-29 16:45', tag: '发货', read: false },
  { id: 103, title: '售后回访', content: '您购买的电子钢琴已签收一周，请问使用体验如何？如有任何问题请随时联系我们。', time: '2026-06-28 10:30', tag: '回访', read: true },
  { id: 104, title: '优惠活动提醒', content: '您关注的古筝品类即将有大促活动，预计折扣力度达到7折，敬请期待！', time: '2026-06-27 15:00', tag: '提醒', read: true },
  { id: 105, title: '会员等级提升', content: '恭喜您升级为银卡会员！享受全场95折优惠，生日当月额外赠送100积分！', time: '2026-06-25 08:00', tag: '会员', read: true }
])

// 计算未读消息数量
const unreadCount = computed(() => {
  return [...activityMessages.value, ...merchantMessages.value].filter(item => !item.read).length
})

// 标记为已读
const markAsRead = (item) => {
  item.read = true
}

// 用户退出登录
const userLogout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 移动端退出登录
const handleMobileLogout = () => {
  showMobileMenu.value = false
  userLogout()
}

onMounted(() => {
  localStorage.setItem('messageCount', unreadCount.value.toString())
})
</script>

<style scoped>
.message-center {
  padding: 24px;
  padding-bottom: 70px;
}

.badge {
  margin-left: 5px;
}

.content {
  margin-top: 20px;
}

.content h2 {
  margin-bottom: 20px;
  font-size: 22px;
  color: #333;
}

.message-tabs {
  max-width: 800px;
}

.message-list {
  margin-top: 10px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-item:hover {
  background: #f0f5ff;
}

.message-item.unread {
  background: #fffbe6;
  border-left: 4px solid #e6a23c;
}

.msg-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
  margin-right: 16px;
}

.activity-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.merchant-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.msg-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.msg-time {
  font-size: 12px;
  color: #999;
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
  .message-center {
    padding: 15px;
    padding-bottom: 70px;
  }
  
  .content h2 {
    font-size: 20px;
  }
  
  .message-item {
    padding: 12px;
  }
  
  .msg-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: 12px;
  }
  
  .msg-content h4 {
    font-size: 14px;
  }
  
  .msg-content p {
    font-size: 13px;
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
  .message-center {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .content h2 {
    font-size: 18px;
  }
  
  .message-item {
    padding: 10px;
    flex-direction: column;
  }
  
  .msg-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }
}
</style>