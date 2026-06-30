<template>
  <div class="info">
    <!-- 移动端菜单按钮 -->
    <div class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
      <i class="el-icon-menu"></i>
    </div>

    <!-- 顶部导航栏 -->
    <el-menu mode="horizontal" router class="desktop-menu">
      <el-menu-item index="/admin">首页看板</el-menu-item>
      <el-menu-item index="/admin/category">乐器分类</el-menu-item>
      <el-menu-item index="/admin/goods">商品管理</el-menu-item>
      <el-menu-item index="/admin/info">个人中心</el-menu-item>
      <el-menu-item index="/">返回商城前台</el-menu-item>
    </el-menu>

    <!-- 移动端菜单 -->
    <transition name="slide">
      <el-menu v-if="showMobileMenu" mode="vertical" router class="mobile-menu">
        <el-menu-item index="/admin" @click="showMobileMenu = false">首页看板</el-menu-item>
        <el-menu-item index="/admin/category" @click="showMobileMenu = false">乐器分类</el-menu-item>
        <el-menu-item index="/admin/goods" @click="showMobileMenu = false">商品管理</el-menu-item>
        <el-menu-item index="/admin/info" @click="showMobileMenu = false">个人中心</el-menu-item>
        <el-menu-item index="/" @click="showMobileMenu = false">返回商城前台</el-menu-item>
      </el-menu>
    </transition>

    <div class="content-wrap">
      <!-- 头像上传 -->
      <el-card style="margin-bottom:20px;text-align:center">
        <h3>管理员头像</h3>
        <div style="margin:20px 0">
          <el-avatar :size="100" :src="adminInfo.avatar || defaultAvatar" style="border:2px solid #409eff"/>
        </div>
        <el-upload
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
        >
          <el-button type="primary">更换头像</el-button>
        </el-upload>
      </el-card>

      <!-- 密码修改 -->
      <el-card>
        <h3>修改管理员密码</h3>
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
            <el-button type="primary" @click="changePwd">确认修改</el-button>
            <el-button type="danger" @click="logout">退出登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const showMobileMenu = ref(false)

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 管理员信息
const adminInfo = ref({
  avatar: localStorage.getItem('adminAvatar') || ''
})

// 密码表单
const pwdForm = ref({ old: "", new: "", confirm: "" })

// 组件加载时读取头像
onMounted(() => {
  adminInfo.value.avatar = localStorage.getItem('adminAvatar') || ''
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
    adminInfo.value.avatar = e.target.result
    localStorage.setItem('adminAvatar', e.target.result)
    ElMessage.success('头像上传成功！')
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
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
  ElMessage.success("密码修改成功")
  pwdForm.value = { old: "", new: "", confirm: "" }
}

// 退出登录
const logout = () => {
  localStorage.removeItem("adminToken")
  ElMessage.success("已退出后台")
  router.push("/admin/login")
}
</script>

<style scoped>
.info {
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

.content-wrap {
  max-width: 500px;
  width: 90%;
  margin: 50px auto;
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
  .info {
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
  
  .content-wrap {
    margin: 30px auto;
  }
}

@media (max-width: 480px) {
  .info {
    padding: 10px;
  }
  
  .content-wrap {
    margin: 20px auto;
  }
}
</style>