<template>
  <div class="user-info">
    <div class="content-wrap">
      <!-- 用户信息卡片 -->
      <el-card style="margin-bottom:20px;text-align:center">
        <h3>用户信息</h3>
        <div style="margin:20px 0">
          <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" style="border:2px solid #67c23a"/>
        </div>
        <el-upload
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
        >
          <el-button type="success">更换头像</el-button>
        </el-upload>
      </el-card>

      <!-- 修改个人信息 -->
      <el-card style="margin-bottom:20px">
        <h3>修改个人信息</h3>
        <el-form :model="userForm">
          <el-form-item label="用户名">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="userForm.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="updateInfo">保存信息</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 修改密码 -->
      <el-card>
        <h3>修改密码</h3>
        <el-form :model="pwdForm">
          <el-form-item label="原密码">
            <el-input v-model="pwdForm.old" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="pwdForm.new" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="pwdForm.confirm" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="changePwd">确认修改</el-button>
          </el-form-item>
        </el-form>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

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

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
  phone: '',
  address: '',
  avatar: ''
})

// 用户表单
const userForm = ref({
  username: '',
  email: '',
  phone: '',
  address: ''
})

// 密码表单
const pwdForm = ref({ old: "", new: "", confirm: "" })

// 组件加载时读取用户信息
onMounted(() => {
  const savedInfo = localStorage.getItem('userInfo')
  if (savedInfo) {
    const parsed = JSON.parse(savedInfo)
    userInfo.value = { ...userInfo.value, ...parsed }
    userForm.value = { ...userForm.value, ...parsed }
  }
})

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB！')
    return false
  }

  // 读取文件并保存为base64
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.value.avatar = e.target.result
    localStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(localStorage.getItem('userInfo') || '{}'), avatar: e.target.result }))
    ElMessage.success('头像上传成功！')
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

// 更新用户信息
const updateInfo = () => {
  const updatedInfo = { ...userForm.value, avatar: userInfo.value.avatar }
  localStorage.setItem('userInfo', JSON.stringify(updatedInfo))
  userInfo.value = updatedInfo
  ElMessage.success("个人信息更新成功！")
}

// 修改密码
const changePwd = () => {
  if (!pwdForm.value.old || !pwdForm.value.new || !pwdForm.value.confirm) {
    ElMessage.warning('请填写完整密码信息！')
    return
  }
  if (pwdForm.value.new !== pwdForm.value.confirm) {
    ElMessage.error('两次输入的密码不一致！')
    return
  }
  ElMessage.success("密码修改成功！")
  pwdForm.value = { old: "", new: "", confirm: "" }
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
</script>

<style scoped>
.user-info {
  padding: 24px;
  padding-bottom: 70px;
}

.content-wrap {
  max-width: 500px;
  width: 90%;
  margin: 20px auto;
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
  .user-info {
    padding: 15px;
    padding-bottom: 70px;
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
  .user-info {
    padding: 10px;
    padding-bottom: 70px;
  }
}
</style>